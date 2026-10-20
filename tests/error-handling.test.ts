import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("Error handling", () => {
  it("should return 404 for an unknown route", async () => {
    const response = await request(app).get(
      "/this-route-does-not-exist",
    );

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      status: "fail",
      message:
        "Route not found: GET /this-route-does-not-exist",
    });
  });

  it("should return 400 for malformed JSON", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Content-Type", "application/json")
      .send('{"name":');

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      status: "fail",
      message: "Request body contains invalid JSON",
    });
  });
});