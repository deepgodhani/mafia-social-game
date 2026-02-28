
function VoteReveal({ votes, onFinish }) {
    if (!votes) return null;
  
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
        <div className="panel p-5 w-[90%] max-w-md text-center">
          <div className="panel-header">Voting Result</div>
  
          <h2 className="phase-title mt-1">
            Votes Revealed
          </h2>
  
          <div className="mt-4 space-y-2 text-left">
            {votes.map((v, i) => (
              <div
                key={i}
                className="panel p-2 flex justify-between"
              >
                <span className="text-amber-100">
                  {v.voter}
                </span>
                <span className="text-red-400">
                  → {v.target}
                </span>
              </div>
            ))}
          </div>
  
          <button
            onClick={onFinish}
            className="btn-primary mt-4"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }
  
  export default VoteReveal;