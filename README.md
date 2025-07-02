# NextJS CLI

[![npm version](https://badge.fury.io/js/@fazycks%2Fnextjs-template-cli.svg)](https://badge.fury.io/js/@fazycks%2Fnextjs-template-cli)
[![downloads](https://img.shields.io/npm/dt/@fazycks/nextjs-template-cli.svg)](https://www.npmjs.com/package/@fazycks/nextjs-template-cli)
[![license](https://img.shields.io/npm/l/@fazycks/nextjs-template-cli.svg)](https://github.com/fazycks/nextjs-template-cli/blob/main/LICENSE)

Un CLI TypeScript inspiré de ShadCN UI pour cloner des dépôts GitHub NextJS avec système d'authentification et ajout de composants.

## 🚀 Fonctionnalités

-   🚀 **Création de projets** - Clonage de dépôts NextJS publics et privés
-   � **Système de composants** - Ajout de composants comme ShadCN UI avec `nextjs-cli add`
-   🔐 **Authentification** - Système d'auth avec base de données fictive
-   👥 **Gestion des utilisateurs** - Permissions et tokens GitHub
-   🎨 **Interface colorée** - CLI avec indicateurs de progression
-   ✅ **Validation robuste** - Noms de projets, URLs et configurations
-   🛠️ **Installation automatique** - Dépendances npm automatiques

## 📋 Prérequis

-   Node.js (version 16 ou supérieure)
-   Git installé sur le système
-   npm, yarn ou pnpm

## 🛠️ Installation

### Installation globale (recommandée)

```bash
# Via npm
npm install -g nextjs-cli

# Via pnpm
pnpm add -g nextjs-cli

# Via yarn
yarn global add nextjs-cli
```

### Installation locale pour développement

```bash
git clone <url-du-projet>
cd NextJs-CLI
npm install
npm run build
npm link
```

## 🎯 Utilisation

### Créer un nouveau projet

```bash
# Méthode 1: Avec le nom du projet
nextjs-cli create mon-projet

# Méthode 2: Sélection interactive
nextjs-cli create

# Forcer un gestionnaire de paquets spécifique
nextjs-cli create mon-projet --pm pnpm
nextjs-cli create mon-projet --package-manager yarn

# Via pnpm dlx (sans installation)
pnpm dlx nextjs-cli@latest create mon-projet
```

### Ajouter des composants (comme ShadCN UI)

```bash
# Dans un projet NextJS existant
cd mon-projet-nextjs

# Ajout avec sélection interactive
nextjs-cli add

# Ajout direct par nom
nextjs-cli add ui-components
nextjs-cli add nextjs-clean
nextjs-cli add auth-system

# Forcer un gestionnaire de paquets spécifique
nextjs-cli add ui-components --pm pnpm
nextjs-cli add auth-system --package-manager yarn

# Ne pas installer les dépendances automatiquement
nextjs-cli add ui-components --no-install

# Via pnpm dlx (comme ShadCN)
pnpm dlx nextjs-cli@latest add ui-components
pnpm dlx nextjs-cli@latest add
```

### Lister les composants disponibles

```bash
# Tous les composants
nextjs-cli list-components

# Par catégorie
nextjs-cli list-components --category ui
nextjs-cli list-components -c auth

# Alias court
nextjs-cli list-comp
```

### Autres commandes utiles

```bash
# Lister les utilisateurs de test
nextjs-cli list-users

# Lister les templates de projets
nextjs-cli list-repos

# Lister les gestionnaires de paquets disponibles
nextjs-cli list-package-managers
nextjs-cli list-pm

# Valider la configuration
nextjs-cli validate

# Aide
nextjs-cli --help
nextjs-cli add --help
nextjs-cli create --help
```

## 📦 Composants disponibles

### 🛠️ Setup & Configuration

-   **`nextjs-clean`** - Configuration NextJS propre avec TypeScript et Tailwind CSS
-   **`database-setup`** 🔒 - Configuration Prisma + PostgreSQL

### 🎨 Interface Utilisateur

-   **`ui-components`** - Pack de composants UI réutilisables (Button, Card, etc.)

### � Authentification

-   **`auth-system`** 🔒 - Système d'authentification NextAuth.js complet

_🔒 = Nécessite une authentification_

## 👥 Utilisateurs de test

| Nom d'utilisateur | Email | Accès privé | Description |
| --- | --- | --- | --- |
| `admin` | admin@example.com | ✅ | Administrateur avec accès complet |
| `user1` | user1@example.com | ❌ | Utilisateur standard (composants publics uniquement) |
| `developer` | dev@example.com | ✅ | Développeur avec accès aux composants privés |

## 🏗️ Architecture du projet

```
src/
├── types/
│   └── index.ts              # Types TypeScript
├── services/
│   ├── auth.service.ts       # Service d'authentification
│   ├── repository.service.ts # Gestion des templates de projets
│   ├── component.service.ts  # Gestion des composants (nouveau)
│   ├── git.service.ts        # Service de clonage Git
│   ├── config.service.ts     # Service de configuration
│   ├── data.service.ts       # Service de données
│   └── validation.service.ts # Service de validation
└── index.ts                  # Point d'entrée du CLI
```

## � Développement

```bash
# Installation des dépendances
npm install

# Mode développement
npm run dev

# Construction
npm run build

# Mode watch
npm run watch

# Test du CLI en développement
npx ts-node src/index.ts --help
npx ts-node src/index.ts add ui-components
```

## 🧪 Tests

```bash
# Sur Windows
test-cli.bat
test-components.bat

# Sur Linux/Mac
./test-cli.sh
./test-components.sh
```

## ⚙️ Configuration

### Variables d'environnement

```bash
cp .env.example .env
```

### Fichier config.json

Le CLI utilise `config.json` pour la configuration des utilisateurs, dépôts et composants.

## 🎨 Ajout de nouveaux composants

### Structure d'un composant

```json
{
    "name": "mon-composant",
    "displayName": "Mon Composant Génial",
    "description": "Description du composant",
    "category": "ui",
    "isPrivate": false,
    "requiresAuth": false,
    "dependencies": ["package1", "package2"],
    "devDependencies": ["@types/package1"],
    "files": [
        {
            "path": "components/MonComposant.tsx",
            "type": "file",
            "content": "// Code du composant..."
        }
    ]
}
```

### Ajout au config.json

Ajoutez votre composant dans la section `components` du fichier `config.json`.

## 🚀 Publication sur NPM

### Préparation

```bash
# Build
npm run build

# Vérification
npm pack --dry-run

# Publication
npm publish
```

### Utilisation après publication

```bash
# Installation globale
npm install -g nextjs-cli

# Utilisation directe (comme ShadCN)
npx nextjs-cli@latest add ui-components
pnpm dlx nextjs-cli@latest add auth-system
```

## 🔒 Sécurité

⚠️ **Important** : Ce projet utilise une base de données fictive à des fins de démonstration.

**En production :**

-   Utilisez une vraie base de données
-   Chiffrez les tokens GitHub
-   Implémentez une authentification OAuth
-   Utilisez des variables d'environnement
-   Validez toutes les entrées utilisateur

## 📖 Comparaison avec ShadCN UI

| Fonctionnalité | ShadCN UI | NextJS CLI |
| --- | --- | --- |
| Ajout de composants | `npx shadcn@latest add button` | `npx nextjs-cli@latest add ui-components` |
| Sélection interactive | `npx shadcn@latest add` | `npx nextjs-cli@latest add` |
| Liste des composants | `npx shadcn@latest add --help` | `nextjs-cli list-components` |
| Type de composants | UI uniquement | UI + Auth + Setup + Database |
| Authentification | Non | Oui (pour composants privés) |

## �️ Fonctionnalités avancées

### Clonage optimisé

-   Clone shallow (--depth 1)
-   Nettoyage automatique de l'historique Git
-   Validation des URLs avant clonage

### Gestion des dépendances

-   Installation automatique des packages npm
-   Séparation dependencies/devDependencies
-   Confirmation utilisateur avant installation

### Validation

-   Noms de projets (2-50 caractères, format valide)
-   URLs GitHub avec tokens d'authentification
-   Structure de projet NextJS

## 📄 Licence

MIT - Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

-   🐛 Issues: [GitHub Issues](https://github.com/your-username/nextjs-cli/issues)
-   💬 Discussions: [GitHub Discussions](https://github.com/your-username/nextjs-cli/discussions)
-   📧 Email: votre-email@example.com

---

**Inspiré par ShadCN UI** - Créé avec ❤️ pour la communauté NextJS

## 📦 Gestionnaires de paquets supportés

Le CLI détecte et supporte automatiquement plusieurs gestionnaires de paquets :

| Gestionnaire | Installation | Commande d'installation | Détection |
| --- | --- | --- | --- |
| **pnpm** | `npm install -g pnpm` | `pnpm add <package>` | `pnpm-lock.yaml` |
| **yarn** | `npm install -g yarn` | `yarn add <package>` | `yarn.lock` |
| **bun** | Voir [bun.sh](https://bun.sh) | `bun add <package>` | `bun.lockb` |
| **npm** | Inclus avec Node.js | `npm install <package>` | `package-lock.json` |

### Fonctionnalités intelligentes :

-   🔍 **Détection automatique** - Le CLI détecte le gestionnaire utilisé dans votre projet
-   📋 **Sélection interactive** - Choix du gestionnaire si plusieurs sont disponibles
-   ⚙️ **Configuration automatique** - Mise à jour du `package.json` avec le champ `packageManager`
-   🚀 **Installation optimisée** - Utilise les commandes spécifiques à chaque gestionnaire
