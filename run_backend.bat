@echo off
title Smart Helmet FastAPI Backend (:8001)
color 0B
echo =====================================================================
echo   SMART HELMET ^& RIDER SAFETY ALERT SYSTEM - FASTAPI BACKEND
echo =====================================================================
echo.

rem Check and activate virtual environment if present
if exist "%~dp0venv\Scripts\activate.bat" (
    echo [Backend] Activating virtual environment (venv)...
    call "%~dp0venv\Scripts\activate.bat"
) else if exist "%~dp0.venv\Scripts\activate.bat" (
    echo [Backend] Activating virtual environment (.venv)...
    call "%~dp0.venv\Scripts\activate.bat"
) else if exist "%~dp0backend\venv\Scripts\activate.bat" (
    echo [Backend] Activating virtual environment (backend\venv)...
    call "%~dp0backend\venv\Scripts\activate.bat"
) else (
    echo [Backend] Using system Python environment...
)

echo.
cd /d "%~dp0backend"
echo [Backend] Starting Uvicorn ASGI Server on http://127.0.0.1:8001 ...
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload

if %ERRORLEVEL% neq 0 (
    echo.
    echo =====================================================================
    echo   [ERROR] Backend server failed to start (Exit Code: %ERRORLEVEL%).
    echo   Possible causes:
    echo     1. Port 8001 is already in use by another application.
    echo     2. Python packages are missing. Run: pip install -r requirements.txt
    echo     3. Python path is not registered in system environment variables.
    echo =====================================================================
    echo.
)

pause
