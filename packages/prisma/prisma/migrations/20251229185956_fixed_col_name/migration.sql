/*
  Warnings:

  - You are about to drop the column `ticket_number` on the `tickets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number]` on the table `tickets` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tickets_ticket_number_key";

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "ticket_number",
ADD COLUMN     "number" SERIAL;

-- CreateIndex
CREATE UNIQUE INDEX "tickets_number_key" ON "tickets"("number");
