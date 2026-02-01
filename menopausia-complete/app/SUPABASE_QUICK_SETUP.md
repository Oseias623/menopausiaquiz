# Setup Rápido do Supabase - Hotmart Integration

## Passo 1: Acessar o SQL Editor

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral esquerdo, clique em **SQL Editor**

## Passo 2: Executar o SQL

1. Clique em **+ New Query**
2. Copie **TODO O CONTEÚDO** do arquivo:
   ```
   supabase/migrations/001_create_purchases_table_FIXED.sql
   ```
3. Cole no editor SQL
4. Clique em **RUN** (ou pressione Ctrl+Enter)

## Passo 3: Verificar se funcionou

1. No menu lateral, clique em **Table Editor**
2. Você deve ver a tabela **purchases** na lista
3. Clique nela para ver a estrutura

### Colunas esperadas:
- ✅ id
- ✅ email
- ✅ **product_id** ← Esta é a coluna que estava faltando
- ✅ hotmart_transaction_id
- ✅ hotmart_product_id
- ✅ buyer_name
- ✅ status
- ✅ purchased_at
- ✅ cancelled_at
- ✅ price_value
- ✅ price_currency
- ✅ raw_webhook_data
- ✅ created_at
- ✅ updated_at

## Passo 4: Inserir Dados de Teste (Opcional)

Se quiser testar o login antes de fazer uma compra real, rode este SQL:

```sql
INSERT INTO purchases (
  email,
  product_id,
  hotmart_transaction_id,
  hotmart_product_id,
  buyer_name,
  status,
  purchased_at,
  price_value,
  price_currency
)
VALUES
  ('seu-email@gmail.com', 'prog-antiinflamatorio', 'TEST-001', 6887519, 'Teste', 'active', NOW(), 97.00, 'USD'),
  ('seu-email@gmail.com', 'bump-snacks', 'TEST-002', 6888461, 'Teste', 'active', NOW(), 27.00, 'USD');
```

**Substitua** `seu-email@gmail.com` pelo email que você quer usar para testar.

Isso vai liberar:
- Programa Antiinflamatorio (principal)
- Snacks Anti-Ansiedad (upsell)

## Passo 5: Testar o Login

1. Acesse: https://appmenopausiaconclaridad.vercel.app
2. Digite o email que você inseriu nos dados de teste
3. Clique em **Ingresar**
4. Você deve ser logado e ver os produtos liberados!

## Troubleshooting

### Erro: "column product_id does not exist"
- A tabela não foi criada ainda
- Execute o SQL do arquivo `001_create_purchases_table_FIXED.sql`

### Erro: "relation purchases already exists"
- A tabela já existe, mas pode ter estrutura antiga
- Use o arquivo `_FIXED.sql` que tem `DROP TABLE IF EXISTS` no início
- **CUIDADO**: Isso apaga dados existentes!

### Login não funciona
1. Vá no Supabase → Table Editor → purchases
2. Verifique se tem dados com o email que você está tentando
3. Verifique se `status = 'active'`
4. Abra o Console do navegador (F12) e veja os logs

### Webhook não salva compras
1. Vá no Vercel → Functions → /api/hotmart-webhook
2. Veja os logs de execução
3. Teste o webhook na Hotmart com "Enviar Teste"

## URLs Importantes

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com
- **App em Produção**: https://appmenopausiaconclaridad.vercel.app
- **Hotmart**: https://app.hotmart.com
