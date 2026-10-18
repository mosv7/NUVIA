@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
  call npm ci
  if errorlevel 1 goto failed
)
call npm run dev
exit /b %errorlevel%
:failed
echo Installation failed. Check the message above.
pause
exit /b 1
