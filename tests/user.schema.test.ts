import { describe, expect, it } from "vitest";

import { createUserSchema } from "../src/schemas/user.schema.js";

describe("createUserSchema", () => {
  it("should accept valid user data", () => {
    const result = createUserSchema.safeParse({
      name: "Sairose",
      email: "sairose@example.com",
      age: 23,
    });

    expect(result.success).toBe(true);
  });

  it("should trim the name and normalize the email", () => {
    const result = createUserSchema.parse({
      name: "  Sairose  ",
      email: "  SAIROSE@EXAMPLE.COM  ",
      age: 23,
    });

    expect(result).toEqual({
      name: "Sairose",
      email: "sairose@example.com",
      age: 23,
    });
  });

  it("should reject an invalid email address", () => {
    const result = createUserSchema.safeParse({
      name: "Sairose",
      email: "not-an-email",
      age: 23,
    });

    expect(result.success).toBe(false);
  });

  it("should reject an age below 18", () => {
    const result = createUserSchema.safeParse({
      name: "Sairose",
      email: "sairose@example.com",
      age: 17,
    });

    expect(result.success).toBe(false);
  });

  it("should reject a non-integer age", () => {
    const result = createUserSchema.safeParse({
      name: "Sairose",
      email: "sairose@example.com",
      age: 23.5,
    });

    expect(result.success).toBe(false);
  });

  it("should reject an empty name", () => {
    const result = createUserSchema.safeParse({
      name: "   ",
      email: "sairose@example.com",
      age: 23,
    });

    expect(result.success).toBe(false);
  });
});