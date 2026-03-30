import { useState, useEffect, useCallback } from "react";

// ─── Palette ───────────────────────────────────────────────────────────────
const G  = "#C9A227";   // or principal
const G2 = "#E8C84A";   // or clair (hover)
const G3 = "#7A5C10";   // or sombre
const G4 = "#3D2E08";   // or très sombre (borders subtils)
const BG  = "#0A0904";  // fond principal
const BG2 = "#111008";  // fond sidebar
const BG3 = "#181409";  // fond cards
const BG4 = "#1E1A0C";  // fond hover lignes
const TX  = "#E8D9A8";  // texte principal
const TX2 = "#8A7A50";  // texte secondaire
const TX3 = "#5A4E30";  // texte tertiaire

// ─── Badges statut (dark-mode) ─────────────────────────────────────────────
const STATUS = {
  "En cours":          { bg: "#0C1F08", text: "#7EC85A", border: "#2A5A18" },
  "Jugé":              { bg: "#080C1F", text: "#5A8AE8", border: "#182A5A" },
  "Classé sans suite": { bg: "#141208", text: "#8A8060", border: "#3A3420" },
  "Instruit":          { bg: "#1A1004", text: "#D4A040", border: "#5A3A10" },
  "Traitée":           { bg: "#080C1F", text: "#5A8AE8", border: "#182A5A" },
  "Archivé":           { bg: "#141208", text: "#8A8060", border: "#3A3420" },
  "Actif":             { bg: "#0C1F08", text: "#7EC85A", border: "#2A5A18" },
  "Inactif":           { bg: "#141208", text: "#8A8060", border: "#3A3420" },
  "Suspendu":          { bg: "#1F0808", text: "#E85A5A", border: "#5A1818" },
  "Mis en examen":     { bg: "#1A1004", text: "#D4A040", border: "#5A3A10" },
  "Condamné":          { bg: "#1F0808", text: "#E85A5A", border: "#5A1818" },
  "Suspect":           { bg: "#1A0C12", text: "#D47AAA", border: "#5A2040" },
  "Libre":             { bg: "#0C1F08", text: "#7EC85A", border: "#2A5A18" },
};

const Badge = ({ status }) => {
  const s = STATUS[status] || STATUS["Classé sans suite"];
  return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 600,
      padding: "3px 10px", borderRadius: 3,
      background: s.bg, color: s.text, border: `1px solid ${s.border}`,
      letterSpacing: "0.04em", fontFamily: "'Georgia', serif"
    }}>{status}</span>
  );
};

// ─── Logo balance ──────────────────────────────────────────────────────────
const Logo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
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
);

