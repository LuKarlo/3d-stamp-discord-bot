@echo off
title Streaming Bot Discord - Manager

echo ========================================
echo 🔄 Controllo e download aggiornamenti Git...
echo ========================================
git fetch origin
git reset --hard origin/main
git clean -fd

echo.
echo ========================================
echo 🚀 Avvio dell'applicazione Node.js...
echo ========================================
npm start

pause