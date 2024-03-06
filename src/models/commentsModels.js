import mongoose from "mongoose";

const commentsSchema = mongoose.Schema({
  commenter: {
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
  storyID: {
    type: String,
    required: true,
  },
});
export default new mongoose.model("Comments", commentsSchema);
