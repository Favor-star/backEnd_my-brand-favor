import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../src/server.js";
import dotenv from "dotenv";
dotenv.config();

vi.mock("../models/userModels.js");
vi.mock("../authMiddleware/authenticator.js", (req, res, next) => {
  next();
});

describe("TESING FETCH USERS ENDPOINTS", () => {
  it("should return error when endpoint is not authenticated", async () => {
    const result = await request(app).get("/users");
    expect(result.body.OK).toBeFalsy();
    expect(result.statusCode).toBe(401);
    expect(result.body.message).toMatch(/denied/);
  }, 10000);

  it("should return users if authenticated", async () => {
    const result = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
    expect(result.status).toBe(200);
  }, 10000);
});
