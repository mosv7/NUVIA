@echo off
setlocal
cd /d "%~dp0"
where pnpm >nul 2>nul
if errorlevel 1 (
  echo Install pnpm 11.25.0 first: npm install --global pnpm@11.25.0
  pause
  exit /b 1
)
call pnpm install --frozen-lockfile
if errorlevel 1 goto failed
call pnpm setup:local
if errorlevel 1 goto failed
echo Check JWT_SECRET and the intended MongoDB database in root .env. See README.md.
call pnpm dev
exit /b %errorlevel%
:failed
echo Installation failed. Check the message above.
pause
exit /b 1
