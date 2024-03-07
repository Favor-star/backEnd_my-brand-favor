import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export function verifyToken(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) {
    return res
      .status(401)
      .send({ OK: false, message: "Access denied. ERR_TOKEN_NOT_PASSED" });
  }
  const token = header && header.split(" ")[1];
  jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ OK: false, message: "Invalid or expired token" });
    }
    req.decoded = decoded;
    next();
  });
}
