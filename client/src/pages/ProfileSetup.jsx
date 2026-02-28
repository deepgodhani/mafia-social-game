import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileSetup() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const email = payload.email || "";
      const name = payload.name || "";

      const emailPrefix = email.split("@")[0] || "player";
      const suggestedUsername = emailPrefix
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_");

      setUsername((prev) => prev || suggestedUsername);
      setDisplayName((prev) => prev || name || suggestedUsername);
    } catch {
      // if token is malformed just send them back to landing
      navigate("/");
    }
  }, [navigate]);

  const saveProfile = async () => {
    setError("");
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const res = await fetch("http://localhost:3000/profile/setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: username.trim(),
        displayName: displayName.trim(),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.error === "USERNAME_TAKEN") {
        setError("That username is already taken. Try another.");
      } else {
        setError("Could not save profile. Please try again.");
      }
      return;
    }

    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-black text-amber-100 flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Profile Setup</h2>

      <input
        placeholder="Username (unique)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 rounded bg-zinc-900"
      />

      <input
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="p-2 rounded bg-zinc-900"
      />

      {error && (
        <p className="text-sm text-red-400 max-w-xs text-center">
          {error}
        </p>
      )}

      <button
        onClick={saveProfile}
        className="px-6 py-2 bg-amber-700 rounded"
      >
        Continue
      </button>
    </div>
  );
}

export default ProfileSetup;