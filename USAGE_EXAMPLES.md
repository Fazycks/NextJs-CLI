# Guide d'utilisation pratique - NextJS CLI

## 🚀 Scénarios d'utilisation

### Scénario 1: Créer un nouveau projet NextJS clean

```bash
# Créer un projet avec template propre
nextjs-cli create mon-app

# Sélectionner "NextJS Clean" dans la liste
# Le projet sera créé avec TypeScript et configuration de base
```

### Scénario 2: Ajouter des composants UI à un projet existant

```bash
# Dans un projet NextJS existant
cd mon-projet-nextjs

# Ajouter le pack de composants UI
nextjs-cli add ui-components

# Ou via pnpm (comme ShadCN)
pnpm dlx nextjs-cli@latest add ui-components

# Les fichiers créés:
# - components/ui/Button.tsx
# - components/ui/Card.tsx
# - lib/utils.ts
# + installation automatique de clsx et tailwind-merge
```

### Scénario 3: Ajouter un système d'authentification (privé)

```bash
cd mon-projet-nextjs

# Ajouter le système d'auth (nécessite authentification)
nextjs-cli add auth-system

# Entrer les identifiants:
# Username: admin
# Password: (système d'auth fictif)

# Les fichiers créés:
# - lib/auth.ts (configuration NextAuth)
# - components/auth/LoginForm.tsx
# + installation automatique de next-auth, @next-auth/prisma-adapter, etc.
```

### Scénario 4: Setup complet d'un projet avec base de données

```bash
# 1. Créer le projet
nextjs-cli create mon-app-full

# 2. Ajouter la configuration clean
cd mon-app-full
nextjs-cli add nextjs-clean

# 3. Ajouter les composants UI
nextjs-cli add ui-components

# 4. Ajouter le système d'auth (avec admin/developer)
nextjs-cli add auth-system

# 5. Ajouter la base de données (avec admin/developer)
nextjs-cli add database-setup

# 6. Installer les dépendances finales
npm install

# 7. Configurer la base de données
npx prisma migrate dev --name init
```

## 📦 Composants disponibles par cas d'usage

### 🎨 Interface Utilisateur

-   `ui-components` - Button, Card, Input, etc. (Public)

### 🛠️ Configuration & Setup

-   `nextjs-clean` - TypeScript + Tailwind CSS (Public)

### 🔐 Authentification

-   `auth-system` - NextAuth.js complet (Privé - admin/developer)

### 🗄️ Base de données

-   `database-setup` - Prisma + PostgreSQL (Privé - admin/developer)

## 🎯 Exemples de commandes

```bash
# Installation globale
npm install -g nextjs-cli

# Utilisation sans installation (comme ShadCN)
npx nextjs-cli@latest create mon-projet
pnpm dlx nextjs-cli@latest add ui-components

# Liste des composants par catégorie
nextjs-cli list-components --category ui
nextjs-cli list-components --category auth

# Voir tous les templates de projets
nextjs-cli list-repos

# Validation de la config
nextjs-cli validate
```

## 🔑 Authentification des composants privés

```bash
# Utilisateurs avec accès aux composants privés:
Username: admin
Username: developer

# Utilisateur sans accès privé:
Username: user1 (erreur d'accès aux composants 🔒)
```

## 📁 Structure générée après installation complète

```
mon-projet/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── auth/
│       └── LoginForm.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── tailwind.config.js
├── postcss.config.js
└── app/
    └── globals.css (avec Tailwind)
```

## 🚀 Workflow recommandé

1. **Créer le projet** : `nextjs-cli create`
2. **Setup initial** : `nextjs-cli add nextjs-clean`
3. **Composants UI** : `nextjs-cli add ui-components`
4. **Authentification** : `nextjs-cli add auth-system` (si nécessaire)
5. **Base de données** : `nextjs-cli add database-setup` (si nécessaire)
6. **Installation finale** : `npm install && npm run dev`
