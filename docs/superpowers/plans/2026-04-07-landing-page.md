# ProMe Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `HomeHub` with a full-bleed marketing landing page that introduces ProMe's features to players of The Protector's Memories.

**Architecture:** A new `LandingPage` component tree, entirely separate from the shared `Layout` shell. The home route (`src/app/[locale]/page.tsx`) swaps `HomeHub` for `LandingPage`. The landing page renders its own nav (reusing the dark header + Ant Design `Menu` pattern from `Layout.tsx` but adding a CTA button), a full-viewport hero section, six alternating feature sections, a final CTA, and the existing `Footer` component. All new copy lives in a `landing` i18n namespace in both `messages/en.json` and `messages/fr.json`.

**Tech Stack:** Next.js App Router, next-intl (`useTranslations()`), Ant Design (`Layout.Header`, `Menu`), collocated CSS files (BEM-style class names), `IntersectionObserver` for scroll-triggered fade-in animations.

---

## File Map

### New files

| File | Responsibility |
|---|---|
| `src/components/LandingPage/LandingPage.tsx` | Root component — assembles all sections |
| `src/components/LandingPage/LandingPage.css` | Page-level layout (flex column, section resets) |
| `src/components/LandingPage/LandingNav.tsx` | Nav bar with logo, menu links, and CTA button |
| `src/components/LandingPage/LandingNav.css` | Nav styles (dark background, logo, CTA pill) |
| `src/components/LandingPage/LandingHero.tsx` | Full-viewport hero section |
| `src/components/LandingPage/LandingHero.css` | Hero: bg image, overlay, centered content, CTA |
| `src/components/LandingPage/LandingFeature.tsx` | Reusable feature section (text + visual, alternating) |
| `src/components/LandingPage/LandingFeature.css` | Feature section: layout, color schemes, tags |
| `src/components/LandingPage/LandingFinalCta.tsx` | Closing CTA section |
| `src/components/LandingPage/LandingFinalCta.css` | Final CTA styles (echoes hero) |
| `src/components/LandingPage/useFadeIn.ts` | `IntersectionObserver` scroll animation hook |
| `src/components/LandingPage/visuals/CharacterSheetVisual.tsx` | CSS mockup: stat grid + inventory |
| `src/components/LandingPage/visuals/CharacterSheetVisual.css` | |
| `src/components/LandingPage/visuals/MapVisual.tsx` | CSS mockup: hex grid |
| `src/components/LandingPage/visuals/MapVisual.css` | |
| `src/components/LandingPage/visuals/JournalVisual.tsx` | CSS mockup: journal entry |
| `src/components/LandingPage/visuals/JournalVisual.css` | |
| `src/components/LandingPage/visuals/DiceVisual.tsx` | CSS mockup: dice + playing card |
| `src/components/LandingPage/visuals/DiceVisual.css` | |
| `src/components/LandingPage/visuals/MusicVisual.tsx` | CSS mockup: audio player + playlist |
| `src/components/LandingPage/visuals/MusicVisual.css` | |
| `src/components/LandingPage/visuals/GeneratorVisual.tsx` | CSS mockup: NPC card |
| `src/components/LandingPage/visuals/GeneratorVisual.css` | |

### Modified files

| File | Change |
|---|---|
| `messages/en.json` | Add `landing` top-level key |
| `messages/fr.json` | Add `landing` top-level key (French) |
| `src/app/[locale]/page.tsx` | Import `LandingPage` instead of `HomeHub` |

### Deleted files

| File | Reason |
|---|---|
| `src/components/HomeHub/HomeHub.tsx` | Replaced by `LandingPage` |

---

## Task 1: Add i18n keys

**Files:**
- Modify: `messages/en.json` (add before final `}`)
- Modify: `messages/fr.json` (add before final `}`)

No tests — message files are validated at build time by next-intl.

- [ ] **Step 1: Add English landing keys to `messages/en.json`**

Add the following block as a new top-level key, immediately before the final closing `}`:

```json
  ,
  "landing": {
    "nav": {
      "cta": "Begin your journey →"
    },
    "hero": {
      "eyebrow": "A companion app for The Protector's Memories",
      "title": "ProMe",
      "tagline": "Your journal, map, and toolkit for journeying through a forgotten world.",
      "cta": "Begin your journey",
      "sub": "Free · No account required · Runs in your browser"
    },
    "features": {
      "character": {
        "number": "01 — Your Protector",
        "title": "A living character sheet",
        "body": "Track everything that matters — health, stamina, resources, inventory, spells — on a persistent sheet that remembers your Protector between sessions. No spreadsheets, no paper.",
        "tags": {
          "one": "Stats & Clock",
          "two": "Inventory",
          "three": "Spellbook",
          "four": "Notes"
        }
      },
      "map": {
        "number": "02 — The World",
        "title": "An interactive map of every step",
        "body": "Draw your journey hex by hex. Each cell holds its biome, encounters, and notes. The world grows as you explore — and stays exactly as you left it.",
        "tags": {
          "one": "6 Biomes",
          "two": "Hex Grid",
          "three": "Encounters",
          "four": "Annotations"
        }
      },
      "journal": {
        "number": "03 — Your Story",
        "title": "Markdown-powered journaling",
        "body": "Write your memories in rich Markdown. Embed dice rolls, card draws, and map references directly in your entries. Your story, told in your words.",
        "tags": {
          "one": "Markdown",
          "two": "Embeds",
          "three": "Timeline"
        }
      },
      "dice": {
        "number": "04 — The Oracle",
        "title": "Dice rolls & card draws, built in",
        "body": "Roll any die, draw from a standard deck — all within the app. Results feed directly into your journal and character sheet. No physical dice required.",
        "tags": {
          "one": "d4–d20",
          "two": "Card Deck",
          "three": "Roll History"
        }
      },
      "music": {
        "number": "05 — The Ambiance",
        "title": "Atmospheric soundtracks, always ready",
        "body": "Curated TableTopAudio playlists for every biome and mood — shadow forest, flooded plains, silent desert. Set the scene without leaving the app.",
        "tags": {
          "one": "TableTopAudio",
          "two": "Per-biome",
          "three": "Background play"
        }
      },
      "generators": {
        "number": "06 — The World's People",
        "title": "NPC & village generators",
        "body": "Populate your world instantly. Generate named inhabitants with faction, age, personality, and backstory — or roll up an entire village with establishments and traits.",
        "tags": {
          "one": "NPC Generator",
          "two": "Village Generator",
          "three": "Factions"
        }
      }
    },
    "finalCta": {
      "title": "Ready to begin your journey?",
      "sub": "Create your Protector and step into the world.",
      "cta": "Create your Protector"
    }
  }
```

