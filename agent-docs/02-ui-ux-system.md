# 02. UI/UX Details & Design System

The application must feel like a high-end 2026 SaaS product (inspired by Linear, Vercel, and modern Web3 applications). It must maintain exceptional contrast in both Light and Dark modes.

## The Theme System
We manage styles entirely using standard React Tailwind CSS classes supported by custom CSS variables configured in `src/index.css`.

### Brand Colors
- **Deep Slate:** Application dark backgrounds (`bg-base` / `bg-surface`).
- **Electric Purple / Pink gradients:** Used for the brand primary actions and premium highlights (e.g., `bg-gradient-to-r from-electric to-pink-500`).
- **Text:** `text-slate-900 dark:text-white` for primary headers, `text-text-muted` for secondary descriptions.

### The "Glassmorphism" Aesthetic
Premium features and floating UI layers heavily rely on glassmorphism to feel "light" and immersive.
- **Implementation:** We achieve this using Tailwind utility classes: `bg-base/80`, `backdrop-blur-md`, `border border-border-subtle`, and `shadow-2xl`.

### Modern Interactions
- **Micro-animations:** Always apply `transition-all` or `transition-colors` on interactive elements. Use `hover:scale-[1.02] active:scale-[0.98]` on primary buttons.
- **Scrollbars:** We have custom webkit scrollbar modifications globally defined in `index.css` to hide ugly default browser scrollbars and replace them with ultra-thin, elegant tracks.
- **Z-Indices:** Maintain rigorous Z-index hierarchy. Navbar is `z-50`, floating context menus `z-30`/`z-40`, and modals `z-[100]`.

> **⚠️ Rule for AI Agents:** NEVER implement default blue/generic styling. If building a new button or a new page section, always source colors from the existing brand palette (electric, purple-600) and ensure the dark-mode configuration uses the `dark:` utility modifier explicitly.
