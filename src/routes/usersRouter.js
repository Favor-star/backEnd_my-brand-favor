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

router.get("/", verifyToken, getUsers);
router.post("/", registerUser);
router.patch("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/login", login);

export default router;
