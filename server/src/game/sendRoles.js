export function sendRoles(io, room) {
    Object.values(room.players).forEach((player) => {
      io.to(player.socketId).emit("your-role", {
        role: player.role,
      });
    });
  }