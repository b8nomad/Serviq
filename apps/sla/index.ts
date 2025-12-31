import { Worker, Job } from "bullmq";
import { REDIS_CRED } from "config";

import prisma, { type Ticket, type TicketSLA } from "@serviq/prisma";

import { type SLAJobs } from "@serviq/config/types";

// Standard Hardcoded SLA Policy
const SLA_POLICY = {
  LOW: { first: 12 * 60, resolution: 4 * 24 * 60 },
  NORMAL: { first: 8 * 60, resolution: 2 * 24 * 60 },
  HIGH: { first: 2 * 60, resolution: 12 * 60 },
  CRITICAL: { first: 30, resolution: 2 * 24 * 60 },
} as const;

const handlers = {
  initialize: async (job: SLAJobs["initialize"]) => {
    const { ticket_id } = job;

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticket_id,
      },
    });

    if (!ticket) throw new Error("Ticket not found!");

    const policy = SLA_POLICY[ticket.priority];

    const existingSLAs = await prisma.ticketSLA.findMany({
      where: {
        ticket_id: ticket.id,
      },
      select: { type: true },
    });

    const existingTypes = new Set(existingSLAs.map((s) => s.type));
    const base = ticket.created_at.getTime();

    const creates = [];

    if (!existingTypes.has("FIRST_RESPONSE")) {
      creates.push(
        prisma.ticketSLA.create({
          data: {
            ticket_id: ticket.id,
            type: "FIRST_RESPONSE",
            due_at: new Date(base + policy.first).toISOString(),
          },
        })
      );
    }

    if (!existingTypes.has("RESOLUTION")) {
      creates.push(
        prisma.ticketSLA.create({
          data: {
            ticket_id: ticket.id,
            type: "RESOLUTION",
            due_at: new Date(base + policy.resolution).toISOString(),
          },
        })
      );
    }

    if (existingSLAs.length === 0) return { error: "SLA already exists" };

    await prisma.$transaction(creates);
  },
};

const worker = new Worker("sla", async (job: Job) => {
  const handler = handlers[job.name as keyof SLAJobs];

  await handler(job.data);

  if (!handler) return { error: "Invalid Handler" };
});
