
import { MongoServerError } from "mongodb";

import { UserModel } from "../models/user.model.js";
import type { UpdateUserInput } from "../schemas/update-user.schema.js";
import { AppError } from "../utils/app-error.js";

export async function updateUserService(
  id: string,
  input: UpdateUserInput,
) {
  try {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: input },
      {
        new: true,
        runValidators: true,
      },
    )
      .select("-__v")
      .lean()
      .exec();

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      age: user.age,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error: unknown) {
    if (
      error instanceof MongoServerError &&
      error.code === 11000
    ) {
      throw new AppError(
        "A user with this email already exists",
        409,
      );
    }

    throw error;
  }
}
