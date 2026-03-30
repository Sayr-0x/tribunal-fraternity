import { useState, useEffect, useCallback } from "react";

const GOLD = "#C9A227";
const GOLD_LIGHT = "#F5E6B3";
const GOLD_DARK = "#8B6E1A";

const STATUS_COLORS = {
  "En cours":         { bg: "#EAF3DE", text: "#27500A", border: "#639922" },
  "Jugé":             { bg: "#E6F1FB", text: "#0C447C", border: "#378ADD" },
  "Classé sans suite":{ bg: "#F1EFE8", text: "#444441", border: "#888780" },
  "Instruit":         { bg: "#FAEEDA", text: "#633806", border: "#BA7517" },
  "Traitée":          { bg: "#E6F1FB", text: "#0C447C", border: "#378ADD" },
  "Archivé":          { bg: "#F1EFE8", text: "#444441", border: "#888780" },
  "Actif":            { bg: "#EAF3DE", text: "#27500A", border: "#639922" },
  "Inactif":          { bg: "#F1EFE8", text: "#444441", border: "#888780" },
  "Suspendu":         { bg: "#FCEBEB", text: "#791F1F", border: "#E24B4A" },
  "Mis en examen":    { bg: "#FAEEDA", text: "#633806", border: "#BA7517" },
  "Condamné":         { bg: "#FCEBEB", text: "#791F1F", border: "#E24B4A" },
  "Suspect":          { bg: "#FBEAF0", text: "#72243E", border: "#D4537E" },
  "Libre":            { bg: "#EAF3DE", text: "#27500A", border: "#639922" },
};

const Badge = ({ status }) => {
  const s = STATUS_COLORS[status] || STATUS_COLORS["Classé sans suite"];
  return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 500,
      padding: "2px 8px", borderRadius: 4,
      background: s.bg, color: s.text, border: `1px solid ${s.border}`
    }}>{status}</span>
  );
};

const Logo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
);

const GoldDivider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
    <div style={{ flex: 1, height: 1, background: GOLD }} />
    <span style={{ color: GOLD, fontSize: 10 }}>◆</span>
    <div style={{ flex: 1, height: 1, background: GOLD }} />
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center"
  }} onClick={onClose}>
    <div style={{
      background: "var(--color-background-primary)", borderRadius: 12,
      border: `1px solid ${GOLD}`, padding: "24px 28px", minWidth: 420, maxWidth: 560,
      boxShadow: "0 8px 40px rgba(0,0,0,0.18)", maxHeight: "90vh", overflowY: "auto"
    }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500, color: GOLD_DARK }}>{title}</h3>
        <button onClick={onClose} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 18, color: "var(--color-text-secondary)", padding: "0 4px"
        }}>✕</button>
      </div>
      <GoldDivider />
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  </div>
);

