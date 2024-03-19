import mongoose from "mongoose";

const commentBodySchema = mongoose.Schema({
  commentor: {
    type: [String],
    required: true,
  },
  commentBody: {
    type: String,
    required: true,
  },
  commentedAt: {
    type: String,
    default: new Date().toString(),
  },
});

const commentsSchema = mongoose.Schema({
  storyID: {
    type: String,
    required: true,
  },
  comments: {
    type: [commentBodySchema],
    required: true,
  },
  likedBy: [String],
});
export default new mongoose.model("Comments", commentsSchema);
