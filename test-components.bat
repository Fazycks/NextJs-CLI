@echo off
REM Script de test du système de composants NextJS CLI

echo 🧪 Test du système de composants NextJS CLI
echo ===========================================
echo.

echo 1. Création d'un projet de test:
echo --------------------------------
mkdir test-project 2>nul
cd test-project

REM Créer un package.json minimal pour simuler un projet NextJS
(
echo {
echo   "name": "test-nextjs-project",
echo   "version": "0.1.0",
echo   "private": true,
echo   "scripts": {
echo     "dev": "next dev",
echo     "build": "next build",
echo     "start": "next start"
echo   },
echo   "dependencies": {
echo     "next": "14.0.0",
echo     "react": "^18",
echo     "react-dom": "^18"
echo   },
echo   "devDependencies": {
echo     "typescript": "^5",
echo     "@types/node": "^20",
echo     "@types/react": "^18",
echo     "@types/react-dom": "^18"
echo   }
echo }
) > package.json

echo ✅ Projet de test créé
echo.

echo 2. Test de la liste des composants:
echo ----------------------------------
cd ..
call npx ts-node src/index.ts list-components
echo.

echo 3. Instructions pour tester l'ajout de composants:
echo -------------------------------------------------
echo Pour tester l'ajout d'un composant public:
echo cd test-project
echo npx ts-node ../src/index.ts add ui-components
echo.
echo Pour tester l'ajout d'un composant privé (nécessite auth):
echo cd test-project
echo npx ts-node ../src/index.ts add auth-system
echo Utilisateurs avec accès privé: admin, developer
echo.
echo Pour une sélection interactive:
echo cd test-project
echo npx ts-node ../src/index.ts add
echo.

echo 4. Nettoyage (optionnel):
echo ------------------------
echo rmdir /s /q test-project

pause