- [ ] **Step 2: Add French landing keys to `messages/fr.json`**

Add the following block as a new top-level key, immediately before the final closing `}`:

```json
  ,
  "landing": {
    "nav": {
      "cta": "Commencer votre voyage →"
    },
    "hero": {
      "eyebrow": "Une application compagnon pour Les Mémoires du Protecteur",
      "title": "ProMe",
      "tagline": "Votre journal, carte et boîte à outils pour explorer un monde oublié.",
      "cta": "Commencer votre voyage",
      "sub": "Gratuit · Sans compte · Fonctionne dans votre navigateur"
    },
    "features": {
      "character": {
        "number": "01 — Votre Protecteur",
        "title": "Une fiche de personnage vivante",
        "body": "Suivez tout ce qui compte — santé, endurance, ressources, inventaire, sorts — sur une fiche persistante qui se souvient de votre Protecteur entre les sessions. Ni tableur, ni papier.",
        "tags": {
          "one": "Stats & Horloge",
          "two": "Inventaire",
          "three": "Grimoire",
          "four": "Notes"
        }
      },
      "map": {
        "number": "02 — Le Monde",
        "title": "Une carte interactive de chaque pas",
        "body": "Dessinez votre voyage hexagone par hexagone. Chaque case contient son biome, ses rencontres et ses notes. Le monde grandit au fil de votre exploration.",
        "tags": {
          "one": "6 Biomes",
          "two": "Grille hexagonale",
          "three": "Rencontres",
          "four": "Annotations"
        }
      },
      "journal": {
        "number": "03 — Votre Histoire",
        "title": "Journalisation en Markdown",
        "body": "Rédigez vos souvenirs en Markdown enrichi. Intégrez des jets de dés, des tirages de cartes et des références à la carte directement dans vos entrées. Votre histoire, dans vos mots.",
        "tags": {
          "one": "Markdown",
          "two": "Intégrations",
          "three": "Chronologie"
        }
      },
      "dice": {
        "number": "04 — L'Oracle",
        "title": "Jets de dés & tirages de cartes intégrés",
        "body": "Lancez n'importe quel dé, tirez d'un jeu standard — tout depuis l'application. Les résultats alimentent directement votre journal et votre fiche de personnage.",
        "tags": {
          "one": "d4–d20",
          "two": "Jeu de cartes",
          "three": "Historique"
        }
      },
      "music": {
        "number": "05 — L'Ambiance",
        "title": "Bandes sonores atmosphériques, toujours prêtes",
        "body": "Des playlists TableTopAudio pour chaque biome — forêt des ombres, plaines inondées, désert silencieux. Posez l'atmosphère sans quitter l'application.",
        "tags": {
          "one": "TableTopAudio",
          "two": "Par biome",
          "three": "Lecture en arrière-plan"
        }
      },
      "generators": {
        "number": "06 — Les Gens du Monde",
        "title": "Générateurs de PNJ & de villages",
        "body": "Peuplez votre monde instantanément. Générez des habitants nommés avec faction, âge, personnalité et contexte — ou créez un village entier avec ses établissements et ses traits.",
        "tags": {
          "one": "Générateur de PNJ",
          "two": "Générateur de village",
          "three": "Factions"
        }
      }
    },
    "finalCta": {
      "title": "Prêt à commencer votre voyage ?",
      "sub": "Créez votre Protecteur et entrez dans le monde.",
      "cta": "Créer votre Protecteur"
    }
  }
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: no TypeScript or next-intl errors.

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/fr.json
git commit -m "feat: add landing page i18n keys (en + fr)"
```

---

## Task 2: `useFadeIn` hook

**Files:**
- Create: `src/components/LandingPage/useFadeIn.ts`

No unit tests — this hook lives in `src/components/` which is excluded from coverage.

- [ ] **Step 1: Create `src/components/LandingPage/useFadeIn.ts`**

```typescript
import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to the returned ref. When the element
 * enters the viewport, adds the `FadeIn--visible` class which triggers the
 * CSS transition defined in LandingPage.css. Respects prefers-reduced-motion.
 */
export function useFadeIn<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      el.classList.add('FadeIn--visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('FadeIn--visible')
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LandingPage/useFadeIn.ts
git commit -m "feat: add useFadeIn scroll animation hook"
```

---

## Task 3: `LandingNav`

**Files:**
- Create: `src/components/LandingPage/LandingNav.tsx`
- Create: `src/components/LandingPage/LandingNav.css`

- [ ] **Step 1: Create `src/components/LandingPage/LandingNav.css`**

