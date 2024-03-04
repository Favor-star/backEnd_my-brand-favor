import express from "express";
import {
  registerUser,
  getUsers,
  deleteUser,
  updateUser,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", registerUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
