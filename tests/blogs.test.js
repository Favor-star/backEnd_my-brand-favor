import mongoose from "mongoose";
import storyModels from "../src/models/storyModels.js";
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

// afterEach(async () => {
// });
describe("General test on Server", () => {
  it("should return welcome info when there is no route passed", async () => {
    const result = await request(app).get("/");
    expect(result.text).toContain("FAVOR'S PERSONAL PORTFOLIO");
  });
  it("should retun unknown route when post on non-existsing route", async () => {
    const result = await request(app).post("/*").send({});

    expect(result.body.OK).toBeFalsy();
    expect(result.body.message).toMatch(/does not exist/);
  });
  it("should retun unknown route when GET on non-existsing route", async () => {
    const result = await request(app).get("/*");
    expect(result.body.OK).toBeFalsy();
    expect(result.body.message).toMatch(/does not exist/);
  });
});
describe("Test GET stories", () => {
  it("should create a todo item successfully", async () => {
    let validStory = {
      storyTitle: "Title goes here",
      storyContent: "Content",
      storyImageURL: "url will be here on final test",
      storyCategory: "the category will be here",
    };
    const newStory = await storyModels(validStory);
    await newStory.save();
    expect(newStory._id).toBeDefined();
    expect(newStory.storyTitle).toBe(validStory.storyTitle);
    expect(newStory.completed).toBe(validStory.completed);
  });
  it("should return not created", async () => {
    let invalidStory = {};
    try {
      const newStory = new storyModels(invalidStory);
      await newStory.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });
});
describe("GET /blogs", () => {
  let validStory = {
    storyTitle: "Title goes here",
    storyContent: "Content",
    storyImageURL: "url will be here on final test",
    storyCategory: "the category will be here",
  };
  beforeAll(async () => {
    await request(app).post("/blogs").send(validStory);
  });
  afterAll(async () => {
    const result = await request(app).delete(`/blogs/${validStory._id}`);
  });
  it("should successfully return stories ", async () => {
    const response = await request(app).get("/blogs");
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(undefined);
  });
  it("should return stories", async () => {
    const response = await request(app).get("/blogs");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(1);
  });
  it("should return 404 if stories are not found", async () => {
    await dropCollections();
    const response = await request(app).get("/blogs");
    expect(response.status).toBe(404);
    expect(response.OK).toBeFalsy();
  });
  it("should return error if passed properties does not match the required ones", async () => {
    await dropCollections();
    await request(app).post("/blogs").send({});
    try {
      const response = await request(app).get("/blogs");
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });
});

describe("POST /blogs", () => {
  const validStory = {
    storyTitle: "Title goes here",
    storyContent: "Content",
    storyImageURL: "url will be here on final test",
    storyCategory: "the category will be here",
  };

  it("should successfully create a story", async () => {
    const result = await request(app)
      .post("/blogs")
      .set({
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      })
      .send(validStory);
    expect(result.status).toBe(201);
    expect(result.body.message).toMatch(/create/);
  }, 30000);
});

describe("DELETE /blogs", () => {
  beforeAll(async () => {
    const validStory = {
      storyTitle: "Title goes here",
      storyContent: "Content",
      storyImageURL: "url will be here on final test",
      storyCategory: "the category will be here",
    };
    await request(app).post("/blogs").send(validStory);
  });
  it("should successfully delete the story", async () => {
    const response = await request(app)
      .get("/blogs")
      .set({
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      });
    const id = response.body[0]._id;
    const result = await request(app).delete(`/blogs/${id}`);
    expect(result.status).toBe(200);
    expect(result.body.message).toMatch(/deleted/);
  });
});
