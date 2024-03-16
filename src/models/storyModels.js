import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  storyTitle: {
    type: String,
    required: true,
  },
  storyContent: {
    type: String,
    required: true,
  },
  storyImageURL: {
    type: String,
    required: true,
  },
  storyCategory: {
    type: String,
    required: true,
  },
  storyImageCaption: {
    type: String,
    default: "This is supposed to be image caption",
  },
  storyVisits: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: String,
    default: new Date().toString(),
  },
});
export default new mongoose.model("Story", storySchema);
