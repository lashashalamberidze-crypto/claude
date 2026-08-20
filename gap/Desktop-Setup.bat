@echo off
chcp 65001 >nul
title GAP - dayeneba desktopze
setlocal
set "SRC=%~dp0"
set "DEST=%USERPROFILE%\Desktop\GAP\"
if /i "%SRC%"=="%DEST%" (
  echo ეს საქაღალდე უკვე დესკტოპზეა: %DEST%
  start "" "%DEST%gap-info.html"
  timeout /t 3 >nul
  exit /b 0
)
echo ვაკოპირებ დესკტოპზე: %DEST%
xcopy "%SRC%*" "%DEST%" /E /I /Y /Q >nul
if errorlevel 1 (
  echo ვერ დაკოპირდა. გადმოაკოპირე საქაღალდე ხელით დესკტოპზე.
  pause
  exit /b 1
)
echo მზადაა. ვხსნი...
start "" "%DEST%gap-info.html"
timeout /t 3 >nul
