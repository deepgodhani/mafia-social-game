/**
 * Creates a client-safe version of the room state.
 * Key change: Converts the `players` object into an array.
 * @param {object} room - The internal room object.
 * @returns {object} A public-facing room object.
 */
export function getPublicRoomState(room) {
  if (!room) return null;

  // Create a deep copy to avoid mutating the original server-side room object.
  const publicRoom = JSON.parse(JSON.stringify(room));

  // Convert the players object to an array for easier client-side rendering.
  publicRoom.players = Object.values(publicRoom.players);

  return publicRoom;
}