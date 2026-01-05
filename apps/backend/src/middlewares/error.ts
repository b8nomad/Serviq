import type { Request, Response, NextFunction } from "express";
import { AppError } from "@serviq/lib/error.ts";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // known AppError
  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        details: err.details ?? null,
      },
    });
  }

  // unknown / unhandled
  console.error("UNHANDLED ERROR:", err);

  res.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    },
  });
}
