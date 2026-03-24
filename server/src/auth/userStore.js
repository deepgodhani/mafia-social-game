export const users = {}; // In-memory store: userId -> user object

/**
 * Finds or creates a user from a Google ID token payload.
 * Uses the Google `sub` field as the unique and stable user ID.
 * @param {object} googleUser - The payload from a verified Google ID token.
 * @returns {object} The user object from the store.
 */
export function getOrCreateUserFromGoogle(googleUser) {
  const userId = googleUser.sub;
  if (!users[userId]) {
    users[userId] = {
      id: userId,
      googleId: userId,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      username: null,
      displayName: null,
    };
  }
  return users[userId];
}

/**
 * Finds or creates a user from a JWT payload.
 * This is used to re-identify users on subsequent connections.
 * @param {object} payload - The payload from a verified internal JWT.
 * @returns {object} The user object from the store.
 */
export function getOrCreateUserFromToken(payload) {
  const userId = payload.id;

  // If the user isn't in our in-memory store (e.g., after a server restart),
  // we recreate them from the token payload.
  if (userId && !users[userId]) {
    users[userId] = {
      id: userId,
      googleId: userId, // The 'id' in our token IS the googleId.
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      username: null, // This will be updated later via profile setup.
      displayName: null,
    };
  }

  return users[userId];
}

export function isUsernameTaken(username, currentUserId) {
  return Object.values(users).some(
    (user) =>
      user.id !== currentUserId && user.username?.toLowerCase() === username.toLowerCase()
  );
}