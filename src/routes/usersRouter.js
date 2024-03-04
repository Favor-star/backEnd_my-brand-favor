import express from "express";
import {
  registerUser,
  getUsers,
  deleteUser,
  updateUser,
  login,
  verifyToken,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.post("/", registerUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", login);

export default router;
