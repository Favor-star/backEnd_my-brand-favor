import { test, expect,vi } from "vitest";
import supertest from "supertest";
import storyModel from "../src/models/storyModels.js";
import app from "../src/server.js";


test("GET /api/stories - Should handle empty stories", async () => {
  // Mock empty stories (implementation depends on your mocking library)
  const mockEmptyStories = vi.fn().mockReturnValue(()=>"Favour"); // Example using Jest's mock function

  // Assuming Story is imported from storyModels.js
  const originalStory = storyModel.Story; // Access the actual Story model
console.log(mockEmptyStories)
  // Replace actual Story model with the mock
  storyModel.Story.find = mockEmptyStories;

  const response = await supertest(app).get("/api/stories");
  expect(response.statusCode).toBe(404);
  expect(response.body).toEqual({
    OK: false,
    message: "Stories are not found",
  });

  // Restore original Story model
  storyModel.Story.find = originalStory;
});
