# Capital Core Dance Studio — Website Design Spec

**Date:** 2026-03-31
**Project:** `capitalcoredancewebsite`
**Client:** Capital Core Dance Studio, Midlothian, VA
**Managed by:** Hicks Virtual Solutions LLC

---

## Overview

A marketing website for Capital Core Dance Studio. No backend. Static-first, fully responsive. Logo and real business info will be added later — use placeholders for now. More pages will be added in future phases.

---

## Tech Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Hosting:** TBD (Vercel recommended)
- **No backend, no forms API** — contact form is UI-only for now (no submission handling)

---

## Brand

### Colors
| Role | Value |
|---|---|
| Primary navy (dark) | `#0d1b36` |
| Primary navy (mid) | `#1e3a6e` |
| Primary red | `#c0392b` |
| White | `#ffffff` |
| Pale blue accent | `#7ab3e8` |
| Pink accent | `#f4a8b4` |
| Coral accent | `#f4a060` |
| Light bg | `#f4f6fa` |
| Card border | `#e0e6f0` |

### Typography
- **Headings:** Inter or system sans-serif, weight 900, tight letter-spacing
- **Body:** Inter or system sans-serif, weight 400–600
- **Labels/eyebrows:** All-caps, wide letter-spacing, small size

### Vibe
Bold, energetic, modern. High contrast. Accents pop against the dark navy base. Not playful/kiddie — serious about dance but approachable.

---

## Site Structure

```
/               → Homepage
/classes        → Classes page
/camps          → Camps page
/birthdays      → Birthdays page
/contact        → Contact page
```

All routes are client-side via React Router. Navigation is consistent across all pages.

---

## Components

### `Navbar`
- Background: `#0d1b36` (dark navy), full width, sticky
- Left: Logo placeholder + "CAPITAL CORE / DANCE STUDIO" stacked text
- Right: Links — Classes, Camps, Birthdays — then a red pill CTA "Contact Us"
- Active link: highlighted with bottom border + pink accent color
- Responsive: collapses to hamburger menu on mobile

### `PageHeader` (reusable inner page header)
- Background: gradient `155deg`, `#0d1b36` → `#1a1040` → `#5a1020`
- Decorative translucent circle in corner
- Eyebrow text (pale blue or pink, all-caps)
- Large bold white page title
- Subtitle in pale blue
- Used on: Classes, Camps, Birthdays, Contact pages

### `Footer`
- Background: `#0d1b36`
- Left: Studio name + location placeholder
- Right: copyright
- Shared across all pages

---

## Pages

### Homepage (`/`)

1. **Navbar**
2. **Hero section**
   - Full-width gradient: `155deg`, `#0d1b36` → `#1a1040` → `#5a1020`
   - Decorative translucent circles (red top-right, blue bottom-left)
   - Eyebrow: "Midlothian, Virginia" in pink
   - Headline: "MOVE WITH PURPOSE" — white, size 5xl–6xl, weight 900
   - `<span>` on second word styled in pink accent
   - Subhead: pale blue, max-width ~420px centered
   - Two CTAs: red filled "Explore Classes" + outlined ghost "Plan a Party"
3. **Section intro**
   - White background
   - Red eyebrow label "What We Offer"
   - Dark navy headline "Everything your dancer needs"
   - Gray subtext
4. **Section cards grid** (2×2)
   - Light bg (`#f4f6fa`), white card with border
   - Each card: colored gradient header (navy, red, purple, green), emoji icon, title, accent color subtext
   - Card body: description text + red "View X →" link
   - Cards: Classes (navy), Camps (red/dark), Birthdays (purple/indigo), Contact (green/teal)
5. **Footer**

### Classes Page (`/classes`)

1. **Navbar** (active: Classes)
2. **PageHeader** — title "Classes", subtitle about year-round instruction
3. **Content section** — white bg
   - Red eyebrow + navy headline "Find the right class for your dancer"
   - List of class cards (left-colored-border style):
     - Each card: class name, age range/level, day(s)
     - Border accent colors: red, pale blue, pink, coral (rotate)
     - Placeholder for more classes to be added later
   - Navy "Enroll Now" CTA button at bottom
4. **Footer**

### Camps Page (`/camps`)

1. **Navbar** (active: Camps)
2. **PageHeader** — title "Camps", subtitle about summer & holiday camps
3. **Content section** — white bg
   - Eyebrow + headline
   - Camp cards (same border-accent pattern as classes)
   - Each card: camp name, dates/season, age range, brief description
   - Placeholder for camp listings
   - Red "Learn More / Register" CTA
4. **Footer**

### Birthdays Page (`/birthdays`)

1. **Navbar** (active: Birthdays)
2. **PageHeader** — title "Birthdays", subtitle about party packages
3. **Content section** — white bg
   - Eyebrow + headline "Celebrate at the studio"
   - Party package cards (same style)
   - Each card: package name, included items, placeholder price
   - Pink/coral accents throughout (fits birthday vibe within the palette)
   - Red "Book a Party" CTA
4. **Footer**

### Contact Page (`/contact`)

1. **Navbar** (active: Contact Us)
2. **PageHeader** — title "Contact Us", subtitle "We'd love to hear from you"
3. **Contact form** — white bg
   - Fields: First Name + Last Name (side by side), Email, Phone (optional), Interest dropdown (Classes / Camps / Birthdays / General), Message textarea
   - Red "Send Message" submit button
   - Form is UI-only — no submission handler in this phase
4. **Footer**

---

## Responsive Behavior

- Mobile-first Tailwind classes
- Navbar collapses to hamburger on `md` breakpoint and below
- Hero text scales down on mobile
- Section card grid: 2 columns on desktop, 1 column on mobile
- Contact form: side-by-side name fields stack on mobile

---

## Out of Scope (this phase)

- Backend / API of any kind
- Form submission handling
- Authentication
- CMS or content management
- Real logo (placeholder used)
- Real business info (address, phone, hours — added later)
- Any page beyond the 4 listed above
