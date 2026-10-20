@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
  call npm ci
  if errorlevel 1 goto failed
)
echo For connected accounts, run npm run dev:backend and npm run mail:work in two other terminals.
echo Setup and verification mail instructions: docs\development\backend.md
echo Design previews without backend: http://127.0.0.1:5173/preview/
call npm run dev
exit /b %errorlevel%
:failed
echo Installation failed. Check the message above.
pause
exit /b 1
