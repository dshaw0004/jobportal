---
name: Job Nova
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8d9e3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fd'
  surface-container: '#ecedf7'
  surface-container-high: '#e6e8f2'
  surface-container-highest: '#e0e2ec'
  on-surface: '#191c23'
  on-surface-variant: '#414754'
  inverse-surface: '#2d3038'
  inverse-on-surface: '#eff0fa'
  outline: '#727785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005bc0'
  primary: '#005bbf'
  on-primary: '#ffffff'
  primary-container: '#1a73e8'
  on-primary-container: '#ffffff'
  inverse-primary: '#adc7ff'
  secondary: '#2b5bb5'
  on-secondary: '#ffffff'
  secondary-container: '#759efd'
  on-secondary-container: '#00337c'
  tertiary: '#9e4300'
  on-tertiary: '#ffffff'
  tertiary-container: '#c55500'
  on-tertiary-container: '#0e0200'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc7ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#b0c6ff'
  on-secondary-fixed: '#001945'
  on-secondary-fixed-variant: '#00429c'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb691'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783100'
  background: '#f9f9ff'
  on-background: '#191c23'
  surface-variant: '#e0e2ec'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system is engineered for a premium professional ecosystem, specifically tailored to the Indian job market. The brand personality is **Trustworthy, Efficient, and Aspirational**. It moves away from the cluttered density of traditional job boards toward a **Modern SaaS** aesthetic—prioritizing clarity, ample white space, and a high-end "editorial" feel for career advancement.

The visual style is **Corporate Modern with a Soft Edge**. It utilizes a clean white foundation, sophisticated professional blues, and subtle depth cues. The interface aims to evoke a sense of calm productivity, making the high-stakes task of job searching feel managed and premium.

## Colors
The palette is anchored by **Nova Blue** (#1A73E8), a vibrant yet professional primary color that signals technology and reliability.

- **Primary:** Used for main actions, active states, and brand identifiers.
- **Secondary:** A deeper navy for contrast in navigation and footers.
- **Semantic:** Success green for "Applied" or "Hired" statuses; Error red for missing fields or expired listings.
- **Neutrals:** An expansive range of Slate Grays. `Neutral-50` and `Neutral-100` are used for background zoning to prevent a "flat" white look.

## Typography
The system uses a paired sans-serif approach to balance character with utility.

**Hanken Grotesk** is used for headlines to provide a sharp, contemporary "tech-startup" edge. Its geometry is precise and modern. **Inter** is used for all body copy and functional UI labels, selected for its world-class legibility in data-heavy environments like job descriptions and candidate dashboards.

Visual hierarchy is maintained through strict weight differentiation: Headlines use `SemiBold (600)` or `Bold (700)`, while body copy stays at `Regular (400)` to ensure long-form reading comfort.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Content is centered within a 1280px max-width container for desktop viewing to maintain focus.

- **Grid:** A 12-column grid is used for desktop, 8-column for tablet, and 4-column for mobile.
- **Rhythm:** An 8px linear scale governs all padding and margins.
- **Zoning:** Use `xl` (40px) spacing between major sections (e.g., Header to Search Bar). Use `md` (16px) for internal card padding to maintain a compact, professional information density.

## Elevation & Depth
Depth is created using **Ambient Shadows** rather than heavy lines. This creates a "layered paper" effect that feels light and modern.

- **Level 0 (Background):** `Neutral-50` (#F9FAFB).
- **Level 1 (Cards/Surface):** White (#FFFFFF) with a soft, 15% opacity blue-tinted shadow (`0px 4px 20px rgba(26, 115, 232, 0.08)`).
- **Level 2 (Hover/Modals):** A more pronounced shadow to indicate interactivity and "lift."

Avoid heavy borders. Use 1px `Neutral-100` strokes only when elements are adjacent on the same elevation level.

## Shapes
The shape language is defined by **Rounded (Option 2)** geometry. Standard containers and cards utilize a **12px - 16px radius**.

This specific curvature is soft enough to feel approachable and high-end, but geometric enough to maintain a professional "SaaS" architectural feel. Small elements like tags and chips should use the `rounded-lg` (16px) or full pill-shape to distinguish them from structural containers.

## Components

### Buttons
- **Primary:** Nova Blue background, White text. 12px border radius. Use a subtle scale-down (0.98) on click.
- **Secondary:** Ghost style with a 1px `Neutral-300` border or light blue tint.
- **Sizing:** Large (56px height) for Hero CTA; Medium (44px) for standard forms.

### Input Fields
- **Search Bar:** The "Job Nova" signature component. Large (64px height on desktop), 16px radius, featuring a subtle `Neutral-100` background that turns White with a Blue stroke on focus.
- **Input Text:** 12px radius, `Neutral-100` fill, 16px internal padding.

### Cards
- **Job Card:** White background, 16px radius, Level 1 shadow. Company logo should be in a 48px rounded square with a `Neutral-50` border.
- **Premium Badge:** A small, high-contrast tag using a gradient of `Secondary` to `Primary` blue to denote sponsored listings.

### Status Chips
- Small, uppercase `label-sm` text.
- Backgrounds should be 10% opacity versions of the status color (e.g., Light green background with dark green text for "Full Time").