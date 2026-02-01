#!/bin/bash

# ================================================
# Supabase Migration Executor
# Abre o Supabase SQL Editor e copia o SQL
# ================================================

PROJECT_ID="pmscpydblddkwbgkzdmw"
SQL_FILE="supabase_migrations.sql"

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Supabase SQL Migration Executor                       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if SQL file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ Arquivo $SQL_FILE não encontrado!"
    exit 1
fi

echo "📋 Arquivo SQL encontrado: $(wc -c < "$SQL_FILE") bytes"
echo ""

# Show instructions
echo "✅ Siga estes passos:"
echo ""
echo "1️⃣  URL do Supabase SQL Editor:"
echo "   https://app.supabase.com/project/$PROJECT_ID/sql/new"
echo ""
echo "2️⃣  COPIE TODO O CONTEÚDO ABAIXO E COLE NO SQL EDITOR:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Display SQL content
cat "$SQL_FILE"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "3️⃣  Clique no botão azul \"RUN\" no SQL Editor"
echo ""
echo "4️⃣  Verifique em Tables que as 4 tabelas foram criadas:"
echo "   - quiz_sessions"
echo "   - quiz_events"
echo "   - quiz_checkouts"
echo "   - (purchases foi modificada)"
echo ""
echo "✨ Pronto! As migrations estão executadas."
echo ""
