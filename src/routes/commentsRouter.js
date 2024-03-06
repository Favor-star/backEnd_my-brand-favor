import express from "express";
import {
  addComment,
  getComments,
  getSingleComment,
} from "../controllers/commentsControllers.js";

const router = express.Router();

router.get("/", getComments);
router.post("/", addComment);
router.get("/:id", getSingleComment);
router.get("/*", (req, res) => {
  res.status(400).send({
    OK: false,
    message: "Route does not exist! Please re-check the route",
  });
});
export default router;
