function MorningReport({ result, onFinish }) {
    if (!result) return null;
  
    const title =
      result.type === "KILL"
        ? "TRAGEDY!"
        : "QUIET NIGHT";
  
    const text =
      result.type === "KILL"
        ? `${result.playerName} was found dead in the alley.`
        : "Nobody died tonight...";
  
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <div className="bg-yellow-100 text-black p-8 rounded-xl shadow-2xl max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-lg">{text}</p>
  
          <button
            onClick={onFinish}
            className="mt-6 bg-black text-white px-4 py-2 rounded-lg"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }
  
  export default MorningReport;