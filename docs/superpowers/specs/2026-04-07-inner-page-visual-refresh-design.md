# Inner Page Visual Refresh — Design Spec

**Date:** 2026-04-07
**Scope:** Light theme only. Dark mode is untouched.

---

## Goal

The landing page feels polished and distinctive. The inner pages (character sheets, generators, settings, map, FAQ…) feel generic — sharp-white, default-blue Ant Design. This refresh brings them in line: warmer, more natural, less dashboard-y, while keeping the existing structure and component usage intact.

---

## Decisions

### Color direction: Forest & Parchment

| Role | Token / var | Value | Notes |
|---|---|---|---|
| Page background | `--prome-bg` / `colorBgLayout` | `#faf8f3` | Warm parchment, replaces `#f6f9f7` |
| Card / input surfaces | `--prome-surface` / `colorBgContainer` | `#fff9ee` | Warm off-white, replaces `#ffffff` |
| Elevated surfaces (modals, popovers, dropdowns, notifications) | `colorBgElevated` | `#fff9ee` | Consistent with container; Ant Design defaults to pure white |
| Border | `--prome-border` / `colorBorder` | `#e2d9c4` | Earthier, replaces `#d8e5df` |
| Muted text | `--prome-muted` | `#5c726b` | **Unchanged** — already passes WCAG AA (4.9:1 on parchment) |
| Primary action color | `colorPrimary` | `#2d6a4f` | Deep forest green, replaces Ant Design default blue |

### Contrast audit (WCAG 2.2 AA — 4.5:1 normal text, 3:1 large text / UI components)

| Pair | Ratio | Result |
|---|---|---|
| Main text `#1f3a2a` on parchment | 11.8:1 | ✅ Pass |
| White on primary green button | 6.4:1 | ✅ Pass |
| Primary green `#2d6a4f` on parchment | 6.1:1 | ✅ Pass |
| Muted text `#5c726b` on parchment | 4.9:1 | ✅ Pass |
| Card header text on gradient (`#e2f0e8`→`#f5f0e4`) | 10.5:1 | ✅ Pass |

⚠️ The warm brown `#9a8870` (3.3:1 on parchment) must **not** be used for text — use `#5c726b` instead.

### Buttons: pill shape

Use Ant Design component-level tokens on `Button` so only buttons get the pill shape, not all components:

```ts
components: {
  Button: {
    borderRadius: 20,
    borderRadiusSM: 16,
    borderRadiusLG: 24,
  }
}
```

Base `borderRadius` seed token: `10` (affects cards, inputs, tags, segmented controls, etc.).

### Card headers: green→parchment gradient

Every Ant Design `Card` header gets a gradient wash via CSS. This is not achievable via tokens alone.

```css
.ant-card .ant-card-head {
  background: linear-gradient(135deg, #e2f0e8 0%, #f5f0e4 100%);
  border-bottom-color: #d8cfbe;
}
```

---

## Files changed

### 1. `src/components/AppProviders/ThemeProvider.tsx`

Add token overrides to `ConfigProvider`. Only applied to the light algorithm — dark mode is untouched.

```ts
const lightTokens = {
  token: {
    colorPrimary: '#2d6a4f',
    colorBgContainer: '#fff9ee',
    colorBgLayout: '#faf8f3',
    colorBgElevated: '#fff9ee',
    colorBorder: '#e2d9c4',
    borderRadius: 10,
  },
  components: {
    Button: {
      borderRadius: 20,
      borderRadiusSM: 16,
      borderRadiusLG: 24,
    },
  },
}
```

Pass `lightTokens` only when `algorithm === antdTheme.defaultAlgorithm`.

### 2. `src/app/globals.css`

Update CSS custom properties:

```css
:root {
  --prome-bg: #faf8f3;          /* was #f6f9f7 */
  --prome-surface: #fff9ee;     /* was #ffffff */
  --prome-border: #e2d9c4;      /* was #d8e5df */
  --prome-border-radius: 10px;  /* new — used by Layout.css; was undefined (fell back to 0) */
  /* --prome-text and --prome-muted unchanged */
}
```

### 3. `src/app/app-theme.css` (new file)

Ant Design overrides that cannot be expressed as tokens. Imported in `src/app/layout.tsx` alongside `globals.css`.

```css
/* Card header gradient */
.ant-card .ant-card-head {
  background: linear-gradient(135deg, #e2f0e8 0%, #f5f0e4 100%);
  border-bottom-color: #d8cfbe;
}

/* Breadcrumb separator and inactive items */
.ant-breadcrumb .ant-breadcrumb-separator {
  color: #c4b89a;
}
.ant-breadcrumb li:last-child .ant-breadcrumb-link {
  color: #4a4036;
}
```

### 4. `src/app/layout.tsx`

Add import for the new stylesheet:

```ts
import './app-theme.css'
```

---

## Out of scope

- Dark mode — entirely untouched
- Landing page — already polished, no changes
- Typography / font changes
- Component-level color changes (biome tags, progress bars, character stat colors) — potential follow-up
- Any structural/layout changes
