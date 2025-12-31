import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { DB_CONN_STRING } from "config";

const pg = new PrismaPg({ connectionString: DB_CONN_STRING });

const prisma = new PrismaClient({
  adapter: pg,
});

export type {
  User,
  Employee,
  Permission,
  UserPermission,
  TicketStatus,
  TicketPriority,
  Ticket,
  SLAType,
  SLAStatus,
  TicketSLA,
  AssigneeType,
  TicketAssignee,
  TicketEventType,
  TicketEvent,
  TicketMediaContentType,
  TicketMedia,
} from "@prisma/client";
export default prisma;
