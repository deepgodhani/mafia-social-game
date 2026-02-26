import jwt from "jsonwebtoken";

const SECRET = "super-secret-key"; // later move to env

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