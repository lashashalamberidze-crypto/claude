@echo off
chcp 65001 >nul
title GAP Finance
cd /d "%USERPROFILE%\Desktop\gap_finance"
start "" /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:8000"
.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
pause
