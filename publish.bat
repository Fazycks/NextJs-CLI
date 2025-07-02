@echo off
REM Script de publication NextJS CLI

echo 🚀 Préparation de la publication NextJS CLI
echo ===========================================
echo.

REM Vérifier si on est dans le bon répertoire
if not exist "package.json" (
    echo ❌ Erreur: package.json non trouvé
    echo Assurez-vous d'être dans le répertoire racine du projet
    pause
    exit /b 1
)

echo 1. Nettoyage du projet...
if exist "dist" rmdir /s /q dist
if exist "node_modules" rmdir /s /q node_modules

echo 2. Installation des dépendances...
call npm install

echo 3. Build du projet...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo ❌ Erreur lors du build
    pause
    exit /b 1
)

echo 4. Test de l'exécutable...
call node dist/index.js --help

if %ERRORLEVEL% neq 0 (
    echo ❌ Erreur: l'exécutable ne fonctionne pas correctement
    pause
    exit /b 1
)

echo 5. Vérification des fichiers à publier...
call npm pack --dry-run

echo.
echo ✅ Prêt pour la publication!
echo.
echo Pour publier sur NPM:
echo   npm login
echo   npm publish
echo.
echo Pour publier en version beta:
echo   npm publish --tag beta
echo.
echo Pour tester l'installation globale:
echo   npm install -g .
echo   nextjs-cli --help

pause
