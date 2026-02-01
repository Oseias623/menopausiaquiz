# Configuração do Webhook Hotmart

Este guia explica como configurar o webhook da Hotmart para processar compras automaticamente.

## 1. Criar Tabela no Supabase

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Cole o conteúdo do arquivo `supabase/migrations/001_create_purchases_table.sql`
5. Execute o SQL

**O que a tabela faz:**
- Armazena todas as compras feitas via Hotmart
- Vincula email do comprador aos produtos comprados
- Permite login apenas com email (sem senha)
- Rastreia status da compra (ativo, cancelado, reembolsado)

## 2. Configurar Webhook na Hotmart

1. Acesse https://app.hotmart.com
2. Vá em **Ferramentas > Webhooks**
3. Clique em **Adicionar Webhook**
4. Configure:

**URL do Webhook:**
```
https://appmenopausiaconclaridad.vercel.app/api/hotmart-webhook
```

**Eventos para Ouvir:**
- ✅ `PURCHASE_COMPLETE` - Compra completa
- ✅ `PURCHASE_APPROVED` - Compra aprovada
- ✅ `PURCHASE_CANCELED` - Compra cancelada
- ✅ `PURCHASE_REFUNDED` - Compra reembolsada
- ✅ `PURCHASE_CHARGEBACK` - Chargeback

5. Salve o webhook

## 3. Mapeamento de Produtos

Os IDs dos produtos da Hotmart estão mapeados em `/api/hotmart-webhook.ts`:

```typescript
const productMapping: Record<number, string> = {
  6887519: 'prog-antiinflamatorio',  // Produto principal
  6888461: 'bump-snacks',            // Snacks Anti-Ansiedad
  6888109: 'bump-cenas',             // Cenas para Dormir Mejor
  6888217: 'bump-plan7',             // Plan de 7 Días
  6888446: 'bump-lista',             // Lista de Compras
  6888416: 'bump-rapidas'            // Recetas Rápidas
};
```

**Se adicionar novos produtos:**
1. Pegue o ID do produto na Hotmart
2. Adicione no `productMapping` em `/api/hotmart-webhook.ts`
3. Adicione o produto em `/constants.tsx` com o mesmo `id`
4. Faça commit e deploy

## 4. Testar o Webhook

### Teste Manual (Hotmart)
1. Na página de configuração do webhook na Hotmart
2. Use a opção **Enviar Teste**
3. Verifique os logs no Vercel

### Verificar Logs no Vercel
1. Acesse https://vercel.com
2. Vá no projeto
3. Clique em **Deployments > [último deploy] > Functions**
4. Clique em `/api/hotmart-webhook`
5. Veja os logs de execução

### Verificar no Supabase
1. Acesse o Supabase
2. Vá em **Table Editor > purchases**
3. Veja se a compra foi registrada

## 5. Fluxo Completo

```
1. Cliente compra na Hotmart
   ↓
2. Hotmart envia webhook para nossa API
   ↓
3. API processa e salva no Supabase
   ↓
4. Cliente faz login com email de compra
   ↓
5. LoginScreen busca produtos do cliente
   ↓
6. App libera acesso aos produtos comprados
```

## 6. Estrutura de Dados

### Tabela `purchases`

| Campo                    | Tipo      | Descrição                           |
|-------------------------|-----------|-------------------------------------|
| `id`                    | UUID      | ID único da compra                  |
| `email`                 | VARCHAR   | Email do comprador (lowercase)      |
| `product_id`            | VARCHAR   | ID interno do produto               |
| `hotmart_transaction_id`| VARCHAR   | ID da transação Hotmart             |
| `hotmart_product_id`    | INTEGER   | ID do produto na Hotmart            |
| `buyer_name`            | VARCHAR   | Nome do comprador                   |
| `status`                | VARCHAR   | active / cancelled / refunded       |
| `purchased_at`          | TIMESTAMP | Data da compra                      |
| `cancelled_at`          | TIMESTAMP | Data do cancelamento (se houver)    |
| `price_value`           | DECIMAL   | Valor pago                          |
| `price_currency`        | VARCHAR   | Moeda (USD, BRL, etc)               |
| `raw_webhook_data`      | JSONB     | Dados completos do webhook          |

## 7. Segurança

**Políticas de RLS (Row Level Security):**
- ✅ Leitura pública permitida (para verificar login)
- ✅ Escrita apenas via webhook (service role)

**Em produção, considere:**
- Adicionar autenticação no webhook (token secreto)
- Validar assinatura Hotmart
- Rate limiting na API
- Monitoramento de compras suspeitas

## 8. Troubleshooting

### Webhook não está recebendo eventos
- Verifique se a URL está correta no painel da Hotmart
- Confirme que os eventos estão marcados
- Verifique logs do Vercel para erros

### Email não faz login
- Verifique se a compra está na tabela `purchases`
- Confirme que `status = 'active'`
- Verifique se o email está em lowercase
- Veja logs do console do navegador

### Produto não aparece após compra
- Confirme que `product_id` no banco corresponde ao `id` em `constants.tsx`
- Verifique o mapeamento em `productMapping`
- Faça logout e login novamente

## 10. Configuração de Email (Resend)

Para que o sistema envie emails de boas-vindas automaticamente:

1. Crie uma conta em [resend.com](https://resend.com)
2. Gere uma API Key
3. Adicione a variável de ambiente no Vercel (e `.env.local`):
```bash
RESEND_API_KEY="re_..."
```
4. O remetente padrão é `nao-responda@resend.dev` (modo teste). Para produção, configure um domínio no Resend.

> **⚠️ Importante:** O Resend **não aceita** domínios gratuitos como `gmail.com`, `hotmail.com` ou `vercel.app`.
> Você precisa ter um **domínio próprio** (ex: `seudominio.com`) comprado em sites como GoDaddy, Namecheap ou Registro.br.
> 
> Enquanto não verificar um domínio próprio, os emails só serão enviados para o email cadastrado na conta do Resend (modo teste).

## 9. Ambiente de Desenvolvimento

Para testar localmente:

1. Instale o Vercel CLI:
```bash
npm i -g vercel
```

2. Execute localmente:
```bash
vercel dev
```

3. Use ngrok para expor localhost:
```bash
ngrok http 3000
```

4. Configure o webhook para apontar para a URL do ngrok

## 10. Monitoramento

**Logs importantes:**
- 📦 Webhook recebido
- ✅ Compra salva
- 🚫 Compra cancelada
- ⚠️ Produto não mapeado
- ❌ Erro no Supabase

**Monitore regularmente:**
- Quantidade de compras processadas
- Taxa de erros no webhook
- Compras não mapeadas (IDs novos)
