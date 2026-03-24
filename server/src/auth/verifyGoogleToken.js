import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("FATAL: Missing GOOGLE_CLIENT_ID environment variable. Please create a .env file in the /server directory.");
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}