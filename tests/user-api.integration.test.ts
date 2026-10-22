import mongoose from "mongoose";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";
import { env } from "../src/config/env.js";
import { UserModel } from "../src/models/user.model.js";

const TEST_DATABASE_NAME = "professional_backend_test";


const ALLOWED_TEST_DATABASE_HOSTS = new Set([
  "127.0.0.1",
  "localhost",
]);

function assertTestDatabase(): void {
  const databaseUrl = new URL(env.MONGODB_URI);
  const databaseName = databaseUrl.pathname.slice(1);
  const databaseHost = databaseUrl.hostname;

  if (!ALLOWED_TEST_DATABASE_HOSTS.has(databaseHost)) {
    throw new Error(
      `Integration tests must use a local MongoDB host. ` +
        `Refusing to use "${databaseHost}".`,
    );
  }

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


  it("should return an empty user list with default pagination", async () => {
    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual([]);
    expect(response.body.pagination).toMatchObject({
      page: 1,
      limit: 10,
      totalUsers: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it("should return users with correct pagination metadata", async () => {
    await UserModel.create([
      { name: "User One", email: "one@example.com", age: 21 },
      { name: "User Two", email: "two@example.com", age: 22 },
      { name: "User Three", email: "three@example.com", age: 23 },
    ]);

    const response = await request(app).get("/api/users?page=1&limit=2");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.pagination).toMatchObject({
      page: 1,
      limit: 2,
      totalUsers: 3,
      totalPages: 2,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });

  it("should return the requested page of users", async () => {
    await UserModel.create([
      { name: "User One", email: "one@example.com", age: 21 },
      { name: "User Two", email: "two@example.com", age: 22 },
      { name: "User Three", email: "three@example.com", age: 23 },
    ]);

    const response = await request(app).get("/api/users?page=2&limit=2");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      name: "User One",
      email: "one@example.com",
      age: 21,
    });
    expect(response.body.pagination).toMatchObject({
      page: 2,
      limit: 2,
      totalUsers: 3,
      totalPages: 2,
      hasNextPage: false,
      hasPreviousPage: true,
    });
  });

  it("should reject invalid pagination parameters", async () => {
    const invalidPageResponse = await request(app).get(
      "/api/users?page=0",
    );

    expect(invalidPageResponse.status).toBe(400);

    const invalidLimitResponse = await request(app).get(
      "/api/users?limit=101",
    );

    expect(invalidLimitResponse.status).toBe(400);
  });

  it("should reject unknown pagination query parameters", async () => {
    const response = await request(app).get(
      "/api/users?unexpected=value",
    );

    expect(response.status).toBe(400);
  });

  //get user by id tests
  it("should retrieve a user by ID", async () => {
    const createdUser = await UserModel.create({
      name: "Find Me",
      email: "find-me@example.com",
      age: 25,
    });

    const response = await request(app).get(
      `/api/users/${createdUser._id.toString()}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User retrieved successfully");
    expect(response.body.data).toMatchObject({
      id: createdUser._id.toString(),
      name: "Find Me",
      email: "find-me@example.com",
      age: 25,
    });
  });

  it("should return 404 when a user ID does not exist", async () => {
    const response = await request(app).get(
      "/api/users/507f1f77bcf86cd799439011",
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should reject an invalid user ID", async () => {
    const response = await request(app).get(
      "/api/users/invalid-id",
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "User ID must be a valid MongoDB ObjectId",
    );
  });

  //update user tests

  it("should update a user successfully", async () => {
    const user = await UserModel.create({
      name: "Original Name",
      email: "original@example.com",
      age: 25,
    });

    const response = await request(app)
      .patch(`/api/users/${user._id.toString()}`)
      .send({
        name: "Updated Name",
        age: 26,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User updated successfully");
    expect(response.body.data).toMatchObject({
      id: user._id.toString(),
      name: "Updated Name",
      email: "original@example.com",
      age: 26,
    });
  });

  it("should return 404 when updating a nonexistent user", async () => {
    const response = await request(app)
      .patch("/api/users/507f1f77bcf86cd799439011")
      .send({ name: "Updated Name" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should reject an invalid user ID when updating", async () => {
    const response = await request(app)
      .patch("/api/users/invalid-id")
      .send({ name: "Updated Name" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "User ID must be a valid MongoDB ObjectId",
    );
  });

  it("should reject invalid update data", async () => {
    const user = await UserModel.create({
      name: "Valid User",
      email: "valid-user@example.com",
      age: 25,
    });

    const response = await request(app)
      .patch(`/api/users/${user._id.toString()}`)
      .send({ age: 17 });

    expect(response.status).toBe(400);
  });

  it("should reject an email already used by another user", async () => {
    await UserModel.create({
      name: "First User",
      email: "first@example.com",
      age: 25,
    });

    const secondUser = await UserModel.create({
      name: "Second User",
      email: "second@example.com",
      age: 26,
    });

    const response = await request(app)
      .patch(`/api/users/${secondUser._id.toString()}`)
      .send({ email: "first@example.com" });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe(
      "A user with this email already exists",
    );
  });

  //delete user tests

  it("should delete a user successfully", async () => {
    const user = await UserModel.create({
      name: "User To Delete",
      email: "delete-me@example.com",
      age: 25,
    });

    const response = await request(app).delete(
      `/api/users/${user._id.toString()}`,
    );

    expect(response.status).toBe(204);
    expect(response.text).toBe("");

    const deletedUser = await UserModel.findById(user._id).exec();
    expect(deletedUser).toBeNull();
  });

  it("should return 404 when deleting a nonexistent user", async () => {
    const response = await request(app).delete(
      "/api/users/507f1f77bcf86cd799439011",
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should reject an invalid user ID when deleting", async () => {
    const response = await request(app).delete(
      "/api/users/invalid-id",
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "User ID must be a valid MongoDB ObjectId",
    );
  });

});