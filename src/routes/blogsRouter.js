import express from "express";
import { createStory, getStories,getSingleStory, updateStory } from "../controllers/blogControllers.js";

const router = express.Router();

router.get("/", getStories);
router.post("/", createStory);
router.get("/:id", getSingleStory);
router.patch("/:id", updateStory);

export default router;