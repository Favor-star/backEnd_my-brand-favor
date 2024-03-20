import express from "express";
import {
  createStory,
  getStories,
  getSingleStory,
  updateStory,
  deleteStory,
} from "../controllers/blogControllers.js";

const router = express.Router();
router.get("/", getStories);
router.post("/", createStory);
router.get("/:id", getSingleStory);
router.patch("/:id", updateStory);
router.delete("/:id", deleteStory);

export default router;
