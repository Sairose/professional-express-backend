
import { z } from "zod";

import { createUserSchema } from "./user.schema.js";

export const updateUserSchema = createUserSchema
  .partial()
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided for update",
    },
  );

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
