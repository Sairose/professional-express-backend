import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";

export async function deleteUserService(id: string): Promise<void> {
  const deletedUser = await UserModel.findByIdAndDelete(id)
    .lean()
    .exec();

  if (!deletedUser) {
    throw new AppError("User not found", 404);
  }
}