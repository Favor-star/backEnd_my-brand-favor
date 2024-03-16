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
router.post("/",verifyToken, addComment);
router.get("/:id",verifyToken, getSingleStoryComments);
router.delete("/:id",verifyToken, deleteComment);
router.patch("/:storyID/:id",verifyToken, updateComment);
export default router;
