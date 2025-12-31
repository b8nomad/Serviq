/*
  Warnings:

  - The values [CREATED] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('OPEN', 'REOPENED', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED');
ALTER TABLE "public"."tickets" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "tickets" ALTER COLUMN "status" TYPE "TicketStatus_new" USING ("status"::text::"TicketStatus_new");
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "public"."TicketStatus_old";
ALTER TABLE "tickets" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- CreateIndex
CREATE INDEX "ticket_assignee_ticket_id_idx" ON "ticket_assignee"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_events_ticket_id_idx" ON "ticket_events"("ticket_id");
