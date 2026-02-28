function DetectiveResult({ result, onClose }) {
  if (!result) return null;

  const { targetName, isMafia } = result;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="panel p-6 max-w-sm w-[90%] text-center">
        <div className="panel-header">Detective Report</div>

        <h2 className="phase-title mt-1">
          Investigation Result
        </h2>

        <p className="mt-4 text-sm text-amber-200">
          You investigated{" "}
          <span className="font-semibold">{targetName}</span>.
        </p>

        <p
          className={`mt-2 text-lg font-bold ${
            isMafia ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {isMafia ? "They are MAFIA." : "They are NOT mafia."}
        </p>

        <button
          onClick={onClose}
          className="btn-primary mt-5"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default DetectiveResult;

