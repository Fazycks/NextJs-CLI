# 🚀 Guide Complet de Publication

## 📋 Résumé des Étapes

### ✅ TERMINÉ

-   [x] Code CLI développé et testé
-   [x] Configuration package.json avec nom @fazycks/nextjs-template-cli
-   [x] Documentation complète (README.md, guides)
-   [x] Scripts de test et publication
-   [x] Dépôt Git local initialisé avec commits

### 🐙 ÉTAPE 1: GitHub (À FAIRE MAINTENANT)

1. **Créer le dépôt sur GitHub:**

    - Aller sur https://github.com/fazycks
    - "New repository"
    - Nom: `nextjs-template-cli`
    - Description: `CLI TypeScript pour créer des projets NextJS avec système de composants`
    - Public ✅
    - NE PAS initialiser avec README ❌

2. **Publier le code:**

    ```bash
    # Option 1: Script automatique
    ./push-to-github.sh    # Linux/Mac
    # ou
    push-to-github.bat     # Windows

    # Option 2: Commandes manuelles
    git remote add origin https://github.com/fazycks/nextjs-template-cli.git
    git branch -M main
    git push -u origin main
    ```

### 📦 ÉTAPE 2: NPM (APRÈS GITHUB)

1. **Connexion NPM:**

    ```bash
    npm login
    ```

2. **Publication:**

    ```bash
    npm publish --access public
    ```

3. **Test global:**
    ```bash
    npm install -g @fazycks/nextjs-template-cli
    nextjs-template-cli --help
    ```

## 🔗 URLs Finales

Après publication, vous aurez:

-   **GitHub:** https://github.com/fazycks/nextjs-template-cli
-   **NPM:** https://www.npmjs.com/package/@fazycks/nextjs-template-cli
-   **Installation:** `npm install -g @fazycks/nextjs-template-cli`

## 🎯 Commande d'installation finale pour les utilisateurs

```bash
npm install -g @fazycks/nextjs-template-cli
```

## 🛠️ Utilisation du CLI après installation

```bash
# Créer un nouveau projet
nextjs-template-cli create my-project

# Ajouter des composants
cd my-project
nextjs-template-cli add ui-components

# Lister les options
nextjs-template-cli list-repos
nextjs-template-cli list-components
```

---

**🚀 Prêt pour la publication ! Commencez par GitHub puis NPM.**
