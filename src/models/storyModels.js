import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const storySchema = new mongoose.Schema({
  storyID: {
    type: String,
    default: uuidv4(),
  },
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
  createdAt: {
    type: String,
    default: new Date().toString(),
  },
});
export default new mongoose.model("Story", storySchema);
