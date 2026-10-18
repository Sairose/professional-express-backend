
import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { AppError } from "../utils/app-error.js";

export function validateParams(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => {
          const field = issue.path.join(".");

          return field
            ? `${field}: ${issue.message}`
            : issue.message;
        })
        .join("; ");

      next(new AppError(message, 400));
      return;
    }

    next();
  };
}
