@echo off
cd /d "%~dp0"
git add components\Contact.js components\Header.js >nul 2>&1
git commit -m "feat: convert contact bubbles to direct-click links" >nul 2>&1
git push origin main >nul 2>&1
if %errorlevel%==0 (
  echo SUCCESS
) else (
  echo FAILED
)
exit /b %errorlevel%