const Field = ({ label, value, onChange, type = "text", options, disabled }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>{label}</label>
    {options ? (
      <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 6, border: "1px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", boxSizing: "border-box" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : type === "textarea" ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        style={{ width: "100%", fontSize: 13, minHeight: 70, resize: "vertical", boxSizing: "border-box", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        style={{ width: "100%", fontSize: 13, boxSizing: "border-box", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
    )}
  </div>
);

const Table = ({ cols, rows, onRowClick }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: `2px solid ${GOLD}` }}>
          {cols.map(c => (
            <th key={c.key} style={{
              textAlign: "left", padding: "8px 12px", fontSize: 11,
              fontWeight: 500, color: GOLD_DARK, letterSpacing: "0.05em",
              whiteSpace: "nowrap"
            }}>{c.label.toUpperCase()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr><td colSpan={cols.length} style={{ padding: "24px 12px", textAlign: "center", color: "var(--color-text-secondary)", fontSize: 13 }}>Aucune donnée</td></tr>
        )}
        {rows.map((row, i) => (
          <tr key={row.id || i}
            onClick={() => onRowClick && onRowClick(row)}
            style={{
              borderBottom: "0.5px solid var(--color-border-tertiary)",
              cursor: onRowClick ? "pointer" : "default",
              transition: "background 0.1s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--color-background-secondary)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {cols.map(c => (
              <td key={c.key} style={{ padding: "9px 12px", color: "var(--color-text-primary)" }}>
                {c.render ? c.render(row[c.key], row) : row[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PageHeader = ({ title, subtitle, onAdd, addLabel }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
    <div>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)" }}>{title}</h2>
      {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>{subtitle}</p>}
    </div>
    {onAdd && (
      <button onClick={onAdd} style={{
        background: GOLD, color: "#fff", border: "none", borderRadius: 6,
        padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer"
      }}>{addLabel || "＋ Ajouter"}</button>
    )}
  </div>
);

const BtnRow = ({ onClose, onSave, saving }) => (
  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
    <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", fontSize: 13 }}>Annuler</button>
    <button onClick={onSave} disabled={saving} style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: GOLD, color: "#fff", cursor: saving ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 500, opacity: saving ? 0.7 : 1 }}>
      {saving ? "Enregistrement…" : "Enregistrer"}
    </button>
  </div>
);

const TABS = [
  { key: "dashboard", label: "Tableau de bord", icon: "⊞" },
  { key: "affaires",  label: "Affaires en cours", icon: "⚖" },
  { key: "plaintes",  label: "Plaintes", icon: "📋" },
  { key: "rapports",  label: "Rapports", icon: "📄" },
  { key: "prevenus",  label: "Prévenus & Suspects", icon: "👤" },
  { key: "employes",  label: "Employés", icon: "🏛" },
  { key: "semaine",   label: "Semaine en cours", icon: "📅" },
];

// ─── API helpers ───────────────────────────────────────────────────────────
const api = {
  get:   url => fetch(url, { credentials: "include" }).then(r => r.json()),
  post:  (url, body) => fetch(url, { method: "POST",  credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json()),
  patch: (url, body) => fetch(url, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json()),
  put:   (url, body) => fetch(url, { method: "PUT",   credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json()),
};

// ─── AFFAIRES tab ──────────────────────────────────────────────────────────
function AffairesTab({ user }) {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/affaires").then(d => { setRows(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (form) => {
    await api.post("/api/affaires", form);
    load();
  };
  const handleEdit = async (id, patch) => {
    await api.patch(`/api/affaires/${id}`, patch);
    load();
  };

  return (
    <div>
      <PageHeader title="Affaires en cours" subtitle={`${rows.length} dossier(s)`}
        onAdd={() => setModal({ type: "add" })} addLabel="＋ Nouveau dossier" />
      {loading ? <Loader /> : (
        <Table
          cols={[
            { key: "numero",     label: "N° Dossier", render: v => <span style={{ color: GOLD, fontWeight: 500 }}>{v}</span> },
            { key: "prevenu",    label: "Prévenu" },
            { key: "infractions",label: "Infractions", render: v => <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>{v?.length > 60 ? v.slice(0,60)+"…" : v}</span> },
            { key: "statut",     label: "Statut", render: v => <Badge status={v} /> },
            { key: "date_dossier",label: "Date" },
            { key: "magistrat",  label: "Magistrat", render: v => <span style={{ fontSize: 12 }}>{v}</span> },
          ]}
          rows={rows}
          onRowClick={row => setModal({ type: "detail", row })}
        />
      )}
      {modal?.type === "add" && (
        <AffaireAddModal
          nextId={`26/${String(rows.length + 1).padStart(5, "0")}`}
          user={user}
          onClose={() => setModal(null)}
          onSave={handleAdd}
        />
      )}
      {modal?.type === "detail" && (
        <AffaireDetailModal
          row={modal.row}
          onClose={() => setModal(null)}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

function AffaireAddModal({ nextId, user, onClose, onSave }) {
  const [form, setForm] = useState({ numero: nextId, prevenu: "", infractions: "", statut: "En cours", date_dossier: new Date().toLocaleDateString("fr-FR"), magistrat: user?.nom || "Hugo Veyermann" });
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const save = async () => { setSaving(true); await onSave(form); onClose(); };
  return (
    <Modal title="Nouveau dossier" onClose={onClose}>
      <Field label="N° Dossier"  value={form.numero}       onChange={f("numero")} />
      <Field label="Prévenu"     value={form.prevenu}      onChange={f("prevenu")} />
      <Field label="Infractions" value={form.infractions}  onChange={f("infractions")} type="textarea" />
      <Field label="Statut"      value={form.statut}       onChange={f("statut")} options={["En cours","Instruit","Jugé","Classé sans suite"]} />
      <Field label="Date"        value={form.date_dossier} onChange={f("date_dossier")} />
      <Field label="Magistrat"   value={form.magistrat}    onChange={f("magistrat")} />
      <BtnRow onClose={onClose} onSave={save} saving={saving} />
    </Modal>
  );
}

function AffaireDetailModal({ row, onClose, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [statut, setStatut]   = useState(row.statut);
  const [notes, setNotes]     = useState(row.notes || "");
  const [saving, setSaving]   = useState(false);
  const save = async () => { setSaving(true); await onEdit(row.id, { statut, notes }); onClose(); };
  return (
    <Modal title={`Dossier ${row.numero}`} onClose={onClose}>
      {[["Prévenu", row.prevenu], ["Infractions", row.infractions], ["Date", row.date_dossier], ["Magistrat", row.magistrat]].map(([k, v]) => (
        <div key={k} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 2 }}>{k}</div>
          <div style={{ fontSize: 13 }}>{v}</div>
        </div>
      ))}
      <Field label="Statut" value={statut} onChange={setStatut} options={["En cours","Instruit","Jugé","Classé sans suite"]} />
      <Field label="Notes" value={notes} onChange={setNotes} type="textarea" />
      <BtnRow onClose={onClose} onSave={save} saving={saving} />
    </Modal>
  );
}

// ─── PLAINTES tab ──────────────────────────────────────────────────────────
function PlaintesTab() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);

  const load = useCallback(() => {
    api.get("/api/plaintes").then(d => { setRows(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleAdd = async (form) => { await api.post("/api/plaintes", form); load(); };

  return (
    <div>
      <PageHeader title="Plaintes" subtitle={`${rows.length} plainte(s)`}
        onAdd={() => setModal("add")} addLabel="＋ Nouvelle plainte" />
      {loading ? <Loader /> : (
        <Table
          cols={[
            { key: "reference", label: "Référence", render: v => <span style={{ color: GOLD, fontWeight: 500 }}>{v}</span> },
            { key: "plaignant", label: "Plaignant" },
            { key: "contre",    label: "Mis en cause" },
            { key: "objet",     label: "Objet", render: v => <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{v?.length > 60 ? v.slice(0,60)+"…" : v}</span> },
            { key: "statut",    label: "Statut", render: v => <Badge status={v || "En cours"} /> },
            { key: "date_plainte", label: "Date" },
          ]}
          rows={rows}
        />
      )}
      {modal === "add" && (
        <PlainteAddModal
          nextRef={`PL-26/${String(rows.length + 1).padStart(3, "0")}`}
          onClose={() => setModal(null)}
          onSave={async f => { await handleAdd(f); setModal(null); }}
        />
      )}
    </div>
  );
}

function PlainteAddModal({ nextRef, onClose, onSave }) {
  const [form, setForm] = useState({ reference: nextRef, plaignant: "", contre: "", objet: "", statut: "En cours", date_plainte: new Date().toLocaleDateString("fr-FR") });
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const save = async () => { setSaving(true); await onSave(form); };
  return (
    <Modal title="Nouvelle plainte" onClose={onClose}>
      <Field label="Référence"   value={form.reference}    onChange={f("reference")} />
      <Field label="Plaignant"   value={form.plaignant}    onChange={f("plaignant")} />
      <Field label="Mis en cause"value={form.contre}       onChange={f("contre")} />
      <Field label="Objet"       value={form.objet}        onChange={f("objet")} type="textarea" />
      <Field label="Statut"      value={form.statut}       onChange={f("statut")} options={["En cours","Traitée","Classée sans suite"]} />
      <Field label="Date"        value={form.date_plainte} onChange={f("date_plainte")} />
      <BtnRow onClose={onClose} onSave={save} saving={saving} />
    </Modal>
  );
}

// ─── RAPPORTS tab ──────────────────────────────────────────────────────────
function RapportsTab() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);

  const load = useCallback(() => {
    api.get("/api/rapports").then(d => { setRows(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleAdd = async (form) => { await api.post("/api/rapports", form); load(); };

  return (
    <div>
      <PageHeader title="Rapports" subtitle={`${rows.length} rapport(s)`}
        onAdd={() => setModal("add")} addLabel="＋ Nouveau rapport" />
      {loading ? <Loader /> : (
        <Table
          cols={[
            { key: "reference",   label: "Référence", render: v => <span style={{ color: GOLD, fontWeight: 500 }}>{v}</span> },
            { key: "auteur",      label: "Auteur" },
            { key: "objet",       label: "Objet", render: v => <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{v?.length > 60 ? v.slice(0,60)+"…" : v}</span> },
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
          onSave={async f => { await handleAdd(f); setModal(null); }}
        />
      )}
    </div>
  );
}

function RapportAddModal({ nextRef, onClose, onSave }) {
  const [form, setForm] = useState({ reference: nextRef, auteur: "", objet: "", dossier_lie: "", statut: "En cours", date_rapport: new Date().toLocaleDateString("fr-FR") });
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const save = async () => { setSaving(true); await onSave(form); };
  return (
    <Modal title="Nouveau rapport" onClose={onClose}>
      <Field label="Référence"   value={form.reference}    onChange={f("reference")} />
      <Field label="Auteur"      value={form.auteur}       onChange={f("auteur")} />
      <Field label="Objet"       value={form.objet}        onChange={f("objet")} type="textarea" />
      <Field label="Dossier lié" value={form.dossier_lie}  onChange={f("dossier_lie")} />
      <Field label="Statut"      value={form.statut}       onChange={f("statut")} options={["En cours","Archivé"]} />
      <Field label="Date"        value={form.date_rapport} onChange={f("date_rapport")} />
      <BtnRow onClose={onClose} onSave={save} saving={saving} />
    </Modal>
  );
}

// ─── PRÉVENUS tab ──────────────────────────────────────────────────────────
function PrevenusTab() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);

  const load = useCallback(() => {
    api.get("/api/prevenus").then(d => { setRows(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleAdd  = async (form) => { await api.post("/api/prevenus", form); load(); };
  const handleEdit = async (id, patch) => { await api.patch(`/api/prevenus/${id}`, patch); load(); };

  return (
    <div>
      <PageHeader title="Prévenus & Suspects" subtitle={`${rows.length} personne(s) fichée(s)`}
        onAdd={() => setModal({ type: "add" })} addLabel="＋ Ficher" />
      {loading ? <Loader /> : (
        <Table
          cols={[
            { key: "nom",     label: "Nom", render: v => <span style={{ fontWeight: 500 }}>{v}</span> },
            { key: "statut",  label: "Statut", render: v => <Badge status={v} /> },
            { key: "dossiers",label: "Dossier(s)" },
            { key: "notes",   label: "Notes", render: v => <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{v?.length > 70 ? v.slice(0,70)+"…" : v}</span> },
          ]}
          rows={rows}
          onRowClick={row => setModal({ type: "detail", row })}
        />
      )}
      {modal?.type === "add" && (
        <PrevenuAddModal onClose={() => setModal(null)} onSave={async f => { await handleAdd(f); setModal(null); }} />
      )}
      {modal?.type === "detail" && (
        <PrevenuDetailModal row={modal.row} onClose={() => setModal(null)} onEdit={handleEdit} />
      )}
    </div>
  );
}

function PrevenuAddModal({ onClose, onSave }) {
  const [form, setForm] = useState({ nom: "", statut: "Suspect", dossiers: "", notes: "", date_naissance: "" });
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const save = async () => { setSaving(true); await onSave(form); };
  return (
    <Modal title="Ficher une personne" onClose={onClose}>
      <Field label="Nom complet"       value={form.nom}             onChange={f("nom")} />
      <Field label="Date de naissance" value={form.date_naissance}  onChange={f("date_naissance")} />
      <Field label="Statut"            value={form.statut}          onChange={f("statut")} options={["Suspect","Mis en examen","Condamné","Libre"]} />
      <Field label="Dossier(s) lié(s)" value={form.dossiers}        onChange={f("dossiers")} />
      <Field label="Notes"             value={form.notes}           onChange={f("notes")} type="textarea" />
      <BtnRow onClose={onClose} onSave={save} saving={saving} />
    </Modal>
  );
}

function PrevenuDetailModal({ row, onClose, onEdit }) {
  const [statut, setStatut] = useState(row.statut);
  const [notes, setNotes]   = useState(row.notes || "");
  const [saving, setSaving] = useState(false);
  const save = async () => { setSaving(true); await onEdit(row.id, { statut, notes }); onClose(); };
  return (
    <Modal title={row.nom} onClose={onClose}>
      {[["Date de naissance", row.date_naissance || "—"], ["Dossier(s)", row.dossiers || "—"]].map(([k, v]) => (
        <div key={k} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 2 }}>{k}</div>
          <div style={{ fontSize: 13 }}>{v}</div>
        </div>
      ))}
      <Field label="Statut" value={statut} onChange={setStatut} options={["Suspect","Mis en examen","Condamné","Libre"]} />
      <Field label="Notes"  value={notes}  onChange={setNotes} type="textarea" />
      <BtnRow onClose={onClose} onSave={save} saving={saving} />
    </Modal>
  );
}

// ─── EMPLOYÉS tab ──────────────────────────────────────────────────────────
function EmployesTab({ user }) {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const isProcureur = user?.role === "procureur";

  const load = useCallback(() => {
    api.get("/api/users").then(d => { setRows(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleAdd  = async (form) => { await api.post("/api/users", form); load(); };
  const handleEdit = async (id, patch) => { await api.patch(`/api/users/${id}`, patch); load(); };

  return (
    <div>
      <PageHeader title="Employés" subtitle={`${rows.filter(e => e.statut === "Actif").length} actif(s)`}
        onAdd={isProcureur ? () => setModal({ type: "add" }) : null} addLabel="＋ Enregistrer" />
      {loading ? <Loader /> : (
        <Table
          cols={[
            { key: "id",      label: "ID", render: v => <span style={{ color: GOLD, fontWeight: 500, fontSize: 12 }}>{v}</span> },
            { key: "nom",     label: "Nom", render: v => <span style={{ fontWeight: 500 }}>{v}</span> },
            { key: "poste",   label: "Poste" },
            { key: "service", label: "Service" },
            { key: "role",    label: "Rôle" },
            { key: "statut",  label: "Statut", render: v => <Badge status={v} /> },
            { key: "email",   label: "E-mail", render: v => <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{v}</span> },
          ]}
          rows={rows}
          onRowClick={isProcureur ? row => setModal({ type: "detail", row }) : null}
        />
      )}
      {!isProcureur && (
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 12 }}>
          Seul le Procureur peut créer ou modifier des comptes.
        </p>
      )}
      {modal?.type === "add" && (
        <EmployeAddModal onClose={() => setModal(null)} onSave={async f => { await handleAdd(f); setModal(null); }} />
      )}
      {modal?.type === "detail" && (
        <EmployeEditModal row={modal.row} onClose={() => setModal(null)} onEdit={handleEdit} />
      )}
    </div>
  );
}

function EmployeAddModal({ onClose, onSave }) {
  const [form, setForm] = useState({ username: "", password: "", nom: "", poste: "", service: "Parquet", role: "employe", email: "" });
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const save = async () => { setSaving(true); await onSave(form); };
  return (
    <Modal title="Enregistrer un employé" onClose={onClose}>
      <Field label="Identifiant (login)" value={form.username} onChange={f("username")} />
      <Field label="Mot de passe"        value={form.password} onChange={f("password")} type="password" />
      <Field label="Nom complet"         value={form.nom}      onChange={f("nom")} />
      <Field label="Poste"               value={form.poste}    onChange={f("poste")} />
      <Field label="Service"             value={form.service}  onChange={f("service")} options={["Parquet","Siège","Greffe"]} />
      <Field label="Rôle"                value={form.role}     onChange={f("role")} options={["employe","procureur"]} />
      <Field label="E-mail"              value={form.email}    onChange={f("email")} type="email" />
      <BtnRow onClose={onClose} onSave={save} saving={saving} />
    </Modal>
  );
}

function EmployeEditModal({ row, onClose, onEdit }) {
  const [statut,  setStatut]  = useState(row.statut);
  const [poste,   setPoste]   = useState(row.poste || "");
  const [service, setService] = useState(row.service || "Parquet");
  const [role,    setRole]    = useState(row.role || "employe");
  const [saving,  setSaving]  = useState(false);
  const save = async () => { setSaving(true); await onEdit(row.id, { statut, poste, service, role }); onClose(); };
  return (
    <Modal title={`Modifier — ${row.nom}`} onClose={onClose}>
      <Field label="Poste"   value={poste}   onChange={setPoste} />
      <Field label="Service" value={service} onChange={setService} options={["Parquet","Siège","Greffe"]} />
      <Field label="Rôle"    value={role}    onChange={setRole}    options={["employe","procureur"]} />
      <Field label="Statut"  value={statut}  onChange={setStatut}  options={["Actif","Inactif","Suspendu"]} />
      <BtnRow onClose={onClose} onSave={save} saving={saving} />
    </Modal>
  );
}

// ─── SEMAINE tab ───────────────────────────────────────────────────────────
function SemaineTab() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    api.get("/api/semaine").then(d => { setRows(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleEdit = async (id, patch) => {
    await api.put(`/api/semaine/${id}`, patch);
    load();
  };

  return (
    <div>
      <PageHeader title="Semaine en cours" subtitle="Planning hebdomadaire" />
      {loading ? <Loader /> : (
        <div style={{ display: "grid", gap: 10 }}>
          {rows.map((s) => (
            <div key={s.id} style={{
              display: "grid", gridTemplateColumns: "80px 120px 120px 1fr auto",
              gap: 16, alignItems: "center",
              background: "var(--color-background-primary)",
              border: "0.5px solid var(--color-border-tertiary)",
              borderLeft: `3px solid ${GOLD}`,
              borderRadius: "0 8px 8px 0",
              padding: "12px 16px"
            }}>
              <span style={{ fontWeight: 500, color: GOLD_DARK, fontSize: 13 }}>{s.jour}</span>
              <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{s.type || "—"}</span>
              <span style={{ fontSize: 12, color: GOLD }}>{s.dossier !== "—" ? s.dossier : ""}</span>
              <span style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{s.notes}</span>
              <button onClick={() => setEditing(s)} style={{ background: "none", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>✎</button>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <SemaineEditModal
          row={editing}
          onClose={() => setEditing(null)}
          onSave={async patch => { await handleEdit(editing.id, patch); setEditing(null); }}
        />
      )}
    </div>
  );
}

function SemaineEditModal({ row, onClose, onSave }) {
  const [form, setForm] = useState({ type: row.type || "", dossier: row.dossier || "", notes: row.notes || "" });
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const save = async () => { setSaving(true); await onSave(form); };
  return (
    <Modal title={`Modifier — ${row.jour}`} onClose={onClose}>
      <Field label="Type"    value={form.type}    onChange={f("type")}    options={["—","Audience","Permanence","Réunion","Instruction","Garde à vue"]} />
      <Field label="Dossier" value={form.dossier} onChange={f("dossier")} />
      <Field label="Notes"   value={form.notes}   onChange={f("notes")}   type="textarea" />
      <BtnRow onClose={onClose} onSave={save} saving={saving} />
    </Modal>
  );
}

// ─── LOADER ────────────────────────────────────────────────────────────────
const Loader = () => (
  <div style={{ padding: "32px", textAlign: "center", color: "var(--color-text-secondary)", fontSize: 13 }}>
    Chargement…
  </div>
);

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
function Dashboard({ onNav }) {
  const [stats, setStats] = useState(null);
  const [affaires, setAffaires]  = useState([]);
  const [semaine,  setSemaine]   = useState([]);

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
        affaires:  Array.isArray(aff) ? aff.length : 0,
        enCours:   Array.isArray(aff) ? aff.filter(a => a.statut === "En cours").length : 0,
        plaintes:  Array.isArray(pla) ? pla.length : 0,
        prevenus:  Array.isArray(pre) ? pre.length : 0,
        employes:  Array.isArray(usr) ? usr.filter(u => u.statut === "Actif").length : 0,
      });
    });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ background: "var(--color-background-primary)", border: `1px solid ${GOLD}`, borderRadius: 10, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
          <Logo size={56} />
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", color: GOLD_DARK, fontWeight: 500 }}>TRIBUNAL JUDICIAIRE DE FRATERNITY</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: "var(--color-text-primary)", margin: "2px 0" }}>Tableau de bord — Parquet</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Hugo Veyermann · Procureur de la République</div>
          </div>
        </div>
      </div>

      {stats ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Affaires totales", val: stats.affaires,  nav: "affaires" },
            { label: "En cours",         val: stats.enCours,   nav: "affaires" },
            { label: "Plaintes",         val: stats.plaintes,  nav: "plaintes" },
            { label: "Prévenus",         val: stats.prevenus,  nav: "prevenus" },
            { label: "Employés actifs",  val: stats.employes,  nav: "employes" },
          ].map(s => (
            <div key={s.label} onClick={() => onNav(s.nav)} style={{
              background: "var(--color-background-secondary)", borderRadius: 8,
              padding: "14px 16px", cursor: "pointer", transition: "opacity 0.1s"
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 500, color: "var(--color-text-primary)" }}>{s.val}</div>
            </div>
          ))}
        </div>
      ) : <Loader />}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: GOLD_DARK, letterSpacing: "0.05em", marginBottom: 12 }}>AFFAIRES RÉCENTES</div>
          {affaires.slice(0, 5).map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
              <div>
                <span style={{ fontSize: 12, color: GOLD, fontWeight: 500 }}>{a.numero}</span>
                <span style={{ fontSize: 13, color: "var(--color-text-primary)", marginLeft: 8 }}>{a.prevenu}</span>
              </div>
              <Badge status={a.statut} />
            </div>
          ))}
          {affaires.length === 0 && <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Aucune affaire</div>}
        </div>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: GOLD_DARK, letterSpacing: "0.05em", marginBottom: 12 }}>SEMAINE EN COURS</div>
          {semaine.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "7px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
              <span style={{ fontSize: 12, color: GOLD, minWidth: 70, fontWeight: 500 }}>{s.jour}</span>
              <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{s.notes || "—"}</span>
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
      case "dashboard": return <Dashboard onNav={setTab} />;
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
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Georgia, 'Times New Roman', serif", background: "var(--color-background-tertiary)" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, minHeight: "100vh", background: "#1a1508", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 12px 16px", borderBottom: `1px solid ${GOLD_DARK}`, display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={32} />
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.12em", color: GOLD, fontWeight: 500 }}>TRIBUNAL JUDICIAIRE</div>
            <div style={{ fontSize: 9, color: "#8a7040", letterSpacing: "0.05em" }}>DE FRATERNITY</div>
          </div>
        </div>

        {/* User info */}
        <div style={{ padding: "10px 16px", borderBottom: `1px solid ${GOLD_DARK}20` }}>
          <div style={{ fontSize: 11, color: GOLD, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.nom || user?.username}</div>
          <div style={{ fontSize: 10, color: "#6a5a30", marginTop: 1 }}>{user?.role === "procureur" ? "Procureur" : "Employé"}</div>
        </div>

        <nav style={{ flex: 1, padding: "12px 0" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "10px 16px",
              background: tab === t.key ? "rgba(201,162,39,0.15)" : "transparent",
              border: "none", borderLeft: tab === t.key ? `2px solid ${GOLD}` : "2px solid transparent",
              cursor: "pointer", color: tab === t.key ? GOLD : "#8a7040",
              fontSize: 13, textAlign: "left", whiteSpace: "nowrap",
              transition: "all 0.1s"
            }}>
              <span style={{ fontSize: 14, minWidth: 18 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: `1px solid ${GOLD_DARK}` }}>
          <button onClick={handleLogout} style={{
            width: "100%", padding: "8px", background: "transparent",
            border: `1px solid ${GOLD_DARK}`, borderRadius: 6,
            color: "#8a7040", cursor: "pointer", fontSize: 12,
            fontFamily: "Georgia, serif"
          }}>
            ⎋ Déconnexion
          </button>
          <div style={{ fontSize: 10, color: "#3a2e10", marginTop: 8, textAlign: "center" }}>LIBERTÉ · ÉGALITÉ · FRATERNITÉ</div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
        {renderContent()}
      </main>
    </div>
  );
}
