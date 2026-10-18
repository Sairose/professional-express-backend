
import { z } from "zod";

export const userIdSchema = z
  .object({
    id: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "User ID must be a valid MongoDB ObjectId",
      ),
  })
  .strict();

export type UserIdInput = z.infer<typeof userIdSchema>;
