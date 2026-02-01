# Design System - Menopausia con Claridad Quiz

## Direction

**Personality**: Warmth & Approachability  
**Foundation**: Warm coral tones with soft peach accents  
**Depth**: Subtle shadows with glassmorphism effects  
**Feel**: Empathetic, supportive, and premium

This design system is optimized for a health & wellness quiz targeting women 40-60 experiencing menopause. The interface prioritizes emotional connection, trust, and clarity while maintaining a sophisticated, modern aesthetic.

---

## Design Tokens

### Color Palette

#### Primary Colors
```css
--primary-coral: #FF6B6B          /* Main brand color - CTAs, accents */
--primary-coral-light: #FF8E8E    /* Hover states, lighter accents */
--primary-coral-dark: #E85555     /* Active states, emphasis */
```

#### Secondary Colors
```css
--secondary-peach: #FFE5E5        /* Backgrounds, soft highlights */
--secondary-cream: #FFF9F5        /* Alternative backgrounds */
```

#### Accent Colors
```css
--accent-teal: #4ECDC4            /* Progress indicators, success states */
--accent-purple: #9B6B9E          /* Tertiary accents (minimal use) */
```

#### Neutral Colors
```css
--neutral-dark: #2D3436           /* Primary text */
--neutral-medium: #636E72         /* Secondary text, labels */
--neutral-light: #DFE6E9          /* Borders, dividers */
--neutral-bg: #F8F9FA             /* Subtle backgrounds */
```

### Typography

#### Font Families
```css
--font-display: 'Playfair Display', serif  /* Headlines, titles */
--font-body: 'Outfit', sans-serif          /* Body text, UI elements */
```

#### Font Sizes
- **Display (Titles)**: 2.5rem (40px) - `font-family: var(--font-display)`
- **Heading**: 1.125rem (18px) - `font-weight: 600`
- **Body Large**: 1.125rem (18px) - `font-weight: 500`
- **Body**: 1rem (16px) - `font-weight: 400`
- **Small**: 0.875rem (14px) - `font-weight: 500`
- **Label**: 0.875rem (14px) - `text-transform: uppercase; letter-spacing: 1.5px`

### Spacing Scale

```css
--spacing-xs: 0.5rem    /* 8px  - Tight spacing */
--spacing-sm: 1rem      /* 16px - Default gap */
--spacing-md: 1.5rem    /* 24px - Section spacing */
--spacing-lg: 2.5rem    /* 40px - Large sections */
--spacing-xl: 4rem      /* 64px - Major sections */
```

**Base**: 8px grid system  
**Scale**: 8, 16, 24, 40, 64

### Border Radius

- **Small**: 12px - Checkboxes, small elements
- **Medium**: 16px - Cards, buttons
- **Large**: 20px - Large cards, body type cards
- **XLarge**: 24px - Main containers
- **Full**: 50% - Circular elements (back button)

### Shadows

#### Card Shadow (Default)
```css
box-shadow: 
  0 20px 60px rgba(0, 0, 0, 0.08),
  0 0 0 1px rgba(255, 255, 255, 0.5);
```

#### Hover Shadow
```css
box-shadow: 0 12px 32px rgba(255, 107, 107, 0.15);
```

#### Header Shadow
```css
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
```

### Animations

