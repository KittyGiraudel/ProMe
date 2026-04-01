# Tool Keyboard Shortcuts Design

**Date:** 2026-04-01
**Scope:** Character sheet — dice roll (`cmd+R`) and card draw (`cmd+D`) keyboard shortcuts with animated Ant Design notifications.

---

## Overview

Add two keyboard shortcuts available anywhere on the character sheet:

- `cmd+R` — roll a d6, show the result in an Ant notification
- `cmd+D` — draw a playing card, show the result in an Ant notification

Both shortcuts must call `e.preventDefault()` to suppress browser defaults (`cmd+R` reloads the page; `cmd+D` bookmarks it).

Results are displayed using the existing `DiceFaces` and `PlayingCardLabel` display primitives, with a brief randomising animation before settling — matching the feel of the tools page, without any surrounding card or button.

---

## Components

### `DiceRollResult`

A small component that auto-starts the dice animation on mount. No button, no card wrapper. Mirrors the animation logic in `DiceRoll` (`setInterval` at 90ms for 1.4s, then settles on a final `rollD6` value). Renders a `DiceFaces` with the current value.

Lives in `src/components/DiceRoll/DiceRollResult.tsx` (or co-located in `DiceRoll.tsx` as an unexported helper — decision deferred to implementation).

### `CardDrawResult`

Same pattern for cards. Auto-starts on mount, animates for 1.4s, settles on a `randomCard` value. Renders a `PlayingCardLabel`.

Lives in `src/components/CardDraw/CardDrawResult.tsx` (or co-located).

---

## Shortcut Hook

`useKeyboardShortcuts` (`src/components/PageCharacterSheet/useKeyboardShortcuts.ts`) is extended:

- Call `const { notification } = App.useApp()` inside the hook
- Add a `cmd+R` branch: `e.preventDefault()`, open a notification with title `characters.tools.die_title` and description `<DiceRollResult />`
- Add a `cmd+D` branch: `e.preventDefault()`, open a notification with title `characters.tools.card_title` and description `<CardDrawResult />`
- Notification placement and duration use Ant defaults (top-right, 4.5s) — long enough to see the animation settle and read the result

The hook already receives `form` and `isDead`; no new parameters are needed.

---

## Data Flow

```
keydown (cmd+R / cmd+D)
  → preventDefault
  → notification.open({ message: t(title), description: <DiceRollResult /> })
       → component mounts, starts setInterval
       → after 1.4s: settles on final value
       → notification auto-closes after 4.5s
```

---

## Out of Scope

- No changes to the tools page itself
- No shortcut indicator in the UI (tooltip, legend, etc.)
- No support for multiple simultaneous rolls/draws
