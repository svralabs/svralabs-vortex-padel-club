# Design Plan — Vortex Padel Club

**Framework Directive:** `MASTER.md` Module 03  
**Project:** Vortex Padel Club (Astro + TypeScript + Native CSS + GSAP)  
**Execution Date:** 2026-11-16

---

## 1. Brand Identity & Strategy

* **Brand Name:** **VORTEX PADEL CLUB**
* **Brand Subtitle:** *Arena & Social Sanctuary*
* **Core Philosophy:** "Elevating the sport of padel through state-of-the-art panoramic glass courts, a vibrant social community, and seamless digital court booking."
* **Primary Conversion:** Interactive court booking (`Book a Court` modal), membership inquiry (`Join the Group`), and facility exploration.

---

## 2. Preserve vs. Transform (MASTER.md 3.1)

### A. Preserve (Reference Principles to Maintain)
1. **Electric Royal Blue & Neon Palette:** Retain the signature vibrant blue turf court atmosphere (`#1D4ED8`, `#2563EB`) with optic neon ball highlights (`#D4F72C`), dark cinematic panels (`#0B1220`), and light neutral backdrops (`#F8FAFC`).
2. **Asymmetric Editorial Composition:** Retain the fluid interplay of staggered cards, rounded photo containers (`rounded-3xl`), circular action pills (`↗`, `+`, `‹ ›`), and prominent quote layouts.
3. **Padel-Specific Semantic Integrity:** 100% genuine padel elements — perforated carbon composite rackets with safety lanyards, glass-walled courts, and authentic athlete action. Zero tennis strings, zero badminton.

### B. Transform (Original by Design Decisions)
1. **Original Brand Identity:** Brand renamed to **VORTEX PADEL CLUB** with an original geometric monogram icon (racket head + ball vortex).
2. **Full Dynamic Interactivity:**
   * **Live Court Booking Modal:** Complete reservation flow with court selector (Panoramic Glass Indoor / Sunlit Outdoor / Stadium Center), date picker, duration, gear add-ons (racket rental, premium balls, personal trainer), and instant rupiah price calculation with WhatsApp auto-checkout.
   * **Interactive Facility Filter & Carousel:** Live category switching (`All`, `Courts`, `Lounge`, `Gym`, `Events`) with GSAP smooth transition and active card pagination.
   * **Interactive Member Testimonial Carousel:** Multi-slide review switcher with working navigation controls (`‹ ›`).
   * **Live Search Feedback:** Search bar in navbar and facilities with instant interactive dropdown / toast notification.
3. **Motion Architecture:**
   * Refined GSAP ScrollTrigger reveals with `clearProps` to guarantee 100% solid opacity and zero layout bugs.
   * Smooth micro-interactions on circular buttons, card hovers, and CTA pills.
   * Full accessibility support with `prefers-reduced-motion`.
4. **Enhanced Mobile UX:**
   * Responsive bottom quick-booking sheet on mobile screens.
   * Fluid typography utilizing modern CSS `clamp()`.

---

## 3. Design Tokens (CSS Custom Properties)

```css
:root {
  --color-court-blue: #1d4ed8;
  --color-court-dark: #0f172a;
  --color-court-turf: #1a56db;
  --color-neon: #d4f72c;
  --color-neon-hover: #bfe41d;
  --color-surface-light: #f8fafc;
  --color-surface-white: #ffffff;
  --color-dark-panel: #0b1220;
  --color-dark-surface: #111a2e;
  --color-text-main: #0f172a;
  --color-text-muted: #64748b;
  --color-border-subtle: #e2e8f0;

  --radius-pill: 9999px;
  --radius-card: 28px;
  --radius-card-sm: 20px;

  --font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;

  --container-max: 1360px;
}
```

---

## 4. Section Architecture

1. **Header / Navbar:** Sticky pill with brand monogram, navigation links (`About`, `Courts`, `Facilities`, `Membership`, `Testimonials`), search input, and `Book Now ↗` action pill.
2. **Hero:** Full-bleed royal blue turf card with large headline, social proof badge, and photographic padel racket flatlay.
3. **About Section:** Dual-card asymmetric gallery introducing the club’s community philosophy and outdoor/indoor courts.
4. **Experience Section:** Contrast panel — night tournament court with booking counter (Left) + gear showcase & feature description (Right).
5. **Explore Facilities:** 4 interactive venue cards with search bar and filter controls.
6. **Member Stories:** Social testimonial with athlete portrait and quote.
7. **Final CTA:** Panoramic court action banner inviting players to join the community.
8. **Footer:** Contact details, court hours, social links, newsletter, and legal notice.
