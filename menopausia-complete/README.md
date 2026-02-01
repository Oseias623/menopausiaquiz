# Menopausia Con Claridad - Monorepo

Este repositório unificado contém todos os projetos do ecossistema Menopausia Con Claridad.

## Estrutura de Pastas

*   **`/app`**: Código fonte do Aplicativo Web (PWA).
*   **`/lp`**: Landing Page principal de vendas (`menopausaconclaridad.com`).
*   **`/quiz`**: Quiz interativo de diagnóstico (`quiz.menopausaconclaridad.com`).

## Deploy na Vercel

Para hospedar estes projetos em domínios/subdomínios diferentes usando este mesmo repositório:

1.  Crie 3 projetos separados na Vercel.
2.  Em cada projeto, conecte este repositório do Git.
3.  Nas configurações de **"Root Directory"** de cada projeto:
    *   **Projeto App:** Defina como `app`
    *   **Projeto LP:** Defina como `lp`
    *   **Projeto Quiz:** Defina como `quiz`

Assim, cada deploy atualizará apenas a parte correspondente do site.
