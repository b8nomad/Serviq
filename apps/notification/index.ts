import { Worker } from "bullmq";
import { REDIS_CRED } from "config";
import { email } from "@serviq/email";
import prisma from "@serviq/prisma";
import type { EmailNotificationJobs } from "@serviq/config/types";

const handlers = {
  "ticket.created": async (job: EmailNotificationJobs["ticket.created"]) => {
    const { ticket_id } = job;
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticket_id,
      },
      select: {
        title: true,
        description: true,
        number: true,
        author_id: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: ticket?.author_id,
      },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user || !ticket) throw new Error("User or Ticket Invalid!");

    email.ticket.create({
      user,
      ticket,
    });
  },
  "ticket.assign": async (job: EmailNotificationJobs["ticket.assign"]) => {
    const { ticket_id, agent_id } = job;

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticket_id,
      },
    });

    if (!ticket) throw new Error("Ticket not found");

    const agent = await prisma.user.findUnique({
      where: {
        id: agent_id,
      },
      select: {
        name: true,
        employee: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!agent) throw new Error("Agent not found");

    if (!agent.employee) {
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: ticket?.author_id,
      },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) throw new Error("User not found");

    email.ticket.assign({
      user,
      agent: {
        name: agent.name,
        employee: {
          title: agent.employee.title,
        },
      },
      ticket,
    });
  },
};

const emailWorker = new Worker(
  "notification.email",
  async (job) => {
    const handler = handlers[job.name as keyof EmailNotificationJobs];

    if (handlers) return { error: "Invalid handler" };

    await handler(job.data);

    return;
  },
  { connection: REDIS_CRED }
);

emailWorker.on("ready", () => {
  console.log("Email worker is ready!");
});

const smsWorker = new Worker(
  "notification.sms",
  async (job) => {
    //
  },
  { connection: REDIS_CRED }
);
