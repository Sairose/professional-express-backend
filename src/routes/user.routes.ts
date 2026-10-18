
import { Router } from "express";

import {
  createUser,
  getUsers,
} from "../controllers/user.controller.js";
import { paginationSchema } from "../schemas/pagination.schema.js";
import { validateQuery } from "../middleware/validate-query.js";

const userRouter = Router();

// Retrieve users with validated pagination.
userRouter.get("/", validateQuery(paginationSchema), getUsers);

// Create a new user.
userRouter.post("/", createUser);

export default userRouter;
