#!/bin/bash

# Script de test du système de composants NextJS CLI

echo "🧪 Test du système de composants NextJS CLI"
echo "==========================================="
echo ""

echo "1. Création d'un projet de test:"
echo "--------------------------------"
mkdir -p test-project
cd test-project

# Créer un package.json minimal pour simuler un projet NextJS
cat > package.json << 'EOF'
{
  "name": "test-nextjs-project",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
EOF

echo "✅ Projet de test créé"
echo ""

echo "2. Test de la liste des composants:"
echo "----------------------------------"
cd ..
npx ts-node src/index.ts list-components
echo ""

echo "3. Instructions pour tester l'ajout de composants:"
echo "-------------------------------------------------"
echo "Pour tester l'ajout d'un composant public:"
echo "cd test-project"
echo "npx ts-node ../src/index.ts add ui-components"
echo ""
echo "Pour tester l'ajout d'un composant privé (nécessite auth):"
echo "cd test-project"
echo "npx ts-node ../src/index.ts add auth-system"
echo "Utilisateurs avec accès privé: admin, developer"
echo ""
echo "Pour une sélection interactive:"
echo "cd test-project"
echo "npx ts-node ../src/index.ts add"
echo ""

echo "4. Nettoyage (optionnel):"
echo "------------------------"
echo "rm -rf test-project"
