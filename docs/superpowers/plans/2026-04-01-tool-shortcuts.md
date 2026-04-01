# Tool Keyboard Shortcuts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `cmd+R` (dice roll) and `cmd+D` (card draw) keyboard shortcuts to the character sheet, each displaying an animated Ant notification using the existing display primitives.

**Architecture:** Two new auto-animating result components (`DiceRollResult`, `CardDrawResult`) are created alongside their parent components. The existing `useKeyboardShortcuts` hook is extended with `App.useApp()` to fire notifications on `cmd+R` / `cmd+D`. The hook file is renamed `.tsx` to support JSX in the notification description.

**Tech Stack:** React, Ant Design (`App.useApp()`, `notification`), `next-intl` (`useTranslations`), existing `DiceFaces` / `PlayingCardLabel` display primitives, `rollD6` / `randomCard` from `@/lib/rng`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/components/DiceRoll/DiceRollResult.tsx` | Auto-animating dice result for notifications |
| Create | `src/components/DiceRoll/DiceRollResult.css` | Sizing + animation for DiceRollResult |
| Create | `src/components/CardDraw/CardDrawResult.tsx` | Auto-animating card result for notifications |
| Create | `src/components/CardDraw/CardDrawResult.css` | Sizing + animation for CardDrawResult |
| Rename → Modify | `src/components/PageCharacterSheet/useKeyboardShortcuts.ts` → `.tsx` | Add cmd+R / cmd+D shortcut handlers |

---

## Task 1: `DiceRollResult` component

**Files:**
- Create: `src/components/DiceRoll/DiceRollResult.tsx`
- Create: `src/components/DiceRoll/DiceRollResult.css`

Note: The codebase has no React component tests — all tests cover pure utility functions. Consistent with that pattern, no test file is added here; `rollD6` is already tested in `src/lib/rng.test.ts`.

- [ ] **Step 1: Create `DiceRollResult.css`**

```css
.DiceRollResult__die-face {
  font-size: 3em;
}

.DiceRollResult--rolling .DiceRollResult__die-face {
  animation: DiceRollResult-pulse 0.16s ease-in-out infinite;
}

@keyframes DiceRollResult-pulse {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.08) rotate(-2deg);
  }
}
```

- [ ] **Step 2: Create `DiceRollResult.tsx`**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { DiceFaces } from '@/components/DiceFaces/DiceFaces'
import { rollD6 } from '@/lib/rng'
import './DiceRollResult.css'

export function DiceRollResult() {
  const [dieValue, setDieValue] = useState<number>(() => rollD6(Math.random))
  const [isRolling, setIsRolling] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDieValue(rollD6(Math.random))
    }, 90)

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setDieValue(rollD6(Math.random))
      setIsRolling(false)
    }, 1400)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <span
      className={[
        'DiceRollResult',
        isRolling ? 'DiceRollResult--rolling' : '',
      ]
        .filter(Boolean)
        .join(' ')}>
      <DiceFaces values={[dieValue]} className='DiceRollResult__die-face' />
    </span>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/DiceRoll/DiceRollResult.tsx src/components/DiceRoll/DiceRollResult.css
git commit -m "feat: add DiceRollResult auto-animating notification component"
```

---

## Task 2: `CardDrawResult` component

**Files:**
- Create: `src/components/CardDraw/CardDrawResult.tsx`
- Create: `src/components/CardDraw/CardDrawResult.css`

- [ ] **Step 1: Create `CardDrawResult.css`**

```css
.CardDrawResult__card {
  font-size: 1.65em;
}

.CardDrawResult--drawing .CardDrawResult__card {
  animation: CardDrawResult-flip 0.18s ease-in-out infinite;
}

@keyframes CardDrawResult-flip {
  0% {
    transform: rotateY(0deg) scale(1);
    opacity: 0.92;
  }
  50% {
    transform: rotateY(80deg) scale(1.04);
    opacity: 0.62;
  }
  100% {
    transform: rotateY(0deg) scale(1);
    opacity: 0.92;
  }
}
```

- [ ] **Step 2: Create `CardDrawResult.tsx`**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { randomCard } from '@/lib/rng'
import type { PlayingCard } from '@/lib/types'
import './CardDrawResult.css'

export function CardDrawResult() {
  const [card, setCard] = useState<PlayingCard>(() => randomCard(Math.random))
  const [isDrawing, setIsDrawing] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCard(randomCard(Math.random))
    }, 90)

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setCard(randomCard(Math.random))
      setIsDrawing(false)
    }, 1400)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <span
      className={[
        'CardDrawResult',
        isDrawing ? 'CardDrawResult--drawing' : '',
      ]
        .filter(Boolean)
        .join(' ')}>
      <PlayingCardLabel card={card} className='CardDrawResult__card' />
    </span>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CardDraw/CardDrawResult.tsx src/components/CardDraw/CardDrawResult.css
git commit -m "feat: add CardDrawResult auto-animating notification component"
```

---

## Task 3: Extend `useKeyboardShortcuts` with tool shortcuts

**Files:**
- Rename + Modify: `src/components/PageCharacterSheet/useKeyboardShortcuts.ts` → `useKeyboardShortcuts.tsx`

The import in `CharacterSheetShell.tsx` uses `'./useKeyboardShortcuts'` (no extension), so the rename is transparent to consumers. The file is renamed to `.tsx` because the notification `description` prop receives JSX elements (`<DiceRollResult />`, `<CardDrawResult />`).

- [ ] **Step 1: Rename the file**

```bash
git mv src/components/PageCharacterSheet/useKeyboardShortcuts.ts \
        src/components/PageCharacterSheet/useKeyboardShortcuts.tsx
```

- [ ] **Step 2: Replace the file contents**

Full new content of `src/components/PageCharacterSheet/useKeyboardShortcuts.tsx`:

```tsx
import { App } from 'antd'
import type { FormInstance } from 'antd/es/form'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { CardDrawResult } from '@/components/CardDraw/CardDrawResult'
import { DiceRollResult } from '@/components/DiceRoll/DiceRollResult'

export function useKeyboardShortcuts({
  form,
  isDead,
}: {
  form: FormInstance
  isDead: boolean
}) {
  const t = useTranslations()
  const { notification } = App.useApp()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey

      if (isMeta && e.key === 's') {
        e.preventDefault()
        if (!isDead) form.submit()
      }

      if (isMeta && e.key === 'r') {
        e.preventDefault()
        notification.open({
          message: t('characters.tools.die_title'),
          description: <DiceRollResult />,
        })
      }

      if (isMeta && e.key === 'd') {
        e.preventDefault()
        notification.open({
          message: t('characters.tools.card_title'),
          description: <CardDrawResult />,
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [form, isDead, notification, t])
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/PageCharacterSheet/useKeyboardShortcuts.tsx
git commit -m "feat: add cmd+R / cmd+D tool shortcuts to character sheet"
```

---

## Manual Verification

1. Open any character sheet
2. Press `cmd+R` — an Ant notification should appear in the top-right corner with the die title and an animated dice face that settles after ~1.4s
3. Press `cmd+D` — same for a playing card
4. Press `cmd+R` while a browser tab is focused but NOT on the character sheet — nothing should happen (shortcuts are scoped to the sheet)
5. Confirm `cmd+S` still saves the character sheet as before
