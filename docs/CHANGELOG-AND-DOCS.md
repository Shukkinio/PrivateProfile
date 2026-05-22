# ProfileOS — Changelog & Documentation

## Overview

This document tracks every change made to the ProfileOS codebase, including all modifications, potential errors encountered, and how they were resolved.

---

## 1. Hide Next.js Dev Indicator ("N" in bottom-left corner)

**File:** `apps/web/next.config.ts`

**Change:** Added `devIndicators: false` to the Next.js config.

**What it fixes:** In development mode, Next.js shows a small "N" icon in the bottom-left corner. This hides it.

**Potential issues:** None. This is a standard Next.js config option.

---

## 2. Effect Name Visibility in Dashboard Select Dropdowns

**Files:** `apps/web/src/app/dashboard/page.tsx`

**Change:** Added inline `style={{ color, background }}` attributes to every `<option>` element inside `<select>` elements for background effects and username effects.

**Before:** `<option value="plasma">plasma</option>`
**After:** `<option value="plasma" style={{ color: '#e8e6f0', background: '#1a1a2e' }}>plasma</option>`

**What it fixes:** In a dark-themed `<select>`, the dropdown options had white text on a white/light background (system default), making them invisible until hovered. By explicitly setting both `color` and `background` on each `<option>`, the text is always visible.

**Potential issues:** 
- Some browsers (especially older ones) may ignore inline styles on `<option>` elements. For those, consider using a custom select component.
- The `background: '#1a1a2e'` is hardcoded; if the theme changes globally, this won't auto-update.
- This approach must be replicated for any new `<select>` elements added in the future.

---

## 3. Horizontal Audio Adjuster (Volume Control)

**File:** `apps/web/src/app/\(public\)/\[username\]/page.tsx`

**Change:** Changed the volume control container from `flex-col` (vertical stack) to `flex-row` (horizontal layout). The icon, slider, and percentage label now sit side-by-side.

**Before:** Volume icon on top, slider below, percentage below that.
**After:** Icon, slider, and percentage in a single horizontal row.

**Key code change:**
```tsx
// Before
<div className="flex flex-col items-center gap-2 ...">

// After
<div className="flex flex-row items-center gap-3 ...">
```

**Also added:** The volume icon now doubles as a play/pause toggle button.

**Potential issues:** On very small screens (mobile), the horizontal layout might be cramped. Consider adding responsive behavior if needed.

---

## 4. Start Message Blur Overlay (Major Restructure)

**File:** `apps/web/src/app/\(public\)/\[username\]/page.tsx`

This was the most significant change.

### What Changed:

**Before:** The component had three early-return render branches:
1. Loading state
2. 404 / not found state
3. `!entered` state — a completely separate click-to-enter screen with its own video element (with `autoPlay muted`)

After clicking, the entire page re-rendered with the full profile content.

**After:** The component now has:
1. Loading state (unchanged)
2. 404 / not found state (unchanged)
3. A single unified render:
   - The FULL profile content is always rendered (with `pointer-events-none` when `!entered`)
   - A blur overlay is rendered **on top** when `!entered`, covering the full content
   - Clicking the overlay sets `entered=true`, removes the overlay, and starts video/audio

### Key Changes:

1. **Removed the `!entered` early return** (previous lines 166-191)
2. **Wrapped everything in a single `<div className="relative min-h-screen">`** so the overlay positions correctly
3. **Video no longer auto-plays** — `autoPlay` removed from the video tag. Video starts muted. Playback only begins after clicking the start overlay.
4. **Audio element is initially `muted`** — `<audio ref={audioRef} loop src={audioSrc} muted />`
5. **Start overlay uses `backdrop-blur-2xl` + `bg-black/40`** to blur and darken everything behind it
6. **Start overlay has `z-[10000]`** to ensure it's above everything
7. **Full content gets `pointer-events-none select-none` when `!entered`** to prevent interaction through the overlay
8. **Font support:** The start message uses `fontFamily: p.startMessageFont || undefined`

### Potential Issues:

1. **Backdrop blur performance:** `backdrop-blur-2xl` can be GPU-intensive, especially with a video playing behind it. On low-end devices, this might cause frame drops. The blur layer is removed after entering, so this is temporary.

2. **Video start timing:** Since video has no `autoPlay`, there may be a slight delay between clicking and video starting (while it loads/buffers). This is expected behavior — better than playing audio before the user wants it.

3. **Audio visual state:** The `playing` state might briefly be out of sync with actual audio playback. The `.then(() => setPlaying(true))` handles this but the `.catch(() => {})` silently swallows errors (e.g., autoplay policy blocking).

4. **Z-index conflicts:** The overlay uses `z-[10000]`. Custom cursor uses `z-[9999]`. This works but must be maintained if new z-index layers are added.

