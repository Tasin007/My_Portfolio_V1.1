@echo off
setlocal
cd /d "%~dp0"
where npm.cmd >nul 2>nul
if errorlevel 1 (
  if exist "C:\Program Files\nodejs\npm.cmd" (
    set "PATH=C:\Program Files\nodejs;%PATH%"
  ) else (
    echo Node.js was not found. Install Node.js LTS and reopen this file.
    pause
    exit /b 1
  )
)
call npm.cmd ci
if errorlevel 1 goto failed
call npm.cmd run build
if errorlevel 1 goto failed
echo.
echo Open http://127.0.0.1:4174 in your browser. Keep this window open.
call npm.cmd start
if errorlevel 1 goto failed
exit /b 0
:failed
echo.
echo Startup stopped because a command failed. Read the message above.
pause
exit /b 1
