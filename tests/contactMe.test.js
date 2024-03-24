import mongoose from "mongoose";
import storyModels from "../src/models/storyModels";
import request from "supertest";
import { app } from "../src/server.js";
import dotenv from "dotenv";
import { connectDatabase, dropDatabase, dropCollections } from "../src/db.js";
import {
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  describe,
  it,
  expect,
} from "vitest";
import { contactMe } from "../src/controllers/contactMeControllers";
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

describe("POST /contact-me", () => {
  const contactForm = {
    names: "Contact names",
    email: "contact@contact.com",
    messageBody: "contact me message",
    subject: "Contact me subject",
  };
  it("should return okay message when the contact is successfully submited", async () => {
    const result = await request(app).post("/contact-me").send(contactForm);
    expect(result.body.OK).toBeTruthy();
    expect(result.body.message).toMatch(/reach/);
  });
  it("should return an error when tere is one", async () => {
    const result = await request(app).post("/contact-me").send({});
    expect(result.body.OK).toBeFalsy();
    expect(result.body.message).toMatch(/Unexpected/);
  });
});
describe("GET /contact-me", () => {
  it("should return contacted people when found", async () => {
    const result = await request(app).get("/contact-me");
    expect(result.status).toBe(200);
  });
  it("should 404 when no contact form are found", async () => {
    await dropCollections();
    const result = await request(app).get("/contact-me");

    expect(result.status).toBe(404);
    expect(result.body.OK).toBeFalsy();
    expect(result.body.message).toMatch(/forms not found/);
  });
});
