# Tribunal Judiciaire de Fraternity — Application de gestion

## Structure exacte du projet

```
tribunal-fraternity/          ← racine du repo GitHub
├── index.js                  ← Serveur Express (à la RACINE, pas dans server/)
├── schema.sql                ← Schéma PostgreSQL + données initiales
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx              ← Point d'entrée React + page Login
    └── App.jsx               ← Dashboard complet
```

> ⚠️ **Important** : `index.js` doit être **à la racine**, pas dans un sous-dossier `server/`.
> Render exécute `npm start` depuis la racine, ce qui lance `node index.js`.

---

## Déploiement sur Render

### 1. Préparer le dépôt GitHub

```bash
git init
git add .
git commit -m "Initial commit — Tribunal Fraternity"
git remote add origin https://github.com/TON_USERNAME/tribunal-fraternity.git
git push -u origin main
```

### 2. Créer la base de données PostgreSQL sur Render

1. Render Dashboard → **New** → **PostgreSQL**
2. Name : `tribunal-fraternity-db`
3. Plan : **Free**
4. Une fois créée, clique dessus et copie l'**Internal Database URL**
   (format : `postgresql://user:password@host/dbname`)

### 3. Créer le Web Service sur Render

1. Render Dashboard → **New** → **Web Service**
2. Connecte ton repo GitHub
3. Paramètres :
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
4. **Variables d'environnement** (onglet Environment) :

| Clé | Valeur |
|-----|--------|
| `DATABASE_URL` | L'Internal Database URL copiée à l'étape 2 |
| `SESSION_SECRET` | Une chaîne aléatoire longue (ex: `openssl rand -base64 32`) |
| `NODE_ENV` | `production` |

### 4. Initialiser la base de données

Une fois le service déployé, va sur ta **base de données Render** → onglet **Shell** et exécute :

```bash
psql $DATABASE_URL -f schema.sql
```

Ou depuis ton terminal local (si tu as `psql` installé) :

```bash
psql "postgresql://..." -f schema.sql
```

### 5. Déployer

Render déploie automatiquement à chaque `git push`. L'appli sera accessible sur :
`https://tribunal-fraternity.onrender.com`

---

## Connexion par défaut

| Identifiant | Mot de passe |
|-------------|--------------|
| `hveyermann` | `fraternity2026` |

> ⚠️ **Changer le mot de passe après la première connexion.**
> Pour générer un nouveau hash et l'insérer directement en base :
> ```bash
> node -e "const b = require('bcrypt'); b.hash('NOUVEAU_MDP', 12).then(console.log)"
> # Puis dans psql :
> UPDATE users SET password_hash='LE_HASH' WHERE username='hveyermann';
> ```

---

## Développement local

Prérequis : Node.js, une base PostgreSQL locale ou Render (via External URL).

```bash
npm install

# Créer un fichier .env à la racine :
echo "DATABASE_URL=postgresql://..." > .env
echo "SESSION_SECRET=dev-secret" >> .env

# Terminal 1 — back-end (port 3001)
node index.js

# Terminal 2 — front-end (port 5173, proxyfie /api vers 3001)
npm run dev:client
```

---

## Rôles et permissions

| Rôle | Peut faire |
|------|-----------|
| `procureur` | Tout : créer/modifier/supprimer comptes, toutes les données |
| `employe` | Consulter et saisir des données, mais pas gérer les comptes |

Les comptes **Inactif** et **Suspendu** ne peuvent pas se connecter.
