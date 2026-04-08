# Character Creation Page Redesign

**Date:** 2026-04-08
**Status:** Approved

## Goal

Replace the current form-like character creation page with a more immersive experience. The archetype selection — the most consequential choice a new player makes — should be visually rich and informative rather than a plain dropdown.

## Scope

- Redesign `CharacterCreate` component and surrounding layout
- Create a new `ArchetypeSelector` component (custom Ant Design Form-compatible card picker)
- Add lore quotes and image placeholder areas to archetype cards
- Leave `IdentityCard`, `InheritanceCard`, and all other pages untouched

## Page Structure

The page remains a single form with the same fields. Layout top to bottom:

1. **Identity card** — slim card with name (required) + gender (optional) fields only
2. **Archetype selector** — three clickable cards replacing the dropdown
3. **InheritanceCard** — unchanged
4. **Submit / cancel actions** — unchanged

The current `IdentityCard` component is reused as-is on the character edit page (`isArchetypeReadonly={true}`). On the creation page it is replaced by the new layout described below.

## Identity Card (creation variant)

A standard Ant Design `Card` with title "Identité" containing:
- Name field (`Form.Item`, required, full width or ~2/3)
- Gender field (`Form.Item`, optional, ~1/3 width, existing `Select`)

This replaces the name+archetype+gender row currently inside `IdentityCard` on the creation page.

## Archetype Selector (`ArchetypeSelector` component)

A custom component wrapping three clickable cards. It behaves as a controlled `Form.Item` value (string: `'warrior' | 'pilgrim' | 'bard'`). Clicking a card sets the form field value.

### Card anatomy (per archetype)

```
┌─────────────────────────────┐
│   Image area (90px tall)    │  ← gradient placeholder; designed to hold an
│   [large emoji/icon]        │    illustration later. Coloured by archetype.
└─────────────────────────────┘
│ Archetype name              │
│ ─────────────────────────── │
│ "Lore quote…"  (italic,     │
│  left-border accent)        │
│ ─────────────────────────── │
│ [Santé N] [Courage N]       │
│ [Endurance N]  (stat pills) │
│ ─────────────────────────── │
│ Pouvoir                     │
│ Short power description     │
└─────────────────────────────┘
```

### Image area colours (gradient, dark-to-light diagonal)

| Archetype | Gradient |
|-----------|----------|
| Guerrier·e | Deep red/brown (`#3d1f1f` → `#8b4a3a`) |
| Pèlerin·e | Slate blue (`#1f2d3d` → `#3a6b8b`) |
| Troubadour·esse | Amber/gold (`#3d3220` → `#a07840`) |

Image area includes a subtle "illustration à venir" hint text (bottom-right, low opacity) that can be removed once real artwork is added.

### Stat pills

Three equal-width pills: Santé, Courage, Endurance.
- Background: `#f5ece0`, border: `#d4c5a9`, border-radius: 6px
- Stat label: 9px uppercase, muted
- Stat value: 16px bold, colour-coded (Santé=red `#b94040`, Courage=amber `#c07820`, Endurance=green `#2d7a50`)

Values sourced from `getDefaultPoolsForArchetype()` (already exported from `src/lib/character/model.ts`).

### Power block

Small block below stats. "Pouvoir" label in small uppercase. Text from existing translations (`common.archetypes.power.*_description`).

### Selected state

- Border: 2px solid `#2d6a4f` (primary green)
- Box shadow: `0 0 0 3px rgba(45,106,79,.12)`
- Green checkmark badge (20×20px circle) in the top-right corner of the image area
- Archetype name and lore border-left accent change to primary green

### Hover state (unselected cards)

- Border: `#8ab4a0`
- Box shadow: `0 2px 8px rgba(45,106,79,.12)`

### Responsive

On viewport `< 600px` the three cards stack vertically (single column).

## Lore Quotes

New translation keys to add under `common.archetypes.lore.*`:

| Key | French |
|-----|--------|
| `common.archetypes.lore.warrior` | "Vos souvenirs peuvent être fragmentaires mais quelque chose vous dit que pour sauver le monde, combat sera inévitable." |
| `common.archetypes.lore.pilgrim` | "Le monde vous est inconnu mais vous savez que le périple sera long et parsemé d'embûches. Pour accomplir votre mission, tout dépendra de ce voyage." |
| `common.archetypes.lore.bard` | "Pour remplir votre mission, il faudra que votre cœur soit ouvert et votre esprit curieux pour collecter les histoires qui vous attendent en chemin." |

English equivalents to be added to `messages/en.json` as well (can be same text or translated).

## Components Affected

| File | Change |
|------|--------|
| `src/components/PageCharacterCreate/CharacterCreate.tsx` | Restructure: remove `IdentityCard`, add name+gender card + `ArchetypeSelector` |
| `src/components/ArchetypeSelector/ArchetypeSelector.tsx` | **New** — the card picker component |
| `src/components/ArchetypeSelector/ArchetypeSelector.css` | **New** — styles |
| `messages/fr.json` | Add `common.archetypes.lore.*` keys |
| `messages/en.json` | Add `common.archetypes.lore.*` keys |

`IdentityCard` is **not modified**.

## Out of Scope

- Changes to the character edit/identity page
- Actual archetype illustrations (placeholder design accommodates them)
- Any changes to InheritanceCard, form validation logic, or data model
