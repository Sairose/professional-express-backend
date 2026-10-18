
import type { RequestHandler } from "express";

import { createUserService } from "../services/user.service.js";

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
