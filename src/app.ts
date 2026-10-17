
import express from "express";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import healthRouter from "./routes/health.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

// Parse incoming JSON request bodies.
app.use(express.json());


// Register health-related routes under /health.
app.use("/health", healthRouter);

// Register user-related routes.
app.use("/api/users", userRouter);

// Convert unmatched routes into application errors.
app.use(notFoundHandler);

// Handle errors forwarded through Express.
app.use(errorHandler);

export default app;
