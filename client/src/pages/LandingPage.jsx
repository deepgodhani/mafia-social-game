import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-noir-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,0,0,0.05)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-crimson-900/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md animate-in fade-in zoom-in duration-1000">
        <div className="mb-4">
          <div className="panel-header opacity-40 mb-2">Underground Protocol</div>
          <h1 className="text-7xl font-black uppercase tracking-tighter italic leading-none drop-shadow-2xl">
            MAFIA
          </h1>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="h-px w-8 bg-white/10"></div>
            <span className="text-xs font-black uppercase tracking-[0.5em] text-crimson-600">Noir</span>
            <div className="h-px w-8 bg-white/10"></div>
          </div>
        </div>

        <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] mb-12 italic max-w-[240px]">
          "The truth is a commodity we cannot afford."
        </p>

        <div className="w-full panel p-8 border-white/5 bg-noir-900/40 backdrop-blur-xl relative group">
          <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="mb-6 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Secure Access</div>
            <p className="text-[10px] font-medium text-white/20 uppercase tracking-tight">Verify your credentials to continue</p>
          </div>

          <div className="flex justify-center scale-110">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
                const res = await fetch(`${SERVER_URL}/auth/google`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    credential: credentialResponse.credential,
                  }),
                });

                const data = await res.json();
                localStorage.setItem("token", data.token);

                if (!data.user?.username) {
                  navigate("/profile-setup");
                } else {
                  navigate("/home");
                }
              }}
              onError={() => console.log("Login Failed")}
              theme="filled_black"
              shape="pill"
            />
          </div>
        </div>

        <div className="mt-16 text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">
          Copyright © 1947 Noir Syndicate
        </div>
      </div>

      {/* Redacted Strips */}
      <div className="absolute top-20 -right-20 w-64 h-12 bg-noir-900 -rotate-12 border-y border-white/5 opacity-30"></div>
      <div className="absolute bottom-40 -left-20 w-64 h-12 bg-noir-900 12 border-y border-white/5 opacity-30"></div>
    </div>
  );
}

export default LandingPage;