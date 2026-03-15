---
name: style-rules
description: Enforce the Alan Wake 2 visual theme and styling rules for the Anchor quiz application
---

# style-rules

Apply a restrained Alan Wake 2-inspired style across Anchor. Keep it minimal, high-contrast, and cinematic rather than decorative.

## Visual Scale

- Prefer a quiet noir look: black, charcoal, off-white, and controlled use of `neon-red`.
- Use red sparingly for focus, active states, warnings, and primary actions. Do not use default Tailwind reds.
- Avoid loud gradients, overly complex textures, oversized glows, and theme-heavy props unless the request explicitly calls for them.

## Hard Rules

- Backgrounds should stay dark unless a deliberate manuscript-style contrast block is needed.
- Text should remain crisp and readable: white or muted off-white on dark surfaces.
- Corners should stay sharp or nearly sharp. Avoid soft, rounded SaaS styling.
- Shadows should be deep and directional. Glows should be subtle and rare.
- Keep spacing clean and intentional. Favor tension and restraint over dense ornament.

## Components

- Use `components/shared/wake-button.tsx` for styled buttons or button-like links.
- Inputs and form controls should use minimal borders with high-contrast focus states.
- Cards and panels should feel editorial and severe, not playful or soft.

## When To Apply

- New pages, sections, cards, forms, buttons, and interactive states.
- Visual refactors where the UI has drifted toward generic modern SaaS styling.
- Tailwind class generation for any user-facing surface.

## Working Style

- Preserve existing project patterns and only intensify the theme where it helps the feature.
- Default to the smallest set of classes needed to achieve the look.
- If a design choice is ambiguous, choose the more minimal option.
