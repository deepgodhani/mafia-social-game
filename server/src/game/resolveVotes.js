export function resolveVotes(room) {
  const votes = room.game.votes;

  const count = {};

  // count votes
  for (const voterId in votes) {
    const targetId = votes[voterId];

    count[targetId] = (count[targetId] || 0) + 1;
  }

  let maxVotes = 0;
  let topPlayers = [];

  for (const playerId in count) {
    const votesForPlayer = count[playerId];

    if (votesForPlayer > maxVotes) {
      maxVotes = votesForPlayer;
      topPlayers = [playerId];
    } else if (votesForPlayer === maxVotes) {
      topPlayers.push(playerId);
    }
  }

  // no votes cast or tie on max votes → no elimination
  if (maxVotes === 0 || topPlayers.length !== 1) {
    return null;
  }

  return topPlayers[0];
}