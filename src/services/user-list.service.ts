
import { UserModel } from "../models/user.model.js";
import type { PaginationInput } from "../schemas/pagination.schema.js";

export async function getPaginatedUsersService(
  pagination: PaginationInput,
) {
  const { page, limit } = pagination;

  // Calculate how many documents to skip.
  const skip = (page - 1) * limit;

  // Retrieve the requested page and count all users.
  const [users, totalUsers] = await Promise.all([
    UserModel.find()
      .select("-__v")
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),

    UserModel.countDocuments().exec(),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users: users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      age: user.age,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),
    pagination: {
      page,
      limit,
      totalUsers,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