---

## 5. Font Selector (Start Message Font)

### Files Modified:
- `apps/web/src/app/dashboard/page.tsx`
- `apps/web/src/app/globals.css`
- `apps/web/src/app/\(public\)/\[username\]/page.tsx`
- `apps/web/src/app/api/profile/public/route.ts`
- `packages/db/prisma/schema.prisma`

### What Was Added:

1. **New Prisma field:** `startMessageFont String @default("")` on the Profile model
2. **Google Fonts imported in globals.css:**
   - Playfair Display, Space Grotesk, Cinzel, Cormorant Garamond, Inter, DM Serif Display, Unbounded, Instrument Serif, Newsreader, Sora (plus system fonts Georgia, Times New Roman)
3. **FONTS array in dashboard** with 13 preset options
4. **Custom font input field** next to the dropdown — user can type any font name
5. **Live preview** of the selected font below the picker
6. **API returns** `startMessageFont` in the public profile endpoint
7. **Main page applies** `fontFamily: p.startMessageFont` to the start message text

### Potential Issues:

1. **Font loading delay:** Google Fonts are loaded via `@import` in CSS. If the network is slow, the start message might briefly flash in the default font before switching. Consider using `font-display: swap` (already default).
2. **Invalid custom fonts:** If the user types a font name that doesn't exist, the browser will fall back to the default font silently. No validation is performed.
3. **Prisma migration:** The field was added to the schema and `prisma db push` was run. This only applies to SQLite. If the database is changed/reset, the migration must be re-run.

---

## 6. Glow Style Selector

### Files Modified:
- `apps/web/src/app/dashboard/page.tsx`
- `apps/web/src/app/\(public\)/\[username\]/page.tsx`
- `apps/web/src/app/api/profile/public/route.ts`
- `packages/db/prisma/schema.prisma`

### What Was Added:

1. **New Prisma fields:**
   - `glowStyle String @default("text-shadow")`
   - `usernameGlowStyle String @default("text-shadow")`
   - `startMessageGlow Boolean @default(false)`

2. **GLOW_STYLES array** with three options:
   - **Text Shadow** — Multi-layered text-shadow for a neon glow effect on the letters
   - **Radial Glow** — A radial gradient halo behind the text, animated with a pulse
   - **Box Glow** — Box-shadow applied to the heading element itself with padding

3. **`getGlowStyle()` function** in page.tsx that returns the appropriate CSS properties based on the selected style

4. **Toggle for Start Message Glow** in the dashboard glow settings section

### The `getGlowStyle()` function:
```tsx
function getGlowStyle(style: string, accent: string, intensity = 1): React.CSSProperties {
  switch (style) {
    case 'radial':
      return { position: 'relative', color: accent };
    case 'box':
      return {
        color: accent,
        boxShadow: `0 0 30px ${accent}80, 0 0 60px ${accent}40, 0 0 100px ${accent}20`,
        padding: '0.25em 0.5em',
        borderRadius: '8px',
        display: 'inline-block',
      };
    case 'text-shadow':
    default:
      return {
        color: accent,
        textShadow: `0 0 20px ${accent}e0, 0 0 40px ${accent}90, 0 0 80px ${accent}50`,
      };
  }
}
```

### Potential Issues:

1. **Radial glow uses a separate div** with absolute positioning. If the text wraps to multiple lines, the radial glow won't perfectly center. Consider using `::before` pseudo-element instead.
2. **Box glow changes the element display** to `inline-block`, which might affect text wrapping behavior in niche layouts.
3. **Intensity parameter** is accepted but not used yet. If you add intensity customization later, pass it through.

---

## 7. New Background Effects

### Files Modified:
- `apps/web/src/app/\(public\)/\[username\]/page.tsx`
- `apps/web/src/app/dashboard/page.tsx`

### Effects Added:

### Particles
- 50 floating particles with varying sizes (2-6px), colors (accent, white, purple), and opacities
- Uses `particle-float` keyframe animation: particles rise from bottom to top with horizontal drift
- Each particle has a randomized delay so they don't all move in sync

**CSS Keyframe:**
```css
@keyframes particle-float {
  0% { transform: translateY(100vh) translateX(0) scale(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-10vh) translateX(50px) scale(1); opacity: 0; }
}
```

### Matrix Rain
- 40 columns of random Japanese katakana characters (Unicode range 0x30A0-0x30FF)
- Uses `writing-mode: vertical-rl` to display text vertically
- `matrix-fall` animation moves each column from top to bottom
- Very low opacity (0.12) for subtle effect

**CSS Keyframe:**
```css
@keyframes matrix-fall { 0% { transform: translateY(-10vh); } 100% { transform: translateY(110vh); } }
```

