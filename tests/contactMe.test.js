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
 
  it("should return okay message when the contact is successfully submited", async () => {
    const contactForm = {
      names: "Contact names",
      email: "contact@contact.com",
      messageBody: "contact me message",
      subject: "Contact me subject",
    };
  const result =   await request(app).post("/contact-me").send(contactForm);
  expect(result.body.OK).toBeTruthy();
  expect(result.body.message).toMatch(/reach/)
  });
});
describe('GET /contact-me', () => {
  it('should return contacted people when found',async () => {
    const result = await request(app).get("/contact-me")
    expect(result.status).toBe(200);
    
  })
})
