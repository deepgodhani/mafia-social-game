function DoctorResult({ result, onClose }) {
  if (!result) return null;

  const { targetName, saved } = result;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="panel p-6 max-w-sm w-[90%] text-center">
        <div className="panel-header">Doctor's Report</div>

        <h2 className="phase-title mt-1">
          Night Outcome
        </h2>

        <p className="mt-4 text-sm text-amber-200">
          You watched over{" "}
          <span className="font-semibold">{targetName}</span>.
        </p>

        <p
          className={`mt-2 text-lg font-bold ${
            saved ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {saved
            ? "Your patient survived an attack."
            : "No attack reached your patient."}
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

export default DoctorResult;

