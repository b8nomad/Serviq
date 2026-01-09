import { Queue, type JobsOptions } from "bullmq";
import { ENVIRONMENT, REDIS_CRED } from "config";
import type {
  TicketJobs,
  EmailNotificationJobs,
  Workers,
  SLAJobs,
} from "@serviq/config/types";

const createQueues = <Q extends keyof Workers, J extends keyof Workers[Q]>(
  queue: Q,
  job: J,
  payload: Workers[Q][J],
  jobsOpts?: JobsOptions
) => {
  new Queue(queue, { connection: REDIS_CRED }).add(job as string, payload, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: ENVIRONMENT === "production",
    removeOnFail: false,
    ...jobsOpts,
  });
};

export const queues = {
  ticket: {
    created: (payload: TicketJobs["created"], jobsOpts?: JobsOptions) =>
      createQueues("ticket", "created", payload, jobsOpts),
    assign: (payload: TicketJobs["assign"], jobOpts?: JobsOptions) =>
      createQueues("ticket", "assign", payload, jobOpts),
    event: (payload: TicketJobs["event"], jobOpts?: JobsOptions) =>
      createQueues("ticket", "event", payload, jobOpts),
  },
  notifications: {
    email: {
      ticket: {
        create: (
          payload: EmailNotificationJobs["ticket.created"],
          jobsOpt?: JobsOptions
        ) =>
          createQueues(
            "notification.email",
            "ticket.created",
            payload,
            jobsOpt
          ),
        assign: (
          payload: EmailNotificationJobs["ticket.assign"],
          jobsOpt?: JobsOptions
        ) =>
          createQueues("notification.email", "ticket.assign", payload, jobsOpt),
      },
    },
  },
  sla: {
    initialize: (payload: SLAJobs["initialize"], jobOpts?: JobsOptions) =>
      createQueues("sla", "initialize", payload, jobOpts),
  },
};
