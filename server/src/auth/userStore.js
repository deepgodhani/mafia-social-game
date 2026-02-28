export const users = {};

// Create or update a user record from Google OAuth payload
export function getOrCreateUserFromGoogle(googleUser) {
  const id = googleUser.googleId;

  if (!users[id]) {
    users[id] = {
      id,
      googleId: id,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      username: null,
      displayName: null,
    };
  } else {
    users[id].email = googleUser.email;
    users[id].name = googleUser.name;
    users[id].picture = googleUser.picture;
  }

  return users[id];
}

// Create or update a user record from JWT payload
export function getOrCreateUserFromToken(payload) {
  const id = payload.id;

  if (!users[id]) {
    users[id] = {
      id,
      googleId: id,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      username: null,
      displayName: null,
    };
  } else {
    users[id].email = payload.email;
    users[id].name = payload.name;
    users[id].picture = payload.picture;
  }

  return users[id];
}

export function isUsernameTaken(username, exceptUserId) {
  if (!username) return false;

  const desired = username.toLowerCase();

  return Object.values(users).some((u) => {
    if (!u.username) return false;
    if (u.id === exceptUserId) return false;
    return u.username.toLowerCase() === desired;
  });
}

