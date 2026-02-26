import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

export async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
  });

  const payload = ticket.getPayload();

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
}