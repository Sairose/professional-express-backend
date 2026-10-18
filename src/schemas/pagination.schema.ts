
import { z } from "zod";

export const paginationSchema = z
  .object({
    page: z
      .string()
      .default("1")
      .transform(Number)
      .pipe(
        z
          .number()
          .int("Page must be an integer")
          .min(1, "Page must be at least 1"),
      ),

    limit: z
      .string()
      .default("10")
      .transform(Number)
      .pipe(
        z
          .number()
          .int("Limit must be an integer")
          .min(1, "Limit must be at least 1")
          .max(100, "Limit must not exceed 100"),
      ),
  })
  .strict();

export type PaginationInput = z.infer<typeof paginationSchema>;
