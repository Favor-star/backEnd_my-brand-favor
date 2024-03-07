import express from "express";
import {
  addComment,
  getComments,
  getSingleStoryComments,
  deleteComment,
  updateComment,
} from "../controllers/commentsControllers.js";
import { verifyToken } from "../authMiddleware/authenticator.js";

const router = express.Router();

router.get("/",verifyToken, getComments);
router.post("/", addComment);
router.get("/:id", getSingleStoryComments);
router.delete("/:id", deleteComment);
router.patch("/:storyID/:id", updateComment);
export default router;
