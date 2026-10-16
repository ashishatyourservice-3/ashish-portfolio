@echo off
setlocal
cd /d "%~dp0client"
echo ========================================
echo       Ashish Tiwari Portfolio
echo ========================================
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install the LTS version from https://nodejs.org/
  pause
  exit /b 1
)
if not exist "node_modules" (
  echo First-time setup: installing website files. Please wait...
  call npm install
  if errorlevel 1 (
    echo Setup failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
echo Starting website. Keep this window open.
call npm run dev -- --open
pause
