
import type { ErrorRequestHandler } from "express";

import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      status: error.status,
      message: error.message,
    });

    return;
  }

  // Log unexpected errors for server-side debugging.
  console.error("Unexpected application error:", error);

  res.status(500).json({
    success: false,
    status: "error",
    message:
      env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
          ? error.message
          : "An unexpected error occurred",
  });
};
