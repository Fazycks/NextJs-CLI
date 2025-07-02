# 📦 Guide de Publication sur NPM

## Étapes de Publication

### 1. Créer un compte NPM
- Aller sur [npmjs.com](https://www.npmjs.com)
- Créer un compte ou se connecter
- Confirmer l'email si nouveau compte

### 2. Se connecter en local
```bash
npm login
# Suivre les instructions pour entrer vos identifiants
```

### 3. Vérifier la connexion
```bash
npm whoami
# Doit afficher votre nom d'utilisateur NPM
```

### 4. Mise à jour du package.json
✅ **Déjà fait pour Fazycks !**
- "name": "@fazycks/nextjs-template-cli"
- Toutes les URLs GitHub mises à jour
- Auteur configuré

### 5. Publication
```bash
# Test final
npm run build

# Publication (première fois)
npm publish --access public

# Pour les mises à jour futures
npm version patch  # ou minor/major
npm publish --access public
```

### 6. Installation globale pour test
```bash
npm install -g @fazycks/nextjs-template-cli
nextjs-template-cli --help
```

## Options de Publication

### Publication Publique (Recommandé)
- Package accessible à tous
- `npm publish --access public`

### Publication Privée (payant)
- Nécessite un compte NPM Pro
- `npm publish` (par défaut pour les scoped packages)

## Bonnes Pratiques

1. **Versioning Sémantique** :
   - `1.0.0` → `1.0.1` (patch)
   - `1.0.0` → `1.1.0` (minor)
   - `1.0.0` → `2.0.0` (major)

2. **Tests avant publication** :
   ```bash
   npm pack --dry-run
   npm run build
   ```

3. **Documentation** :
   - README.md à jour
   - CHANGELOG.md pour les versions
   - Badges NPM dans le README

4. **Sécurité** :
   - Pas de tokens/secrets dans le code
   - `.npmignore` configuré
   - Audit de sécurité : `npm audit`