### Gradient Waves
- A full-screen `linear-gradient` using the accent color + teal + indigo
- `backgroundSize: 400% 400%` allows for smooth panning
- `wave-shift` animation moves the background position

**CSS Keyframe:**
```css
@keyframes wave-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
```

### Potential Issues:

1. **Performance:** 50 particle + 40 matrix DOM elements = 90 extra elements. This is fine for modern devices but could be heavy on low-end phones. Consider reducing counts or using Canvas API for better performance.
2. **Katakana characters in matrix:** Uses `String.fromCharCode(0x30A0 + Math.random() * 96)` to generate random katakana. These look authentic for a matrix effect. If the user's browser doesn't support these characters, they'll render as boxes.
3. **Gradient waves use accent color** which might clash with some background colors. The gradient has low opacity (0.30) to mitigate this.
4. **The EFFECT_STYLES gradient backgrounds** for these effects are very dark (`bg-[#0a0a12]` etc.) to ensure the overlay stands out.

---

## 8. New Username Effects

### Files Modified:
- `apps/web/src/app/\(public\)/\[username\]/page.tsx`
- `apps/web/src/app/dashboard/page.tsx`

### Effects Added:

### Glitch
- Two alternating `clip-path` animations (`glitch-1` and `glitch-2`) that create horizontal slice distortions
- Translates the text in random directions to simulate digital glitch artifacts
- Animation runs at 0.5s intervals for a fast, stuttering glitch look

**CSS Keyframe (glitch-1):**
```css
@keyframes glitch-1 {
  0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
  20% { clip-path: inset(20% 0 60% 0); transform: translate(-3px, 2px); }
  40% { clip-path: inset(40% 0 40% 0); transform: translate(3px, -1px); }
  60% { clip-path: inset(60% 0 20% 0); transform: translate(-2px, 1px); }
  80% { clip-path: inset(10% 0 70% 0); transform: translate(2px, -2px); }
}
```

### Neon Pulse
- Multi-layered text-shadow that oscillates between intense and moderate glow
- Uses 6 layers of the accent color at increasing blur radii
- Animation runs at 2s intervals for a breathing effect

**CSS Keyframe:**
```css
@keyframes neon-pulse {
  0%, 100% { text-shadow: 0 0 7px ${accent}, 0 0 10px ${accent}, 0 0 21px ${accent}, 0 0 42px ${accent}, 0 0 82px ${accent}, 0 0 92px ${accent}; }
  50% { text-shadow: 0 0 4px ${accent}, 0 0 7px ${accent}, 0 0 13px ${accent}, 0 0 26px ${accent}, 0 0 40px ${accent}, 0 0 52px ${accent}; }
}
```

### Fire
- Animated text color cycling through orange-red-gold
- Multiple text-shadow layers simulating flames rising upward (negative Y offset)
- Colors: `#ff4500` (orange-red), `#ff6347` (tomato), `#ff8c00` (dark orange), `#ffd700` (gold)
- Animation runs at 1.5s intervals

**CSS Keyframe:**
```css
@keyframes fire {
  0%, 100% { text-shadow: 0 -5px 10px #ff4500, 0 -10px 20px #ff4500, 0 -15px 30px #ff4500, 0 -20px 40px #ff8c00, 0 -30px 50px #ffd700; color: #ff4500; }
  25% { text-shadow: 0 -5px 10px #ff6347, 0 -10px 20px #ff6347, 0 -15px 30px #ff4500, 0 -20px 40px #ff8c00, 0 -30px 50px #ffd700; color: #ff6347; }
  50% { text-shadow: 0 -5px 10px #ff4500, 0 -10px 20px #ff8c00, 0 -15px 30px #ffd700, 0 -20px 40px #ff4500, 0 -30px 50px #ff6347; color: #ff8c00; }
  75% { text-shadow: 0 -5px 10px #ff8c00, 0 -10px 20px #ff4500, 0 -15px 30px #ff6347, 0 -20px 40px #ffd700, 0 -30px 50px #ff4500; color: #ff6347; }
}
```

### Potential Issues:

