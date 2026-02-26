import jwt from "jsonwebtoken";

const SECRET = "super-secret-key";

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}