```css
.LandingNav.LandingNav {
  display: flex;
  align-items: center;
  padding-inline: 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  --ant-layout-header-height: 3em;
}

.LandingNav__logo {
  color: white;
  font-variant: small-caps;
  letter-spacing: 0.05em;
  font-family: cursive;
  font-weight: 700;
  font-size: 1.1rem;
  padding-inline-end: 1rem;
  flex-shrink: 0;
}

.LandingNav__menu {
  flex: 1;
  min-width: 0;
}

.LandingNav__menu .ant-menu-item:has([data-current='true']),
.LandingNav__menu .ant-menu-item:has([data-current='true']):hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.LandingNav__cta.LandingNav__cta {
  flex-shrink: 0;
  margin-inline-start: 1rem;
  padding: 0.3rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: white;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  white-space: nowrap;
  transition: background 200ms;
}

.LandingNav__cta.LandingNav__cta:hover {
  background: rgba(255, 255, 255, 0.25);
}

@media (max-width: 767px) {
  .LandingNav__logo {
    display: none;
  }
}
```

- [ ] **Step 2: Create `src/components/LandingPage/LandingNav.tsx`**

```tsx
'use client'

import { Layout, Menu } from 'antd'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { usePathname } from '@/i18n/navigation'
import './LandingNav.css'

export function LandingNav() {
  const t = useTranslations()
  const pathname = usePathname()

  const items = useMemo(
    () => [
      {
        key: '/',
        label: (
          <BlockedLink href='/' data-current={pathname === '/'}>
            {t('nav.home')}
          </BlockedLink>
        ),
      },
      {
        key: '/characters',
        label: (
          <BlockedLink
            href='/characters'
            data-current={pathname.startsWith('/characters')}>
            {t('nav.characters')}
          </BlockedLink>
        ),
      },
      {
        key: '/generators/npc',
        label: (
          <BlockedLink
            href='/generators/npc'
            data-current={pathname.startsWith('/generators/npc')}>
            {t('nav.inhabitant_generator')}
          </BlockedLink>
        ),
      },
      {
        key: '/generators/village',
        label: (
          <BlockedLink
            href='/generators/village'
            data-current={pathname.startsWith('/generators/village')}>
            {t('nav.village_generator')}
          </BlockedLink>
        ),
      },
      {
        key: '/faq',
        label: (
          <BlockedLink
            href='/faq'
            data-current={pathname.startsWith('/faq')}
            data-position='right'>
            {t('nav.faq')}
          </BlockedLink>
        ),
      },
      {
        key: '/settings',
        label: (
          <BlockedLink
            href='/settings'
            data-current={pathname.startsWith('/settings')}>
            {t('nav.settings')}
          </BlockedLink>
        ),
      },
    ],
    [pathname, t]
  )

  return (
    <Layout.Header className='LandingNav'>
      <span className='LandingNav__logo'>ProMe</span>
      <Menu
        className='LandingNav__menu'
        theme='dark'
        mode='horizontal'
        items={items}
        style={{ flex: 1, minWidth: 0 }}
      />
      <BlockedLink href='/characters/new' className='LandingNav__cta'>
        {t('landing.nav.cta')}
      </BlockedLink>
    </Layout.Header>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npm run build 2>&1 | grep -E "error|LandingNav"
```

Expected: no errors referencing LandingNav.

- [ ] **Step 4: Commit**

```bash
git add src/components/LandingPage/LandingNav.tsx src/components/LandingPage/LandingNav.css
git commit -m "feat: add LandingNav with CTA button"
```

---

## Task 4: `LandingHero`

**Files:**
- Create: `src/components/LandingPage/LandingHero.tsx`
- Create: `src/components/LandingPage/LandingHero.css`

The hero expects an image at `public/images/landing-hero.webp`. Until the MidJourney image is generated, a CSS gradient fallback is baked into the CSS so the section looks good without the file.

- [ ] **Step 1: Create `src/components/LandingPage/LandingHero.css`**

```css
.LandingHero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  /* Gradient fallback — replaced by real image once available */
  background:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.06) 0%,
      rgba(0, 0, 0, 0.02) 40%,
      rgba(0, 0, 0, 0.38) 100%
    ),
    linear-gradient(
      180deg,
      #a8d8d2 0%,
      #c0e4b8 42%,
      #d8c880 72%,
      #c8a860 100%
    );

  background-size: cover;
  background-position: center;
}

/* When the real hero image exists, add it here: */
/* .LandingHero { background-image: url('/images/landing-hero.webp'), ... } */

.LandingHero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
  max-width: 640px;
}

.LandingHero__eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.88);
  margin-bottom: 0.6rem;
}

.LandingHero__title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(3.5rem, 8vw, 6rem);
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.18);
  letter-spacing: 0.04em;
  line-height: 1;
  margin-bottom: 0;
}

.LandingHero__divider {
  width: 60px;
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
  margin: 1rem auto;
}

.LandingHero__tagline {
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  color: rgba(255, 255, 255, 0.92);
  font-style: italic;
  line-height: 1.6;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
  margin-bottom: 1.75rem;
}

.LandingHero__cta {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: white;
  color: #2d5e28;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
  transition: transform 150ms, box-shadow 150ms;
}

.LandingHero__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.22);
}

.LandingHero__sub {
  display: block;
  margin-top: 1rem;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.06em;
}

@media (max-width: 767px) {
  .LandingHero {
    min-height: 85svh;
  }
}
```

- [ ] **Step 2: Create `src/components/LandingPage/LandingHero.tsx`**

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import './LandingHero.css'

