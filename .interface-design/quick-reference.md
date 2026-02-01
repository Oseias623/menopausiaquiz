# Interface Design Quick Reference
**Project**: Menopausia con Claridad Quiz

---

## 🎨 Quick Access Tokens

### Colors

```css
/* Primary Actions */
var(--primary-coral)        /* #FF6B6B - Buttons, CTAs */
var(--primary-coral-light)  /* #FF8E8E - Hover states */
var(--primary-coral-dark)   /* #E85555 - Active states */

/* Backgrounds */
var(--secondary-peach)      /* #FFE5E5 - Soft highlights */
var(--secondary-cream)      /* #FFF9F5 - Alternative bg */

/* Accents */
var(--accent-teal)          /* #4ECDC4 - Progress, success */
var(--accent-purple)        /* #9B6B9E - Tertiary (rare) */

/* Text */
var(--neutral-dark)         /* #2D3436 - Primary text */
var(--neutral-medium)       /* #636E72 - Secondary text */
var(--neutral-light)        /* #DFE6E9 - Borders */
```

### Spacing

```css
var(--spacing-xs)   /* 8px  - Tight */
var(--spacing-sm)   /* 16px - Default */
var(--spacing-md)   /* 24px - Sections */
var(--spacing-lg)   /* 40px - Large */
var(--spacing-xl)   /* 64px - Major */
```

### Typography

```css
var(--font-display)  /* Playfair Display - Titles */
var(--font-body)     /* Outfit - Body text */
```

### Animations

```css
var(--transition-smooth)  /* 0.4s ease-out - Default */
var(--transition-bounce)  /* 0.6s elastic - Playful */
```

---

## 📦 Component Recipes

### Basic Button

```css
.my-button {
    background: linear-gradient(135deg, var(--primary-coral) 0%, var(--primary-coral-light) 100%);
    color: white;
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: 16px;
    border: none;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition-smooth);
}

.my-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 107, 107, 0.3);
}

.my-button:active {
    transform: translateY(0) scale(0.98);
}
```

### Card with Glassmorphism

```css
.my-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: var(--spacing-xl) var(--spacing-lg);
    box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.08),
        0 0 0 1px rgba(255, 255, 255, 0.5);
}
```

### Option Card (Clickable)

```css
.option-card {
    background: white;
    border: 2px solid var(--neutral-light);
    border-radius: 16px;
    padding: var(--spacing-md) var(--spacing-lg);
    cursor: pointer;
    transition: var(--transition-smooth);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.option-card:hover {
    border-color: var(--primary-coral);
    transform: translateX(8px);
    box-shadow: 0 8px 24px rgba(255, 107, 107, 0.2);
}
```

### Insight Box

```css
.insight-box {
    background: linear-gradient(135deg, #FFF9F5 0%, #FFE5E5 100%);
    border-left: 4px solid var(--primary-coral);
    border-radius: 12px;
    padding: var(--spacing-lg);
    font-style: italic;
}
```

### Checkbox Card

```css
.checkbox-card {
    background: white;
    border: 2px solid var(--neutral-light);
    border-radius: 16px;
    padding: var(--spacing-md) var(--spacing-lg);
    cursor: pointer;
    transition: var(--transition-smooth);
}

.checkbox-card input:checked ~ .checkbox-content {
    border-color: var(--primary-coral);
    background: rgba(255, 107, 107, 0.05);
}
```

---

## 🎬 Animation Patterns

### Fade In

```css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.element {
    opacity: 0;
    animation: fadeIn 0.6s forwards;
}
```

### Slide In from Right

```css
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.element {
    opacity: 0;
    animation: slideInRight 0.5s forwards;
}
```

### Staggered Animation

```css
.item:nth-child(1) { animation-delay: 0.5s; }
.item:nth-child(2) { animation-delay: 0.6s; }
.item:nth-child(3) { animation-delay: 0.7s; }
.item:nth-child(4) { animation-delay: 0.8s; }
```

### Hover Lift

```css
.card {
    transition: var(--transition-smooth);
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(255, 107, 107, 0.15);
}
```

---

## 📱 Responsive Patterns

### Mobile Breakpoint

```css
@media (max-width: 640px) {
    .question-title {
        font-size: 2rem; /* Down from 2.5rem */
    }
    
    .body-type-grid {
        grid-template-columns: 1fr; /* Single column */
    }
    
    .step-content {
        padding: var(--spacing-md); /* Reduced padding */
    }
}
```

