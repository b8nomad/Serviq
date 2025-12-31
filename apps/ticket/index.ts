import { Worker } from "bullmq";
import {
  type EmailNotificationJobs,
  type TicketJobs,
} from "@serviq/config/types";
import { REDIS_CRED } from "@serviq/config";
import { queues } from "@serviq/bull";

const handlers = {
  created: async (job: EmailNotificationJobs["ticket.created"]) => {
    const { ticket_id } = job;
    queues.notifications.email.ticket.create({ ticket_id });
    queues.sla.initialize({ ticket_id });
  },
  assign: async (job: EmailNotificationJobs["ticket.assign"]) => {
    const { ticket_id, agent_id } = job;
    queues.notifications.email.ticket.assign({ ticket_id, agent_id });
  },
};

const worker = new Worker(
  "ticket",
  async (job) => {
    const handler = handlers[job.name as keyof TicketJobs];
    if (handlers) return { error: "Invalid handler" };
    await handler(job.data);
    return;
  },
  { connection: REDIS_CRED }
);
