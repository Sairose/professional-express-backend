import type { RequestHandler } from "express";
import { env } from "../config/env.js";

export const getHealth: RequestHandler = (_req, res) =>{
    res.status(200).json({
    success: true,
    message: "Professional Express Backend is running",
    environment: env.NODE_ENV,
  });
}