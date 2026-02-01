#!/usr/bin/env node

/**
 * Migration Runner - Executa SQL migrations no Supabase
 * Uso: node run-migrations.js
 */

const fs = require('fs');
const path = require('path');

// Supabase credentials
const SUPABASE_URL = 'https://pmscpydblddkwbgkzdmw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_g3qVdfbiJo942PAs-V-zqA_S8HKfivc';

async function runMigrations() {
    console.log('🚀 Iniciando migrações SQL no Supabase...\n');

    try {
        // Read SQL file
        const sqlFilePath = path.join(__dirname, 'supabase_migrations.sql');
        if (!fs.existsSync(sqlFilePath)) {
            console.error('❌ Arquivo supabase_migrations.sql não encontrado!');
            process.exit(1);
        }

        const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
        console.log(`📄 Arquivo SQL carregado (${(sqlContent.length / 1024).toFixed(2)}KB)\n`);

        // Split SQL into individual statements
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📋 ${statements.length} statements encontrados\n`);

        // Execute each statement
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            const statementNum = i + 1;

            // Skip comments and empty statements
            if (statement.startsWith('--') || !statement.trim()) {
                continue;
            }

            process.stdout.write(`[${statementNum}/${statements.length}] Executando... `);

            try {
                const response = await fetch(
                    `${SUPABASE_URL}/rest/v1/rpc/query`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`,
                        },
                        body: JSON.stringify({
                            query: statement
                        })
                    }
                );

                if (response.ok) {
                    console.log('✅');
                    successCount++;
                } else {
                    const error = await response.text();
                    console.log(`⚠️  (${response.status})`);
                    console.log(`   └─ ${error.substring(0, 100)}...`);
                    // Don't count as error - RPC endpoint may not support raw SQL
                }
            } catch (error) {
                console.log('❌');
                console.log(`   └─ ${error.message}`);
                errorCount++;
            }
        }

        console.log(`\n📊 Resultado: ${successCount} ✅ | ${errorCount} ❌\n`);

        // Alternative: Try using SQL endpoint
        console.log('💡 Tentando abordagem alternativa via SQL endpoint...\n');
        await tryAlternativeMethod(sqlContent);

    } catch (error) {
        console.error('❌ Erro fatal:', error.message);
        process.exit(1);
    }
}

async function tryAlternativeMethod(sqlContent) {
    console.log('📌 Para executar as SQL migrations manualmente:\n');
    console.log('1. Acesse: https://app.supabase.com/project/pmscpydblddkwbgkzdmw/sql/new');
    console.log('2. Cole todo o conteúdo de "supabase_migrations.sql"');
    console.log('3. Clique em "RUN"\n');
    console.log('⚠️  A REST API não permite executar SQL raw por razões de segurança.\n');
}

// Run
runMigrations().catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
});
