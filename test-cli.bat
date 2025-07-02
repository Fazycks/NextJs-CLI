@echo off
echo 🧪 Test du CLI NextJS
echo ====================
echo.

echo 1. Test de l'aide du CLI:
echo -------------------------
call npx ts-node src/index.ts --help
echo.

echo 2. Test de la liste des utilisateurs:
echo -------------------------------------
call npx ts-node src/index.ts list-users
echo.

echo 3. Test de la liste des dépôts:
echo -------------------------------
call npx ts-node src/index.ts list-repos
echo.

echo 4. Instructions pour tester la création d'un projet:
echo ---------------------------------------------------
echo Pour tester la création d'un projet, exécutez:
echo npx ts-node src/index.ts create test-project
echo.
echo Utilisateurs de test disponibles:
echo - admin (accès privé)
echo - user1 (pas d'accès privé)
echo - developer (accès privé)
echo.
echo Le dépôt public peut être cloné sans authentification.
echo Le dépôt privé nécessite une authentification avec un utilisateur ayant les droits.

pause
