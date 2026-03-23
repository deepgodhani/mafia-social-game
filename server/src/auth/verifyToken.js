import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "super-secret-key";

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}