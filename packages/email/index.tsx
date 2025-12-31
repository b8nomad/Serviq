import * as nodemailer from "nodemailer";
import type { Transporter, TransportOptions } from "nodemailer";

import { SMTP_HOST, SMTP_LOGIN, SMTP_PASSWORD, SMTP_PORT } from "config";
import { render } from "@react-email/components";

import { type Ticket } from "@serviq/prisma";

const transporter: Transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_LOGIN,
    pass: SMTP_PASSWORD,
  },
} as TransportOptions);

const sendEmail = async ({
  to,
  subject,
  Email,
}: {
  to: string;
  subject: string;
  Email: React.ReactNode;
}) => {
  const emailHtml = await render(Email);
  return await transporter.sendMail({
    from: "Team Nomad <transport@devmail.b8nomad.lol>",
    to: to,
    subject: subject,
    html: emailHtml,
  });
};

import TicketCreateEmail from "./emails/ticket/create";
import TicketAssignEmail from "./emails/ticket/assign";

export const email = {
  ticket: {
    create: async ({
      user,
      ticket,
    }: {
      user: {
        name: string;
        email: string;
      };
      ticket: {
        title: string;
        description: string;
        number: number;
      };
    }): Promise<void> => {
      await sendEmail({
        to: user.email,
        subject: `Query received, Ticket ID: #${ticket.number?.toString().padStart(6, "0")}`,
        Email: (
          <TicketCreateEmail
            customerName={user.name}
            ticketNumber={ticket.number?.toString().padStart(6, "0")!}
            ticketTitle={ticket.title}
            ticketDescription={ticket.description}
          />
        ),
      });
    },
    assign: async ({
      user,
      agent,
      ticket,
    }: {
      user: {
        name: string;
        email: string;
      };
      agent: { name: string; employee: { title: string } };
      ticket: Ticket;
    }): Promise<void> => {
      await sendEmail({
        to: user.email,
        subject: `Update: Agent assigned, Ticket ID: #${ticket.number?.toString().padStart(6, "0")}`,
        Email: (
          <TicketAssignEmail
            customerName={user.name}
            agentName={agent.name}
            agentTitle={agent.employee.title}
            ticketNumber={ticket.number?.toString().padStart(6, "0")!}
            ticketTitle={ticket.title}
          />
        ),
      });
    },
  },
};
