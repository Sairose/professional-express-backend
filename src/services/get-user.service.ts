
import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";

export async function getUserByIdService(id: string) {
  const user = await UserModel.findById(id).lean().exec();

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
}
