import mongoose from "mongoose";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";
import { env } from "../src/config/env.js";
import { UserModel } from "../src/models/user.model.js";

const TEST_DATABASE_NAME = "professional_backend_test";

function assertTestDatabase(): void {
  const databaseName = new URL(env.MONGODB_URI).pathname.slice(1);

  if (databaseName !== TEST_DATABASE_NAME) {
    throw new Error(
      `Integration tests require the "${TEST_DATABASE_NAME}" database. ` +
        `Refusing to use "${databaseName}".`,
    );
  }
}

describe("User API integration tests", () => {
  beforeAll(async () => {
    assertTestDatabase();
    await mongoose.connect(env.MONGODB_URI);
  });

  afterEach(async () => {
    assertTestDatabase();
    await UserModel.deleteMany({}).exec();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a user successfully", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        name: "Test User",
        email: "test-user@example.com",
        age: 25,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      name: "Test User",
      email: "test-user@example.com",
      age: 25,
    });
    expect(response.body.data.id).toEqual(expect.any(String));
  });

  it("should reject an invalid email address", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        name: "Test User",
        email: "invalid-email",
        age: 25,
      });

    expect(response.status).toBe(400);
  });

    it("should reject duplicate email addresses", async () => {
    const user = {
      name: "First User",
      email: "duplicate@example.com",
      age: 25,
    };

    const firstResponse = await request(app)
      .post("/api/users")
      .send(user);

    expect(firstResponse.status).toBe(201);

    const duplicateResponse = await request(app)
      .post("/api/users")
      .send({
        name: "Second User",
        email: "duplicate@example.com",
        age: 26,
      });

    expect(duplicateResponse.status).toBe(409);

    expect(duplicateResponse.body.message).toBe(
    "A user with this email address already exists",
    );
  });

  it("should reject users younger than 18", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        name: "Underage User",
        email: "underage@example.com",
        age: 17,
      });

    expect(response.status).toBe(400);
  });
});