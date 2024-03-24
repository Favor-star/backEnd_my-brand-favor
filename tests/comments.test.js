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
describe("POST /comments", () => {
  const comment = {
    storyID: "1q2w3e4r5t6y7u",
    comments: [
      {
        commentor: "Favor",
        commentBody: "Test the comment",
      },
    ],
    likedBy: ["Favour", "Eliab"],
  };
  beforeAll(async () => {});
  afterAll(async () => {
    const id = (
      await request(app)
        .get("/comments")
        .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
    ).body[0]._id;
    await request(app)
      .delete(`/comments/${id}`)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
  });
  it("should succesfully post the comment", async () => {
    const comment = {
      storyID: "1q2w3e4r5t6y7u",
      comments: [
        {
          commentor: "Favor",
          commentBody: "Test the comment",
        },
      ],
      likedBy: ["Favour", "Eliab"],
    };
    const result = await request(app)
      .post("/comments")
      .send(comment)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body.OK).toBeTruthy();

    await request(app).delete(`/comments/${comment._id}`);
  });
  it("should return an error when the comments are not fully defined", async () => {
    const invalidCOmment = { comments: [{}] };
    try {
      const result = await request(app)
        .post("/comments")
        .send(invalidCOmment)
        .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });
  it("should return an error when accesToken was not passed", async () => {
    const comment = {
      storyID: "1q2w3e4r5t6y7u",
      comments: [
        {
          commentor: "Favor",
          commentBody: "Test the comment",
        },
      ],
      likedBy: ["Favour", "Eliab"],
    };
    const result = await request(app).post("/comments").send(comment);
    expect(result.body.OK).toBeFalsy();
    expect(result.body.message).toMatch(/denied/);
  });
});
describe("GET /comments", () => {
  const comment = {
    storyID: "1q2w3e4r5t6y7u",
    comments: [
      {
        commentor: "Favor",
        commentBody: "Test the comment",
      },
    ],
    likedBy: ["Favour", "Eliab"],
  };
  beforeAll(async () => {
    await request(app)
      .post("/comments")
      .send(comment)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
  });
  afterAll(async () => {
    const id = (
      await request(app)
        .get("/comments")
        .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
    ).body[0]._id;
    await request(app)
      .delete(`/comments/${id}`)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
  });
  it("should return list of comments", async () => {
    const result = await request(app)
      .get("/comments")
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
    expect(result.body[0]._id).toBeDefined();
    expect(result.statusCode).toBe(200);
  });
  it("should return error when token is not passed", async () => {
    const result = await request(app).get("/comments");
    expect(result.body.OK).toBeFalsy();
    expect(result.body.message).toMatch(/denied/);
  });

  it("should return single comments if ID is passed", async () => {
    const result = await request(app)
      .get(`/comments/${comment.storyID}`)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
    expect(result.body.length).toEqual(1);
    expect(result.body[0]).toHaveProperty("storyID");
  });
  it("should return no comment found if is it not found", async () => {
    const storyID = "randomString";
    const result = await request(app)
      .get(`/comments/${storyID}`)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
    expect(result.body.OK).toBeFalsy();
    expect(result.body.message).toMatch(/found/);
  });
  it("should return 404 when comments are not found", async () => {
    await dropCollections();
    const result = await request(app)
      .get("/comments")
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
    expect(result.statusCode).toBe(404);
    expect(result.body.message).toMatch(/found/);
    await request(app)
      .post("/comments")
      .send(comment)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
  });
});
describe("DELETE /comments", () => {
  const comment = {
    storyID: "1q2w3e4r5t6y7u",
    comments: [
      {
        commentor: "Favor",
        commentBody: "Test the comment",
      },
    ],
    likedBy: ["Favour", "Eliab"],
  };
  beforeEach(async () => {
    await request(app)
      .post("/comments")
      .send(comment)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
  });
  afterEach(async () => {
    await request(app).delete(`/comments/${comment._id}`);
  });
  it("should successfully delete the comment when ID is correct and token passed", async () => {
    const id = (
      await request(app)
        .get("/comments")
        .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
    ).body[0]._id;
    const result = await request(app)
      .delete(`/comments/${id}`)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
    expect(result.body.OK).toBeTruthy();
    expect(result.body.message).toMatch(/successfully/);
  });
  it("should return an error when ID is correct but token not passed", async () => {
    const id = (
      await request(app)
        .get("/comments")
        .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
    ).body[0]._id;
    const result = await request(app).delete(`/comments/${id}`);
    expect(result.body.OK).toBeFalsy();
    expect(result.body.message).toMatch(/denied/);
  });
  it("should return an error when ID is incorrect", async () => {
    const id = `randomstring`;
    const result = await request(app)
      .delete(`/comments/${id}`)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
    expect(result.body.OK).toBeFalsy();
    expect(result.statusCode).toBe(500);
    expect(result.body.message).toMatch(/Unexpected/);
  });
});

describe("PATCH /comments", () => {
  const comment = {
    storyID: "1q2w3e4r5t6y7u",
    comments: [
      {
        commentor: "Favor",
        commentBody: "Test the comment",
      },
    ],
    likedBy: ["Favour", "Eliab"],
  };
  beforeAll(async () => {
    await request(app)
      .post("/comments")
      .send(comment)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
  });
  afterAll(async () => {
    const id = (
      await request(app)
        .get("/comments")
        .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
    ).body[0]._id;
    await request(app)
      .delete(`/comments/${id}`)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
  });

  it("should fail to update the comment when token is not passed", async () => {
    const { storyID, _id } = (
      await request(app)
        .get("/comments")
        .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
    ).body[0];
    const result = await request(app)
      .patch(`/comments/${storyID}/${_id}`)
      .send({
        commentor: "Updated Comment",
        commentBody: "Updated Commment body",
      });
    expect(result.body.OK).toBeFalsy();
    expect(result.body.message).toMatch(/denied/);
  });
  it("should  update the comment when token is passed", async () => {
    const { storyID, comments } = (
      await request(app)
        .get("/comments")
        .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
    ).body[0];
    const result = await request(app)
      .patch(`/comments/${storyID}/${comments[0]._id}`)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
      .send({
        commentor: "Updated Comment",
        commentBody: "Updated Commment body",
      });
    expect(result.status).toBe(200);
    expect(result.body.OK).toBeTruthy();
    expect(result.body.message).toMatch(/updated/);
  });
});

describe("PATCH /comments/like", () => {
  const comment = {
    storyID: "1q2w3e34r5t6y7u8i",
    comments: [
      { commentor: "The commentor", commentBody: "CommentBody will be here" },
    ],
    likedBy: ["Favour", "Eliab"],
  };
  beforeAll(async () => {
    await request(app)
      .post("/comments")
      .send(comment)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
  });
  afterAll(async () => {
    const id = (
      await request(app)
        .get("/comments")
        .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
    ).body[0]._id;
    await request(app)
      .delete(`/comments/${id}`)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);
  });
  it("should updated like when user likes for the first time ", async () => {
    const result = await request(app)
      .patch(`/comments/like/${comment.storyID}`)
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
      .send({ likedBy: "New Person" });
    expect(result.body.OK).toBeTruthy();
    expect(result.body.message).toMatch(/added/);
  });
  it("should remove the like if the liker exists", async () => {
    const result = await request(app)
      .patch(`/comments/like/${comment.storyID}`)
      .send({ likedBy: "Favour" })
      .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

    expect(result.body.OK).toBeTruthy();
    expect(result.body.message).toMatch(/removed/);
  });
});
