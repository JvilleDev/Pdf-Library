@echo off
setlocal

set "baseFolder=%cd%"

start cmd /k "cd backend && npm run start"
start cmd /k "cd frontend && npm run serve"

echo Preparación del front y back completa. Ahora puedes iniciarlo.

endlocal
