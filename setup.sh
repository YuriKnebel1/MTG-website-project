#!/bin/bash

# MTG Manager - Script de Setup
echo "🎴 MTG Manager - Configuração do Ambiente"
echo "=========================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+ primeiro."
    exit 1
fi

echo "✅ Node.js $(node --version) encontrado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install --legacy-peer-deps

# Gerar cliente Prisma
echo "🗄️ Configurando banco de dados..."
npm run db:generate

# Executar migrações
npm run db:migrate

# Executar testes
echo "🧪 Executando testes..."
npm run test

echo ""
echo "🚀 Setup concluído com sucesso!"
echo ""
echo "Para iniciar o servidor de desenvolvimento:"
echo "  npm run dev"
echo ""
echo "Para executar testes E2E:"
echo "  npm run test:e2e"
echo ""
echo "Para build de produção:"
echo "  npm run build"
echo "  npm run start"
