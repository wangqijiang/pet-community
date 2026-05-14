---
name: Soft & Cute Healing System
colors:
  surface: '#fff8f7'
  surface-dim: '#dfd8d8'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f2f2'
  surface-container: '#f3ecec'
  surface-container-high: '#eee6e6'
  surface-container-highest: '#e8e1e1'
  on-surface: '#1e1b1b'
  on-surface-variant: '#4f4446'
  inverse-surface: '#333030'
  inverse-on-surface: '#f6efef'
  outline: '#807476'
  outline-variant: '#d2c3c4'
  surface-tint: '#71585c'
  primary: '#71585c'
  on-primary: '#ffffff'
  primary-container: '#ffdde2'
  on-primary-container: '#795f64'
  inverse-primary: '#dfbfc3'
  secondary: '#655e43'
  on-secondary: '#ffffff'
  secondary-container: '#eadfbd'
  on-secondary-container: '#6a6347'
  tertiary: '#546254'
  on-tertiary: '#ffffff'
  tertiary-container: '#daead8'
  on-tertiary-container: '#5b6a5c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#fcdadf'
  primary-fixed-dim: '#dfbfc3'
  on-primary-fixed: '#29161a'
  on-primary-fixed-variant: '#584145'
  secondary-fixed: '#ede2c0'
  secondary-fixed-dim: '#d0c6a5'
  on-secondary-fixed: '#201b06'
  on-secondary-fixed-variant: '#4d472e'
  tertiary-fixed: '#d7e7d5'
  tertiary-fixed-dim: '#bbcbba'
  on-tertiary-fixed: '#121e14'
  on-tertiary-fixed-variant: '#3c4a3d'
  background: '#fff8f7'
  on-background: '#1e1b1b'
  surface-variant: '#e8e1e1'
typography:
  display-title:
    fontFamily: Quicksand
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  margin-page: 20px
  gutter-card: 12px
  padding-container: 16px
  stack-gap: 8px
---

## Brand & Style

The design system centers on a "healing" (治愈) aesthetic tailored for a pet-centric community. The brand personality is that of a warm, fluffy companion—approachable, soft to the touch, and emotionally resonant. It avoids the clinical sharpness of traditional apps in favor of a tactile, organic feel.

The visual direction leans into a refined version of soft-ui, utilizing extremely subtle depth and pastel saturation to create a "marshmallow" effect. Interfaces should feel lightweight and airy, evoking the sensation of a sunny afternoon spent with a pet. Every interaction is designed to reduce cognitive load and provide positive emotional reinforcement through playful motion and organic shapes.

## Colors

The palette is anchored by **Milky White (#FDFBF7)**, which serves as a warm, non-glaring canvas that is easier on the eyes than pure white. 

- **Primary Pale Milk Pink**: Used for key actions, active states, and "love" related features (likes, favorites).
- **Secondary Light Milk Yellow**: Used for secondary highlights, tips, and friendship-related badges.
- **Accent Soft Light Blue**: Reserved for informational links, grooming services, or weather-related pet tips.
- **Typography Tone**: Instead of pure black, a warm charcoal-brown (#5C5455) is used to maintain the soft "healing" contrast levels.

## Typography

This design system utilizes rounded terminals across all font weights to mimic the softness of the brand. **Quicksand** provides a playful, geometric roundness for headings, while **Nunito Sans** offers high legibility for longer social posts while maintaining a friendly character.

Hierarchy is established through weight rather than dramatic size shifts. Titles are kept cozy (18-20px) to ensure the interface feels intimate rather than loud. Line heights are generous to give the text "room to breathe," enhancing the relaxed, healing atmosphere.

## Layout & Spacing

The layout follows a fluid model optimized for the WeChat Mini-program environment. It relies on generous page margins (20px) to frame content within a safe, "comfy" zone. 

Spacing units are strictly based on a 4px scale, favoring larger gaps (16px, 24px) to avoid clutter. Elements should never feel squeezed; the "healing" effect relies on white space to suggest a sense of calm. Content blocks use a single-column stack or a 2-column masonry grid for pet photo galleries.

## Elevation & Depth

Depth is achieved through **colored ambient shadows** rather than grey ones. Shadows should use a low-opacity version of the Primary Pink or a warm Brown (e.g., `rgba(168, 155, 157, 0.12)`).

- **Level 1 (Cards)**: A very soft, wide blur (8px) with no offset to make containers look like they are gently resting on the milky background.
- **Level 2 (Buttons/Popups)**: A slightly more pronounced shadow with a 4px vertical offset to suggest interactability.
- **Interactive Depth**: When clicked, elements should appear to sink slightly (reduce shadow) or scale up (1.05x) to provide tactile feedback.

## Shapes

The shape language is consistently "bubbly." There are no sharp corners in the design system. 

- **Containers/Cards**: Use an 8px radius for a structured but soft look.
- **Interactive Elements**: Buttons and Popups use a 12px radius, leaning toward a "squircle" aesthetic.
- **Media**: Pet photos and avatars use a more aggressive 16px radius or full circles to emphasize cuteness and safety.

## Components

### Buttons
Primary buttons are pill-shaped or 12px rounded, filled with **Pale Milk Pink**. They feature a soft shadow and a 1.05x scale transform on hover/touch.

### Icons & Imagery
Icons are thick-stroked (2px or 3px) with rounded ends. The set is dog-themed:
- **Navigation**: Home (kennel shape), Community (two paws), Profile (dog silhouette).
- **Actions**: Like (heart with small bone detail), Comment (rounded bubble).

### Cards
Cards use the **Milky White** base but are distinguished by a subtle 1px border in a slightly darker cream or a soft shadow. They should contain ample internal padding (16px).

### Interactive Feedback
- **Transitions**: Use `cubic-bezier(0.34, 1.56, 0.64, 1)` for a "bouncy" feel during page transitions.
- **Heart Particles**: On "Liking" a post, a burst of 3-5 small pastel hearts should float upward and fade, providing a "healing" micro-reward for the user.
- **Input Fields**: Soft yellow background when focused, with a pulsing pink cursor.