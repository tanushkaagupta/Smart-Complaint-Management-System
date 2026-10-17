@echo off
title ComplaintHub Full-Stack App
echo ====================================================
echo Starting ComplaintHub (Backend + Frontend)
echo ====================================================

start "ComplaintHub Backend (Port 5000)" cmd /k "cd backend && npm run dev"
start "ComplaintHub Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo Backend URL:  http://localhost:5000/api
echo Frontend URL: http://localhost:5173
echo.
echo Both servers are launching in separate windows.
pause
