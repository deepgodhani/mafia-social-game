export function resolveVotes(room) {
    const votes = room.game.votes;
  
    const count = {};
  
    // count votes
    for (const voterId in votes) {
      const targetId = votes[voterId];
  
      count[targetId] = (count[targetId] || 0) + 1;
    }
  
    let maxVotes = 0;
    let eliminatedPlayerId = null;
  
    for (const playerId in count) {
      if (count[playerId] > maxVotes) {
        maxVotes = count[playerId];
        eliminatedPlayerId = playerId;
      }
    }
  
    return eliminatedPlayerId;
  }