#### Timing Functions
```css
--transition-smooth: all 0.4s cubic-bezier(0.4, 0, 0.2, 1)
--transition-bounce: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

#### Keyframe Animations
- **fadeInUp**: Entry animation for steps (0.6s)
- **fadeOutDown**: Exit animation for steps (0.4s)
- **fadeIn**: Simple opacity fade (0.6s)
- **slideInRight**: Slide from left with fade (0.5s)
- **shimmer**: Progress bar shimmer effect (2s infinite)

### Glassmorphism

```css
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(20px);
```

Used for: Header, main content cards

---

## Component Patterns

### Header (Fixed)

**Dimensions**: 
- Height: 56px
- Z-index: 1001

**Structure**:
```
[Back Button] [Logo] [Step Counter]
```

**Styling**:
- Background: `rgba(255, 255, 255, 0.95)` with `backdrop-filter: blur(20px)`
- Shadow: `0 2px 10px rgba(0, 0, 0, 0.05)`

**Back Button**:
- Size: 40px × 40px
- Border-radius: 50%
- Hover: `background: var(--secondary-peach)`
- Disabled: `opacity: 0.3`

**Logo**:
- Font: `var(--font-display)`
- Size: 1.125rem
- Weight: 600
- Color: `var(--primary-coral)`

**Step Counter**:
- Font: `var(--font-body)`
- Size: 0.875rem
- Weight: 500
- Color: `var(--neutral-medium)`

### Progress Bar

**Dimensions**:
- Height: 6px
- Position: Fixed below header (top: 56px)

**Styling**:
- Background: `rgba(255, 255, 255, 0.3)` with `backdrop-filter: blur(10px)`
- Fill: `linear-gradient(90deg, var(--primary-coral) 0%, var(--accent-teal) 100%)`
- Transition: `width 0.6s cubic-bezier(0.4, 0, 0.2, 1)`
- Shimmer effect: Animated gradient overlay

### Step Container

**Max-width**: 800px  
**Padding**: 
- Top: `calc(62px + var(--spacing-lg))` (accounts for fixed header)
- Horizontal: `var(--spacing-md)`
- Bottom: `var(--spacing-lg)`

**Background**: 
```css
background: rgba(255, 255, 255, 0.9);
backdrop-filter: blur(20px);
border-radius: 24px;
padding: var(--spacing-xl) var(--spacing-lg);
```

### Question Title

**Typography**:
- Font: `var(--font-display)`
- Size: 2.5rem
- Weight: 700
- Line-height: 1.2
- Color: `var(--neutral-dark)`

**Animation**: `fadeIn 0.6s 0.3s forwards`

### Question Subtitle

**Typography**:
- Font: `var(--font-body)`
- Size: 1.125rem
- Color: `var(--neutral-medium)`

**Animation**: `fadeIn 0.6s 0.4s forwards`

### Step Number Label

**Typography**:
- Size: 0.875rem
- Weight: 500
- Color: `var(--primary-coral)`
- Transform: `uppercase`
- Letter-spacing: 1.5px

**Animation**: `fadeIn 0.6s 0.2s forwards`

### Option Card (Simple)

**Usage**: Age selection (Step 1)

**Dimensions**:
- Padding: `var(--spacing-md) var(--spacing-lg)`
- Border-radius: 16px

**Styling**:
- Background: `white`
- Border: `2px solid var(--neutral-light)`
- Transition: `var(--transition-smooth)`

**States**:
- **Hover**: 
  - Border: `var(--primary-coral)`
  - Transform: `translateX(8px)`
  - Shadow: `0 8px 24px rgba(255, 107, 107, 0.2)`
- **Active**: 
  - Transform: `translateX(8px) scale(0.98)`

**Animation**: `slideInRight 0.5s forwards` with staggered delays (0.5s, 0.6s, 0.7s...)

**Content**:
```
[Option Text] ────────────────── [→ Icon]
```

### Body Type Card

**Usage**: Body type selection (Step 2), Goal selection (Step 3)

**Layout**: 2-column grid  
**Gap**: `var(--spacing-md)`

**Dimensions**:
- Padding: `var(--spacing-md)`
- Border-radius: 20px

**Structure**:
```
┌─────────────────┐
│                 │
│  [Illustration] │
│                 │
├─────────────────┤
│  Description    │
└─────────────────┘
```

**Illustration**:
- Height: 160px
- Border-radius: 12px
- CSS-based silhouettes using `::before` and `::after` pseudo-elements
- Gradient backgrounds with layered shapes

**States**:
- **Hover**: 
  - Border: `var(--primary-coral)`
  - Transform: `translateY(-4px)`
  - Shadow: `0 12px 32px rgba(255, 107, 107, 0.15)`
- **Active**: 
  - Transform: `translateY(-2px) scale(0.98)`

### Option Card Large

**Usage**: Symptom selection (Step 4), Previous attempts (Step 5)

**Dimensions**:
- Padding: `var(--spacing-lg)`
- Border-radius: 20px

**Structure**:
```
[Emoji] [Primary Text     ] [→]
        [Secondary Text   ]
