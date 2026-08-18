---
name: TumbadosZumba Digital Storefront
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#564336'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#8a7264'
  outline-variant: '#ddc1b0'
  surface-tint: '#964900'
  primary: '#964900'
  on-primary: '#ffffff'
  primary-container: '#f5821f'
  on-primary-container: '#5b2a00'
  inverse-primary: '#ffb786'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#5c5f60'
  on-tertiary: '#ffffff'
  tertiary-container: '#9fa1a3'
  on-tertiary-container: '#35383a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc6'
  primary-fixed-dim: '#ffb786'
  on-primary-fixed: '#311400'
  on-primary-fixed-variant: '#723600'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e1e2e4'
  tertiary-fixed-dim: '#c5c6c8'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1440px
---

## Brand & Style
The design system focuses on a high-utility, retail-centric aesthetic that prioritizes clarity, trust, and ease of navigation. The brand personality is energetic yet organized, leveraging a professional **Corporate/Modern** style.

The visual narrative is driven by generous whitespace and a "container-first" philosophy. Every product, category, and promotional banner lives within a clearly defined, softly shadowed vessel. This approach mirrors the physical retail experience of organized aisles and structured shelving, translated into a premium digital interface. The emotional response should be one of reliability and efficiency, ensuring the user feels empowered to find and purchase products without friction.

## Colors
This design system utilizes a high-visibility palette optimized for e-commerce conversion. 

- **Primary (Orange):** Used exclusively for action-oriented elements such as Primary Buttons, "Add to Cart" functions, and active selection states.
- **Secondary (Dark Gray):** Reserved for primary text, iconography, and structural accents to ensure high legibility and WCAG AA compliance.
- **Tertiary (Light Gray):** Applied to backgrounds, disabled states, and subtle borders to differentiate content zones without adding visual noise.
- **Neutral (White):** The foundation of the design, used for page backgrounds and card surfaces to maximize the "clean" aesthetic.

## Typography
The typography system uses **Inter** across all levels to maintain a systematic, utilitarian feel. 

Headlines utilize bold weights and tighter letter spacing for a commanding presence in product listings and hero sections. Body copy is set with generous line heights to ensure readability during long browsing sessions. Labels use a slightly heavier weight to distinguish metadata (like SKUs or price labels) from general descriptive text.

## Layout & Spacing
The layout follows a **Fixed Grid** model centered on a 1440px max-width container for desktop.

- **Desktop:** 12-column grid with 24px gutters. Content is padded from the viewport edges by 64px.
- **Tablet:** 8-column grid with 24px gutters.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

Vertical rhythm is strictly maintained using multiples of 8px. Sections should be separated by 'lg' (48px) or 'xl' (80px) units to maintain the requested "generous whitespace" feel.

## Elevation & Depth
Hierarchy is established through **Ambient Shadows** on white surfaces. 

This design system avoids heavy borders. Instead, depth is created by placing white `rounded-xl` or `rounded-2xl` containers on a `#F3F4F6` (Light Gray) background. Shadows should be highly diffused: `0px 4px 20px rgba(0, 0, 0, 0.05)`. 

When an element is hovered, such as a product card, the shadow should slightly deepen and the element should lift by 2px to provide tactile feedback.

## Shapes
The shape language is friendly and modern, utilizing substantial corner radii to soften the industrial nature of retail hardware. 

- **Small Components (Buttons, Inputs):** Use `0.5rem` (rounded) for a precise, clickable feel.
- **Product Cards:** Use `1.5rem` (rounded-xl) to create a distinct, modern "tiled" look.
- **Hero Containers:** Large promotional blocks should utilize `2rem` (rounded-2xl) to act as visual anchors on the page.

## Components
- **Buttons:** Primary buttons use a solid `#F5821F` fill with white text. Secondary buttons use a `#333333` outline with 2px stroke. All buttons have a height of 48px for touch-friendliness.
- **Cards:** Product cards must have a white background, `rounded-xl` corners, and the standard ambient shadow. Content inside should have 24px of internal padding.
- **Input Fields:** Use a `#F3F4F6` background with a subtle 1px border in a slightly darker gray. On focus, the border transitions to Primary Orange.
- **Chips:** Used for categories or filters. These should be pill-shaped with a Light Gray background and Dark Gray text; the active state switches to Primary Orange with White text.
- **Search Bar:** A prominent component in the header, utilizing a `rounded-xl` shape and a 56px height to dominate the top navigation for utility.
- **Lists:** Clean, borderless rows separated by 16px of vertical space, using subtle dividers only when necessary for data-heavy views.