### Container Max-Width

```css
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
}
```

---

## 🎯 Common Patterns

### Title + Subtitle

```html
<div class="step-number">Paso 1 de 8</div>
<h1 class="question-title">Your Question Here</h1>
<p class="question-subtitle">Supporting text here</p>
```

```css
.step-number {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--primary-coral);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: var(--spacing-md);
}

.question-title {
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--neutral-dark);
    margin-bottom: var(--spacing-sm);
    line-height: 1.2;
}

.question-subtitle {
    font-size: 1.125rem;
    color: var(--neutral-medium);
    margin-bottom: var(--spacing-lg);
}
```

### Icon + Text Layout

```html
<div class="option-content">
    <span class="option-emoji">🎈</span>
    <div class="option-text-wrapper">
        <span class="option-text">Primary Text</span>
        <span class="option-subtext">Secondary text</span>
    </div>
</div>
```

```css
.option-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.option-emoji {
    font-size: 2.5rem;
    transition: var(--transition-bounce);
}

.option-emoji:hover {
    transform: scale(1.2) rotate(5deg);
}
```

---

## 🚀 JavaScript Helpers

### Navigate to Step

```javascript
function navigateToStep(stepId) {
    const currentActive = document.querySelector('.quiz-step.active');
    const nextStep = document.getElementById(stepId);
    
    currentActive.classList.add('exit');
    
    setTimeout(() => {
        currentActive.classList.remove('active', 'exit');
        nextStep.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
}
```

### Update Progress Bar

```javascript
function updateProgress(step) {
    const progressBar = document.getElementById('progressBar');
    const percentage = (step / totalSteps) * 100;
    progressBar.style.width = `${percentage}%`;
}
```

### Enable/Disable Button

```javascript
function updateButtonState(buttonId, isEnabled) {
    const button = document.getElementById(buttonId);
    button.disabled = !isEnabled;
}
```

---

## ✅ Design Checklist

When adding a new component, ensure:

- [ ] Uses CSS custom properties for colors
- [ ] Uses spacing variables (`--spacing-*`)
- [ ] Has hover state with lift or slide effect
- [ ] Has active state with scale down
- [ ] Uses proper border-radius (12px, 16px, 20px, or 24px)
- [ ] Includes smooth transition (`var(--transition-smooth)`)
- [ ] Has staggered animation if part of a list
- [ ] Works on mobile (< 640px)
- [ ] Has proper focus state for accessibility
- [ ] Uses semantic HTML

---

## 🎨 Color Usage Guide

| Element | Color | Usage |
|---------|-------|-------|
| Primary CTA | `--primary-coral` | Main action buttons |
| Hover CTA | `--primary-coral-light` | Button hover gradient |
| Active CTA | `--primary-coral-dark` | Button active state |
| Borders | `--neutral-light` | Default card borders |
| Active Border | `--primary-coral` | Selected/hover borders |
| Primary Text | `--neutral-dark` | Headings, important text |
| Secondary Text | `--neutral-medium` | Subtitles, labels |
| Background | `--secondary-cream` | Page background |
| Card Background | `white` or `rgba(255,255,255,0.9)` | Cards, containers |
| Progress Bar | `--primary-coral` → `--accent-teal` | Gradient fill |

---

## 🔧 Common Modifications

### Change Primary Color

```css
:root {
    --primary-coral: #YOUR_COLOR;
    --primary-coral-light: #LIGHTER_VARIANT;
    --primary-coral-dark: #DARKER_VARIANT;
}
```

### Adjust Animation Speed

```css
:root {
    --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Faster */
}
```

### Increase Spacing

```css
:root {
    --spacing-lg: 3rem; /* Up from 2.5rem */
}
```

### Change Font

```css
:root {
    --font-display: 'Your Display Font', serif;
    --font-body: 'Your Body Font', sans-serif;
}
```

---

## 📚 Resources

- **Full System**: `.interface-design/system.md`
- **Audit Report**: `.interface-design/audit-report.md`
- **Live Code**: `style.css`, `script.js`, `index.html`

---

**Quick Tip**: When in doubt, copy an existing component and modify it. The patterns are consistent throughout the codebase!

**Last Updated**: January 23, 2026
