import express from "express";
import {
  contactMe,
  getContactedPeople,
} from "../controllers/contactMeControllers.js";

const router = express.Router();

router.post("/", contactMe);
router.get("/", getContactedPeople);

export default router;