#!/usr/bin/env python3

"""
Smart Migration Runner - Tenta múltiplas estratégias para executar SQL
Se nenhuma funcionar, fornece instruções detalhadas para execução manual
"""

import os
import sys
import subprocess
import json
from pathlib import Path

# Configuration
PROJECT_ID = "pmscpydblddkwbgkzdmw"
SUPABASE_URL = "https://pmscpydblddkwbgkzdmw.supabase.co"
ANON_KEY = "sb_publishable_g3qVdfbiJo942PAs-V-zqA_S8HKfivc"
SQL_FILE = "supabase_migrations.sql"

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def print_step(num, text):
    print(f"  {num}️⃣  {text}")

def read_sql_file():
    if not Path(SQL_FILE).exists():
        print(f"❌ Arquivo {SQL_FILE} não encontrado!")
        sys.exit(1)
    return Path(SQL_FILE).read_text()

def try_supabase_cli():
    """Tenta usar Supabase CLI para executar migrations"""
    print_header("Tentativa 1: Supabase CLI")

    try:
        # Check if CLI exists
        result = subprocess.run(['supabase', '--version'], capture_output=True)
        if result.returncode != 0:
            print("  ⚠️  Supabase CLI não instalado")
            return False

        print(f"  ✅ Supabase CLI {result.stdout.decode().strip()} encontrado")

        # Try to link project
        print("  🔗 Tentando linkar projeto...")
        result = subprocess.run(
            ['supabase', 'link', '--project-ref', PROJECT_ID],
            capture_output=True,
            input=b'y\n'  # Auto-confirm
        )

        if result.returncode == 0:
            print("  ✅ Projeto linkado com sucesso!")

            # Execute migrations
            print("  📝 Executando migrations...")
            sql_content = read_sql_file()
            result = subprocess.run(
                ['supabase', 'db', 'push', '-f'],
                input=sql_content.encode(),
                capture_output=True
            )

            if result.returncode == 0:
                print("  ✅ ✅ ✅ MIGRATIONS EXECUTADAS COM SUCESSO!")
                return True
            else:
                print(f"  ⚠️  Erro ao executar: {result.stderr.decode()[:100]}")
                return False
        else:
            print(f"  ⚠️  Erro ao linkar: {result.stderr.decode()[:100]}")
            return False

    except Exception as e:
        print(f"  ⚠️  Erro: {str(e)[:100]}")
        return False

def try_psql():
    """Tenta usar psql para conectar direto ao banco"""
    print_header("Tentativa 2: PostgreSQL Direct Connection")

    try:
        # Check if psql exists
        result = subprocess.run(['psql', '--version'], capture_output=True)
        if result.returncode != 0:
            print("  ⚠️  psql não instalado")
            return False

        print(f"  ✅ {result.stdout.decode().strip()}")

        print("  ⚠️  Requer connection string com password (não disponível)")
        return False

    except Exception as e:
        print(f"  ⚠️  Erro: {str(e)[:100]}")
        return False

def show_manual_instructions():
    """Mostra instruções para execução manual"""
    print_header("✨ EXECUÇÃO MANUAL (5 minutos)")

    print("  Siga estes passos simples:\n")

    print_step(1, "Abra este URL no seu navegador:")
    print(f"     https://app.supabase.com/project/{PROJECT_ID}/sql/new\n")

    print_step(2, "Copie TODO O CONTEÚDO ABAIXO:\n")
    sql = read_sql_file()
    print(f"     [... {len(sql)} caracteres de SQL ...]")
    print(f"     (Arquivo: {SQL_FILE})\n")

    print_step(3, "Cole no SQL Editor do Supabase\n")

    print_step(4, "Clique no botão azul 'RUN'\n")

    print_step(5, "Verifique em Tables que as 4 foram criadas:")
    print("     ✓ quiz_sessions")
    print("     ✓ quiz_events")
    print("     ✓ quiz_checkouts")
    print("     ✓ purchases (modificada)\n")

    print("  "+"="*56)
    print("  ⏱️  Tempo estimado: 5 minutos")
    print("  "+"="*56+"\n")

def main():
    print("\n")
    print("╔════════════════════════════════════════════════════════╗")
    print("║         🚀 SMART MIGRATION RUNNER 🚀                  ║")
    print("║     Supabase Quiz Analytics Schema Migrations          ║")
    print("╚════════════════════════════════════════════════════════╝")

    # Try automated approaches
    if try_supabase_cli():
        print("\n✅ ✅ ✅ SUCCESS! Migrations executadas automaticamente!")
        return 0

    if try_psql():
        print("\n✅ ✅ ✅ SUCCESS! Migrations executadas via psql!")
        return 0

    # If all automated approaches fail, show manual instructions
    show_manual_instructions()

    print("  💡 DICA: Você pode copiar o SQL desta forma:\n")
    print(f"     cat {SQL_FILE} | pbcopy  (macOS)")
    print(f"     cat {SQL_FILE} | xclip   (Linux)\n")

    print("  📧 Se tiver dúvidas com a execução, peça ajuda!")
    print("  "+"="*56+"\n")

    return 1

if __name__ == '__main__':
    sys.exit(main())
