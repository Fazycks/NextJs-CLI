#!/bin/bash

echo "✅ Vérification finale avant publication"
echo "========================================"
echo ""

echo "📦 Package: $(node -p "require('./package.json').name")"
echo "👤 Auteur: $(node -p "require('./package.json').author")"
echo "🏠 Repository: $(node -p "require('./package.json').repository.url")"
echo "📖 Homepage: $(node -p "require('./package.json').homepage")"
echo ""

echo "🔍 Test de disponibilité du nom sur NPM:"
npm view @fazycks/nextjs-template-cli 2>/dev/null || echo "✅ Nom disponible!"
echo ""

echo "🏗️ Build test:"
npm run build
echo ""

echo "🚀 Prêt pour la publication !"
echo "Commandes à exécuter:"
echo "1. npm login"
echo "2. npm publish --access public"
