# Brand Design System for Menopausia Con Claridad

This document defines the core design elements, specifically the color palette, used in the `menopausaconclaridad.com` Landing Page. 
Use this guide to ensure consistency across new components and pages.

## 🎨 Color Palette

The project uses a custom set of colors extended in Tailwind.

### Primary Colors (Greens / "Navy")
Although named `navy` in the configuration, these colors render as deep, elegant forest greens, providing a sense of health and stability.

| Name | Tailwind Class | Hex Value | Usage |
| :--- | :--- | :--- | :--- |
| **Deep Green** | `bg-navy-900` / `text-navy-900` | `#143d2c` | Main background for dark sections, primary text headings on light backgrounds. |
| **Medium Green** | `bg-navy-800` / `text-navy-800` | `#1a4d38` | Secondary backgrounds, cards, or softer contrast elements. |
| **Mint White** | `bg-navy-50` / `text-navy-50` | `#f2fcf5` | Very light background tint for "white" sections to reduce harshness. |

### Accent Colors (Gold)
Used for calls-to-action (buttons), highlights, and emphasized text.

| Name | Tailwind Class | Hex Value | Usage |
| :--- | :--- | :--- | :--- |
| **Bright Gold** | `bg-gold-400` / `text-gold-400` | `#fbbf24` | Highlights, icons, or secondary accents. |
| **Classic Gold** | `bg-gold-500` / `text-gold-500` | `#d97706` | **Primary Button Color**, strong calls to action. |
| **Dark Gold** | `bg-gold-600` / `text-gold-600` | `#b45309` | Hover states for buttons, borders. |
| **Metallic Gold** | `bg-gold-metallic` / `text-gold-metallic` | `#d4af37` | Special gradients, badges, or premium UI elements. |

## ✒️ Typography

| Family | Tailwind Class | Font Name |
| :--- | :--- | :--- |
| **Serif** | `font-serif` | Playfair Display |
| **Sans** | `font-sans` | Montserrat |

## 🛠 Usage in Tailwind

You can use these directly in your HTML/JSX:

```jsx
// Example of a primary button
<button className="bg-gold-500 hover:bg-gold-600 text-white font-sans font-bold py-2 px-4 rounded">
  Get Started
</button>

// Example of a heavy section
<section className="bg-navy-900 text-navy-50 font-serif">
  <h2>Our Mission</h2>
</section>
```
