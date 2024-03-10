import request from "supertest";
import app from "../src/server.js";

import { expect, it, describe, beforeAll, vi } from "vitest";

vi.mock("../src/models/userModels.js");

describe("TEST THE GET USER API", function () {
  it("should return no story found object once there are no stories found", async () => {
    const response = await request(app).get("/blogs");
    expect(response.status).toBe(200);
  }, 10000);
  it("should return 400, and error message once the route is incorect", async () => {
    const response = await request(app).get("/*");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      OK: false,
      message: "Route does not exist! Please re-check the route",
    });
  }, 10000);
});

describe("TEST POST REQUEST ON USER API", () => {
  it("should return Route not found on non-existing route", async () => {}, 10000);
});
