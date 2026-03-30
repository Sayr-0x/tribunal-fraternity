-- Tribunal Judiciaire de Fraternity — Schéma de base de données
-- À exécuter une fois à la création de la base PostgreSQL

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50)  UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nom           VARCHAR(100) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'employe', -- 'procureur' | 'employe'
  statut        VARCHAR(20)  NOT NULL DEFAULT 'Actif',   -- 'Actif' | 'Inactif' | 'Suspendu'
  poste         VARCHAR(100),
  service       VARCHAR(50),
  email         VARCHAR(100),
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affaires (
  id           SERIAL PRIMARY KEY,
  numero       VARCHAR(20) UNIQUE NOT NULL,
  prevenu      VARCHAR(200),
  infractions  TEXT,
  statut       VARCHAR(50)  DEFAULT 'En cours',
  date_dossier VARCHAR(20),
  magistrat    VARCHAR(100),
  notes        TEXT,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plaintes (
  id           SERIAL PRIMARY KEY,
  reference    VARCHAR(30) UNIQUE NOT NULL,
  plaignant    VARCHAR(200),
  contre       VARCHAR(200),
  objet        TEXT,
  statut       VARCHAR(50) DEFAULT 'En cours',
  date_plainte VARCHAR(20),
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rapports (
  id           SERIAL PRIMARY KEY,
  reference    VARCHAR(30) UNIQUE NOT NULL,
  auteur       VARCHAR(200),
  objet        TEXT,
  dossier_lie  VARCHAR(20),
  statut       VARCHAR(50) DEFAULT 'En cours',
  date_rapport VARCHAR(20),
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prevenus (
  id             SERIAL PRIMARY KEY,
  nom            VARCHAR(200) NOT NULL,
  statut         VARCHAR(50)  DEFAULT 'Suspect',
  dossiers       TEXT,
  notes          TEXT,
  date_naissance VARCHAR(20),
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semaine (
  id      SERIAL PRIMARY KEY,
  jour    VARCHAR(20) NOT NULL,
  type    VARCHAR(50)  DEFAULT '—',
  dossier VARCHAR(20)  DEFAULT '—',
  notes   TEXT         DEFAULT '—'
);

-- ── Données initiales semaine (7 jours fixes) ─────────────────────────────
INSERT INTO semaine (jour, type, dossier, notes) VALUES
  ('Lundi',    '—',          '—', '—'),
  ('Mardi',    'Permanence', '—', 'Permanence du Parquet'),
  ('Mercredi', '—',          '—', '—'),
  ('Jeudi',    '—',          '—', '—'),
  ('Vendredi', 'Réunion',    '—', 'Réunion de service'),
  ('Samedi',   '—',          '—', '—'),
  ('Dimanche', '—',          '—', '—')
ON CONFLICT DO NOTHING;

-- ── Données historiques ───────────────────────────────────────────────────
INSERT INTO affaires (numero, prevenu, infractions, statut, date_dossier, magistrat, notes) VALUES
  ('26/00003', 'DIALLO Gloria',
   'Prises d''otage (x4), assassinats (x3) avec préméditation, tentative d''assassinat, actes de torture et de barbarie (x3), port d''arme blanche, port d''équipement militaire',
   'Jugé', '16/02/2026', 'Hugo Veyermann',
   'Réclusion criminelle à perpétuité incompressible — période de sûreté maximale')
ON CONFLICT (numero) DO NOTHING;

INSERT INTO plaintes (reference, plaignant, contre, objet, statut, date_plainte) VALUES
  ('PL-26/001', 'Madame Orzola', 'DIALLO Gloria', 'Prise d''otage, violences graves', 'Traitée', '10/02/2026')
ON CONFLICT (reference) DO NOTHING;

INSERT INTO rapports (reference, auteur, objet, dossier_lie, statut, date_rapport) VALUES
  ('RPT-26/001', 'Lt. Bellamy', 'Rapport d''intervention — affaire DIALLO', '26/00003', 'Archivé', '14/02/2026')
ON CONFLICT (reference) DO NOTHING;

INSERT INTO prevenus (nom, statut, dossiers, notes, date_naissance) VALUES
  ('DIALLO Gloria', 'Condamné', '26/00003', 'Réclusion criminelle à perpétuité incompressible. Dangerosité maximale.', '—'),
  ('FLASH Julia',   'Suspect',  '26/00003', 'Co-mise en cause potentielle — non jugée', '—'),
  ('FLASH Lucie',   'Libre',    '26/00003', 'Mentionnée par DIALLO comme bouc émissaire', '—')
ON CONFLICT DO NOTHING;

-- ── Compte administrateur par défaut ──────────────────────────────────────
-- Mot de passe : fraternity2026
-- Hash bcrypt généré avec saltRounds=12
-- ⚠ CHANGER LE MOT DE PASSE À LA PREMIÈRE CONNEXION
INSERT INTO users (username, password_hash, nom, role, statut, poste, service, email) VALUES
  ('hveyermann',
   '$2b$12$jaO9ap5eqIGT1vN/TDph2OHkteTplk/CPLVybK95Rs/R8fENafwEq',
   'Hugo Veyermann',
   'procureur',
   'Actif',
   'Procureur de la République',
   'Parquet',
   'hveyermann@tribunal-fraternity.fr')
ON CONFLICT (username) DO NOTHING;
