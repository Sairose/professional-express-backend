
import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import type { PaginationInput } from "../schemas/pagination.schema.js";
import { AppError } from "../utils/app-error.js";

type QueryLocals = {
  pagination: PaginationInput;
};

export function validateQuery(
  schema: ZodType<PaginationInput>,
): RequestHandler<
  Record<string, string>,
  unknown,
  unknown,
  Record<string, string>,
  QueryLocals
> {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

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

    res.locals.pagination = result.data;
    next();
  };
}
