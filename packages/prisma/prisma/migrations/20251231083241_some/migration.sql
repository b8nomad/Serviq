-- DropForeignKey
ALTER TABLE "ticket_events" DROP CONSTRAINT "ticket_events_author_id_fkey";

-- AlterTable
ALTER TABLE "ticket_events" ALTER COLUMN "author_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ticket_events" ADD CONSTRAINT "ticket_events_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
