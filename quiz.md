# 🧩 Antigravity Quiz Template

Este é o esqueleto (skeleton) oficial do seu sistema de Quiz de Alta Conversão. Este modelo foi otimizado para **Menopausa con Claridad**, mas sua estrutura modular permite replicá-lo para qualquer nicho apenas alterando os textos (copy) e imagens.

## 📂 Estrutura do Projeto
Para que o sistema funcione corretamente, seu projeto deve ter:
- `index.html`: Estrutura de passos (quiz-steps) e telas de transição.
- `style.css`: Design System (Verde Esmeralda & Gold) e componentes premium.
- `script.js`: Motor de navegação, lógica de pontuação e animações.

---

## 🚀 Como Replicar este Quiz

### 1. Sistema de "Passos" (Steps)
Cada tela do quiz é uma `div` com a classe `.quiz-step`.
Para adicionar uma nova pergunta, basta criar um novo bloco:
```html
<div class="quiz-step" id="seu_id_aqui" data-step="NUMERO_DO_PASSO">
    <div class="step-content">
        <h1 class="question-title">Sua Pergunta Aqui?</h1>
        <div class="options-list">
            <button class="option-card" data-value="SCORE_VAL" data-next="PROXIMO_ID">
                Texto da Opção
            </button>
        </div>
    </div>
</div>
```

### 2. Motor de Navegação (JS)
O `script.js` gerencia as transições automaticamente usando o atributo `data-next`. Ele também cuida da barra de progresso e do salvamento automático no `localStorage`.

### 3. Design System (CSS)
O arquivo `style.css` utiliza variáveis root (`:root`) para cores. Para mudar a identidade visual, altere apenas os valores no topo do arquivo CSS.

---

## 🛠️ Código Fonte Base (Skeleton)

### [Template Index.html]
*(O código completo do index.html deste projeto serve como base estrutural)*

### [Template Script.js]
O motor de navegação principal:
```javascript
function navigateTo(stepId) {
    // 1. Oculta todos os passos
    document.querySelectorAll('.quiz-step').forEach(step => step.classList.remove('active'));
    
    // 2. Mostra o passo atual
    const nextStep = document.getElementById(stepId);
    if (nextStep) {
        nextStep.classList.add('active');
        quizState.currentStepId = stepId;
        // 3. Atualiza barra de progresso
        updateProgressBar();
    }
}
```

---

## 📈 Melhores Práticas de Conversão
1. **Doses de Micro-Vitória**: Use as telas de "Feedback" após perguntas-chave (Age, Sleep) para validar a usuária.
2. **Autoridade na Transição**: A tela de "Validation" (Loader) é essencial para gerar valor antes da oferta.
3. **Oferta Gold**: O cabeçalho verde/dourado (`.offer-mode`) deve ser ativado apenas na tela final de checkout.

---
*Gerado automaticamente pelo Agente Antigravity para uso em múltiplos projetos.*
