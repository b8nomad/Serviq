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
  assign: { ticket_id: string };
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
