
import express from "express";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import healthRouter from "./routes/health.routes.js";

const app = express();

// Parse incoming JSON request bodies.
app.use(express.json());


// Register health-related routes under /health.
app.use("/health", healthRouter);

// Convert unmatched routes into application errors.
app.use(notFoundHandler);

// Handle errors forwarded through Express.
app.use(errorHandler);

export default app;
