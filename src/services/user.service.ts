import {
  createUserSchema,
  type CreateUserInput,
} from "../schemas/user.schema.js";

export function prepareUserData(input: unknown): CreateUserInput {
  return createUserSchema.parse(input);
}