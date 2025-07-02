#!/bin/bash

echo "🚀 Push vers GitHub"
echo "=================="
echo ""

# Vérifier si l'origin existe déjà
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Remote origin déjà configuré: $(git remote get-url origin)"
else
    echo "🔗 Configuration du remote origin..."
    git remote add origin https://github.com/fazycks/nextjs-template-cli.git
    echo "✅ Remote origin configuré"
fi

echo ""
echo "🌿 Configuration de la branche principale..."
git branch -M main

echo ""
echo "📤 Push vers GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Code publié avec succès sur GitHub!"
    echo "🔗 Dépôt: https://github.com/fazycks/nextjs-template-cli"
    echo ""
    echo "✅ Vous pouvez maintenant publier sur NPM:"
    echo "   npm login"
    echo "   npm publish --access public"
else
    echo ""
    echo "❌ Erreur lors du push vers GitHub"
    echo "Vérifiez que:"
    echo "- Le dépôt GitHub existe"
    echo "- Vous avez les droits d'écriture"
    echo "- Votre authentification Git est configurée"
fi