// ─── Divider doré ──────────────────────────────────────────────────────────
const Divider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0" }}>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${G3})` }} />
    <span style={{ color: G3, fontSize: 9 }}>◆</span>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${G3})` }} />
  </div>
);

// ─── Modal ─────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center"
  }} onClick={onClose}>
    <div style={{
      background: BG3, borderRadius: 8,
      border: `1px solid ${G3}`,
      boxShadow: `0 0 0 1px ${G4}, 0 24px 60px rgba(0,0,0,0.7)`,
      padding: "28px 32px", minWidth: 440, maxWidth: 580,
      maxHeight: "90vh", overflowY: "auto"
    }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: G, letterSpacing: "0.08em", fontFamily: "Georgia,serif" }}>
          {title.toUpperCase()}
        </h3>
        <button onClick={onClose} style={{
          background: "none", border: `1px solid ${G4}`, borderRadius: 4,
          cursor: "pointer", fontSize: 14, color: TX2, padding: "2px 8px",
          lineHeight: 1
        }}>✕</button>
      </div>
      <Divider />
      <div style={{ marginTop: 18 }}>{children}</div>
    </div>
  </div>
);

// ─── Field ─────────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 4,
  border: `1px solid ${G4}`, background: BG, color: TX,
  boxSizing: "border-box", fontFamily: "Georgia,serif",
  outline: "none"
};

const Field = ({ label, value, onChange, type = "text", options, disabled }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 10, color: TX2, letterSpacing: "0.1em", marginBottom: 5 }}>
      {label.toUpperCase()}
    </label>
    {options ? (
      <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        style={{ ...inputStyle }}>
        {options.map(o => <option key={o} value={o} style={{ background: BG3 }}>{o}</option>)}
      </select>
    ) : type === "textarea" ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        style={{ ...inputStyle }} />
    )}
  </div>
);

// ─── Table ─────────────────────────────────────────────────────────────────
const Table = ({ cols, rows, onRowClick }) => (
  <div style={{ overflowX: "auto", borderRadius: 6, border: `1px solid ${G4}` }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: BG2, borderBottom: `1px solid ${G3}` }}>
          {cols.map(c => (
            <th key={c.key} style={{
              textAlign: "left", padding: "10px 14px", fontSize: 10,
              fontWeight: 700, color: G, letterSpacing: "0.12em",
              whiteSpace: "nowrap", fontFamily: "Georgia,serif"
            }}>{c.label.toUpperCase()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr><td colSpan={cols.length} style={{
            padding: "32px 14px", textAlign: "center",
            color: TX3, fontSize: 13, fontStyle: "italic"
          }}>Aucune donnée enregistrée</td></tr>
        )}
        {rows.map((row, i) => (
          <tr key={row.id || i}
            onClick={() => onRowClick && onRowClick(row)}
            style={{
              borderBottom: `1px solid ${G4}`,
              cursor: onRowClick ? "pointer" : "default",
              background: i % 2 === 0 ? BG : BG3,
              transition: "background 0.1s"
            }}
            onMouseEnter={e => { if (onRowClick) e.currentTarget.style.background = BG4; }}
            onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? BG : BG3; }}
          >
            {cols.map(c => (
              <td key={c.key} style={{ padding: "10px 14px", color: TX }}>
                {c.render ? c.render(row[c.key], row) : row[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── PageHeader ────────────────────────────────────────────────────────────
const PageHeader = ({ title, subtitle, onAdd, addLabel }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
      <div>
        <div style={{ fontSize: 10, color: G3, letterSpacing: "0.15em", marginBottom: 4, fontFamily: "Georgia,serif" }}>
          TRIBUNAL JUDICIAIRE DE FRATERNITY · PARQUET
        </div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TX, fontFamily: "Georgia,serif" }}>{title}</h2>
        {subtitle && <p style={{ margin: "4px 0 0", fontSize: 12, color: TX2, fontStyle: "italic" }}>{subtitle}</p>}
      </div>
      {onAdd && (
        <button onClick={onAdd} style={{
          background: "transparent", color: G, border: `1px solid ${G}`,
          borderRadius: 4, padding: "8px 18px", fontSize: 12, fontWeight: 700,
          cursor: "pointer", letterSpacing: "0.08em", fontFamily: "Georgia,serif",
          transition: "all 0.15s"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = G; e.currentTarget.style.color = BG; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = G; }}
        >
          {addLabel || "+ AJOUTER"}
        </button>
      )}
    </div>
    <div style={{ height: 1, background: `linear-gradient(to right, ${G3}, transparent)`, marginTop: 14 }} />
  </div>
);

// ─── BtnRow ────────────────────────────────────────────────────────────────
const BtnRow = ({ onClose, onSave, saving }) => (
  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${G4}` }}>
    <button onClick={onClose} style={{
      padding: "8px 20px", borderRadius: 4, border: `1px solid ${G4}`,
      background: "transparent", cursor: "pointer", fontSize: 12,
      color: TX2, fontFamily: "Georgia,serif", letterSpacing: "0.06em"
    }}>ANNULER</button>
    <button onClick={onSave} disabled={saving} style={{
      padding: "8px 20px", borderRadius: 4, border: `1px solid ${G}`,
      background: saving ? G4 : G, color: BG,
      cursor: saving ? "not-allowed" : "pointer", fontSize: 12,
      fontWeight: 700, fontFamily: "Georgia,serif", letterSpacing: "0.06em"
    }}>
      {saving ? "ENREGISTREMENT…" : "ENREGISTRER"}
    </button>
  </div>
);

// ─── Loader ────────────────────────────────────────────────────────────────
const Loader = () => (
  <div style={{ padding: 40, textAlign: "center", color: TX3, fontSize: 13, fontStyle: "italic" }}>
    Chargement…
  </div>
);

// ─── Tabs config ────────────────────────────────────────────────────────────
const TABS = [
  { key: "dashboard", label: "Tableau de bord",     icon: "⊞" },
  { key: "affaires",  label: "Affaires",             icon: "⚖" },
  { key: "plaintes",  label: "Plaintes",             icon: "◧" },
  { key: "rapports",  label: "Rapports",             icon: "◨" },
  { key: "prevenus",  label: "Prévenus & Suspects",  icon: "◉" },
  { key: "employes",  label: "Employés",             icon: "◈" },
  { key: "semaine",   label: "Semaine en cours",     icon: "◫" },
];