export function LandingHero() {
  const t = useTranslations()

  return (
    <section className='LandingHero'>
      <div className='LandingHero__content'>
        <p className='LandingHero__eyebrow'>{t('landing.hero.eyebrow')}</p>
        <h1 className='LandingHero__title'>{t('landing.hero.title')}</h1>
        <div className='LandingHero__divider' aria-hidden='true' />
        <p className='LandingHero__tagline'>{t('landing.hero.tagline')}</p>
        <BlockedLink href='/characters/new' className='LandingHero__cta'>
          {t('landing.hero.cta')}
        </BlockedLink>
        <span className='LandingHero__sub'>{t('landing.hero.sub')}</span>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add real hero image (when ready)**

When the MidJourney-generated landscape image is available, place it at `public/images/landing-hero.webp`, then update `LandingHero.css` to add it as the background image:

```css
.LandingHero {
  background-image:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.06) 0%,
      rgba(0, 0, 0, 0.02) 40%,
      rgba(0, 0, 0, 0.38) 100%
    ),
    url('/images/landing-hero.webp');
  background-size: cover;
  background-position: center 30%;
}
```

This step can be done at any time after the image is generated — no code changes required beyond the CSS.

- [ ] **Step 4: Commit**

```bash
git add src/components/LandingPage/LandingHero.tsx src/components/LandingPage/LandingHero.css
git commit -m "feat: add LandingHero full-viewport section"
```

---

## Task 5: `LandingFeature`

**Files:**
- Create: `src/components/LandingPage/LandingFeature.tsx`
- Create: `src/components/LandingPage/LandingFeature.css`

This is the reusable section component used six times. It takes text content + a visual slot (ReactNode) and a `colorScheme` string that drives background/text colors via CSS class.

- [ ] **Step 1: Create `src/components/LandingPage/LandingFeature.css`**

```css
.LandingFeature {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 400ms ease-out,
    transform 400ms ease-out;
}

.LandingFeature.FadeIn--visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .LandingFeature {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.LandingFeature__inner {
  display: flex;
  align-items: center;
  gap: 4rem;
  padding: 5rem 6rem;
  max-width: 1280px;
  margin: 0 auto;
}

.LandingFeature--reversed .LandingFeature__inner {
  flex-direction: row-reverse;
}

@media (max-width: 1024px) {
  .LandingFeature__inner {
    padding: 3.5rem 3rem;
    gap: 2.5rem;
  }
}

@media (max-width: 767px) {
  .LandingFeature__inner,
  .LandingFeature--reversed .LandingFeature__inner {
    flex-direction: column;
    padding: 2.5rem 1.5rem;
    gap: 2rem;
  }
}

/* Text side */
.LandingFeature__text {
  flex: 1;
  min-width: 0;
}

.LandingFeature__number {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 0.5rem;
}

.LandingFeature__title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 0.75rem;
}

.LandingFeature__body {
  font-size: 0.95rem;
  line-height: 1.75;
  opacity: 0.82;
  max-width: 420px;
}

.LandingFeature__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1rem;
}

.LandingFeature__tag {
  font-size: 0.65rem;
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Visual side */
.LandingFeature__visual {
  flex: 1;
  min-height: 260px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Color schemes ── */

/* sage (character sheet) */
.LandingFeature--sage {
  background: #f2f8ef;
  color: #1e3820;
}
.LandingFeature--sage .LandingFeature__title { color: #2d5e28; }
.LandingFeature--sage .LandingFeature__tag {
  background: #cce8c2;
  color: #2d5e28;
}
.LandingFeature--sage .LandingFeature__visual {
  background: linear-gradient(135deg, #e4f2df 0%, #cce4c6 100%);
  border: 1px solid #b8d8b0;
}

/* purple-dark (map) */
.LandingFeature--purple-dark {
  background: #18122a;
  color: #e2d8f4;
}
.LandingFeature--purple-dark .LandingFeature__title { color: #cbbcee; }
.LandingFeature--purple-dark .LandingFeature__tag {
  background: rgba(203, 188, 238, 0.18);
  color: #cbbcee;
}
.LandingFeature--purple-dark .LandingFeature__visual {
  background: #221a38;
  border: 1px solid rgba(203, 188, 238, 0.2);
}

/* parchment (journal) */
.LandingFeature--parchment {
  background: #faf5e8;
  color: #3a2e1a;
}
.LandingFeature--parchment .LandingFeature__title { color: #5a3e14; }
.LandingFeature--parchment .LandingFeature__tag {
  background: #ede0c4;
  color: #7a5820;
}
.LandingFeature--parchment .LandingFeature__visual {
  background: #f2e8d0;
  border: 1px solid #ddd0a8;
}

/* terracotta-dark (dice) */
.LandingFeature--terracotta-dark {
  background: #201410;
  color: #f0e0d0;
}
.LandingFeature--terracotta-dark .LandingFeature__title { color: #e8a078; }
.LandingFeature--terracotta-dark .LandingFeature__tag {
  background: rgba(232, 160, 120, 0.18);
  color: #e8a078;
}
.LandingFeature--terracotta-dark .LandingFeature__visual {
  background: #301c14;
  border: 1px solid rgba(232, 160, 120, 0.2);
}

/* teal (music) */
.LandingFeature--teal {
  background: #edf8f8;
  color: #1a3838;
}
.LandingFeature--teal .LandingFeature__title { color: #1a6870; }
.LandingFeature--teal .LandingFeature__tag {
  background: #c4e8ec;
  color: #1a6070;
}
.LandingFeature--teal .LandingFeature__visual {
  background: linear-gradient(135deg, #d4f0f4 0%, #b8e4ea 100%);
  border: 1px solid #a8d4dc;
}

/* gold-dark (generators) */
.LandingFeature--gold-dark {
  background: #1c1808;
  color: #f0e8cc;
}
.LandingFeature--gold-dark .LandingFeature__title { color: #e8c870; }
.LandingFeature--gold-dark .LandingFeature__tag {
  background: rgba(232, 200, 112, 0.18);
  color: #e8c870;
}
.LandingFeature--gold-dark .LandingFeature__visual {
  background: #2c2410;
  border: 1px solid rgba(232, 200, 112, 0.2);
}
```

- [ ] **Step 2: Create `src/components/LandingPage/LandingFeature.tsx`**

```tsx
'use client'

import type { ReactNode } from 'react'
import { useFadeIn } from './useFadeIn'
import './LandingFeature.css'

type ColorScheme =
  | 'sage'
  | 'purple-dark'
  | 'parchment'
  | 'terracotta-dark'
  | 'teal'
  | 'gold-dark'

type Props = {
  number: string
  title: string
  body: string
  tags: string[]
  visual: ReactNode
  reversed?: boolean
  colorScheme: ColorScheme
}

export function LandingFeature({
  number,
  title,
  body,
  tags,
  visual,
  reversed = false,
  colorScheme,
}: Props) {
  const ref = useFadeIn<HTMLElement>()

  return (
    <section
      ref={ref}
      className={[
        'LandingFeature',
        `LandingFeature--${colorScheme}`,
        reversed ? 'LandingFeature--reversed' : '',
      ]
        .filter(Boolean)
        .join(' ')}>
      <div className='LandingFeature__inner'>
        <div className='LandingFeature__text'>
          <p className='LandingFeature__number'>{number}</p>
          <h2 className='LandingFeature__title'>{title}</h2>
          <p className='LandingFeature__body'>{body}</p>
          <div className='LandingFeature__tags'>
            {tags.map(tag => (
              <span key={tag} className='LandingFeature__tag'>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className='LandingFeature__visual'>{visual}</div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/LandingPage/LandingFeature.tsx src/components/LandingPage/LandingFeature.css
git commit -m "feat: add LandingFeature reusable section component"
```

---

## Task 6: Feature visual components

**Files:**
- Create: `src/components/LandingPage/visuals/CharacterSheetVisual.tsx` + `.css`
- Create: `src/components/LandingPage/visuals/MapVisual.tsx` + `.css`
- Create: `src/components/LandingPage/visuals/JournalVisual.tsx` + `.css`
- Create: `src/components/LandingPage/visuals/DiceVisual.tsx` + `.css`
- Create: `src/components/LandingPage/visuals/MusicVisual.tsx` + `.css`
- Create: `src/components/LandingPage/visuals/GeneratorVisual.tsx` + `.css`

All visuals are CSS-only decorative mockups. None need i18n (they use fictional sample data).

- [ ] **Step 1: Create `CharacterSheetVisual.css` and `CharacterSheetVisual.tsx`**

`src/components/LandingPage/visuals/CharacterSheetVisual.css`:
```css
.CharacterSheetVisual {
  padding: 1.25rem;
  width: 100%;
  font-size: 0.82rem;
}

.CharacterSheetVisual__name {
  font-family: Georgia, serif;
  font-size: 1rem;
  font-weight: 700;
  color: #2d5e28;
  border-bottom: 1px solid #b8d8b0;
  padding-bottom: 0.4rem;
  margin-bottom: 0.75rem;
}

.CharacterSheetVisual__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.CharacterSheetVisual__stat {
  background: white;
  border: 1px solid #b8d8b0;
  border-radius: 6px;
  padding: 0.35rem 0.25rem;
  text-align: center;
}

.CharacterSheetVisual__stat-value {
  display: block;
  font-family: Georgia, serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d5e28;
  line-height: 1;
}

.CharacterSheetVisual__stat-label {
  display: block;
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #5a8055;
  margin-top: 0.2rem;
}

.CharacterSheetVisual__inventory {
  background: white;
  border: 1px solid #b8d8b0;
  border-radius: 6px;
  overflow: hidden;
}

.CharacterSheetVisual__item {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.5rem;
  font-size: 0.7rem;
  color: #3a5838;
  border-bottom: 1px dashed #d4ecd0;
}

.CharacterSheetVisual__item:last-child {
  border-bottom: none;
}
```

`src/components/LandingPage/visuals/CharacterSheetVisual.tsx`:
```tsx
import './CharacterSheetVisual.css'

export function CharacterSheetVisual() {
  return (
    <div className='CharacterSheetVisual' aria-hidden='true'>
      <div className='CharacterSheetVisual__name'>Elden · Shadow Forest</div>
      <div className='CharacterSheetVisual__stats'>
        {[
          { value: '8', label: 'Health' },
          { value: '6', label: 'Stamina' },
          { value: '3', label: 'Magic' },
          { value: '12', label: 'Gold' },
        ].map(s => (
          <div key={s.label} className='CharacterSheetVisual__stat'>
            <span className='CharacterSheetVisual__stat-value'>{s.value}</span>
            <span className='CharacterSheetVisual__stat-label'>{s.label}</span>
          </div>
        ))}
      </div>
      <div className='CharacterSheetVisual__inventory'>
        {[
          ['Healing Potion', '×2'],
          ['Old Lantern', '×1'],
          ['Rope (10m)', '×1'],
        ].map(([name, qty]) => (
          <div key={name} className='CharacterSheetVisual__item'>
            <span>{name}</span>
            <span>{qty}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `MapVisual.css` and `MapVisual.tsx`**

`src/components/LandingPage/visuals/MapVisual.css`:
```css
.MapVisual {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
  padding: 1.25rem;
  width: 100%;
}

.MapVisual__cell {
  aspect-ratio: 1;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.MapVisual__cell--unexplored {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.MapVisual__cell--forest {
  background: rgba(90, 160, 100, 0.45);
  border: 1px solid rgba(90, 160, 100, 0.65);
}
.MapVisual__cell--purple {
  background: rgba(167, 147, 195, 0.4);
  border: 1px solid rgba(167, 147, 195, 0.6);
}
.MapVisual__cell--blue {
  background: rgba(94, 196, 232, 0.35);
  border: 1px solid rgba(94, 196, 232, 0.6);
}
.MapVisual__cell--sand {
  background: rgba(220, 185, 110, 0.4);
  border: 1px solid rgba(220, 185, 110, 0.6);
}
.MapVisual__cell--current {
  background: rgba(255, 255, 255, 0.14);
  border: 2px solid rgba(255, 255, 255, 0.75);
}
```

`src/components/LandingPage/visuals/MapVisual.tsx`:
```tsx
import './MapVisual.css'

type CellType = 'unexplored' | 'forest' | 'purple' | 'blue' | 'sand' | 'current'

const GRID: Array<[CellType, string?]> = [
  ['unexplored'], ['forest', '🌿'], ['forest'], ['unexplored'], ['unexplored'],
  ['forest'], ['current', '📍'], ['purple'], ['purple'], ['unexplored'],
  ['sand'], ['sand'], ['blue'], ['blue'], ['unexplored'],
  ['unexplored'], ['sand'], ['sand'], ['unexplored'], ['unexplored'],
]

export function MapVisual() {
  return (
    <div className='MapVisual' aria-hidden='true'>
      {GRID.map(([type, icon], i) => (
        <div key={i} className={`MapVisual__cell MapVisual__cell--${type}`}>
          {icon}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create `JournalVisual.css` and `JournalVisual.tsx`**

`src/components/LandingPage/visuals/JournalVisual.css`:
```css
.JournalVisual {
  padding: 1.25rem 1.5rem;
  width: 100%;
}

.JournalVisual__date {
  font-size: 0.58rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b89050;
  margin-bottom: 0.35rem;
}

.JournalVisual__title {
  font-family: Georgia, serif;
  font-size: 1rem;
  font-weight: 700;
  color: #3a2e1a;
  margin-bottom: 0.6rem;
}

.JournalVisual__line {
  height: 7px;
  background: #e8dfc8;
  border-radius: 3px;
  margin-bottom: 0.35rem;
}

.JournalVisual__line--short { width: 55%; }
.JournalVisual__line--med   { width: 78%; }
.JournalVisual__line--full  { width: 100%; }

.JournalVisual__embed {
  height: 22px;
  background: rgba(184, 144, 80, 0.12);
  border-left: 2px solid rgba(184, 144, 80, 0.55);
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  font-size: 0.55rem;
  color: #9a7040;
  margin-bottom: 0.35rem;
}
```

`src/components/LandingPage/visuals/JournalVisual.tsx`:
```tsx
import './JournalVisual.css'

export function JournalVisual() {
  return (
    <div className='JournalVisual' aria-hidden='true'>
      <div className='JournalVisual__date'>Day 12 · Flooded Plains</div>
      <div className='JournalVisual__title'>The bridge is gone.</div>
      <div className='JournalVisual__line JournalVisual__line--full' />
      <div className='JournalVisual__line JournalVisual__line--med' />
      <div className='JournalVisual__embed'>📍 Arrived at the Flooded Plains</div>
      <div className='JournalVisual__line JournalVisual__line--full' />
      <div className='JournalVisual__line JournalVisual__line--short' />
      <div className='JournalVisual__line JournalVisual__line--med' />
    </div>
  )
}
```

- [ ] **Step 4: Create `DiceVisual.css` and `DiceVisual.tsx`**

`src/components/LandingPage/visuals/DiceVisual.css`:
```css
.DiceVisual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  width: 100%;
}

.DiceVisual__die {
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Georgia, serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
}

.DiceVisual__die--featured {
  width: 66px;
  height: 66px;
  font-size: 1.7rem;
  background: rgba(232, 160, 120, 0.3);
  border-color: rgba(232, 160, 120, 0.6);
}

.DiceVisual__card {
  width: 44px;
  height: 62px;
  background: white;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.4);
}
```

`src/components/LandingPage/visuals/DiceVisual.tsx`:
```tsx
import './DiceVisual.css'

export function DiceVisual() {
  return (
    <div className='DiceVisual' aria-hidden='true'>
      <div className='DiceVisual__die'>4</div>
      <div className='DiceVisual__die DiceVisual__die--featured'>17</div>
      <div className='DiceVisual__die'>12</div>
      <div className='DiceVisual__card'>🃏</div>
    </div>
  )
}
```

- [ ] **Step 5: Create `MusicVisual.css` and `MusicVisual.tsx`**

`src/components/LandingPage/visuals/MusicVisual.css`:
```css
.MusicVisual {
  padding: 1.25rem 1.5rem;
  width: 100%;
  font-size: 0.8rem;
  color: #1a4a50;
}

.MusicVisual__track {
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 0.15rem;
}

.MusicVisual__source {
  font-size: 0.58rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(26, 74, 80, 0.6);
  margin-bottom: 0.6rem;
}

.MusicVisual__bar {
  height: 4px;
  background: #a8d0d8;
  border-radius: 2px;
  position: relative;
  margin-bottom: 0.5rem;
}

.MusicVisual__bar::after {
  content: '';
  position: absolute;
  inset-block: 0;
  left: 0;
  width: 38%;
  background: #1a8090;
  border-radius: 2px;
}

.MusicVisual__controls {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: rgba(26, 74, 80, 0.5);
}

.MusicVisual__controls--play {
  color: #1a6870;
  font-size: 1.15rem;
}

.MusicVisual__playlist {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.MusicVisual__playlist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.65rem;
  padding: 0.28rem 0;
  border-bottom: 1px solid rgba(26, 74, 80, 0.1);
  color: rgba(26, 74, 80, 0.65);
}

.MusicVisual__playlist-item:last-child {
  border-bottom: none;
}

.MusicVisual__playlist-item--active {
  color: #1a6870;
  font-weight: 700;
}
```

`src/components/LandingPage/visuals/MusicVisual.tsx`:
```tsx
import './MusicVisual.css'

const PLAYLIST = [
  { name: 'Shadow Forest — Nightfall', active: true },
  { name: 'Flooded Plains — Rain', active: false },
  { name: 'Silent Desert — Wind', active: false },
]

export function MusicVisual() {
  return (
    <div className='MusicVisual' aria-hidden='true'>
      <div className='MusicVisual__track'>Shadow Forest — Nightfall</div>
      <div className='MusicVisual__source'>TableTopAudio · Atmospheric</div>
      <div className='MusicVisual__bar' />
      <div className='MusicVisual__controls'>
        <span>⏮</span>
        <span className='MusicVisual__controls--play'>⏸</span>
        <span>⏭</span>
      </div>
      <div className='MusicVisual__playlist'>
        {PLAYLIST.map(({ name, active }) => (
          <div
            key={name}
            className={[
              'MusicVisual__playlist-item',
              active ? 'MusicVisual__playlist-item--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}>
            <span>{name}</span>
            {active && <span>▶</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create `GeneratorVisual.css` and `GeneratorVisual.tsx`**

`src/components/LandingPage/visuals/GeneratorVisual.css`:
```css
.GeneratorVisual {
  padding: 1.25rem;
  width: 100%;
}

.GeneratorVisual__name {
  font-family: Georgia, serif;
  font-size: 1rem;
  font-weight: 700;
  color: #f4e0b0;
  margin-bottom: 0.15rem;
}

.GeneratorVisual__role {
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(220, 180, 80, 0.75);
  margin-bottom: 0.7rem;
}

.GeneratorVisual__attrs {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.GeneratorVisual__attr {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.7rem;
  padding: 0.28rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  color: rgba(244, 232, 204, 0.78);
}

.GeneratorVisual__attr:last-child {
  border-bottom: none;
}

.GeneratorVisual__attr-value {
  color: #e8c870;
  font-weight: 600;
  text-align: right;
  flex-shrink: 0;
}
```

`src/components/LandingPage/visuals/GeneratorVisual.tsx`:
```tsx
import './GeneratorVisual.css'

const ATTRS = [
  { label: 'Age', value: '34' },
  { label: 'Personality', value: 'Cautious, warm' },
  { label: 'Faction', value: "Wanderer's Guild" },
  { label: 'Context', value: 'Seeking rare herbs' },
]

export function GeneratorVisual() {
  return (
    <div className='GeneratorVisual' aria-hidden='true'>
      <div className='GeneratorVisual__name'>Mara Ashwood</div>
      <div className='GeneratorVisual__role'>Herbalist · Wanderer's Guild</div>
      <div className='GeneratorVisual__attrs'>
        {ATTRS.map(({ label, value }) => (
          <div key={label} className='GeneratorVisual__attr'>
            <span>{label}</span>
            <span className='GeneratorVisual__attr-value'>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/LandingPage/visuals/
git commit -m "feat: add landing page feature visual components"
```

---

## Task 7: `LandingFinalCta`

**Files:**
- Create: `src/components/LandingPage/LandingFinalCta.tsx`
- Create: `src/components/LandingPage/LandingFinalCta.css`

- [ ] **Step 1: Create `src/components/LandingPage/LandingFinalCta.css`**

```css
.LandingFinalCta {
  position: relative;
  padding: 6rem 2rem;
  text-align: center;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #a8d8d2 0%,
    #c0e4b8 45%,
    #d8c880 78%,
    #c8a860 100%
  );
}

.LandingFinalCta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.18);
  pointer-events: none;
}

.LandingFinalCta__content {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 400ms ease-out,
    transform 400ms ease-out;
}

.LandingFinalCta__content.FadeIn--visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .LandingFinalCta__content {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.LandingFinalCta__title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  color: white;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  margin-bottom: 0.5rem;
}

.LandingFinalCta__sub {
  color: rgba(255, 255, 255, 0.88);
  font-size: 1rem;
  font-style: italic;
  margin-bottom: 2rem;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.LandingFinalCta__cta {
  display: inline-block;
  padding: 0.85rem 2.4rem;
  background: white;
  color: #2d5e28;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
  transition: transform 150ms, box-shadow 150ms;
}

.LandingFinalCta__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.22);
}
```

- [ ] **Step 2: Create `src/components/LandingPage/LandingFinalCta.tsx`**

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { useFadeIn } from './useFadeIn'
import './LandingFinalCta.css'

export function LandingFinalCta() {
  const t = useTranslations()
  const ref = useFadeIn()

  return (
    <section className='LandingFinalCta'>
      <div ref={ref} className='LandingFinalCta__content'>
        <h2 className='LandingFinalCta__title'>{t('landing.finalCta.title')}</h2>
        <p className='LandingFinalCta__sub'>{t('landing.finalCta.sub')}</p>
        <BlockedLink href='/characters/new' className='LandingFinalCta__cta'>
          {t('landing.finalCta.cta')}
        </BlockedLink>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/LandingPage/LandingFinalCta.tsx src/components/LandingPage/LandingFinalCta.css
git commit -m "feat: add LandingFinalCta closing section"
```

---

## Task 8: Assemble `LandingPage`

**Files:**
- Create: `src/components/LandingPage/LandingPage.tsx`
- Create: `src/components/LandingPage/LandingPage.css`

- [ ] **Step 1: Create `src/components/LandingPage/LandingPage.css`**

```css
.LandingPage {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.LandingPage__main {
  flex: 1;
}

/* Ensure the Footer inside LandingPage gets the same padding as elsewhere */
.LandingPage .Footer {
  padding: 1em 3em;
}

@media (max-width: 767px) {
  .LandingPage .Footer {
    padding: 1em;
  }
}
```

- [ ] **Step 2: Create `src/components/LandingPage/LandingPage.tsx`**

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { Footer } from '@/components/Footer/Footer'
import { LandingFinalCta } from './LandingFinalCta'
import { LandingFeature } from './LandingFeature'
import { LandingHero } from './LandingHero'
import { LandingNav } from './LandingNav'
import { CharacterSheetVisual } from './visuals/CharacterSheetVisual'
import { DiceVisual } from './visuals/DiceVisual'
import { GeneratorVisual } from './visuals/GeneratorVisual'
import { JournalVisual } from './visuals/JournalVisual'
import { MapVisual } from './visuals/MapVisual'
import { MusicVisual } from './visuals/MusicVisual'
import './LandingPage.css'

export function LandingPage() {
  const t = useTranslations()

  return (
    <div className='LandingPage'>
      <LandingNav />
      <LandingHero />
      <main className='LandingPage__main'>
        <LandingFeature
          number={t('landing.features.character.number')}
          title={t('landing.features.character.title')}
          body={t('landing.features.character.body')}
          tags={[
            t('landing.features.character.tags.one'),
            t('landing.features.character.tags.two'),
            t('landing.features.character.tags.three'),
            t('landing.features.character.tags.four'),
          ]}
          visual={<CharacterSheetVisual />}
          colorScheme='sage'
        />
        <LandingFeature
          number={t('landing.features.map.number')}
          title={t('landing.features.map.title')}
          body={t('landing.features.map.body')}
          tags={[
            t('landing.features.map.tags.one'),
            t('landing.features.map.tags.two'),
            t('landing.features.map.tags.three'),
            t('landing.features.map.tags.four'),
          ]}
          visual={<MapVisual />}
          colorScheme='purple-dark'
          reversed
        />
        <LandingFeature
          number={t('landing.features.journal.number')}
          title={t('landing.features.journal.title')}
          body={t('landing.features.journal.body')}
          tags={[
            t('landing.features.journal.tags.one'),
            t('landing.features.journal.tags.two'),
            t('landing.features.journal.tags.three'),
          ]}
          visual={<JournalVisual />}
          colorScheme='parchment'
        />
        <LandingFeature
          number={t('landing.features.dice.number')}
          title={t('landing.features.dice.title')}
          body={t('landing.features.dice.body')}
          tags={[
            t('landing.features.dice.tags.one'),
            t('landing.features.dice.tags.two'),
            t('landing.features.dice.tags.three'),
          ]}
          visual={<DiceVisual />}
          colorScheme='terracotta-dark'
          reversed
        />
        <LandingFeature
          number={t('landing.features.music.number')}
          title={t('landing.features.music.title')}
          body={t('landing.features.music.body')}
          tags={[
            t('landing.features.music.tags.one'),
            t('landing.features.music.tags.two'),
            t('landing.features.music.tags.three'),
          ]}
          visual={<MusicVisual />}
          colorScheme='teal'
        />
        <LandingFeature
          number={t('landing.features.generators.number')}
          title={t('landing.features.generators.title')}
          body={t('landing.features.generators.body')}
          tags={[
            t('landing.features.generators.tags.one'),
            t('landing.features.generators.tags.two'),
            t('landing.features.generators.tags.three'),
          ]}
          visual={<GeneratorVisual />}
          colorScheme='gold-dark'
          reversed
        />
      </main>
      <LandingFinalCta />
      <Footer />
    </div>
  )
}
```

- [ ] **Step 3: Verify the build**

```bash
npm run build
```

Expected: clean build, no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/LandingPage/LandingPage.tsx src/components/LandingPage/LandingPage.css
git commit -m "feat: assemble LandingPage component"
```

---

## Task 9: Wire up the route and delete HomeHub

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Delete: `src/components/HomeHub/HomeHub.tsx`

- [ ] **Step 1: Add `.superpowers/` to `.gitignore`**

Append to `.gitignore`:

```
.superpowers/
```

- [ ] **Step 2: Update `src/app/[locale]/page.tsx`**

Replace the entire file contents with:

```tsx
import { AppConfig } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'
import { LandingPage } from '@/components/LandingPage/LandingPage'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: { absolute: t('metadata.title') },
  }
}

export default function Home({ params }: Props) {
  const { locale } = use(params)

  setRequestLocale(locale as AppConfig['Locale'])

  return <LandingPage />
}
```

- [ ] **Step 3: Delete `HomeHub`**

```bash
rm src/components/HomeHub/HomeHub.tsx
```

- [ ] **Step 4: Check for any remaining imports of HomeHub**

```bash
grep -r 'HomeHub' src/
```

Expected: no output. If any files still import `HomeHub`, update them to import `LandingPage` instead.

- [ ] **Step 5: Run the dev server and verify visually**

```bash
npm run dev
```

Open http://localhost:3000 and confirm:
- Nav renders with logo, links, and "Begin your journey →" CTA pill
- Hero section fills the viewport with gradient background + centered text + white CTA button
- Six feature sections scroll below, alternating light/dark
- Feature sections fade in as they enter the viewport
- Final CTA section echoes the hero gradient
- Footer renders correctly
- Switch locale to `/fr` and confirm French translations appear

- [ ] **Step 6: Run lint and format check**

```bash
npm run lint && npm run format:check
```

Fix any issues reported, then re-run to confirm clean.

- [ ] **Step 7: Final commit**

```bash
git add .gitignore src/app/[locale]/page.tsx
git commit -m "feat: replace HomeHub with LandingPage on home route"
```

---

## Post-launch: hero image

When the MidJourney landscape image is ready, place it at `public/images/landing-hero.webp` and update `LandingHero.css` as described in Task 4, Step 3. No component changes required.
