---
name: style-rules
description: Enforce the Alan Wake 2 visual theme and styling rules for the Anchor quiz application
---

# style-rules

Instructions for the AI agent to apply the Alan Wake 2 visual theme across the Anchor quiz application. Anchor is a Gen AI powered quiz application, but visually it must feel like diving into the dark, mysterious, and surreal world of Alan Wake 2.

## Core Aesthetic Principles

- **Dark & Atmospheric**: The primary background should be stark black or deep, shadowy grays. Avoid bright white backgrounds unless for stark, blinding contrast (like a flashlight beam or a manuscript page).
- **The "Wake" Red**: Utilize the custom `neon-red` palette defined in the project configuration (e.g., `text-neon-red-500`, `bg-neon-red-900`) instead of default Tailwind reds for accents, critical actions, warnings, and highlighting key text or active states. This is the signature color and must be used exclusively when red is required.
- **Typography**:
  - Headings and titles should evoke a thriller/mystery vibe. Use stark, bold, and sometimes slightly distressed or elongated sans-serif or serif fonts.
  - Body text should resemble typewriter text or clean, highly legible serif/sans-serif that contrasts sharply against dark backgrounds.
  - Text should primarily be stark white or off-white against dark backgrounds.

## Component Guidelines

### Buttons & Interactive Elements

- **WakeButton Component**: When needing a button or a styled link, import and use the `<WakeButton>` component from `components/shared/wake-button.tsx`.
- **Primary Variant** (`variant="primary"`): The deep signature neon red button with a stark white flash on hover. Use for main calls-to-action (e.g., "Start Writing", "Submit").
- **Secondary Variant** (`variant="secondary"`): A ghost button with dark grays that lights up with white text and borders on hover. Use for secondary actions (e.g., "View Records", "Cancel").
- **Forms & Inputs**: Minimalist borders. Focus states should highlight the input with the signature red or a stark white underline/border. No soft, friendly rounded corners; keep edges relatively sharp (e.g., `rounded-none` or `rounded-sm`).

### Layout & Spacing

- **Contrast**: High contrast is essential. Use stark lines and distinct separations between sections.
- **Shadows & Glows**: Use subtle red glows for active or "supernatural" elements, and deep black drop shadows to create depth, avoiding soft, modern, diffuse shadows.
- **Manuscript Motif**: For quiz cards or specific content blocks, consider styling them subtly like manuscript pages (off-white background, dark typewriter text) if it contrasts well with the main dark theme.

## Usage

Use this skill whenever you are:

- Creating new UI components (buttons, forms, cards).
- Styling the layout of a new page.
- Reviewing or updating the visual design of existing elements.
- Generating Tailwind CSS classes for the application.

## Steps

1. **Analyze the Request**: Identify what UI element or page is being created/modified.
2. **Apply Color Palette**: Ensure the background is appropriately dark, text is highly contrasting (stark white/off-white), and the signature `neon-red` palette is used exclusively for accents/interactivity instead of default Tailwind reds.
3. **Apply Typography**: Use the configured typewriter or thriller-esque fonts for headings and body text.
4. **Enforce Component Style**: Check that buttons, inputs, and cards have sharp edges, high contrast, and lack "friendly/soft" modern web design traits.
5. **Verify Theme Consistency**: Ensure the newly styled element feels cohesive with the overall dark, mysterious, and intense Alan Wake 2 aesthetic.
