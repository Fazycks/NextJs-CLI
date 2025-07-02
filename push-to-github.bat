@echo off
echo 🚀 Push vers GitHub
echo ==================
echo.

REM Vérifier si l'origin existe déjà
git remote get-url origin >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Remote origin déjà configuré
    git remote get-url origin
) else (
    echo 🔗 Configuration du remote origin...
    git remote add origin https://github.com/fazycks/nextjs-template-cli.git
    echo ✅ Remote origin configuré
)

echo.
echo 🌿 Configuration de la branche principale...
git branch -M main

echo.
echo 📤 Push vers GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo 🎉 Code publié avec succès sur GitHub!
    echo 🔗 Dépôt: https://github.com/fazycks/nextjs-template-cli
    echo.
    echo ✅ Vous pouvez maintenant publier sur NPM:
    echo    npm login
    echo    npm publish --access public
) else (
    echo.
    echo ❌ Erreur lors du push vers GitHub
    echo Vérifiez que:
    echo - Le dépôt GitHub existe
    echo - Vous avez les droits d'écriture
    echo - Votre authentification Git est configurée
)

pause
