# 🧹 Serviq

A modern open-source ticket management and support system built with TypeScript, featuring automated SLA tracking, email notifications, and a scalable microservices architecture.

## 📋 Overview

Serviq is a comprehensive help desk and ticket management platform that enables organizations to efficiently handle customer support requests. The system includes automated SLA (Service Level Agreement) tracking, email notifications, user management, and a robust permission system.

## 🏗️ Architecture

This project is a monorepo built with:
- **Turborepo** for monorepo management
- **Bun** as the package manager and runtime
- **TypeScript** for type safety
- **PostgreSQL** with **Prisma** ORM for data persistence
- **Redis** with **BullMQ** for job queue management
- **Express.js** for the REST API
- **React Email** for email templates

## 📁 Project Structure

```
Serviq/
├── apps/
│   ├── backend/          # Main Express API server
│   ├── ticket/           # Ticket processing worker
│   ├── notification/     # Email notification worker
│   └── sla/              # SLA tracking worker
├── packages/
│   ├── prisma/           # Database schema and client
│   ├── bull/             # Job queue management
│   ├── config/           # Shared configuration
│   ├── email/            # Email templates and sending
│   └── lib/              # Shared utilities
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **Bun** 1.2.23 (specified package manager)
- **PostgreSQL** database
- **Redis** server

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Serviq
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```env
# App Settings
PORT=3000
ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/serviq

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key
JWT_TOKEN=your-secret-key

# SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_LOGIN=your-email@example.com
SMTP_PASSWORD=your-password
```

4. Set up the database:
```bash
cd packages/prisma
bun run prisma migrate dev
bun run prisma generate
```

5. Start the development servers:
```bash
# Start all services
bun run dev

# Or start individually:
# Backend API
cd apps/backend && bun run dev

# Ticket worker
cd apps/ticket && bun run dev

# Notification worker
cd apps/notification && bun run dev

# SLA worker
cd apps/sla && bun run dev
```

## 🎯 Features

### Core Functionality

- **Ticket Management**
  - Create, view, and track support tickets
  - Ticket status workflow (OPEN, IN_PROGRESS, RESOLVED, CLOSED, etc.)
  - Priority levels (LOW, NORMAL, HIGH, CRITICAL)
  - Ticket assignment with multiple assignee types (PRIMARY, OBSERVER, COLLABORATOR)
  - Ticket events and comments
  - Media attachments support

- **User Management**
  - External and internal user types
  - Employee profiles with departments and titles
  - Permission-based access control
  - JWT authentication
  - User timezone support

- **SLA Tracking**
  - Automated SLA initialization based on ticket priority
  - First response time tracking
  - Resolution time tracking
  - SLA status monitoring (RUNNING, MET, BREACHED)
  - Configurable SLA policies per priority level

- **Email Notifications**
  - Ticket creation notifications
  - Ticket assignment notifications
  - React-based email templates
  - SMTP integration

- **Job Queue System**
  - Asynchronous job processing with BullMQ
  - Retry mechanisms with exponential backoff
  - Separate workers for tickets, notifications, and SLA

## 🔌 API Endpoints

### User Routes (`/api/v1/users`)

- `POST /external/ticket` - Create a new ticket (public)
- `GET /external/ticket/:id` - Get ticket details (public)
- `POST /auth/signin` - User sign in
- `POST /auth/signup` - User registration

### Admin Routes (`/api/v1/admin`)

- Protected routes requiring authentication and permissions

## 🗄️ Database Schema

The system uses PostgreSQL with the following main entities:

- **Users** - User accounts (external/internal)
- **Employees** - Internal employee profiles
- **Tickets** - Support tickets
- **TicketSLA** - SLA tracking records
- **TicketAssignee** - Ticket assignments
- **TicketEvent** - Ticket history and comments
- **TicketMedia** - Attachments
- **Permissions** - Permission definitions
- **UserPermission** - User permission assignments

## 🛠️ Development

### Available Scripts

- `bun run dev` - Start all services in development mode
- `bun run build` - Build all packages and apps
- `bun run lint` - Lint all code
- `bun run format` - Format code with Prettier
- `bun run check-types` - Type check all TypeScript code

### Adding New Features

1. **New API Routes**: Add routes in `apps/backend/src/routes/`
2. **New Workers**: Create worker files in `apps/` directory
3. **New Jobs**: Define job types in `packages/config/types/bull.ts`
4. **Database Changes**: Update `packages/prisma/prisma/schema.prisma` and run migrations

## 📦 Packages

### `@serviq/prisma`
Database client and schema definitions. Provides Prisma client for database operations.

### `@serviq/bull`
Job queue management. Provides typed queue creation and job scheduling.

### `@serviq/config`
Shared configuration and environment variables.

### `@serviq/email`
Email template components and sending functionality using React Email.

### `@serviq/lib`
Shared utility functions and helpers.

## 🔐 Security

- Password hashing with bcrypt
- JWT-based authentication
- Permission-based authorization
- Input validation on API endpoints

## 📝 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]
