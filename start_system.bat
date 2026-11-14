@echo off
title Smart Helmet Surveillance Full-Stack Launcher
color 09
echo =====================================================================
echo   SMART HELMET ^& RIDER SAFETY ALERT SYSTEM FOR TRAFFIC POLICE
echo =====================================================================
echo.
echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8001 ...
start "Smart Helmet FastAPI Backend (:8001)" cmd /k "cd /d "%~dp0backend" && python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload"

echo [2/2] Waiting 3 seconds for backend initialization...
timeout /t 3 /nobreak >nul

echo [3/3] Launching React Vite Frontend on http://localhost:5173 ...
start "Smart Helmet React Frontend (:5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo =====================================================================
echo   System running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://127.0.0.1:8001
echo   API Docs: http://127.0.0.1:8001/docs
echo =====================================================================
timeout /t 5 >nul