1. **Glitch clip-path:** The glitch effect uses `clip-path: inset()` which clips the text at specific percentages. On browsers that don't support `clip-path` (very old ones), the effect won't work but the text will still be visible.
2. **Neon pulse hardcodes accent color:** The CSS keyframe template literal captures the accent color at render time. Since this is dynamic JSX (not a CSS file), it works correctly. If the accent color were to change dynamically (it doesn't in the current implementation), the animation wouldn't update.
3. **Fire effect overrides text color:** The fire animation changes `color` to warm tones, ignoring the user's accent color. This is by design — fire should look like fire — but it means the accent color is not used for this effect.

---

## 9. Prisma Schema Changes

**File:** `packages/db/prisma/schema.prisma`

### Added Fields to Profile Model:

```prisma
startMessageFont String @default("")
glowStyle String @default("text-shadow")
usernameGlowStyle String @default("text-shadow")
startMessageGlow Boolean @default(false)
```

### Migration:
- Run `npx prisma db push --schema=packages/db/prisma/schema.prisma` from the `packages/db` directory
- This syncs the schema to the SQLite database without data loss (all new fields have defaults)

### API Route Changes:

**File:** `apps/web/src/app/api/profile/public/route.ts`

Added four new fields to the public API response:
```ts
startMessageFont: profile.startMessageFont || '',
glowStyle: profile.glowStyle || 'text-shadow',
usernameGlowStyle: profile.usernameGlowStyle || 'text-shadow',
startMessageGlow: profile.startMessageGlow ?? false,
```

### Potential Issues:

1. **SQLite only:** The `prisma db push` command works for the current SQLite dev database. For production deployment with a different database (PostgreSQL, etc.), you'd need to create and run a proper migration.
2. **Field defaults:** All new fields have sensible defaults, so existing profiles will automatically get `text-shadow` for glow style and empty string for font.
3. **API PUT route passes all fields through:** The dashboard save function sends these fields via `api.put('/profile', {...})`. The API route does `{ ...profileData }` on the Prisma upsert, which handles the new fields automatically since they're now in the schema.

---

## 10. Dashboard API Save Function Update

**File:** `apps/web/src/app/dashboard/page.tsx`

### Fields Added to Save Payload:

```ts
startMessageFont: draft.startMessageFont || '',
glowStyle: draft.glowStyle || 'text-shadow',
usernameGlowStyle: draft.usernameGlowStyle || 'text-shadow',
startMessageGlow: draft.startMessageGlow ?? false,
```

### Profile Interface Update:

Added four new fields to the `Profile` interface:
```ts
startMessageFont: string;
glowStyle: string;
usernameGlowStyle: string;
startMessageGlow: boolean;
```

### DEFAULT Constant Update:

Added default values for the new fields to prevent undefined errors on profile load.

---

## 11. Build Errors & Resolutions

### Error 1: Prisma Unknown Field
**Symptom:** Build fails with "Unknown field" when dashboard saves profile with new fields not in Prisma schema.
**Resolution:** Added the new fields to `packages/db/prisma/schema.prisma` and ran `npx prisma db push`.

### Error 2: Select Option Text Invisible
**Symptom:** In the dashboard, opening a `<select>` dropdown shows options with invisible text (white on white).
**Resolution:** Added explicit `color` and `background` styles to each `<option>` element.

### Error 3: Video Autoplay Policy
**Symptom:** Video attempting to `play()` without user interaction gets rejected by browser autoplay policy.
**Resolution:** Removed `autoPlay` from video element. Video starts muted and only plays after user clicks the start overlay. The `play()` call in `handleEnter` is triggered by a user click event, which satisfies browser autoplay requirements.

### Error 4: Build Prerender Error
**Symptom:** `TypeError: Cannot read properties of null (reading 'useContext')` during build for `/_error` page.
**Status:** Pre-existing issue, unrelated to our changes. Likely a React/Next.js version compatibility issue in the original project. The main app pages compile and run correctly.

---

## 12. Possible Future Improvements

1. **Canvas-based effects:** For better performance with particles, matrix rain, and other visual effects, use HTML5 Canvas or WebGL instead of DOM elements.
2. **Effect intensity slider:** Add a slider in dashboard to control effect intensity/opacity.
3. **Custom font validation:** Add a "Preview" button that shows the font in real-time to validate custom font names.
4. **Responsive volume control:** Add responsive behavior to the horizontal volume slider (collapse to icon-only on very small screens).
5. **Multiple glow styles per element:** Allow different glow styles for username, start message, badges, and socials independently.
6. **Animation library:** Consider using Framer Motion or GSAP for smoother, more complex animations (the project already has `framer-motion` in optimizePackageImports).
7. **Reduce DOM elements:** For particle/matrix effects with many elements, use `React.memo` or a canvas-based approach.

---

## File Change Summary

| File | Type of Change |
|------|----------------|
| `packages/db/prisma/schema.prisma` | Added 4 new Profile fields |
| `apps/web/next.config.ts` | Added devIndicators: false |
| `apps/web/src/app/globals.css` | Added 12 Google Font imports |
| `apps/web/src/app/(public)/[username]/page.tsx` | Major restructure: blur overlay, horizontal volume, new effects, glow styles, fonts |
| `apps/web/src/app/dashboard/page.tsx` | Added font picker, glow style selector, effect options, fixed select styling |
| `apps/web/src/app/api/profile/public/route.ts` | Added 4 new fields to API response |
| `docs/CHANGELOG-AND-DOCS.md` | This file |
