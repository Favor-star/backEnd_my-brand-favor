import express from "express";
import { verifyToken } from "../authMiddleware/authenticator.js";
import {
  registerUser,
  getUsers,
  deleteUser,
  updateUser,
  login,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/login", login);
router.get("/", verifyToken, getUsers);
router.post("/", registerUser);
router.patch("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
