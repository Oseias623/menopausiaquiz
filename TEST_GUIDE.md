# Guia de Teste - Sistema de Métricas Completo

## ✅ Checklist Pré-Teste

Antes de começar, confirme que:

- [x] Fase 1: SQL migrations executadas no Supabase
  - Verificar em [Supabase Tables](https://app.supabase.com/project/pmscpydblddkwbgkzdmw/editor): quiz_sessions, quiz_events, quiz_checkouts, purchases

- [x] Fase 2-5: Código adicionado ao projeto
  - `script.js` tem AnalyticsTracker + tracking calls
  - `index.html` tem banner + SDK Supabase
  - `style.css` tem estilos do banner
  - `hotmart-webhook.js` tem linking logic

---

## 🧪 Teste Manual - Passo a Passo

### 1️⃣ Preparar Teste Local

**Abra o quiz em seu navegador com UTM parameters:**

```
http://localhost:3000/index.html?utm_source=facebook&utm_medium=cpc&utm_campaign=teste-metricas
```

Ou se estiver usando um servidor estático:

```
file:///Users/pantera/Desktop/Projetos/Quiz_Menopausia%20con_Claridad/index.html?utm_source=facebook&utm_medium=cpc&utm_campaign=teste-metricas
```

**Importante:** Os UTM parameters precisam estar na URL para serem capturados!

---

### 2️⃣ Abrir DevTools e Monitorar Logs

**Pressione `F12` ou `Cmd+Option+I` (macOS) para abrir Developer Tools:**

1. Vá para a aba **Console**
2. Você deve ver logs como:
   ```
   [Analytics] New session created: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   [Analytics] Event tracked: session_start
   ```

3. Observe os logs conforme você avança no quiz:
   ```
   [Analytics] Event tracked: step_view
   [Analytics] Event tracked: answer_selected
   ```

---

### 3️⃣ Interagir com o Quiz

**Siga este fluxo de teste:**

#### A. Aceitar Consent Banner
- O banner de cookies deve aparecer no topo do intro
- Clique em "Aceitar e continuar"
- **Esperado:** Banner desaparece, logs mostram `[Analytics] Consent accepted`

#### B. Completar Quiz
- Clique no botão "QUIERO DESCUBRIR MI DIAGNÓSTICO"
- Você deve ver logs: `[Analytics] Event tracked: step_view` para cada step

#### C. Selecionar Respostas (Single Choice)
- Clique em uma opção (ex: "Cansada")
- **Esperado em Console:**
  ```
  [Analytics] Event tracked: answer_selected
  answer_value: "cansada"
  block_type: "circadiano"
  ```

#### D. Selecionar Múltiplas Opções (Checkboxes)
- Quando chegar em step 7 (Síntomas), marque 2-3 opções
- Clique em "Continuar"
- **Esperado em Console:**
  ```
  [Analytics] Event tracked: multi_answer_selected
  multi_answers: [{value: "sofocos",...}, {value: "barriga",...}]
  ```

#### E. Testar Botão Back
- Clique no botão back
- **Esperado em Console:**
  ```
  [Analytics] Event tracked: back_button_clicked
  ```

#### F. Capturar Email
- Na página de email, insira: `teste@example.com`
- Clique em "Recibir mi protocolo ahora"
- **Esperado em Console:**
  ```
  [Analytics] Email captured: teste@example.com
  [Analytics] Event tracked: email_captured
  ```

#### G. Completar Quiz
- Continue até chegar no diagnosis
- **Esperado em Console:**
  ```
  [Analytics] Event tracked: quiz_completed
  metadata: {
    score_circadiano: 3,
    score_inflamacion: 2,
    score_estructura: 1,
    dominant_profile: "circadiano"
  }
  ```

#### H. Clique em Checkout
- Clique em um botão de compra (ex: "COMPRA AGORA")
- **Esperado em Console:**
  ```
  [Analytics] Event tracked: checkout_clicked
  metadata: { plan_selected: "4semanas", checkout_location: "offer_section" }
  [Analytics] Checkout tracked: 4semanas
  ```

---

### 4️⃣ Verificar Dados no Supabase

**Abra o [Supabase Dashboard](https://app.supabase.com/project/pmscpydblddkwbgkzdmw/editor)**

#### Tabela: quiz_sessions
```sql
SELECT * FROM quiz_sessions
WHERE email = 'teste@example.com'
ORDER BY created_at DESC
LIMIT 1;
```

**Esperado:**
```
✅ session_id: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
✅ email: teste@example.com
✅ status: completed
✅ utm_source: facebook
✅ utm_medium: cpc
✅ utm_campaign: teste-metricas
✅ score_circadiano: 3 (ou similar)
✅ dominant_profile: circadiano (ou similar)
✅ device_type: mobile/tablet/desktop
✅ browser: Chrome/Safari/Firefox
✅ os: macOS/Windows/iOS/Android
✅ time_spent_seconds: 300-600 (tempo total no quiz)
```

#### Tabela: quiz_events
```sql
SELECT event_type, step_id, answer_value, created_at
FROM quiz_events
WHERE session_id = 'COPIE_O_SESSION_ID_ACIMA'
ORDER BY created_at ASC;
```

**Esperado:** ~20+ eventos listados:
```
session_start  | intro       | null         | 2025-02-01 10:00:00
step_view      | step1       | null         | 2025-02-01 10:00:01
answer_selected| step1       | cansada      | 2025-02-01 10:00:02
step_view      | step2       | null         | 2025-02-01 10:00:03
... (mais eventos)
quiz_completed | diagnosis   | null         | 2025-02-01 10:05:00
```

#### Tabela: quiz_checkouts
```sql
SELECT * FROM quiz_checkouts
WHERE email = 'teste@example.com'
ORDER BY created_at DESC
LIMIT 1;
```

**Esperado:**
```
✅ session_id: (mesmo session_id de quiz_sessions)
✅ plan_selected: 4semanas
✅ checkout_location: offer_section
✅ email: teste@example.com
```

---

## 🔍 Troubleshooting

### ❌ Problema: Consent banner não aparece
**Solução:**
- Verifique se `<div id="consent-banner">` existe em index.html
- Verifique console para erros de JavaScript
- Limpe localStorage: `localStorage.clear()`

### ❌ Problema: Nenhum evento está sendo salvo no Supabase
**Solução:**
1. Verifique se consent foi aceito (você viu "Consent accepted" no console?)
2. Verifique a aba Network (F12 → Network) para ver se as requisições POST estão sendo feitas
3. Verifique se recebe erro 401 (problema de autenticação - checar anon key)
4. Verifique RLS policies no Supabase (devem permitir INSERT anônimo)

```sql
-- No Supabase SQL Editor, execute:
SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'quiz_events';
```

Deve mostrar policies que permitem INSERT.

### ❌ Problema: Email não está sendo capturado
**Solução:**
- Verifique se input tem `id="email"` em index.html
- Verifique se botão tem `id="emailSubmitBtn"` em index.html
- Verifique se função `validateEmail()` existe em script.js

### ❌ Problema: UTM parameters não aparecem em quiz_sessions
**Solução:**
- Verifique se URL tem os parâmetros: `?utm_source=...&utm_medium=...&utm_campaign=...`
- Verifique console para ver se capturou: `[Analytics] captureUTMParams`
- A função `captureUTMParams()` faz: `new URLSearchParams(window.location.search)`

---

## 📊 Queries SQL para Análises Rápidas

Após confirmar que os dados estão sendo salvos, você pode rodar estas queries:

### 1. Respostas Mais Comuns
```sql
SELECT
  step_id,
  answer_value,
  answer_text,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY step_id), 2) as porcentagem
FROM quiz_events
WHERE event_type = 'answer_selected'
GROUP BY step_id, answer_value, answer_text
ORDER BY step_id, total DESC;
```

### 2. Funil de Drop-off
```sql
WITH step_data AS (
  SELECT
    step_number,
    step_id,
    COUNT(DISTINCT session_id) as usuarios
  FROM quiz_events
  WHERE event_type = 'step_view'
  GROUP BY step_number, step_id
)
SELECT
  step_number,
  step_id,
  usuarios,
  LAG(usuarios) OVER (ORDER BY step_number) as usuarios_anterior,
  ROUND(100.0 * (LAG(usuarios) OVER (ORDER BY step_number) - usuarios) / NULLIF(LAG(usuarios) OVER (ORDER BY step_number), 0), 2) as taxa_drop_off_pct
FROM step_data
ORDER BY step_number;
```

### 3. Tempo Médio por Step
```sql
SELECT
  step_id,
  COUNT(*) as views,
  ROUND(AVG(time_on_step_seconds), 1) as tempo_medio_segundos,
  MAX(time_on_step_seconds) as tempo_maximo,
  MIN(time_on_step_seconds) as tempo_minimo
FROM quiz_events
WHERE event_type = 'step_view'
GROUP BY step_id
ORDER BY tempo_medio_segundos DESC;
```

---

## ✨ Indicadores de Sucesso

Você sabe que tudo está funcionando quando:

✅ **Fase 1:** Todos os eventos aparecem no console (session_start, step_view, answer_selected, etc)

✅ **Fase 2:** Dados aparecem em quiz_sessions com email, UTM, device_info, status=completed

✅ **Fase 3:** Dados aparecem em quiz_events com 15-20+ eventos por sessão

✅ **Fase 4:** Dados aparecem em quiz_checkouts com plan_selected correto

✅ **Fase 5:** Email é capturado e salvo em quiz_sessions.email

✅ **Fase 6:** Finalmente, simular compra via Stripe (se quiser testar linking completo)

---

## 🚀 Próximos Passos (Fora do Escopo)

1. **Dashboard Visual**: Criar página HTML com Chart.js mostrando gráficos das métricas
2. **Alertas**: Configurar notificações (Slack, Email) quando conversão > X%
3. **Relatórios Automáticos**: Cron job que envia relatório semanal por email
4. **Pixel Tracking**: Facebook Pixel + Google Ads para remarketing
5. **A/B Testing**: Testar variações de perguntas e medir impacto

---

## 📝 Dúvidas Comuns

**P: Por quanto tempo os dados ficarão no Supabase?**
R: Indefinidamente, a menos que você configure uma política de retenção. Supabase oferece 500MB grátis.

**P: Posso deletar eventos de teste?**
R: Sim, via SQL:
```sql
DELETE FROM quiz_events WHERE session_id = 'session_id_aqui';
DELETE FROM quiz_sessions WHERE session_id = 'session_id_aqui';
```

**P: Como saber se um visitante é real ou bot?**
R: Verifique `user_agent` e `time_spent_seconds`. Bots geralmente são rápidos demais (< 10 segundos).

**P: Os dados incluem informações pessoais?**
R: Apenas email (com consentimento) e device/browser info. Nenhuma cookie de identificação pessoal.

---

## ✅ Checklist Final

- [ ] Consent banner aparece na primeira visita
- [ ] Eventos aparecem em tempo real no console
- [ ] Dados salvos em quiz_sessions com email + UTM
- [ ] Dados salvos em quiz_events com todos os eventos
- [ ] Dados salvos em quiz_checkouts com plan selecionado
- [ ] queries SQL funcionam e retornam dados
- [ ] Taxa de abandono calculada corretamente
- [ ] Respostas mais comuns identificadas
- [ ] Email capturado e vinculado à sessão
- [ ] Teste compra via Stripe (opcional)

---

**Tudo pronto! Você tem um sistema de metrics completo e pronto para produção! 🎉**
