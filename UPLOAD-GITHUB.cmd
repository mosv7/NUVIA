@echo off
setlocal
cd /d "%~dp0"
echo Uploading the prepared main branch to mosv7/NUVIA...
call git push origin main
if errorlevel 1 (
  echo Upload failed. Keep this window open and review the message above.
  echo Do not use force push.
  pause
  exit /b 1
)
echo Upload complete.
pause
