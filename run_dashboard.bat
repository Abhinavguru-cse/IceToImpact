@echo off
setlocal enabledelayedexpansion

echo ==============================================================================
echo   IceToImpact: AI Glacial Lake Monitoring and GLOF Susceptibility Platform
echo ==============================================================================
echo.

:: 1. Check Python
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python is not installed or not in PATH. Please install Python 3.10+.
    pause
    exit /b 1
)

echo [OK] Python detected.
python -c "import uvicorn, fastapi, numpy, PIL; print('[OK] Core scientific and server dependencies verified.')" 2>nul
if %ERRORLEVEL% neq 0 (
    echo [INFO] Installing required Python dependencies...
    pip install fastapi uvicorn numpy pillow scipy shapely sqlalchemy
)

echo.
echo ==============================================================================
echo   Launching unified Application Server (Backend + Interactive Dashboard)...
echo   URL: http://127.0.0.1:8000
echo   API Docs: http://127.0.0.1:8000/docs
echo ==============================================================================
echo.

:: Start server
python run_dashboard.py

pause
