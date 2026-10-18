
import { Router } from "express";

import {
  createUser,
  getUserById,
  getUsers,
} from "../controllers/user.controller.js";
import { paginationSchema } from "../schemas/pagination.schema.js";
import { userIdSchema } from "../schemas/user-id.schema.js";
import { validateParams } from "../middleware/validate-params.js";
import { validateQuery } from "../middleware/validate-query.js";

const userRouter = Router();

// Retrieve one user by ID after validating the URL parameter.
userRouter.get(
  "/:id",
  validateParams(userIdSchema),
  getUserById,
);

// Retrieve users with validated pagination.
userRouter.get("/", validateQuery(paginationSchema), getUsers);

// Create a new user.
userRouter.post("/", createUser);

export default userRouter;
