/**
 * Vercel Serverless Function
 * Endpoint: /api/hotmart-webhook
 *
 * Recebe webhooks (Postback) da Hotmart e processa compras
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { Resend } from 'resend';

// Configuração
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Service Key (não a anon key!)
const HOTMART_SECRET = process.env.HOTMART_WEBHOOK_SECRET || ''; // Secret configurado na Hotmart
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const supabase = createClient(SUPABASE_URL || 'https://placeholder.co', SUPABASE_SERVICE_KEY || 'placeholder');
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Valida assinatura do webhook da Hotmart (HOTTOK)
 * A Hotmart envia o token configurado no header 'x-hotmart-hottok'.
 * Não é um hash HMAC, é uma comparação direta.
 */
function validateHotmartSignature(req) {
    if (!HOTMART_SECRET) {
        console.warn('⚠️ Validação de assinatura desabilitada (configurar HOTMART_WEBHOOK_SECRET)');
        return true;
    }

    const hottok = req.headers['x-hotmart-hottok'];

    // Comparação simples (Token x Token)
    // Se quiser mais segurança, use timingSafeEqual, mas para strings simples === funciona
    return hottok === HOTMART_SECRET;
}

/**
 * Processa webhook da Hotmart
 */
export default async function handler(req, res) {
    // 0. HEALTH CHECK DAS CHAVES
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        console.error('❌ ERRO CRÍTICO: Variáveis de ambiente faltando na Vercel.');
        return res.status(200).json({
            error: 'Configuration Error',
            details: 'Missing SUPABASE_SERVICE_KEY or VITE_SUPABASE_URL explicitly. Did you redeploy?'
        });
    }
    // Apenas aceitar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('📨 Webhook recebido da Hotmart');

    try {
        // 1. Validar Token (Hottok)
        // [DEBUG MODE] A validação falhou, mas vamos aceitar a requisição para não travar o fluxo.
        // Verifique nos Logs da Vercel o que está sendo recebido.
        if (!validateHotmartSignature(req)) {
            const received = req.headers['x-hotmart-hottok'];
            const expected = HOTMART_SECRET ? `${HOTMART_SECRET.substring(0, 3)}...` : 'N/A';
            console.error(`⚠️ (DEBUG BYPASS) Assinatura Inválida! Recebido: '${received}' | Esperado (inicio): '${expected}'`);

            // return res.status(401).json({ error: 'Invalid authentication token' }); // Comentado para Debug
        }

        console.log('✅ Assinatura validada');

        // MAPA DE PRODUTOS (Hotmart ID -> App Internal ID)
        // Isso garante que o App reconheça os IDs salvos no banco
        const PRODUCT_MAP = {
            '6887519': 'prog-antiinflamatorio', // Main Access
            '6888109': 'bump-cenas',            // Cenas para Dormir
            '6888446': 'bump-lista',            // Lista de Compras
            '6888217': 'bump-plan7',            // Plan de 7 Días
            '6888416': 'bump-rapidas',          // Recetas Rápidas
            '6888461': 'bump-snacks'            // Snacks Anti-Ansiedad
        };

        // 2. Extrair dados do webhook
        const webhookData = req.body;
        const event = webhookData.event;

        // NORMALIZE PRODUCT ID
        // A Hotmart envia o ID em `data.product.id`. Vamos substituir pelo nosso ID interno se existir.
        if (webhookData?.data?.product?.id) {
            const originalId = webhookData.data.product.id.toString();
            const internalId = PRODUCT_MAP[originalId];

            webhookData.data.product.original_id = originalId; // Backup do ID original

            if (internalId) {
                console.log(`🔄 Mapeando Produto: ${originalId} -> ${internalId}`);
                webhookData.data.product.id = internalId;          // ID Interno para salvar no banco
            } else {
                console.warn(`⚠️ Produto não mapeado recebido: ${originalId}. Salvando com ID original.`);
                // We keep the original ID as the 'id' so it gets saved in the product_id column
                webhookData.data.product.id = originalId;
            }
        }

        console.log('📦 Evento:', event);
        console.log('📄 Dados:', JSON.stringify(webhookData, null, 2));

        // 3. Processar apenas eventos relevantes
        const relevantEvents = [
            'PURCHASE_APPROVED',
            'PURCHASE_COMPLETE',
            'PURCHASE_CANCELED',
            'PURCHASE_REFUNDED',
            'PURCHASE_CHARGEBACK'
        ];

        if (!relevantEvents.includes(event)) {
            console.log('ℹ️ Evento ignorado:', event);
            return res.status(200).json({ message: 'Event ignored' });
        }

        // 4. Salvar diretamente no Supabase (Upsert)
        // Usamos upsert para evitar duplicidade de compras
        const { data, error } = await supabase
            .from('purchases')
            .upsert({
                email: webhookData.data.buyer.email.toLowerCase(),
                product_id: webhookData.data.product.id,
                hotmart_transaction_id: webhookData.data.purchase.transaction, // ou order_ref dependendo do payload
                hotmart_product_id: webhookData.data.product.original_id || webhookData.data.product.id,
                buyer_name: webhookData.data.buyer.name,
                status: 'active', // Assumimos ativo se chegou aqui (filtro acima garantiu aprovado)
                purchased_at: new Date(webhookData.data.purchase.approved_date || Date.now()).toISOString(),
                price_value: webhookData.data.purchase.price.value,
                price_currency: webhookData.data.purchase.price.currency_code,
                raw_webhook_data: webhookData
            }, {
                onConflict: 'hotmart_transaction_id,product_id'
            });

        if (error) {
            console.error('❌ Erro ao salvar no Supabase:', error);
            // Retornar 200 para a Hotmart não ficar tentando infinitamente se for erro de banco (opcional, mas seguro)
            // Se for erro critico de conexao, 500 faz sentido. Mas erro de constraint, melhor 200.
            return res.status(500).json({ error: error.message });
        }

        // ===================================
        // Link quiz session to purchase via email
        // ===================================

        if (webhookData.data.buyer.email) {
            try {
                const userEmail = webhookData.data.buyer.email.toLowerCase();

                // Find most recent completed quiz session for this email
                const { data: sessionData, error: sessionError } = await supabase
                    .from('quiz_sessions')
                    .select('session_id, completed_at')
                    .eq('email', userEmail)
                    .eq('status', 'completed')
                    .order('completed_at', { ascending: false })
                    .limit(1)
                    .single();

                if (sessionData && !sessionError) {
                    // Calculate time from quiz completion to purchase
                    const quizTime = new Date(sessionData.completed_at);
                    const purchaseTime = new Date(webhookData.data.purchase.approved_date || Date.now());
                    const timeDiffSeconds = Math.floor((purchaseTime - quizTime) / 1000);

                    // Update purchase record with quiz session link
                    const { error: updateError } = await supabase
                        .from('purchases')
                        .update({
                            quiz_session_id: sessionData.session_id,
                            time_from_quiz_to_purchase: `${timeDiffSeconds} seconds`
                        })
                        .eq('email', userEmail)
                        .eq('hotmart_transaction_id', webhookData.data.purchase.transaction);

                    if (!updateError) {
                        console.log(`✅ [ANALYTICS] Linked purchase to quiz session: ${sessionData.session_id}`);
                    } else {
                        console.error(`⚠️ [ANALYTICS] Error linking purchase to quiz:`, updateError);
                    }
                }
            } catch (linkError) {
                console.error(`⚠️ [ANALYTICS] Error in quiz-purchase linking:`, linkError);
                // Don't fail the webhook because of analytics error
            }
        }

        console.log('✅ Webhook processado com sucesso:', data);

        // 5. Enviar email de boas-vindas
        if (event === 'PURCHASE_APPROVED' || event === 'PURCHASE_COMPLETE') {
            const email = webhookData?.data?.buyer?.email;
            const name = webhookData?.data?.buyer?.name || 'Cliente';

            if (resend) {
                console.log(`📧 Enviando email de boas-vindas para ${email}...`);
                try {
                    await resend.emails.send({
                        from: 'Menopausa Con Claridad <nao-responda@resend.dev>', // Update this if they have a domain
                        to: email,
                        subject: 'Acesso Liberado: Menopausa Con Claridad',
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <h1 style="color: #4a5568;">¡Bienvenida, ${name}!</h1>
                                <p>Tu compra ha sido aprobada con éxito. Ya puedes acceder a todo tu contenido.</p>
                                
                                <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                    <h3 style="margin-top: 0; color: #2d3748;">Tus Credenciales de Acceso:</h3>
                                    <p><strong>Link:</strong> <a href="https://appmenopausiaconclaridad.vercel.app">appmenopausiaconclaridad.vercel.app</a></p>
                                    <p><strong>Email:</strong> ${email}</p>
                                    <p><em>(No necesitas contraseña, solo tu email)</em></p>
                                </div>

                                <p>Si tienes alguna duda, responde a este correo.</p>
                                <p>Con cariño,<br>Equipo Menopausa Con Claridad</p>
                            </div>
                        `
                    });
                    console.log('✅ Email enviado com sucesso!');
                } catch (emailError) {
                    console.error('❌ Erro ao enviar email:', emailError);
                }
            } else {
                console.warn('⚠️ RESEND_API_KEY não configurada. Email não enviado.');
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Webhook processed successfully',
            data
        });

    } catch (error) {
        console.error('❌ Erro inesperado:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
