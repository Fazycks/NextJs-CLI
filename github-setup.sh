#!/bin/bash

echo "🐙 Publication sur GitHub"
echo "========================"
echo ""

# Vérifier si on est dans un dépôt Git
if [ ! -d ".git" ]; then
    echo "❌ Erreur: Pas de dépôt Git trouvé"
    echo "Le dépôt Git a déjà été initialisé normalement..."
    exit 1
fi

echo "📋 Instructions pour créer le dépôt GitHub:"
echo "1. Aller sur https://github.com/fazycks"
echo "2. Cliquer 'New repository'"
echo "3. Nom: 'nextjs-template-cli'"
echo "4. Description: 'CLI TypeScript pour créer des projets NextJS avec système de composants'"
echo "5. Public ✅"
echo "6. NE PAS initialiser avec README ❌"
echo "7. Créer le dépôt"
echo ""

echo "Une fois le dépôt créé sur GitHub, exécutez:"
echo ""
echo "git remote add origin https://github.com/fazycks/nextjs-template-cli.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""

echo "🔍 Status Git actuel:"
git status --short
echo ""

echo "📝 Dernier commit:"
git log --oneline -1
echo ""

echo "🚀 Après le push GitHub, vous pourrez publier sur NPM!"
