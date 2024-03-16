import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function createToken(user) {
 return jwt.sign({ ...user }, process.env.AUTH_SECRET, { expiresIn: "1d" });
}
