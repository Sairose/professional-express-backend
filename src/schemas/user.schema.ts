
import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),

  age: z
    .number()
    .int("Age must be an integer")
    .min(18, "You must be at least 18 years old"),
});
