import { password } from "bun";

// APP SETTINGS
export const PORT = process.env.PORT;
export const ENVIRONMENT = process.env.ENV || "development";

// DATABASE CREDENTIALS
export const DB_CONN_STRING = process.env.DATABASE_URL;

// REDIS CREDENTIALS
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const REDIS_CRED = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
};

// JWT OPTIONS
export const JWT_SECRET = process.env.JWT_SECRET;

// SMTP CREDENTIALS
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_LOGIN = process.env.SMTP_LOGIN;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
