#!/bin/bash

# Script de publication NextJS CLI

echo "🚀 Préparation de la publication NextJS CLI"
echo "==========================================="
echo ""

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé"
    echo "Assurez-vous d'être dans le répertoire racine du projet"
    exit 1
fi

echo "1. Nettoyage du projet..."
rm -rf dist/
rm -rf node_modules/

echo "2. Installation des dépendances..."
npm install

echo "3. Build du projet..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "4. Test de l'exécutable..."
node dist/index.js --help

if [ $? -ne 0 ]; then
    echo "❌ Erreur: l'exécutable ne fonctionne pas correctement"
    exit 1
fi

echo "5. Vérification des fichiers à publier..."
npm pack --dry-run

echo ""
echo "✅ Prêt pour la publication!"
echo ""
echo "Pour publier sur NPM:"
echo "  npm login"
echo "  npm publish"
echo ""
echo "Pour publier en version beta:"
echo "  npm publish --tag beta"
echo ""
echo "Pour tester l'installation globale:"
echo "  npm install -g ."
echo "  nextjs-cli --help"
