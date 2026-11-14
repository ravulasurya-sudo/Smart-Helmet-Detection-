@echo off
title Smart Helmet React Frontend (:5173)
color 0A
echo =====================================================================
echo   SMART HELMET ^& RIDER SAFETY ALERT SYSTEM - REACT FRONTEND
echo =====================================================================
echo.
cd /d "%~dp0frontend"
echo [Frontend] Starting Vite Dev Server on http://localhost:5173 ...
npm run dev
pause
