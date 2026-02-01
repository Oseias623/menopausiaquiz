# Guia de Integração - Sistema de Métricas

Este guia mostra **exatamente onde** adicionar as linhas de tracking em cada arquivo.

---

## ✅ Fase 1: SQL Migrations (Supabase)

**Status:** Aguardando execução do usuário

**Arquivo:** `supabase_migrations.sql`

**Como executar:**
1. Abra o [Supabase Dashboard](https://app.supabase.com/project/pmscpydblddkwbgkzdmw)
2. Vá em **SQL Editor** → **New Query**
3. Cole todo o conteúdo de `supabase_migrations.sql`
4. Clique em **Run**

**Resultado esperado:** 4 tabelas criadas (quiz_sessions, quiz_events, quiz_checkouts, ALTER purchases)

---

## ✅ Fase 2: Adicionar AnalyticsTracker em script.js

**Arquivo:** `script.js`

### Passo 1: Adicionar referência ao AnalyticsTracker (Linha 1)

**Antes de `document.addEventListener('DOMContentLoaded', () => {` adicione:**

```javascript
// ===================================
// ANALYTICS TRACKER
// ===================================
// AnalyticsTracker object is defined in analytics-tracker.js
// It provides session management and event tracking
```

### Passo 2: Inicializar tracking em `initQuiz()` (Linha ~90)

**Dentro de `initQuiz()`, LOGO APÓS as primeiras atribuições de event listeners, adicione:**

```javascript
// === ANALYTICS ===
AnalyticsTracker.setupConsentBanner();
// AnalyticsTracker.initSession() será chamado após consent ser aceito
// ou automaticamente se consentimento foi previamente salvo
```

**Localização exata:** Após a linha que diz `document.querySelectorAll('.option-card, .option-card-large').forEach(btn => {`

---

## ✅ Fase 3: Adicionar Tracking em Event Handlers

### 3.1 - Em `handleOptionClick()` (Linha ~193)

**Dentro da função, LOGO APÓS `const stepId = parentStep.id;` adicione:**

```javascript
// TRACK ANSWER SELECTION
AnalyticsTracker.trackEvent('answer_selected', {
    step_id: stepId,
    step_number: parseInt(parentStep.dataset.step) || 0,
    answer_value: value,
    answer_text: btn.textContent.trim(),
    block_type: block || null
});
```

### 3.2 - Em `handleCheckboxChange()` (Linha ~233)

**Esta função não precisa de rastreamento adicional, pois o rastreamento acontece em `handleContinueClick()`**

### 3.3 - Em `handleContinueClick()` (Linha ~251)

**LOGO APÓS `const parentStep = btn.closest('.quiz-step');` adicione:**

```javascript
// TRACK MULTI-SELECT ANSWERS (para steps com checkboxes)
if (parentStep.id === 'step7' || parentStep.id === 'step9' || parentStep.id === 'step_physical') {
    const checked = parentStep.querySelectorAll('input[type="checkbox"]:checked');
    const selectedValues = Array.from(checked).map(input => ({
        value: input.value,
        text: input.closest('label')?.textContent?.trim() || input.value,
        block: input.dataset.block || input.dataset.problem || null
    }));

    AnalyticsTracker.trackEvent('multi_answer_selected', {
        step_id: parentStep.id,
        step_number: parseInt(parentStep.dataset.step) || 0,
        multi_answers: selectedValues
    });
}
```

### 3.4 - Em `handleBackClick()` (Linha ~187)

**LOGO APÓS `const prevStepId = quizState.history.pop();` adicione:**

```javascript
// TRACK BACK NAVIGATION
AnalyticsTracker.trackEvent('back_button_clicked', {
    step_id: quizState.currentStepId,
    navigation_direction: 'back',
    metadata: {
        from_step: quizState.currentStepId,
        to_step: prevStepId
    }
});
```

### 3.5 - Em `navigateTo()` (Linha ~307)

**LOGO APÓS `next.classList.add('active');` e `quizState.currentStepId = stepId;` adicione:**

```javascript
// TRACK STEP VIEW AND RESET TIMER
AnalyticsTracker.trackEvent('step_view', {
    step_id: stepId,
    step_number: stepNum
});
AnalyticsTracker.resetStepTimer();
```

### 3.6 - Em `generateDiagnosis()` (Linha ~540)

**LOGO ANTES de `navigateTo('diagnosis');` (ou ao final da função) adicione:**

```javascript
// TRACK QUIZ COMPLETION
AnalyticsTracker.trackEvent('quiz_completed', {
    step_id: 'diagnosis',
    metadata: {
        score_circadiano: scores.circadiano,
        score_inflamacion: scores.inflamacion,
        score_estructura: scores.estructura,
        dominant_profile: winner
    }
});

// UPDATE SESSION WITH FINAL SCORES
AnalyticsTracker.updateSessionStatus('completed', {
    completed_at: new Date().toISOString(),
    score_circadiano: scores.circadiano,
    score_inflamacion: scores.inflamacion,
    score_estructura: scores.estructura,
    dominant_profile: winner,
    time_spent_seconds: Math.floor((Date.now() - AnalyticsTracker.sessionStartTime) / 1000)
});
```

### 3.7 - Email Submit Handler (Novo - adicionar em `initQuiz()`)

**Ainda em `initQuiz()`, LOGO APÓS os event listeners do FAQ, adicione:**

```javascript
// Email Submit - Track Email Capture
const emailSubmitBtn = document.getElementById('emailSubmitBtn');
if (emailSubmitBtn) {
    emailSubmitBtn.addEventListener('click', async function (e) {
        const emailInput = document.getElementById('email');
        const email = emailInput ? emailInput.value.trim() : null;

        if (email) {
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(email)) {
                // Track email capture
                await AnalyticsTracker.trackEmailCapture(email);

                // Proceed to next step
                const nextId = emailSubmitBtn.dataset.next;
                if (nextId) {
                    navigateTo(nextId);
                }
            } else {
                alert('Por favor, insira um email válido');
                e.preventDefault();
            }
        }
    });
}
```

### 3.8 - Checkout Button Handler Modification (Linha ~156)

**DENTRO do `document.querySelectorAll('.offer-cta-btn').forEach(btn => {` ANTES de `window.location.href = url;` adicione:**

```javascript
// TRACK CHECKOUT CLICK
AnalyticsTracker.trackCheckout(selectedPlan, 'offer_section');
```

**Resultado final (a função ficará assim):**

```javascript
document.querySelectorAll('.offer-cta-btn').forEach(btn => {
    btn.addEventListener('click', async function () {
        // Find the nearest plans-vertical or use the first one
        const section = this.closest('.offer-section');
        let selectedPlan = null;

        if (section) {
            const checked = section.querySelector('.plan-radio:checked');
            if (checked) selectedPlan = checked.value;
        }

        // Fallback: check all plan selectors
        if (!selectedPlan) {
            const allChecked = document.querySelector('.plan-radio:checked');
            if (allChecked) selectedPlan = allChecked.value;
        }

        // Default to 4semanas
        if (!selectedPlan) selectedPlan = '4semanas';

        // TRACK CHECKOUT CLICK
        await AnalyticsTracker.trackCheckout(selectedPlan, 'offer_section');

        const url = checkoutUrls[selectedPlan] || '#checkout-4semanas';
        // Small delay to ensure analytics are sent
        setTimeout(() => {
            window.location.href = url;
        }, 100);
    });
});
```

---

## ✅ Fase 4: Adicionar Consent Banner

### 4.1 - Em `index.html` (Linha ~54)

**LOGO APÓS `<div id="intro" class="quiz-step active">` e ANTES de `<div class="intro-container">` adicione:**

```html
<!-- CONSENT BANNER -->
<div id="consent-banner" class="consent-banner">
    <p>🍪 Usamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa coleta de dados anônimos para melhorar o quiz.</p>
    <button id="accept-consent">Aceitar e continuar</button>
</div>
```

### 4.2 - Em `index.html` (Adicionar antes de `</head>`)

**ANTES de `</head>` adicione:**

```html
<!-- Supabase SDK for Analytics -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Analytics Tracker -->
<script src="analytics-tracker.js"></script>
```

### 4.3 - Em `style.css` (Adicionar ao final)

**Ao final do arquivo `style.css` adicione:**

```css
/* ==================== */
/* CONSENT BANNER STYLES */
/* ==================== */

.consent-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(20, 20, 20, 0.95);
    color: #ffffff;
    padding: 20px;
    text-align: center;
    z-index: 9999;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
    font-family: inherit;
}

.consent-banner p {
    margin: 0 0 15px 0;
    font-size: 14px;
    line-height: 1.5;
}

.consent-banner button {
    margin-top: 10px;
    padding: 12px 40px;
    background: #FF6B9D;
    border: none;
    border-radius: 25px;
    color: white;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    transition: background 0.3s ease;
}

.consent-banner button:hover {
    background: #ff5a8e;
}

.consent-banner button:active {
    transform: scale(0.98);
}

@media (max-width: 768px) {
    .consent-banner {
        padding: 15px;
    }

    .consent-banner p {
        font-size: 13px;
    }

    .consent-banner button {
        padding: 10px 30px;
        font-size: 13px;
    }
}
```

---

## ✅ Fase 5: Modificar Webhook para Linking de Compras

**Arquivo:** `menopausia-complete/app/api/hotmart-webhook.js`

### Localizar a seção de "Save Purchase" (Linha ~130)

**LOGO APÓS a linha que salva a compra com sucesso (após `await supabase.from('purchases').insert(...)`):**

**Adicione este código:**

```javascript
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
```

---

## ✅ Fase 6: Teste End-to-End

### Checklist de Validação:

- [ ] **Phase 1:** SQL migrations executadas no Supabase
  - Verificar em **Tables** que as 4 tabelas existem

- [ ] **Phase 2:** `analytics-tracker.js` adicionado ao projeto

- [ ] **Phase 3:** Tracking integrado em todos os event handlers

- [ ] **Phase 4:** Consent banner visível na página inicial

- [ ] **Phase 5:** Webhook modificado (não quebra)

### Teste Manual:

```
1. Abrir quiz em navegador com UTMs:
   http://localhost:3000/index.html?utm_source=facebook&utm_medium=cpc&utm_campaign=teste

2. Aceitar consent banner (deve desaparecer)

3. Completar quiz selecionando diferentes respostas:
   - Clicar em opções (single select)
   - Selecionar múltiplas respostas (checkboxes)
   - Clicar em back button (testar navegação reversa)
   - Completar todos os steps

4. Capturar email no step de email

5. Clicar em checkout

6. Verificar no Supabase:
   ```
   SELECT * FROM quiz_sessions WHERE email = 'seu_email@test.com';
   SELECT * FROM quiz_events WHERE session_id = 'SESSION_ID_AQUI' ORDER BY created_at;
   SELECT * FROM quiz_checkouts WHERE session_id = 'SESSION_ID_AQUI';
   ```

7. Simular compra via Stripe test mode

8. Verificar linking em purchases:
   ```
   SELECT * FROM purchases WHERE email = 'seu_email@test.com';
   -- Deve ter quiz_session_id preenchido
   ```
```

### Console Debug:

**Abrir DevTools (F12) → Console** e você deve ver logs como:

```
[Analytics] New session created: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
[Analytics] Event tracked: step_view
[Analytics] Event tracked: answer_selected
[Analytics] Session updated: ...
```

### Troubleshooting:

**Erro: "Analytics) HTTP Error 401"**
- Verifique se a anon key em `analytics-tracker.js` está correta
- Verifique se RLS policies estão ativas no Supabase

**Nenhum evento sendo salvo:**
- Verifique se consent foi aceito
- Verifique Network tab (F12 → Network) para ver requisições
- Verifique CORS headers

**Email não siendo capturado:**
- Verifique que `#email` input existe
- Verifique que `#emailSubmitBtn` existe

---

## 📊 Queries SQL para Análises

Após testar, você pode rodar estas queries no Supabase SQL Editor:

### Query 1: Respostas mais comuns

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

### Query 2: Funil de drop-off

```sql
WITH step_data AS (
  SELECT
    step_id,
    step_number,
    COUNT(DISTINCT session_id) as usuarios
  FROM quiz_events
  WHERE event_type = 'step_view'
  GROUP BY step_id, step_number
)
SELECT
  step_id,
  usuarios,
  LAG(usuarios) OVER (ORDER BY step_number) as anterior,
  LAG(usuarios) OVER (ORDER BY step_number) - usuarios as abandono
FROM step_data
ORDER BY step_number;
```

### Query 3: Conversão por resposta

```sql
SELECT
  qe.step_id,
  qe.answer_value,
  COUNT(DISTINCT qe.session_id) as total_leads,
  COUNT(DISTINCT p.email) as compradores,
  ROUND(COUNT(DISTINCT p.email) * 100.0 / COUNT(DISTINCT qe.session_id), 2) as taxa_conversao
FROM quiz_events qe
LEFT JOIN quiz_sessions qs ON qe.session_id = qs.session_id
LEFT JOIN purchases p ON qs.session_id = p.quiz_session_id
WHERE qe.event_type = 'answer_selected'
GROUP BY qe.step_id, qe.answer_value
ORDER BY taxa_conversao DESC;
```

---

## 📝 Resumo das Mudanças

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `supabase_migrations.sql` | Novo | SQL para criar tabelas |
| `analytics-tracker.js` | Novo | Objeto AnalyticsTracker |
| `index.html` | Modificado | + SDK Supabase + Consent banner |
| `script.js` | Modificado | + Tracking calls em 8 lugares |
| `style.css` | Modificado | + Estilos do consent banner |
| `menopausia-complete/app/api/hotmart-webhook.js` | Modificado | + Linking de compras |

---

## ✅ Próximas Etapas

1. Execute `supabase_migrations.sql` no Supabase
2. Adicione `analytics-tracker.js` ao seu projeto
3. Modifique `script.js` conforme as 8 seções acima
4. Modifique `index.html` (SDK + banner)
5. Modifique `style.css` (estilos)
6. Modifique webhook
7. Teste end-to-end
8. Execute as queries SQL para validar dados
