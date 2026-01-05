import { Worker } from "bullmq";
import {
  type EmailNotificationJobs,
  type TicketJobs,
} from "@serviq/config/types";
import { REDIS_CRED } from "@serviq/config";
import { queues } from "@serviq/bull";
import prisma, { type TicketEvent } from "@serviq/prisma";

const handlers = {
  created: async (job: TicketJobs["created"]) => {
    const { ticket_id } = job;
    queues.notifications.email.ticket.create({ ticket_id });
    queues.sla.initialize({ ticket_id });
    queues.ticket.assign({ ticket_id });
  },
  assign: async (job: TicketJobs["assign"]) => {
    const { ticket_id, agent_id, agent_role } = job;

    if (agent_id) {
      return await prisma.ticketAssignee.create({
        data: {
          ticket_id,
          user_id: agent_id,
          role: agent_role ?? "COLLABORATOR",
        },
      });
    }
    const agent = await prisma.user.findFirst({
      where: {
        employee: {
          is_active: true,
          is_online: true,
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        ticketAssignees: {
          _count: "asc",
        },
      },
    });

    if (!agent) throw new Error("No agent available!");

    await prisma.ticketAssignee.create({
      data: {
        ticket_id,
        user_id: agent.id,
        role: agent_role ?? "PRIMARY",
      },
      select: {
        id: true,
      },
    });

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticket_id,
      },
      select: {
        id: true,
        number: true,
      },
    });

    if (!ticket) throw new Error("Error finding ticket!");

    queues.notifications.email.ticket.assign({
      ticket_id: ticket.id,
      agent_id: agent.id,
    });

    queues.ticket.event({
      ticket_id,
      type: "ASSIGNMENT",
      body: `Agent ${agent.name} has been assigned for Ticket ID: #${ticket.number?.toString().padStart(6, "0")}`,
    });
  },
  event: async (job: TicketJobs["event"]) => {
    const { ticket_id, type, body } = job;

    await prisma.ticketEvent.create({
      data: {
        ticket_id,
        body,
        type: type ?? "COMMENT",
      },
    });

    return "Event Created!";
  },
};

const worker = new Worker(
  "ticket",
  async (job) => {
    const handler = handlers[job.name as keyof TicketJobs];

    if (!handler) return { error: "Invalid handler" };

    await handler(job.data);
    return;
  },

  { connection: REDIS_CRED }
);

worker.on("ready", () => {
  console.log("Ticket worker is ready!");
});
