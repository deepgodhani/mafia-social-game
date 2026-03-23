import { useEffect } from "react";

function MorningReport({ result, onFinish }) {
  if (!result) return null;

  const title =
    result.type === "KILL"
      ? "THE CITY MORNS"
      : "A BREATH OF RELIEF";

  const headline =
    result.type === "KILL"
      ? "FOUL PLAY SUSPECTED"
      : "THE NIGHT PASSES IN SILENCE";

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[90] bg-noir-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#e2e2e2] text-noir-950 p-1 sm:p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-md w-full animate-in slide-in-from-bottom duration-700">
        <div className="border-4 border-noir-950 p-6 flex flex-col items-center">
          <div className="w-full border-b-2 border-noir-950 pb-2 mb-4 flex justify-between items-end">
            <span className="text-[10px] font-black uppercase">Vol. LXVI... No. 24,103</span>
            <span className="text-xl font-black uppercase tracking-tighter">The Daily Noir</span>
            <span className="text-[10px] font-black uppercase">Final Edition</span>
          </div>

          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-1">{title}</h2>
          <h1 className="text-4xl font-black uppercase leading-none tracking-tighter text-center mb-6 border-y-2 border-noir-950 py-2 w-full">
            {headline}
          </h1>

          <div className="w-full grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              <p className="text-sm leading-tight font-serif first-letter:text-4xl first-letter:font-black first-letter:mr-1 first-letter:float-left">
                {result.type === "KILL" 
                  ? `Late last night, ${result.playerName} was discovered lifeless in the shadows of the warehouse district. Authorities describe the scene as a calculated strike, leaving the community in a state of growing panic.`
                  : "An uncharacteristic silence fell over the city last night. No reports of violence reached the precinct, providing a brief moment of peace in these dark times. Yet, the tension remains palpable."
                }
              </p>
              <p className="text-xs leading-tight font-serif italic border-t border-noir-950/20 pt-2">
                "We are hunting a ghost," says the commissioner. "But ghosts leave prints."
              </p>
            </div>
            <div className="border-l border-noir-950/20 pl-4 flex flex-col justify-between">
              <div className="w-full h-24 bg-noir-950/10 flex items-center justify-center border border-noir-950/20">
                <span className="text-[8px] text-noir-950/40 uppercase font-black rotate-12">No Photo Available</span>
              </div>
              <div className="text-[8px] font-black leading-none uppercase mt-2">
                Inside: <br/>Market Crash? <br/>Pg. 4
              </div>
            </div>
          </div>

          <button 
            onClick={onFinish}
            className="mt-8 text-[10px] font-black uppercase tracking-widest border-2 border-noir-950 px-4 py-1 hover:bg-noir-950 hover:text-white transition-colors"
          >
            Close Gazette
          </button>
        </div>
      </div>
    </div>
  );
}

export default MorningReport;