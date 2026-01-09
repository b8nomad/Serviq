import pino from "pino-http";

import { ENVIRONMENT } from "@serviq/config";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    ENVIRONMENT === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: true,
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

export const loggerMiddleware = pino({
  logger,
  customLogLevel: (_, res, err) => {
    if (err) return "error";
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

export default logger;
