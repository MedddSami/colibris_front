# Design System Document

## 1. Overview & Creative North Star: "The Biophilic Gallery"

This design system is built to transcend the "standard" eco-platform aesthetic. Instead of generic green boxes, we adopt a **Biophilic Gallery** approach. The Creative North Star centers on the tension between high-end editorial precision and organic fluidity. 

We break the "template" look through **Intentional Asymmetry** and **Tonal Depth**. By utilizing a high-contrast typography scale against a serene, layered background, we create a digital environment that feels like a premium sustainable exhibition. Expect generous white space, overlapping elements that "breathe," and a complete absence of rigid structural lines.

---

## 2. Color Architecture & Surface Philosophy

Our palette is rooted in the "70-20-10" rule to ensure the primary green remains an accent of vitality, not an overwhelming wash.

### Color Tokens
- **Primary (`#006c4a`):** Used for core brand moments and high-priority actions.
- **Secondary (`#00658d`):** Used for supporting information and secondary interactive elements.
- **Surface & Background (`#f1fbfe`):** A cool, airy foundation that provides the "70%" neutral canvas.

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are prohibited for sectioning.** Visual boundaries must be defined solely through background color shifts.
*   *Implementation:* A `surface-container-low` section sitting directly on a `surface` background provides all the separation necessary.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine, recycled paper.
*   **Level 0 (Base):** `surface`
*   **Level 1 (Subtle Inset):** `surface-container-low`
*   **Level 2 (Active Cards):** `surface-container-lowest` (pure white) to create a "lifted" appearance without heavy shadows.

### The "Glass & Gradient" Rule
For hero sections and primary CTAs, use **Signature Textures**. Instead of a flat `#006c4a`, apply a subtle linear gradient transitioning from `primary` to `primary-container`. For floating navigation or modal overlays, use **Glassmorphism**: `surface` at 80% opacity with a `20px` backdrop-blur to allow the biophilic colors to bleed through.

---

## 3. Typography: The Editorial Voice

We utilize **Montserrat** for its geometric clarity and modern "Gotham-style" warmth (it serves as our accessible alternative to Gotham). The hierarchy is designed to convey authority and breathability.

| Token | Size | Weight | Role |
| :--- | :--- | :--- | :--- |
| **display-lg** | 3.5rem | Bold | Hero statements; maximum impact. |
| **headline-lg** | 2rem | Bold | Primary page headers (H1). |
| **headline-md** | 1.75rem | Medium | Section headers (H2). |
| **title-lg** | 1.375rem | Bold | Sub-sections (H3). |
| **body-lg** | 1rem | Regular | Primary reading text; high legibility. |
| **label-md** | 0.75rem | Medium | Functional labels and small captions. |

**Editorial Note:** Use `display-lg` with tightened letter-spacing (-0.02em) for a high-fashion, premium feel.

---

## 4. Elevation & Depth: Tonal Layering

We reject traditional structural lines in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` card on top of a `surface-container` background. This creates a natural, soft "pop" that mimics light hitting a physical surface.
*   **Ambient Shadows:** If an element must float (e.g., a FAB or dropdown), use a custom shadow: `0px 12px 32px rgba(20, 29, 32, 0.06)`. Note the use of the `on-surface` color for the shadow tint, rather than pure black.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` at **20% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Buttons: The Kinetic Touchpoints
*   **Primary:** `primary` fill with `on-primary` text. Uses `xl` (1.5rem) or `full` roundedness. Apply a subtle `primary-container` glow on hover.
*   **Secondary:** `outline-variant` Ghost Border with `secondary` text. No fill.
*   **Tertiary:** Text-only in `primary` weight, used for low-emphasis actions like "Cancel."

### Cards & Lists: The No-Divider Rule
*   **Cards:** Use `md` (0.75rem) rounded corners. Content is separated by 24px or 32px of vertical white space, never by horizontal lines.
*   **List Items:** Use `surface-container-low` on hover to indicate interactivity. 

### Inputs: The Sophisticated Form
*   **Text Fields:** Use a `surface-container-high` background with no border. On focus, transition to a `primary` Ghost Border (20% opacity) and a 1px `primary` underline.

### Ecological Progress Components (Custom)
*   **The Impact Ring:** A semi-circular gauge using a gradient from `primary` to `tertiary` to track environmental metrics.
*   **Bio-Chips:** Selection chips with `sm` (0.25rem) rounding, using `primary-container` for active states to mimic a lush, leafy highlight.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetric Padding:** Allow images to bleed off the edge of containers while text remains strictly aligned to the grid.
*   **Embrace Negative Space:** If you think a section needs more content, it probably needs more white space instead.
*   **Layer Surfaces:** Always ask "can this separation be achieved with a background tint?" before reaching for a border.

### Don't:
*   **Don't Use 1px Borders:** They clutter the "Biophilic" aesthetic and feel like legacy web design.
*   **Don't Use High-Contrast Shadows:** Avoid "dirty" dark shadows; keep them airy and tinted with the `on-surface` hue.
*   **Don't Over-Saturate:** Stick to the 70-20-10 ratio. The neutral `f1fbfe` is what makes the `00A775` green feel premium.