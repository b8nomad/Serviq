import {
  type AssigneeType,
  type TicketEvent,
  type TicketEventType,
  type TicketMedia,
} from "@serviq/prisma";
export type EmailNotificationJobs = {
  "ticket.created": { ticket_id: string };
  "ticket.assign": { ticket_id: string; agent_id: string };
};

export type SMSNotificationJobs = {
  "ticket.created": { ticket_id: string };
  "ticket.assign": { ticket_id: string };
};

export type TicketJobs = {
  created: { ticket_id: string };
  assign: { ticket_id: string; agent_id?: string; agent_role?: AssigneeType };
  event: {
    ticket_id: string;
    author_id?: string;
    type?: TicketEventType;
    body: string;
    public?: boolean;
    attachments?: TicketMedia[];
  };
};

export type SLAJobs = {
  initialize: { ticket_id: string };
};

export type Workers = {
  "notification.email": EmailNotificationJobs;
  "notification.sms": SMSNotificationJobs;
  ticket: TicketJobs;
  sla: SLAJobs;
};