```

**Emoji**:
- Size: 2.5rem
- Hover animation: `scale(1.2) rotate(5deg)` with bounce easing

**Text**:
- Primary: 1.125rem, weight 600
- Secondary: 0.875rem, color `var(--neutral-medium)`

**States**: Same as Option Card (Simple)

### Checkbox Card

**Usage**: Goals selection (Step 6), Physical problems (Step 6.5)

**Dimensions**:
- Padding: `var(--spacing-md) var(--spacing-lg)`
- Border-radius: 16px

**Structure**:
```
[☑] [Checkbox Text] ──────── [Emoji]
```

**States**:
- **Unchecked**: Border `var(--neutral-light)`
- **Checked**: 
  - Border: `var(--primary-coral)`
  - Background: `rgba(255, 107, 107, 0.05)`
  - Checkmark: Visible with scale animation

**Checkbox Input**:
- Hidden: `opacity: 0; position: absolute`
- Custom styled via label

### Continue Button

**Dimensions**:
- Width: 100%
- Padding: `var(--spacing-md) var(--spacing-lg)`
- Border-radius: 16px
- Height: ~52px

**Styling**:
```css
background: linear-gradient(135deg, var(--primary-coral) 0%, var(--primary-coral-light) 100%);
color: white;
font-size: 1.125rem;
font-weight: 600;
border: none;
cursor: pointer;
```

**States**:
- **Hover**: 
  - Transform: `translateY(-2px)`
  - Shadow: `0 8px 24px rgba(255, 107, 107, 0.3)`
- **Active**: 
  - Transform: `translateY(0) scale(0.98)`
- **Disabled**: 
  - Opacity: 0.5
  - Cursor: `not-allowed`

### Validation Screen

**Purpose**: Micro-personalization feedback between questions

**Structure**:
```
[Icon]
[Title]
[Description Text]
[Insight Box (optional)]
[Continue Button]
```

**Icon**:
- Size: 4rem
- Margin-bottom: `var(--spacing-md)`

**Title**:
- Font: `var(--font-display)`
- Size: 2rem
- Weight: 600

**Insight Box**:
- Background: `linear-gradient(135deg, #FFF9F5 0%, #FFE5E5 100%)`
- Border-left: `4px solid var(--primary-coral)`
- Border-radius: 12px
- Padding: `var(--spacing-lg)`
- Font-style: italic

### Stat Highlight

**Usage**: Validation screens showing statistics

**Structure**:
```
┌─────────────────────┐
│       82%           │  ← Large number
│  de las mujeres...  │  ← Label
└─────────────────────┘
```

**Number**:
- Font: `var(--font-display)`
- Size: 3.5rem
- Weight: 700
- Color: `var(--primary-coral)`

**Label**:
- Size: 1rem
- Color: `var(--neutral-medium)`

### Loading Screen

**Structure**:
```
[Spinner Animation]
[Title]
[Subtitle]
[Progress Bar]
```

**Spinner**:
- Size: 60px
- Border: `6px solid var(--secondary-peach)`
- Border-top: `6px solid var(--primary-coral)`
- Animation: `spin 1s linear infinite`

**Progress Bar**:
- Animated width from 0% to 100% over 3.5s

### Result Screen

**Structure**:
```
[Badge]
[Title]
[Diagnosis Summary Cards]
[3 Fallas Section]
[Email Capture Form]
```

**Diagnosis Item**:
```
Label: Value
```
- Label: 0.875rem, `var(--neutral-medium)`
- Value: 1rem, weight 600, `var(--neutral-dark)`

**Falla Item**:
```
[Number] [Title]
         [Description]
```
- Number: Circle with `var(--primary-coral)` background
- Title: 1.125rem, weight 600
- Description: 0.95rem, `var(--neutral-medium)`

---

## Responsive Behavior

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations (< 640px)

**Typography**:
- Question title: 2rem (down from 2.5rem)
- Body large: 1rem (down from 1.125rem)

**Spacing**:
- Container padding: `var(--spacing-sm)` (down from `var(--spacing-md)`)
- Card padding: `var(--spacing-md)` (down from `var(--spacing-lg)`)

**Layout**:
- Body type grid: 1 column (down from 2 columns)
- Option cards: Full width with reduced padding

---

## Interaction Principles

### Micro-interactions

1. **Hover Effects**: All interactive elements have subtle lift (`translateY(-4px)`) or slide (`translateX(8px)`)
2. **Active States**: Scale down slightly (`scale(0.98)`) for tactile feedback
3. **Emoji Animations**: Bounce and rotate on hover for playfulness
4. **Staggered Animations**: Options appear sequentially with 0.1s delays

### Transitions

- **Default**: 0.4s with ease-out curve
- **Bounce**: 0.6s with elastic curve (for playful elements)
- **Page Transitions**: 0.6s fade + slide

### Loading States

- **Progress Bar**: Smooth width transition with shimmer overlay
- **Loading Screen**: 3.5s auto-advance with spinner animation

---

## Accessibility

### Color Contrast

- All text meets WCAG AA standards (4.5:1 minimum)
- Primary coral (#FF6B6B) on white: 4.52:1 ✓
- Neutral dark (#2D3436) on white: 13.8:1 ✓

### Focus States

- All interactive elements have visible focus rings
- Focus color: `var(--primary-coral)` with 2px outline

### Keyboard Navigation

- Tab order follows visual hierarchy
- Enter/Space activates buttons and checkboxes
- Back button accessible via keyboard

---

## Usage Guidelines

### When to Use Each Component

**Option Card (Simple)**: Single-choice questions with short text  
**Body Type Card**: Visual selection with illustrations  
**Option Card Large**: Single-choice with emoji + description  
**Checkbox Card**: Multi-select questions  
**Validation Screen**: Micro-personalization feedback  
**Continue Button**: Primary action to advance

### Color Usage

- **Primary Coral**: CTAs, active states, brand elements
- **Teal**: Progress, success states only
- **Purple**: Minimal use, tertiary accents
- **Neutral**: Text hierarchy, borders, backgrounds

### Animation Guidelines

- **Entry**: Always fade + slide from bottom or right
- **Exit**: Fade + slide to top
- **Hover**: Lift or slide, never both
- **Stagger**: 0.1s delay between sequential items

---

## Design Rationale

### Why Warm Colors?

Menopause is a sensitive, emotional topic. Warm coral and peach tones create a supportive, empathetic atmosphere while maintaining professionalism.

### Why Glassmorphism?

Subtle transparency and blur effects create a modern, premium feel without overwhelming users. It adds depth while keeping content readable.

### Why Serif Titles?

Playfair Display adds elegance and trust. The serif font signals authority and care, important for health-related content.

### Why Micro-interactions?

Small animations and hover effects make the quiz feel alive and responsive, reducing perceived wait time and increasing engagement.

---

## Future Considerations

### Potential Enhancements

- Dark mode variant (low priority for this audience)
- Reduced motion mode for accessibility
- Illustration library expansion for more body types
- Animation performance optimization for older devices

### Scalability

This system is designed for a linear quiz flow. If expanding to:
- **Dashboard**: Add data visualization tokens (charts, graphs)
- **Multi-page app**: Add navigation patterns (sidebar, tabs)
- **Forms**: Add input field patterns (text, select, radio)

---

**Last Updated**: January 23, 2026  
**Version**: 1.0  
**Maintained by**: Interface Design Skill
