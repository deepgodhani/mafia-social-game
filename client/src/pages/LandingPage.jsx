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
    <div className="min-h-screen bg-black text-amber-100 flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold mb-4">MAFIA</h1>

      <p className="text-amber-600 italic mb-8">
        "Trust no one."
      </p>

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

          // ⭐ FLOW CONTROL
          if (!data.user?.username) {
            navigate("/profile-setup");
          } else {
            navigate("/home");
          }
        }}
        onError={() => console.log("Login Failed")}
      />

    </div>
  );
}

export default LandingPage;