// ─── API ────────────────────────────────────────────────────────────────────
const api = {
  get:   url => fetch(url, { credentials: "include" }).then(r => r.json()),
  post:  (url, b) => fetch(url, { method: "POST",  credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  patch: (url, b) => fetch(url, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
  put:   (url, b) => fetch(url, { method: "PUT",   credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).then(r => r.json()),
};

// ─── AFFAIRES ──────────────────────────────────────────────────────────────
function AffairesTab({ user }) {
  const [rows, setRows]   = useState([]);
  const [loading, setL]   = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(() => {
    setL(true);
    api.get("/api/affaires").then(d => { setRows(Array.isArray(d) ? d : []); setL(false); });
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Affaires en cours" subtitle={`${rows.length} dossier(s) enregistré(s)`}
        onAdd={() => setModal({ type: "add" })} addLabel="+ NOUVEAU DOSSIER" />
      {loading ? <Loader /> : (
        <Table
          cols={[
            { key: "numero",      label: "N° Dossier", render: v => <span style={{ color: G, fontWeight: 700, letterSpacing: "0.04em" }}>{v}</span> },
            { key: "prevenu",     label: "Prévenu", render: v => <span style={{ fontWeight: 500 }}>{v}</span> },
            { key: "infractions", label: "Infractions", render: v => <span style={{ color: TX2, fontSize: 12 }}>{v?.length > 55 ? v.slice(0,55)+"…" : v}</span> },
            { key: "statut",      label: "Statut", render: v => <Badge status={v} /> },
            { key: "date_dossier",label: "Date" },
            { key: "magistrat",   label: "Magistrat", render: v => <span style={{ color: TX2, fontSize: 12 }}>{v}</span> },
          ]}
          rows={rows}
          onRowClick={row => setModal({ type: "detail", row })}
        />
      )}
      {modal?.type === "add" && (
        <AffaireAddModal
          nextId={`26/${String(rows.length + 1).padStart(5, "0")}`}
          user={user} onClose={() => setModal(null)}
          onSave={async f => { await api.post("/api/affaires", f); load(); }}
        />
      )}
      {modal?.type === "detail" && (
        <AffaireDetailModal row={modal.row} onClose={() => setModal(null)}
          onEdit={async (id, p) => { await api.patch(`/api/affaires/${id}`, p); load(); }}
        />
      )}
    </div>
  );
}

function AffaireAddModal({ nextId, user, onClose, onSave }) {
  const [form, setForm] = useState({ numero: nextId, prevenu: "", infractions: "", statut: "En cours", date_dossier: new Date().toLocaleDateString("fr-FR"), magistrat: user?.nom || "" });
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Nouveau dossier" onClose={onClose}>
      <Field label="N° Dossier"  value={form.numero}       onChange={f("numero")} />
      <Field label="Prévenu"     value={form.prevenu}      onChange={f("prevenu")} />
      <Field label="Infractions" value={form.infractions}  onChange={f("infractions")} type="textarea" />
      <Field label="Statut"      value={form.statut}       onChange={f("statut")} options={["En cours","Instruit","Jugé","Classé sans suite"]} />
      <Field label="Date"        value={form.date_dossier} onChange={f("date_dossier")} />
      <Field label="Magistrat"   value={form.magistrat}    onChange={f("magistrat")} />
      <BtnRow onClose={onClose} saving={saving}
        onSave={async () => { setSaving(true); await onSave(form); onClose(); }} />
    </Modal>
  );
}

function AffaireDetailModal({ row, onClose, onEdit }) {
  const [statut, setStatut] = useState(row.statut);
  const [notes, setNotes]   = useState(row.notes || "");
  const [saving, setSaving] = useState(false);
  return (
    <Modal title={`Dossier ${row.numero}`} onClose={onClose}>
      {[["Prévenu", row.prevenu], ["Infractions", row.infractions], ["Date", row.date_dossier], ["Magistrat", row.magistrat]].map(([k, v]) => (
        <div key={k} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: TX3, letterSpacing: "0.1em", marginBottom: 3 }}>{k.toUpperCase()}</div>
          <div style={{ fontSize: 13, color: TX }}>{v}</div>
        </div>
      ))}
      <Field label="Statut" value={statut} onChange={setStatut} options={["En cours","Instruit","Jugé","Classé sans suite"]} />
      <Field label="Notes"  value={notes}  onChange={setNotes}  type="textarea" />
      <BtnRow onClose={onClose} saving={saving}
        onSave={async () => { setSaving(true); await onEdit(row.id, { statut, notes }); onClose(); }} />
    </Modal>
  );
}

// ─── PLAINTES ──────────────────────────────────────────────────────────────
function PlaintesTab() {
  const [rows, setRows]   = useState([]);
  const [loading, setL]   = useState(true);
  const [modal, setModal] = useState(null);
  const load = useCallback(() => {
    api.get("/api/plaintes").then(d => { setRows(Array.isArray(d) ? d : []); setL(false); });
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Plaintes" subtitle={`${rows.length} plainte(s) enregistrée(s)`}
        onAdd={() => setModal("add")} addLabel="+ NOUVELLE PLAINTE" />
      {loading ? <Loader /> : (
        <Table
          cols={[
            { key: "reference",   label: "Référence", render: v => <span style={{ color: G, fontWeight: 700 }}>{v}</span> },
            { key: "plaignant",   label: "Plaignant" },
            { key: "contre",      label: "Mis en cause" },
            { key: "objet",       label: "Objet", render: v => <span style={{ color: TX2, fontSize: 12 }}>{v?.length > 55 ? v.slice(0,55)+"…" : v}</span> },
            { key: "statut",      label: "Statut", render: v => <Badge status={v || "En cours"} /> },
            { key: "date_plainte",label: "Date" },
          ]}
          rows={rows}
        />
      )}
      {modal === "add" && (
        <PlainteAddModal
          nextRef={`PL-26/${String(rows.length + 1).padStart(3, "0")}`}
          onClose={() => setModal(null)}
          onSave={async f => { await api.post("/api/plaintes", f); load(); setModal(null); }}
        />
      )}
    </div>
  );
}

function PlainteAddModal({ nextRef, onClose, onSave }) {
  const [form, setForm] = useState({ reference: nextRef, plaignant: "", contre: "", objet: "", statut: "En cours", date_plainte: new Date().toLocaleDateString("fr-FR") });
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Nouvelle plainte" onClose={onClose}>
      <Field label="Référence"    value={form.reference}    onChange={f("reference")} />
      <Field label="Plaignant"    value={form.plaignant}    onChange={f("plaignant")} />
      <Field label="Mis en cause" value={form.contre}       onChange={f("contre")} />
      <Field label="Objet"        value={form.objet}        onChange={f("objet")} type="textarea" />
      <Field label="Statut"       value={form.statut}       onChange={f("statut")} options={["En cours","Traitée","Classée sans suite"]} />
      <Field label="Date"         value={form.date_plainte} onChange={f("date_plainte")} />
      <BtnRow onClose={onClose} saving={saving}
        onSave={async () => { setSaving(true); await onSave(form); }} />
    </Modal>
  );
}

// ─── RAPPORTS ──────────────────────────────────────────────────────────────
function RapportsTab() {
  const [rows, setRows]   = useState([]);
  const [loading, setL]   = useState(true);
  const [modal, setModal] = useState(null);
  const load = useCallback(() => {
    api.get("/api/rapports").then(d => { setRows(Array.isArray(d) ? d : []); setL(false); });
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Rapports" subtitle={`${rows.length} rapport(s) enregistré(s)`}
        onAdd={() => setModal("add")} addLabel="+ NOUVEAU RAPPORT" />
      {loading ? <Loader /> : (
        <Table
          cols={[
            { key: "reference",   label: "Référence", render: v => <span style={{ color: G, fontWeight: 700 }}>{v}</span> },
            { key: "auteur",      label: "Auteur" },
            { key: "objet",       label: "Objet", render: v => <span style={{ color: TX2, fontSize: 12 }}>{v?.length > 55 ? v.slice(0,55)+"…" : v}</span> },
            { key: "dossier_lie", label: "Dossier lié" },
            { key: "statut",      label: "Statut", render: v => <Badge status={v || "En cours"} /> },
            { key: "date_rapport",label: "Date" },
          ]}
          rows={rows}
        />
      )}
      {modal === "add" && (
        <RapportAddModal
          nextRef={`RPT-26/${String(rows.length + 1).padStart(3, "0")}`}
          onClose={() => setModal(null)}
          onSave={async f => { await api.post("/api/rapports", f); load(); setModal(null); }}
        />
      )}
    </div>
  );
}

function RapportAddModal({ nextRef, onClose, onSave }) {
  const [form, setForm] = useState({ reference: nextRef, auteur: "", objet: "", dossier_lie: "", statut: "En cours", date_rapport: new Date().toLocaleDateString("fr-FR") });
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Nouveau rapport" onClose={onClose}>
      <Field label="Référence"   value={form.reference}    onChange={f("reference")} />
      <Field label="Auteur"      value={form.auteur}       onChange={f("auteur")} />
      <Field label="Objet"       value={form.objet}        onChange={f("objet")} type="textarea" />
      <Field label="Dossier lié" value={form.dossier_lie}  onChange={f("dossier_lie")} />
      <Field label="Statut"      value={form.statut}       onChange={f("statut")} options={["En cours","Archivé"]} />
      <Field label="Date"        value={form.date_rapport} onChange={f("date_rapport")} />
      <BtnRow onClose={onClose} saving={saving}
        onSave={async () => { setSaving(true); await onSave(form); }} />
    </Modal>
  );
}

// ─── PRÉVENUS ──────────────────────────────────────────────────────────────
function PrevenusTab() {
  const [rows, setRows]   = useState([]);
  const [loading, setL]   = useState(true);
  const [modal, setModal] = useState(null);
  const load = useCallback(() => {
    api.get("/api/prevenus").then(d => { setRows(Array.isArray(d) ? d : []); setL(false); });
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Prévenus & Suspects" subtitle={`${rows.length} personne(s) fichée(s)`}
        onAdd={() => setModal({ type: "add" })} addLabel="+ FICHER" />
      {loading ? <Loader /> : (
        <Table
          cols={[
            { key: "nom",     label: "Nom complet", render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
            { key: "statut",  label: "Statut", render: v => <Badge status={v} /> },
            { key: "dossiers",label: "Dossier(s)" },
            { key: "notes",   label: "Notes", render: v => <span style={{ color: TX2, fontSize: 12 }}>{v?.length > 65 ? v.slice(0,65)+"…" : v}</span> },
          ]}
          rows={rows}
          onRowClick={row => setModal({ type: "detail", row })}
        />
      )}
      {modal?.type === "add" && (
        <PrevenuAddModal onClose={() => setModal(null)}
          onSave={async f => { await api.post("/api/prevenus", f); load(); setModal(null); }} />
      )}
      {modal?.type === "detail" && (
        <PrevenuDetailModal row={modal.row} onClose={() => setModal(null)}
          onEdit={async (id, p) => { await api.patch(`/api/prevenus/${id}`, p); load(); }} />
      )}
    </div>
  );
}

function PrevenuAddModal({ onClose, onSave }) {
  const [form, setForm] = useState({ nom: "", statut: "Suspect", dossiers: "", notes: "", date_naissance: "" });
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Ficher une personne" onClose={onClose}>
      <Field label="Nom complet"       value={form.nom}            onChange={f("nom")} />
      <Field label="Date de naissance" value={form.date_naissance} onChange={f("date_naissance")} />
      <Field label="Statut"            value={form.statut}         onChange={f("statut")} options={["Suspect","Mis en examen","Condamné","Libre"]} />
      <Field label="Dossier(s)"        value={form.dossiers}       onChange={f("dossiers")} />
      <Field label="Notes"             value={form.notes}          onChange={f("notes")} type="textarea" />
      <BtnRow onClose={onClose} saving={saving}
        onSave={async () => { setSaving(true); await onSave(form); }} />
    </Modal>
  );
}

function PrevenuDetailModal({ row, onClose, onEdit }) {
  const [statut, setStatut] = useState(row.statut);
  const [notes, setNotes]   = useState(row.notes || "");
  const [saving, setSaving] = useState(false);
  return (
    <Modal title={row.nom} onClose={onClose}>
      {[["Date de naissance", row.date_naissance || "—"], ["Dossier(s)", row.dossiers || "—"]].map(([k, v]) => (
        <div key={k} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: TX3, letterSpacing: "0.1em", marginBottom: 3 }}>{k.toUpperCase()}</div>
          <div style={{ fontSize: 13, color: TX }}>{v}</div>
        </div>
      ))}
      <Field label="Statut" value={statut} onChange={setStatut} options={["Suspect","Mis en examen","Condamné","Libre"]} />
      <Field label="Notes"  value={notes}  onChange={setNotes}  type="textarea" />
      <BtnRow onClose={onClose} saving={saving}
        onSave={async () => { setSaving(true); await onEdit(row.id, { statut, notes }); onClose(); }} />
    </Modal>
  );
}

// ─── EMPLOYÉS ──────────────────────────────────────────────────────────────
function EmployesTab({ user }) {
  const [rows, setRows]   = useState([]);
  const [loading, setL]   = useState(true);
  const [modal, setModal] = useState(null);
  const isProcureur = user?.role === "procureur";

  const load = useCallback(() => {
    api.get("/api/users").then(d => { setRows(Array.isArray(d) ? d : []); setL(false); });
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Employés" subtitle={`${rows.filter(e => e.statut === "Actif").length} actif(s) — ${rows.length} total`}
        onAdd={isProcureur ? () => setModal({ type: "add" }) : null} addLabel="+ ENREGISTRER" />
      {loading ? <Loader /> : (
        <Table
          cols={[
            { key: "id",      label: "ID", render: v => <span style={{ color: G3, fontSize: 11 }}>#{v}</span> },
            { key: "nom",     label: "Nom", render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
            { key: "poste",   label: "Poste" },
            { key: "service", label: "Service" },
            { key: "role",    label: "Rôle", render: v => <span style={{ color: v === "procureur" ? G : TX2, fontSize: 12 }}>{v}</span> },
            { key: "statut",  label: "Statut", render: v => <Badge status={v} /> },
            { key: "email",   label: "E-mail", render: v => <span style={{ color: TX3, fontSize: 12 }}>{v}</span> },
          ]}
          rows={rows}
          onRowClick={isProcureur ? row => setModal({ type: "detail", row }) : null}
        />
      )}
      {!isProcureur && (
        <p style={{ fontSize: 12, color: TX3, marginTop: 14, fontStyle: "italic" }}>
          Seul le Procureur peut créer ou modifier des comptes.
        </p>
      )}
      {modal?.type === "add" && (
        <EmployeAddModal onClose={() => setModal(null)}
          onSave={async f => { await api.post("/api/users", f); load(); setModal(null); }} />
      )}
      {modal?.type === "detail" && (
        <EmployeEditModal row={modal.row} onClose={() => setModal(null)}
          onEdit={async (id, p) => { await api.patch(`/api/users/${id}`, p); load(); }} />
      )}
    </div>
  );
}

function EmployeAddModal({ onClose, onSave }) {
  const [form, setForm] = useState({ username: "", password: "", nom: "", poste: "", service: "Parquet", role: "employe", email: "" });
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Enregistrer un employé" onClose={onClose}>
      <Field label="Identifiant (login)" value={form.username} onChange={f("username")} />
      <Field label="Mot de passe"        value={form.password} onChange={f("password")} type="password" />
      <Field label="Nom complet"         value={form.nom}      onChange={f("nom")} />
      <Field label="Poste"               value={form.poste}    onChange={f("poste")} />
      <Field label="Service"             value={form.service}  onChange={f("service")} options={["Parquet","Siège","Greffe"]} />
      <Field label="Rôle"                value={form.role}     onChange={f("role")} options={["employe","procureur"]} />
      <Field label="E-mail"              value={form.email}    onChange={f("email")} type="email" />
      <BtnRow onClose={onClose} saving={saving}
        onSave={async () => { setSaving(true); await onSave(form); }} />
    </Modal>
  );
}

function EmployeEditModal({ row, onClose, onEdit }) {
  const [statut,  setStatut]  = useState(row.statut);
  const [poste,   setPoste]   = useState(row.poste || "");
  const [service, setService] = useState(row.service || "Parquet");
  const [role,    setRole]    = useState(row.role || "employe");
  const [saving,  setSaving]  = useState(false);
  return (
    <Modal title={`Modifier — ${row.nom}`} onClose={onClose}>
      <Field label="Poste"   value={poste}   onChange={setPoste} />
      <Field label="Service" value={service} onChange={setService} options={["Parquet","Siège","Greffe"]} />
      <Field label="Rôle"    value={role}    onChange={setRole}    options={["employe","procureur"]} />
      <Field label="Statut"  value={statut}  onChange={setStatut}  options={["Actif","Inactif","Suspendu"]} />
      <BtnRow onClose={onClose} saving={saving}
        onSave={async () => { setSaving(true); await onEdit(row.id, { statut, poste, service, role }); onClose(); }} />
    </Modal>
  );
}

// ─── SEMAINE ───────────────────────────────────────────────────────────────
function SemaineTab() {
  const [rows, setRows]     = useState([]);
  const [loading, setL]     = useState(true);
  const [editing, setEdit]  = useState(null);

  const load = useCallback(() => {
    api.get("/api/semaine").then(d => { setRows(Array.isArray(d) ? d : []); setL(false); });
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Semaine en cours" subtitle="Planning hebdomadaire du Parquet" />
      {loading ? <Loader /> : (
        <div style={{ display: "grid", gap: 8 }}>
          {rows.map(s => (
            <div key={s.id} style={{
              display: "grid", gridTemplateColumns: "90px 150px 140px 1fr auto",
              gap: 20, alignItems: "center",
              background: BG3, border: `1px solid ${G4}`,
              borderLeft: `3px solid ${G}`,
              borderRadius: "0 6px 6px 0", padding: "14px 18px"
            }}>
              <span style={{ fontWeight: 700, color: G, fontSize: 13, letterSpacing: "0.06em", fontFamily: "Georgia,serif" }}>
                {s.jour.toUpperCase()}
              </span>
              <span style={{ fontSize: 12, color: TX2 }}>{s.type || "—"}</span>
              <span style={{ fontSize: 12, color: s.dossier !== "—" ? G : TX3 }}>{s.dossier}</span>
              <span style={{ fontSize: 13, color: TX }}>{s.notes}</span>
              <button onClick={() => setEdit(s)} style={{
                background: "transparent", border: `1px solid ${G3}`,
                color: G3, borderRadius: 4, padding: "5px 12px",
                cursor: "pointer", fontSize: 12, fontFamily: "Georgia,serif"
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = G; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = G3; e.currentTarget.style.color = G3; }}
              >MODIFIER</button>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <SemaineEditModal row={editing} onClose={() => setEdit(null)}
          onSave={async p => { await api.put(`/api/semaine/${editing.id}`, p); load(); setEdit(null); }}
        />
      )}
    </div>
  );
}

function SemaineEditModal({ row, onClose, onSave }) {
  const [form, setForm] = useState({ type: row.type || "", dossier: row.dossier || "", notes: row.notes || "" });
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  return (
    <Modal title={`Modifier — ${row.jour}`} onClose={onClose}>
      <Field label="Type"    value={form.type}    onChange={f("type")} options={["—","Audience","Permanence","Réunion","Instruction","Garde à vue"]} />
      <Field label="Dossier" value={form.dossier} onChange={f("dossier")} />
      <Field label="Notes"   value={form.notes}   onChange={f("notes")}   type="textarea" />
      <BtnRow onClose={onClose} saving={saving}
        onSave={async () => { setSaving(true); await onSave(form); }} />
    </Modal>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
function Dashboard({ user, onNav }) {
  const [stats,    setStats]    = useState(null);
  const [affaires, setAffaires] = useState([]);
  const [semaine,  setSemaine]  = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/api/affaires"),
      api.get("/api/semaine"),
      api.get("/api/plaintes"),
      api.get("/api/prevenus"),
      api.get("/api/users"),
    ]).then(([aff, sem, pla, pre, usr]) => {
      setAffaires(Array.isArray(aff) ? aff : []);
      setSemaine(Array.isArray(sem) ? sem : []);
      setStats({
        affaires: Array.isArray(aff) ? aff.length : 0,
        enCours:  Array.isArray(aff) ? aff.filter(a => a.statut === "En cours").length : 0,
        plaintes: Array.isArray(pla) ? pla.length : 0,
        prevenus: Array.isArray(pre) ? pre.length : 0,
        employes: Array.isArray(usr) ? usr.filter(u => u.statut === "Actif").length : 0,
      });
    });
  }, []);

  return (
    <div>
      {/* Bandeau institutionnel */}
      <div style={{
        background: BG2, border: `1px solid ${G3}`,
        borderRadius: 6, padding: "18px 24px", marginBottom: 24,
        display: "flex", alignItems: "center", gap: 20,
        boxShadow: `inset 0 0 40px rgba(0,0,0,0.3)`
      }}>
        <Logo size={52} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: G3, letterSpacing: "0.18em", marginBottom: 3 }}>
            RÉPUBLIQUE FRANÇAISE DE FRATERNITY · MINISTÈRE DE LA JUSTICE
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: TX, fontFamily: "Georgia,serif" }}>
            Tribunal Judiciaire de Fraternity
          </div>
          <div style={{ fontSize: 12, color: TX2, marginTop: 2 }}>
            Cabinet du Procureur de la République · {user?.nom}
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 11, color: TX3 }}>
          <div>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
          <div style={{ color: G3, marginTop: 4, letterSpacing: "0.08em" }}>PARQUET · SIÈGE · GREFFE</div>
        </div>
      </div>

      {/* Stats */}
      {stats ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Affaires totales", val: stats.affaires, nav: "affaires", icon: "⚖" },
            { label: "En cours",         val: stats.enCours,  nav: "affaires", icon: "◉" },
            { label: "Plaintes",         val: stats.plaintes, nav: "plaintes", icon: "◧" },
            { label: "Prévenus",         val: stats.prevenus, nav: "prevenus", icon: "◈" },
            { label: "Employés actifs",  val: stats.employes, nav: "employes", icon: "◫" },
          ].map(s => (
            <div key={s.label} onClick={() => onNav(s.nav)} style={{
              background: BG3, border: `1px solid ${G4}`,
              borderTop: `2px solid ${G}`,
              borderRadius: 6, padding: "16px 18px",
              cursor: "pointer", transition: "border-color 0.15s"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G; }}
              onMouseLeave={e => { e.currentTarget.style.borderTopColor = G; e.currentTarget.style.borderLeftColor = G4; e.currentTarget.style.borderRightColor = G4; e.currentTarget.style.borderBottomColor = G4; }}
            >
              <div style={{ fontSize: 10, color: TX3, letterSpacing: "0.1em", marginBottom: 8 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: G, fontFamily: "Georgia,serif" }}>{s.val}</div>
            </div>
          ))}
        </div>
      ) : <Loader />}

      {/* Grille bas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Affaires récentes */}
        <div style={{ background: BG3, border: `1px solid ${G4}`, borderRadius: 6, padding: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: "0.15em", marginBottom: 14, fontFamily: "Georgia,serif" }}>
            AFFAIRES RÉCENTES
          </div>
          {affaires.slice(0, 5).map((a, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "9px 0", borderBottom: `1px solid ${G4}`
            }}>
              <div>
                <span style={{ fontSize: 12, color: G, fontWeight: 700, marginRight: 10 }}>{a.numero}</span>
                <span style={{ fontSize: 13, color: TX }}>{a.prevenu}</span>
              </div>
              <Badge status={a.statut} />
            </div>
          ))}
          {affaires.length === 0 && <div style={{ fontSize: 13, color: TX3, fontStyle: "italic" }}>Aucune affaire</div>}
        </div>

        {/* Semaine */}
        <div style={{ background: BG3, border: `1px solid ${G4}`, borderRadius: 6, padding: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: "0.15em", marginBottom: 14, fontFamily: "Georgia,serif" }}>
            SEMAINE EN COURS
          </div>
          {semaine.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 14, padding: "8px 0",
              borderBottom: `1px solid ${G4}`, alignItems: "center"
            }}>
              <span style={{ fontSize: 11, color: G, minWidth: 75, fontWeight: 700, letterSpacing: "0.06em" }}>
                {s.jour.toUpperCase()}
              </span>
              <span style={{ fontSize: 12, color: TX2 }}>{s.notes !== "—" ? s.notes : <span style={{ color: TX3 }}>—</span>}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────
