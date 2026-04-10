# Modifier Key Hook — Design Spec

**Date:** 2026-04-10

## Overview

Add a `useModifierKey` hook that returns the appropriate keyboard modifier label for the current OS (`'Cmd'` on Mac/iOS, `'Ctrl'` everywhere else). Use it in the settings help text to display the correct key name per platform.

## Hook

**File:** `src/hooks/useModifierKey.ts`

Returns `'Cmd' | 'Ctrl'`. Detects Mac via `navigator.platform` (starts with `'Mac'`). Falls back to `navigator.userAgent` check for `'Mac'` if `platform` is unavailable or empty. Defaults to `'Ctrl'` on the server (SSR) and updates on first client render using `useState` + `useEffect`.

```ts
export function useModifierKey(): 'Cmd' | 'Ctrl' {
  const [key, setKey] = useState<'Cmd' | 'Ctrl'>('Ctrl')
  useEffect(() => {
    const isMac =
      navigator.platform.startsWith('Mac') ||
      /Mac/.test(navigator.userAgent)
    setKey(isMac ? 'Cmd' : 'Ctrl')
  }, [])
  return key
}
```

## i18n

Replace each hardcoded `Cmd` in `shortcuts_enabled_help` with `{modifier}`:

| File | Key | Value |
|------|-----|-------|
| `messages/en.json` | `shortcuts_enabled_help` | `"Enables global keyboard shortcuts: {modifier}+S (save), {modifier}+R (dice roll), {modifier}+D (card draw), {modifier}+M (toggle music), {modifier}+C/V (copy/paste map cell)."` |
| `messages/fr.json` | `shortcuts_enabled_help` | `"Active les raccourcis clavier globaux : {modifier}+S (sauvegarder), {modifier}+R (lancer les dés), {modifier}+D (tirer une carte), {modifier}+M (activer/désactiver la musique), {modifier}+C/V (copier/coller une cellule de carte)."` |

## Settings UI

**File:** `src/components/PageSettings/Settings.tsx`

Call `useModifierKey()` at the top of the `Settings` component and pass the result as an interpolation variable:

```tsx
const modifier = useModifierKey()
// …
t('settings.shortcuts_enabled_help', { modifier })
```

## Scope

- No test needed for the hook itself (it wraps `navigator`, a browser API; the logic is trivial).
- Does not affect the FAQ answer strings, which hardcode "Ctrl" and are out of scope.
