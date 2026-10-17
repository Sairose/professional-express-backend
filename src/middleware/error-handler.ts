
import type { ErrorRequestHandler } from "express";

import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";
import { ZodError } from "zod";

function isMalformedJsonError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "status" in error &&
    error.type === "entity.parse.failed" &&
    error.status === 400
  );
}




export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  // Handle invalid JSON sent by the client.
  if (isMalformedJsonError(error)) {
    res.status(400).json({
      success: false,
      status: "fail",
      message: "Request body contains invalid JSON",
    });

    return;
  }


  // Handle Zod validation errors.
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      status: "fail",
      message: "Request validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });

    return;
  }


  // Handle expected application errors.
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
