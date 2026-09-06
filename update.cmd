@echo off
title Git Update

echo 🔄 Aggiornamento del repository in corso...
git fetch origin
git reset --hard origin/main
git clean -fd

echo.
echo ✅ Operazione completata.
pause