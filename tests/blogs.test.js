import request from "supertest";
import app from "../src/server.js";

import { expect, it, describe, beforeAll, vi, afterAll } from "vitest";
import mongoose from "mongoose";

vi.mock("../src/models/storyModels.js");
const testConnectionString =
  "mongodb+srv://favoureliab:favour123@cluster0.m4ethje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
beforeAll(async () => {
  await mongoose.connect(testConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Test database connected successfully");
});

afterAll(async () => {
  await mongoose.connection.close();
});
describe("TEST THE GET STORIES API", function () {
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
  it("should return story not creeted when there is an error", async () => {
    const result = await request(app).post("/blogs").send({
      storyTitle: "favour",
      storyContent: "Test",
    });
    expect(result.statusCode).toBe(500);
    expect(result.body.message).toEqual("Story could not be created");
  }, 10000);
  it("should return rout not found on non-existing route", async () => {
    const result = await request(app).post("/*").send({
      storyContent: "contents",
      storyTitle: "title",
    });
    expect(result.body.OK).toBeFalsy();
    expect(result.body.message).toMatch(/does not exist/);
  });
  it("should create story if story object is passed", async () => {
    const result = await request(app).post("/blogs").send({
      storyTitle: "Story title",
      storyContent: "Story contents",
      storyCategory: "Category goes here",
      storyImageURL: "image goes here",
    });
    expect(result.statusCode).toBe(201);
    expect(result.body.OK).toBeTruthy();
    expect(result.body.message).toMatch(/created/);
  });
});

// describe("TEST THE DELETE REQUEST ON BLOGS API",()=>{
//   it('should return id is incorrect when the id passed is incorrect', async () => {
//     const result = request(app)
//   })
// });

describe("TEST THE UPDATE STORIES FUNCTION", () => {
  it("should update the story if the ID passed is correct", async () => {
    const id = "65eeb1e174dea18f785f85c1";
    const updatedData = { storyTitle: "Updated title" };
    const result = await request(app).patch(`/blogs/${id}`).send(updatedData);
    expect(result.statusCode).toBe(200);
    expect(result.body.OK).toBeTruthy();
  }, 10000);
  it("should not upddate the story if the  ID passed is incorrect", async () => {
    const id = "12";
    const updatedData = { storyTitle: "Updated title" };
    const result = await request(app).patch(`/blogs/${id}`).send(updatedData);
    expect(result.statusCode).toBe(400);
    expect(result.body.OK).toBeFalsy();
  }, 10000);
});

describe("TEST THE DELETE STORY ENDPOINTS", () => {
  it("should delete the story if the ID is passed is correct", async () => {
    const id = "65eeb1e174dea18f785f85c1";
    const result = await request(app).delete(`/blogs/${id}`);
    expect(result.statusCode).toBe(200);
    expect(result.body.OK).toBeTruthy();
  }, 10000);
});



// import { vi, expect, it, describe,beforeAll,afterAll,afterEach } from "vitest";
// import request from "supertest";
// import app from "../src/server.js";
// import mongoose from "mongoose";
// // import { faker } from "@faker-js/faker";

// const connectionString =
//   "mongodb+srv://favoureliab:favour123@cluster0.m4ethje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Use a test database

// beforeAll(async () => {
//   await mongoose.connect(connectionString, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   console.log("Database connected successfully");
// });

// afterEach(async () => {
//   await mongoose.connection.dropDatabase(); // Clear test database after each test
// });

// afterAll(async () => {
//   await mongoose.connection.close();
// });

// describe("TEST THE GET STORIES API", () => {
//   it("Returns empty list for GET /api/stories with no stories", async () => {
//     // Define mocking logic here
//     const mockEmptyStories = vi.fn(() => Promise.resolve([]));
//     vi.mock("../models/storyModels.js", () => ({
//       Story: {
//         find: mockEmptyStories,
//       },
//     }));

//     const response = await request(app).get("/api/stories");
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual([]); // Assert empty array for no stories
//   });

//   // Add more tests with different mocking scenarios
//   // ...
// });
