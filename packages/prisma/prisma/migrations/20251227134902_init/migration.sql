-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('EXTERNAL', 'INTERNAL');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('CREATED', 'REOPENED', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SLAType" AS ENUM ('FIRST_RESPONSE', 'RESOLUTION');

-- CreateEnum
CREATE TYPE "SLAStatus" AS ENUM ('RUNNING', 'BREACHED', 'MET');

-- CreateEnum
CREATE TYPE "AssigneeType" AS ENUM ('PRIMARY', 'OBSERVER', 'COLLABORATOR');

-- CreateEnum
CREATE TYPE "TicketEventType" AS ENUM ('COMMENT', 'STATUS_CHANGE', 'ASSIGNMENT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "TicketMediaContentType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "type" "UserType" NOT NULL DEFAULT 'EXTERNAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'CREATED',
    "priority" "TicketPriority" NOT NULL DEFAULT 'NORMAL',
    "ticket_number" SERIAL,
    "author_id" TEXT NOT NULL,
    "rating" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_sla" (
    "id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "type" "SLAType" NOT NULL,
    "status" "SLAStatus" NOT NULL DEFAULT 'RUNNING',
    "due_at" TIMESTAMP(3) NOT NULL,
    "met_at" TIMESTAMP(3),
    "breached_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_sla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_assignee" (
    "id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "AssigneeType" NOT NULL DEFAULT 'COLLABORATOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_assignee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_events" (
    "id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "type" "TicketEventType" NOT NULL,
    "body" VARCHAR(5000) NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_media" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "content_type" "TicketMediaContentType" NOT NULL,
    "content_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_user_id_permission_id_key" ON "user_permissions"("user_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_ticket_number_key" ON "tickets"("ticket_number");

-- CreateIndex
CREATE INDEX "tickets_priority_idx" ON "tickets"("priority");

-- CreateIndex
CREATE INDEX "tickets_status_idx" ON "tickets"("status");

-- CreateIndex
CREATE INDEX "tickets_created_at_idx" ON "tickets"("created_at");

-- CreateIndex
CREATE INDEX "ticket_sla_status_idx" ON "ticket_sla"("status");

-- CreateIndex
CREATE INDEX "ticket_sla_due_at_idx" ON "ticket_sla"("due_at");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_sla_ticket_id_type_key" ON "ticket_sla"("ticket_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_assignee_user_id_ticket_id_key" ON "ticket_assignee"("user_id", "ticket_id");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_sla" ADD CONSTRAINT "ticket_sla_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_assignee" ADD CONSTRAINT "ticket_assignee_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_assignee" ADD CONSTRAINT "ticket_assignee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_events" ADD CONSTRAINT "ticket_events_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_events" ADD CONSTRAINT "ticket_events_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_media" ADD CONSTRAINT "ticket_media_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "ticket_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
