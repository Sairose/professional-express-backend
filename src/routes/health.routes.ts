import { Router } from "express";
import { getHealth } from "../controllers/health.controller.js";

const healthRouter = Router();

// Map GET /health to the health controller.
healthRouter.get("/", getHealth);

export default healthRouter;