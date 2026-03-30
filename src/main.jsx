import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const G  = "#C9A227";
const G3 = "#7A5C10";
const G4 = "#3D2E08";
const BG = "#0A0904";

function Login({ onLogin }) {
  const [form, setForm]     = useState({ username: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoad]  = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true); setError("");
    try {
      const res  = await fetch("/api/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      onLogin(data);
    } catch { setError("Erreur de connexion au serveur."); }
    finally { setLoad(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: BG, fontFamily: "Georgia,'Times New Roman',serif",
      backgroundImage: "radial-gradient(ellipse at 50% 0%, #1a1408 0%, #0A0904 60%)"
    }}>
      <div style={{ width: 360 }}>

        {/* En-tête institutionnel */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          {/* Logo SVG */}
          <svg width="72" height="72" viewBox="0 0 100 100" fill="none" style={{ marginBottom: 14 }}>
            <circle cx="50" cy="50" r="46" stroke={G} strokeWidth="1.5" fill="none"/>
            <circle cx="50" cy="50" r="40" stroke={G3} strokeWidth="0.5" fill="none"/>
            <line x1="50" y1="36" x2="50" y2="26" stroke={G} strokeWidth="2"/>
            <circle cx="50" cy="25" r="2.5" fill={G}/>
            <line x1="28" y1="42" x2="72" y2="42" stroke={G} strokeWidth="1.5"/>
            <line x1="28" y1="42" x2="19" y2="57" stroke={G} strokeWidth="1.5"/>
            <line x1="72" y1="42" x2="81" y2="57" stroke={G} strokeWidth="1.5"/>
            <rect x="14" y="56" width="18" height="4" rx="2" fill={G}/>
            <rect x="68" y="56" width="18" height="4" rx="2" fill={G}/>
            <line x1="50" y1="42" x2="50" y2="72" stroke={G} strokeWidth="1.5"/>
            <rect x="41" y="72" width="18" height="3" rx="1.5" fill={G}/>
            <text x="50" y="90" textAnchor="middle" fill={G3} fontSize="6" fontFamily="Georgia,serif" letterSpacing="1">FRATERNITY</text>
          </svg>

          <div style={{ fontSize: 9, letterSpacing: "0.2em", color: G3, marginBottom: 6 }}>
            RÉPUBLIQUE FRANÇAISE DE FRATERNITY
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: G, letterSpacing: "0.06em" }}>
            Tribunal Judiciaire
          </div>
          <div style={{ fontSize: 11, color: "#5A4A28", marginTop: 3, letterSpacing: "0.08em" }}>
            DE FRATERNITY
          </div>
          <div style={{ fontSize: 9, color: G3, marginTop: 6, letterSpacing: "0.1em" }}>
            Cabinet du Procureur de la République
          </div>
        </div>

        {/* Ligne dorée */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${G3})` }} />
          <span style={{ color: G3, fontSize: 10 }}>◆</span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${G3})` }} />
        </div>

        {/* Formulaire */}
        <div style={{
          background: "#0E0C06",
          border: `1px solid ${G4}`,
          borderRadius: 6,
          padding: "28px 30px",
          boxShadow: `0 0 0 1px #1a1408, 0 32px 80px rgba(0,0,0,0.8)`
        }}>
          <div style={{ fontSize: 10, color: G3, letterSpacing: "0.15em", marginBottom: 20, textAlign: "center" }}>
            ACCÈS SÉCURISÉ — PERSONNEL AUTORISÉ
          </div>

          <form onSubmit={submit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 10, color: "#5A4A28", letterSpacing: "0.12em", marginBottom: 6 }}>
                IDENTIFIANT
              </label>
              <input
                type="text" value={form.username} autoComplete="username"
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                style={{
                  width: "100%", padding: "11px 14px",
                  background: BG, border: `1px solid ${error ? "#5A1818" : G4}`,
                  borderRadius: 4, color: "#D4C080", fontSize: 13,
                  fontFamily: "Georgia,serif", boxSizing: "border-box", outline: "none",
                  transition: "border-color 0.15s"
                }}
                onFocus={e => { e.target.style.borderColor = G3; }}
                onBlur={e => { e.target.style.borderColor = error ? "#5A1818" : G4; }}
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 10, color: "#5A4A28", letterSpacing: "0.12em", marginBottom: 6 }}>
                MOT DE PASSE
              </label>
              <input
                type="password" value={form.password} autoComplete="current-password"
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={{
                  width: "100%", padding: "11px 14px",
                  background: BG, border: `1px solid ${error ? "#5A1818" : G4}`,
                  borderRadius: 4, color: "#D4C080", fontSize: 13,
                  fontFamily: "Georgia,serif", boxSizing: "border-box", outline: "none",
                  transition: "border-color 0.15s"
                }}
                onFocus={e => { e.target.style.borderColor = G3; }}
                onBlur={e => { e.target.style.borderColor = error ? "#5A1818" : G4; }}
              />
            </div>

            {error && (
              <div style={{
                fontSize: 11, color: "#E85A5A", marginBottom: 16,
                textAlign: "center", letterSpacing: "0.04em",
                padding: "8px", background: "#1F0808", borderRadius: 4,
                border: "1px solid #5A1818"
              }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "12px",
              background: loading ? G4 : "transparent",
              color: loading ? "#5A4A28" : G,
              border: `1px solid ${loading ? G4 : G}`,
              borderRadius: 4, fontSize: 12, fontWeight: 700,
              letterSpacing: "0.12em", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Georgia,serif", transition: "all 0.15s"
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = G; e.currentTarget.style.color = BG; } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = G; } }}
            >
              {loading ? "AUTHENTIFICATION…" : "SE CONNECTER"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, textAlign: "center", fontSize: 9, color: "#2A2210", letterSpacing: "0.15em" }}>
          LIBERTÉ · ÉGALITÉ · FRATERNITÉ
        </div>
      </div>
    </div>
  );
}

function Root() {
  const [user,     setUser]     = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(u => { setUser(u); setChecking(false); })
      .catch(() => setChecking(false));
  }, []);

  if (checking) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0A0904"
    }}>
      <div style={{ color: G, fontSize: 12, letterSpacing: "0.15em" }}>CHARGEMENT…</div>
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;
  return <App user={user} onLogout={() => setUser(null)} />;
}

createRoot(document.getElementById("root")).render(<StrictMode><Root /></StrictMode>);