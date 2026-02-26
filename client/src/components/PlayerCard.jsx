function PlayerCard({ player, isHost, canVote, onVote, revealRoles }) {
    return (
        <div className="bg-zinc-800 rounded-2xl p-4 flex items-center gap-4 shadow-lg border border-zinc-700">

            {/* Avatar */}
            <img
                src={player.picture}
                alt={player.name}
                className="w-14 h-14 rounded-full object-cover"
            />

            {/* Info */}
            <div className="flex-1">
                <p className="text-lg font-semibold">{player.name}</p>

                <p className="text-sm text-zinc-400">
                    {player.alive ? "Alive" : "Dead"}
                </p>
                {player.role && (
                    <p className="text-sm text-yellow-400 font-semibold">
                        Role: {player.role}
                    </p>
                )}
            </div>

            {/* Host badge */}
            {isHost && (
                <span className="text-xs bg-yellow-600 px-2 py-1 rounded-lg">
                    HOST
                </span>
            )}
            {canVote && player.alive && (
                <button
                    onClick={onVote}
                    className="mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
                >
                    Vote
                </button>
            )}
        </div>
    );
}

export default PlayerCard;