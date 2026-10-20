import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("GET /health", () => {
  it("should return the health status successfully", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      message: "Professional Express Backend is running",
      environment: process.env.NODE_ENV ?? "development",
    });
  });
});