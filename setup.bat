@echo off

REM MTG Manager - Script de Setup para Windows
echo 🎴 MTG Manager - Configuracao do Ambiente
echo ==========================================

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado. Por favor, instale Node.js 18+ primeiro.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set nodeversion=%%i
echo ✅ Node.js %nodeversion% encontrado

REM Instalar dependências
echo 📦 Instalando dependencias...
npm install --legacy-peer-deps

REM Gerar cliente Prisma
echo 🗄️ Configurando banco de dados...
npm run db:generate

REM Executar migrações
npm run db:migrate

REM Executar testes
echo 🧪 Executando testes...
npm run test

echo.
echo 🚀 Setup concluido com sucesso!
echo.
echo Para iniciar o servidor de desenvolvimento:
echo   npm run dev
echo.
echo Para executar testes E2E:
echo   npm run test:e2e
echo.
echo Para build de producao:
echo   npm run build
echo   npm run start

pause