export default function App({ user, onLogout }) {
  const [tab, setTab] = useState("dashboard");

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    onLogout();
  };

  const renderContent = () => {
    switch (tab) {
      case "dashboard": return <Dashboard user={user} onNav={setTab} />;
      case "affaires":  return <AffairesTab user={user} />;
      case "plaintes":  return <PlaintesTab />;
      case "rapports":  return <RapportsTab />;
      case "prevenus":  return <PrevenusTab />;
      case "employes":  return <EmployesTab user={user} />;
      case "semaine":   return <SemaineTab />;
      default:          return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Georgia,'Times New Roman',serif", background: BG }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 230, minHeight: "100vh", background: BG2,
        display: "flex", flexDirection: "column", flexShrink: 0,
        borderRight: `1px solid ${G4}`
      }}>
        {/* Logo */}
        <div style={{
          padding: "18px 16px 14px", borderBottom: `1px solid ${G4}`,
          display: "flex", alignItems: "center", gap: 12
        }}>
          <Logo size={36} />
          <div>
            <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: G, fontWeight: 700 }}>TRIBUNAL JUDICIAIRE</div>
            <div style={{ fontSize: 8, color: G3, letterSpacing: "0.06em", marginTop: 1 }}>DE FRATERNITY</div>
          </div>
        </div>

        {/* Utilisateur connecté */}
        <div style={{ padding: "12px 16px 10px", borderBottom: `1px solid ${G4}` }}>
          <div style={{ fontSize: 11, color: TX, fontWeight: 600, letterSpacing: "0.04em" }}>
            {user?.nom || user?.username}
          </div>
          <div style={{ fontSize: 10, color: G3, marginTop: 2, letterSpacing: "0.06em" }}>
            {user?.role === "procureur" ? "PROCUREUR DE LA RÉPUBLIQUE" : "EMPLOYÉ"}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "10px 0" }}>
          {TABS.map(t => {
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "11px 16px",
                background: active ? `${G}18` : "transparent",
                border: "none",
                borderLeft: `2px solid ${active ? G : "transparent"}`,
                cursor: "pointer",
                color: active ? G : TX3,
                fontSize: 12, textAlign: "left",
                letterSpacing: "0.04em",
                transition: "all 0.12s",
                fontFamily: "Georgia,serif"
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = TX2; e.currentTarget.style.borderLeftColor = G4; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = TX3; e.currentTarget.style.borderLeftColor = "transparent"; } }}
              >
                <span style={{ fontSize: 13 }}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Déconnexion */}
        <div style={{ padding: "12px 16px 16px", borderTop: `1px solid ${G4}` }}>
          <button onClick={handleLogout} style={{
            width: "100%", padding: "9px", background: "transparent",
            border: `1px solid ${G4}`, borderRadius: 4,
            color: TX3, cursor: "pointer", fontSize: 11,
            fontFamily: "Georgia,serif", letterSpacing: "0.08em",
            transition: "all 0.12s"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = G3; e.currentTarget.style.color = TX2; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = G4; e.currentTarget.style.color = TX3; }}
          >
            ⎋ DÉCONNEXION
          </button>
          <div style={{ fontSize: 9, color: G4, marginTop: 10, textAlign: "center", letterSpacing: "0.1em" }}>
            LIBERTÉ · ÉGALITÉ · FRATERNITÉ
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: "30px 36px", overflow: "auto", background: BG }}>
        {renderContent()}
      </main>
    </div>
  );
}