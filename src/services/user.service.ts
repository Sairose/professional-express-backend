
import { MongoServerError } from "mongodb";

import {
  createUserSchema,
  type CreateUserInput,
} from "../schemas/user.schema.js";
import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";

/**
 * Create and persist a user in MongoDB.
 */
export async function createUserService(
  input: unknown,
): Promise<CreateUserInput & { id: string }> {
  // Validate and normalize incoming data.
  const userData = createUserSchema.parse(input);

  try {
    // Create and save the user document.
    const user = await UserModel.create(userData);

    return {
      name: user.name,
      email: user.email,
      age: user.age,
      id: user.id,
    };
  } catch (error: unknown) {
    // MongoDB error code 11000 indicates a duplicate key.
    if (
      error instanceof MongoServerError &&
      error.code === 11000
    ) {
      throw new AppError(
        "A user with this email address already exists",
        409,
      );
    }

    throw error;
  }
}
