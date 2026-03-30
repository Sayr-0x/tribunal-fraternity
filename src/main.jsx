import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const GOLD = "#C9A227";

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      onLogin(data);
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#12100a", fontFamily: "Georgia, 'Times New Roman', serif"
    }}>
      <div style={{
        background: "#1a1508", border: `1px solid ${GOLD}`,
        borderRadius: 12, padding: "40px 44px", width: 340,
        boxShadow: "0 16px 60px rgba(0,0,0,0.5)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 12 }}>
            <circle cx="50" cy="50" r="47" stroke={GOLD} strokeWidth="2" fill="none"/>
            <circle cx="50" cy="50" r="42" stroke={GOLD} strokeWidth="1" fill="none"/>
            <line x1="50" y1="38" x2="50" y2="28" stroke={GOLD} strokeWidth="2"/>
            <circle cx="50" cy="27" r="2" fill={GOLD}/>
            <line x1="30" y1="43" x2="70" y2="43" stroke={GOLD} strokeWidth="1.5"/>
            <line x1="30" y1="43" x2="22" y2="56" stroke={GOLD} strokeWidth="1.5"/>
            <line x1="70" y1="43" x2="78" y2="56" stroke={GOLD} strokeWidth="1.5"/>
            <rect x="18" y="55" width="16" height="4" rx="2" fill={GOLD}/>
            <rect x="66" y="55" width="16" height="4" rx="2" fill={GOLD}/>
            <line x1="50" y1="43" x2="50" y2="72" stroke={GOLD} strokeWidth="1.5"/>
            <rect x="42" y="72" width="16" height="3" rx="1.5" fill={GOLD}/>
            <text x="50" y="90" textAnchor="middle" fill={GOLD} fontSize="5.5" fontFamily="Georgia, serif" fontWeight="bold" letterSpacing="0.5">FRATERNITY</text>
          </svg>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", color: GOLD, marginBottom: 4 }}>TRIBUNAL JUDICIAIRE DE FRATERNITY</div>
          <div style={{ fontSize: 9, color: "#6a5a30", letterSpacing: "0.08em" }}>PARQUET · SIÈGE · GREFFE</div>
        </div>

        <div style={{ height: 1, background: GOLD, marginBottom: 24, opacity: 0.4 }} />

        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, color: "#8a7040", letterSpacing: "0.08em", marginBottom: 6 }}>IDENTIFIANT</label>
            <input
              type="text" value={form.username} autoComplete="username"
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              style={{
                width: "100%", padding: "10px 12px", background: "#12100a",
                border: `1px solid ${error ? "#E24B4A" : "#3a2e10"}`, borderRadius: 6,
                color: "#e8d5a0", fontSize: 14, fontFamily: "Georgia, serif", boxSizing: "border-box",
                outline: "none"
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, color: "#8a7040", letterSpacing: "0.08em", marginBottom: 6 }}>MOT DE PASSE</label>
            <input
              type="password" value={form.password} autoComplete="current-password"
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              style={{
                width: "100%", padding: "10px 12px", background: "#12100a",
                border: `1px solid ${error ? "#E24B4A" : "#3a2e10"}`, borderRadius: 6,
                color: "#e8d5a0", fontSize: 14, fontFamily: "Georgia, serif", boxSizing: "border-box",
                outline: "none"
              }}
            />
          </div>
          {error && <div style={{ fontSize: 12, color: "#E24B4A", marginBottom: 14, textAlign: "center" }}>{error}</div>}
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "11px", background: GOLD, color: "#12100a",
            border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700,
            letterSpacing: "0.08em", cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1, fontFamily: "Georgia, serif"
          }}>
            {loading ? "CONNEXION…" : "SE CONNECTER"}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: "center", fontSize: 9, color: "#3a2e10", letterSpacing: "0.1em" }}>
          LIBERTÉ · ÉGALITÉ · FRATERNITÉ
        </div>
      </div>
    </div>
  );
}

function Root() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(u => { setUser(u); setChecking(false); })
      .catch(() => setChecking(false));
  }, []);

  if (checking) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#12100a" }}>
      <div style={{ color: "#C9A227", fontSize: 13, letterSpacing: "0.1em" }}>CHARGEMENT…</div>
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;
  return <App user={user} onLogout={() => setUser(null)} />;
}

createRoot(document.getElementById("root")).render(<StrictMode><Root /></StrictMode>);
