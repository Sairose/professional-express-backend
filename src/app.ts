
import express from "express";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";

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

// Convert unmatched routes into application errors.
app.use(notFoundHandler);

// Handle errors forwarded through Express.
app.use(errorHandler);

export default app;
