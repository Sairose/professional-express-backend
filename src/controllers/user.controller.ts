
import type { RequestHandler } from "express";
import { ZodError } from "zod";

import { prepareUserData } from "../services/user.service.js";

// Validate and prepare user data received from the client.
export const createUser: RequestHandler = (req, res, next) => {
  try {
    const userData = prepareUserData(req.body);

    res.status(201).json({
      success: true,
      message: "User data validated successfully",
      data: userData,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      next(error);
      return;
    }

    next(error);
  }
};
