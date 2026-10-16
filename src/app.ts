import express from "express";

import { env } from "./config/env.js";

const app = express();

// Parse incoming JSON request bodies.
app.use(express.json());

// Health-check endpoint.
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Professional Express Backend is running",
    environment: env.NODE_ENV,
  });
});

export default app;