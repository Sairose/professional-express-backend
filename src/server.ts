import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(
    `Server is running at http://localhost:${env.PORT}`,
  );
});

// Handle unexpected server errors.
server.on("error", (error: Error) => {
  console.error("HTTP server error:", error);
  process.exitCode = 1;
});