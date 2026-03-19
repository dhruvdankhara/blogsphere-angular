@echo off

:: Terminal 1 - Angular Client
start "Client" cmd /k "cd /d %~dp0client && npm install -g @angular/cli && npm i && ng serve"

:: Terminal 2 - Node Server
start "Server" cmd /k "cd /d %~dp0server && npm i -g nodemon && npm i && npm run dev"
