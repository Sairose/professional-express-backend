
import type { RequestHandler } from "express";

import { createUserService } from "../services/user.service.js";



import { getPaginatedUsersService } from "../services/user-list.service.js";
import type { PaginationInput } from "../schemas/pagination.schema.js";


// Create a user and return the saved document's public data.
export const createUser: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const user = await createUserService(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: unknown) {
    next(error);
  }
};


type UserListLocals = {
  pagination: PaginationInput;
};

export const getUsers: RequestHandler<
  Record<string, string>,
  unknown,
  unknown,
  Record<string, string>,
  UserListLocals
> = async (_req, res, next) => {
  try {
    const users = await getPaginatedUsersService(
      res.locals.pagination,
    );

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users.users,
      pagination: users.pagination,
    });
  } catch (error: unknown) {
    next(error);
  }
};

