export function addPlayerToRoom(room, socket, name = "Player") {
    room.players[socket.id] = {
      id: socket.id,
      name,
      alive: true,
      role: null,
      connected: true,
    };
  }