import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"])
    .default("development"),

    PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(3000),

    MONGODB_URI: z
    .string()
    .min(1)
    .refine(
      (value) =>
        value.startsWith("mongodb://") ||
        value.startsWith("mongodb+srv://"),
      "MONGODB_URI must be a valid MongoDB connection string",
    ),

  REDIS_URL: z
    .string()
    .min(1)
    .refine(
      (value) => value.startsWith("redis://") ||
        value.startsWith("rediss://"),
      "REDIS_URL must use redis:// or rediss://",
    ),
});

export const env = envSchema.parse(process.env);