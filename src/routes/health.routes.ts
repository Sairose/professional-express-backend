
import { Router } from "express";
import { getHealth } from "../controllers/health.controller.js";

const healthRouter = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check API health
 *     description: Checks whether the backend API is running.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is running successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Professional Express Backend is running
 *                 environment:
 *                   type: string
 *                   example: development
 */
healthRouter.get("/", getHealth);

export default healthRouter;
