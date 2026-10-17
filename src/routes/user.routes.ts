
import { Router } from "express";

import { createUser } from "../controllers/user.controller.js";

const userRouter = Router();

// Handle requests to create a user.
userRouter.post("/", createUser);

export default userRouter;