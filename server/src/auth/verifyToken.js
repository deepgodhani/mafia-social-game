import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("FATAL: Missing JWT_SECRET environment variable.");
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}