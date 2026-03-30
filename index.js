const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? false : "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "tribunal-fraternity-secret-dev",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60 * 1000 // 8 heures
  }
}));

// ── Middleware auth ────────────────────────────────────────────────────────
const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: "Non authentifié" });
  next();
};
const requireProcureur = (req, res, next) => {
  if (req.session.role !== "procureur") return res.status(403).json({ error: "Accès refusé" });
  next();
};

// ── AUTH ───────────────────────────────────────────────────────────────────
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Identifiants incorrects" });
    if (user.statut === "Suspendu" || user.statut === "Inactif")
      return res.status(403).json({ error: "Compte désactivé — contactez le Procureur" });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Identifiants incorrects" });
    req.session.userId   = user.id;
    req.session.role     = user.role;
    req.session.username = user.username;
    res.json({ id: user.id, username: user.username, nom: user.nom, role: user.role, statut: user.statut });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

app.get("/api/me", requireAuth, async (req, res) => {
  const result = await pool.query(
    "SELECT id, username, nom, role, statut, poste FROM users WHERE id = $1",
    [req.session.userId]
  );
  res.json(result.rows[0]);
});

// ── USERS (Procureur seulement) ────────────────────────────────────────────
app.get("/api/users", requireAuth, async (req, res) => {
  // Les employés voient la liste, mais ne peuvent pas modifier
  const result = await pool.query(
    "SELECT id, username, nom, role, statut, poste, service, email FROM users ORDER BY id"
  );
  res.json(result.rows);
});

app.post("/api/users", requireAuth, requireProcureur, async (req, res) => {
  try {
    const { username, password, nom, role, poste, service, email } = req.body;
    if (!username || !password || !nom) return res.status(400).json({ error: "Champs obligatoires manquants" });
    const hash = await bcrypt.hash(password, 12);
    const r = await pool.query(
      "INSERT INTO users (username, password_hash, nom, role, statut, poste, service, email) VALUES ($1,$2,$3,$4,'Actif',$5,$6,$7) RETURNING id, username, nom, role, statut, poste",
      [username, hash, nom, role || "employe", poste, service, email]
    );
    res.json(r.rows[0]);
  } catch (err) {
    if (err.code === "23505") return res.status(400).json({ error: "Cet identifiant existe déjà" });
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.patch("/api/users/:id", requireAuth, requireProcureur, async (req, res) => {
  const { statut, poste, service, role } = req.body;
  const r = await pool.query(
    "UPDATE users SET statut = COALESCE($1, statut), poste = COALESCE($2, poste), service = COALESCE($3, service), role = COALESCE($4, role) WHERE id = $5 RETURNING id, username, nom, role, statut, poste, service, email",
    [statut, poste, service, role, req.params.id]
  );
  res.json(r.rows[0]);
});

// ── AFFAIRES ───────────────────────────────────────────────────────────────
app.get("/api/affaires", requireAuth, async (req, res) => {
  const r = await pool.query("SELECT * FROM affaires ORDER BY created_at DESC");
  res.json(r.rows);
});

app.post("/api/affaires", requireAuth, async (req, res) => {
  const { numero, prevenu, infractions, statut, date_dossier, magistrat } = req.body;
  const r = await pool.query(
    "INSERT INTO affaires (numero, prevenu, infractions, statut, date_dossier, magistrat) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [numero, prevenu, infractions, statut || "En cours", date_dossier, magistrat || "Hugo Veyermann"]
  );
  res.json(r.rows[0]);
});

app.patch("/api/affaires/:id", requireAuth, async (req, res) => {
  const { statut, infractions, notes } = req.body;
  const r = await pool.query(
    "UPDATE affaires SET statut = COALESCE($1, statut), infractions = COALESCE($2, infractions), notes = COALESCE($3, notes) WHERE id = $4 RETURNING *",
    [statut, infractions, notes, req.params.id]
  );
  res.json(r.rows[0]);
});

// ── PLAINTES ───────────────────────────────────────────────────────────────
app.get("/api/plaintes", requireAuth, async (req, res) => {
  const r = await pool.query("SELECT * FROM plaintes ORDER BY created_at DESC");
  res.json(r.rows);
});

app.post("/api/plaintes", requireAuth, async (req, res) => {
  const { reference, plaignant, contre, objet, statut, date_plainte } = req.body;
  const r = await pool.query(
    "INSERT INTO plaintes (reference, plaignant, contre, objet, statut, date_plainte) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [reference, plaignant, contre, objet, statut || "En cours", date_plainte]
  );
  res.json(r.rows[0]);
});

// ── RAPPORTS ───────────────────────────────────────────────────────────────
app.get("/api/rapports", requireAuth, async (req, res) => {
  const r = await pool.query("SELECT * FROM rapports ORDER BY created_at DESC");
  res.json(r.rows);
});

app.post("/api/rapports", requireAuth, async (req, res) => {
  const { reference, auteur, objet, dossier_lie, statut, date_rapport } = req.body;
  const r = await pool.query(
    "INSERT INTO rapports (reference, auteur, objet, dossier_lie, statut, date_rapport) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [reference, auteur, objet, dossier_lie, statut || "En cours", date_rapport]
  );
  res.json(r.rows[0]);
});

// ── PRÉVENUS ───────────────────────────────────────────────────────────────
app.get("/api/prevenus", requireAuth, async (req, res) => {
  const r = await pool.query("SELECT * FROM prevenus ORDER BY nom");
  res.json(r.rows);
});

app.post("/api/prevenus", requireAuth, async (req, res) => {
  const { nom, statut, dossiers, notes, date_naissance } = req.body;
  const r = await pool.query(
    "INSERT INTO prevenus (nom, statut, dossiers, notes, date_naissance) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [nom, statut || "Suspect", dossiers, notes, date_naissance]
  );
  res.json(r.rows[0]);
});

app.patch("/api/prevenus/:id", requireAuth, async (req, res) => {
  const { statut, notes } = req.body;
  const r = await pool.query(
    "UPDATE prevenus SET statut = COALESCE($1, statut), notes = COALESCE($2, notes) WHERE id = $3 RETURNING *",
    [statut, notes, req.params.id]
  );
  res.json(r.rows[0]);
});

// ── SEMAINE ────────────────────────────────────────────────────────────────
app.get("/api/semaine", requireAuth, async (req, res) => {
  const r = await pool.query("SELECT * FROM semaine ORDER BY id");
  res.json(r.rows);
});

app.put("/api/semaine/:id", requireAuth, async (req, res) => {
  const { type, dossier, notes } = req.body;
  const r = await pool.query(
    "UPDATE semaine SET type=$1, dossier=$2, notes=$3 WHERE id=$4 RETURNING *",
    [type, dossier, notes, req.params.id]
  );
  res.json(r.rows[0]);
});

// ── Serve React (production) ───────────────────────────────────────────────
// En production Render : le build Vite est dans dist/ à la racine du projet
// index.js est à la racine également (pas dans server/)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Tribunal Fraternity — Serveur démarré sur le port ${PORT}`));
