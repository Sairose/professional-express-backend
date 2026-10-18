
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

/**
 * Start the HTTP server only after MongoDB connects.
 */
async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(
        `Server is running at http://localhost:${env.PORT}`,
      );
    });

    // Handle errors reported by the HTTP server.
    server.on("error", (error: Error) => {
      console.error("HTTP server error:", error);
      process.exitCode = 1;
    });
  } catch (error: unknown) {
    console.error(
      "Application startup failed. The server was not started.",
      error,
    );

    process.exitCode = 1;
  }
}

void startServer();
