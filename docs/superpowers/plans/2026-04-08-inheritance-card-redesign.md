# Inheritance Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the `InheritanceCard` component with a decorative image banner, a two-column inherited/not-inherited list, and general polish.

**Architecture:** Pure UI change — no hook, store, or route modifications. New CSS file alongside the component, existing logic (form watch, alert) untouched.

**Tech Stack:** React, Ant Design (`Card` cover prop, `Divider`), next-intl, CSS (PascalCase BEM, `em` units, `rgb(r g b / a)` format).

---

## File Map

| File | Action |
|------|--------|
| `src/components/InheritanceCard/InheritanceCard.css` | **Create** — all new styles |
| `src/components/InheritanceCard/InheritanceCard.tsx` | **Modify** — banner, two-column list, import Divider and CSS |

No other files change. Parent `CharacterCreate.tsx` is untouched.

---

### Task 1: Create the CSS file

**Files:**
- Create: `src/components/InheritanceCard/InheritanceCard.css`

- [ ] **Step 1: Create the CSS file**

```css
/* src/components/InheritanceCard/InheritanceCard.css */

.InheritanceCard__Banner {
  position: relative;
  height: 5em;
  background:
    linear-gradient(to bottom, transparent 20%, rgb(0 0 0 / 0.55) 100%),
    url('/images/home-cover.avif') center 40% / cover no-repeat;
  display: flex;
  align-items: flex-end;
  padding: 0 1em 0.65em;
}

.InheritanceCard__BannerTitle {
  color: white;
  font-size: 0.9em;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 6px rgb(0 0 0 / 0.4);
}

.InheritanceCard__Cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75em 1em;
}

.InheritanceCard__ColLabel {
  font-size: 0.7em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.4em;
}

.InheritanceCard__ColLabel--inherited {
  color: rgb(82 196 26);
}

.InheritanceCard__ColLabel--fresh {
  color: rgb(192 192 192);
}

.InheritanceCard__Row {
  display: flex;
  align-items: flex-start;
  gap: 0.45em;
  padding: 0.25em 0;
  font-size: 0.85em;
  line-height: 1.4;
  border-bottom: 1px solid rgb(250 250 250);
}

.InheritanceCard__Row--inherited {
  color: inherit;
}

.InheritanceCard__Row--fresh {
  color: rgb(192 192 192);
}

.InheritanceCard__Dot {
  width: 0.4em;
  height: 0.4em;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.4em;
}

.InheritanceCard__Row--inherited .InheritanceCard__Dot {
  background: rgb(82 196 26);
}

.InheritanceCard__Row--fresh .InheritanceCard__Dot {
  background: rgb(217 217 217);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/InheritanceCard/InheritanceCard.css
git commit -m "Add InheritanceCard styles"
```

---

### Task 2: Update the component

**Files:**
- Modify: `src/components/InheritanceCard/InheritanceCard.tsx`

- [ ] **Step 1: Replace the component with the updated version**

Replace the entire file content:

```tsx
'use client'

import { Alert, Card, Divider, Form, Select } from 'antd'
import { useTranslations } from 'next-intl'
import type { InheritanceCandidate } from '@/hooks/useInheritanceCandidates'
import type { Archetype } from '@/lib/character/types'
import './InheritanceCard.css'

const INHERITED_ITEMS = [
  'Map exploration and discovered biomes',
  'Journal entries and memories',
]

const FRESH_ITEMS = [
  'Soul, Courage & Stamina points',
  'Honor and Inspiration',
  'Gold and money',
  'Inventory items',
  'Spellbook entries',
]

export function InheritanceCard({
  candidates,
}: {
  candidates: InheritanceCandidate[]
}) {
  const t = useTranslations()
  const form = Form.useFormInstance()
  const selectedId = Form.useWatch<string>('inheritFromCharacterId', {
    form,
    preserve: true,
  })
  const newArchetype = Form.useWatch<Archetype>('archetype', {
    form,
    preserve: true,
  })
  const newName = Form.useWatch<string>('name', { form, preserve: true }) ?? ''

  const selectedCandidate = candidates.find(c => c.id === selectedId)

  const description = selectedCandidate
    ? newArchetype === selectedCandidate.character.archetype
      ? t('new_character.inheritance_same_archetype_description', {
          nameNew: newName,
          nameOld: selectedCandidate.label,
        })
      : t('new_character.inheritance_different_archetype_description', {
          nameNew: newName,
          nameOld: selectedCandidate.label,
        })
    : null

  const banner = (
    <div className='InheritanceCard__Banner'>
      <span className='InheritanceCard__BannerTitle'>
        {t('new_character.inheritance_section')}
      </span>
    </div>
  )

  return (
    <Card cover={banner}>
      <Form.Item
        name='inheritFromCharacterId'
        label={t('new_character.inheritance_select_label')}
        help={t('new_character.inheritance_select_help')}
        style={{ marginBottom: 0 }}>
        <Select
          allowClear
          placeholder={t('new_character.inheritance_select_placeholder')}
          options={candidates.map(candidate => ({
            value: candidate.id,
            label: candidate.label,
          }))}
          notFoundContent={t('new_character.inheritance_empty')}
        />
      </Form.Item>
      <Divider />
      <div className='InheritanceCard__Cols'>
        <div>
          <div className='InheritanceCard__ColLabel InheritanceCard__ColLabel--inherited'>
            Inherited
          </div>
          {INHERITED_ITEMS.map(item => (
            <div
              key={item}
              className='InheritanceCard__Row InheritanceCard__Row--inherited'>
              <span className='InheritanceCard__Dot' />
              {item}
            </div>
          ))}
        </div>
        <div>
          <div className='InheritanceCard__ColLabel InheritanceCard__ColLabel--fresh'>
            Not inherited
          </div>
          {FRESH_ITEMS.map(item => (
            <div
              key={item}
              className='InheritanceCard__Row InheritanceCard__Row--fresh'>
              <span className='InheritanceCard__Dot' />
              {item}
            </div>
          ))}
        </div>
      </div>
      {description && <Alert title={description} type='info' />}
    </Card>
  )
}
```

- [ ] **Step 2: Run the formatter**

```bash
npm run format
```

Expected: file reformatted with no errors (single quotes, no semis).

- [ ] **Step 3: Verify visually**

```bash
npm run dev
```

Open `http://localhost:3000/en/characters/new` (or `/fr/`). Check:
- Decorative image banner renders with "Inheritance" title in white over a gradient
- Two-column list always visible, green dots left / grey dots right
- Selecting a Protector from the dropdown shows the contextual alert below the list
- No layout breakage in the surrounding form

- [ ] **Step 4: Commit**

```bash
git add src/components/InheritanceCard/InheritanceCard.tsx
git commit -m "Redesign InheritanceCard with banner and two-column layout"
```
