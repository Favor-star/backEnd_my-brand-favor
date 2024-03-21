import mongoose from "mongoose";
import storyModels from "../src/models/storyModels.js";
import request from "supertest";
import { app } from "../src/server.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { dropCollections, dropDatabase, connectDatabase } from "../src/db.js";
import {
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  describe,
  it,
  expect,
} from "vitest";
dotenv.config();
process.env.NODE_ENV = "test";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDatabase();
});
beforeEach(async () => {
  // await connectDatabase();
});
afterAll(async () => {
  await dropCollections();
  await dropDatabase();
  // await dropCollections();
});

describe("POST /users", () => {
  let validUser = {
    lastName: "Test",
    firstName: "First name",
    password: "Password",
    email: "test@test.com",
  };
  beforeAll(async () => {
    // await request(app).post("/users").send(validUser);
  });
  afterAll(async () => {
    await request(app).delete(`/users/${validUser._id}`);
  });
  it("should allow user to register", async () => {
    const result = await request(app).post("/users").send(validUser);
    expect(result.body.OK).toBeTruthy();
    expect(result.body.message).toMatch(/created/);
  });
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
    expect(result.body).toBeDefined();
  }, 10000);
});
describe("PATCH /users", () => {
  let validUser = {
    lastName: "Test",
    firstName: "First name",
    password: "Password",
    email: "test@test.com",
  };
  beforeAll(async () => {
    await request(app).post("/users").send(validUser);
  });
  afterAll(async () => {
    const response = await request(app)
      .get("/users")
      .set({
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      });
    const id = response.body[0]._id;
    await request(app).delete(`/users/${id}`);
  });
  it("should update the user when the user passed is correct", async () => {
    const response = await request(app)
      .get("/users")
      .set({
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      });
    const id = response.body[0]._id;
    const result = await request(app)
      .patch(`/users/${id}`)
      .set({
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      })
      .send({
        firstName: "Updated Name",
      });
    expect(result.status).toBe(202);
  });
  it("should not update the user when the token is not passed", async () => {
    await request(app).post("/users").send(validUser);

    const result = await request(app).patch(`/users/${validUser._id}`).send({
      firstName: "Updated Name",
    });

    expect(result.body.OK).toBeFalsy();
    expect(result.body.message).toMatch(/denied/);
  });
});
describe("POST /users/login", () => {
  const user = {
    password: "Password",
    email: "test@test.com",
  };
  beforeAll(async (done) => {
    const salt = bcrypt.genSaltSync(10); // Generate salt for user creation
    const hashedPassword = bcrypt.hashSync(user.password, salt);
    user.password = hashedPassword; // Update user with hashed password

    await request(app).post("/users").send(user); // Create user with hashed password
  }, 30000);
  afterAll(async () => {
    await request(app).delete(`/users/${user._id}`);
  });
  it("should log the user", async () => {
    const result = await request(app).post("/users/login").send({
      email: "test@test.com",
      password: "Password",
    });
    expect(result.body.OK).toBeTruthy();
    expect(result.body.message).toMatch(/logged/);
  });
});

describe("DELETE", () => {
  beforeAll(async () => {
    const user = {
      lastName: "Test",
      firstName: "First name",
      password: "Password",
      email: "test@test.com",
    };
    await request(app).post("/users").send(user);
  });
  it("should delete the user if passed id is correct", async () => {
    const response = await request(app)
      .get("/users")
      .set({
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      });
    const id = response.body[0]._id;
    const result = await request(app)
      .delete(`/users/${id}`)
      .set({
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      });
    expect(result.body.OK).toBeTruthy();
    expect(result.body.message).toMatch(/deleted/);
  });
  it("should return not found if iincorrect id is passed", async () => {
    const result = await request(app)
      .delete(`/users/id`)
      .set({
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      });
    expect(result.status).toBe(500);
  });
});
