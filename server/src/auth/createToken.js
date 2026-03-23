import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "super-secret-key";

export function createToken(user) {
  return jwt.sign(
    {
      id: user.googleId,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
    SECRET,
    { expiresIn: "7d" }
  );
}