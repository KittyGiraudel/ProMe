# Character Creation Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dropdown-based archetype selector on the character creation page with three rich, clickable cards showing lore, stats, and the archetype's special power.

**Architecture:** A new `ArchetypeSelector` component is a custom Ant Design Form-compatible control (accepts `value`/`onChange`). `CharacterCreate` is restructured to render a slim name+gender card followed by the `ArchetypeSelector` directly. `IdentityCard` is left untouched — it continues to be used as-is on the character edit page.

**Tech Stack:** Next.js App Router, Ant Design, next-intl, TypeScript, CSS (PascalCase BEM), Biome (no semis, single quotes)

---

### Task 1: Add lore translation keys

**Files:**
- Modify: `messages/fr.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Add French lore keys**

In `messages/fr.json`, find the `"common"` → `"archetypes"` → `"power"` block (around line 244) and add a sibling `"lore"` object after it:

```json
"lore": {
  "warrior": "Vos souvenirs peuvent être fragmentaires mais quelque chose vous dit que pour sauver le monde, combat sera inévitable.",
  "pilgrim": "Le monde vous est inconnu mais vous savez que le périple sera long et parsemé d'embûches. Pour accomplir votre mission, tout dépendra de ce voyage.",
  "bard": "Pour remplir votre mission, il faudra que votre cœur soit ouvert et votre esprit curieux pour collecter les histoires qui vous attendent en chemin."
}
```

The resulting structure under `common.archetypes` should be:
```json
"archetypes": {
  "name": { ... },
  "power": { ... },
  "lore": {
    "warrior": "Vos souvenirs peuvent être fragmentaires...",
    "pilgrim": "Le monde vous est inconnu...",
    "bard": "Pour remplir votre mission..."
  }
}
```

- [ ] **Step 2: Add English lore keys**

In `messages/en.json`, find the same location and add:

```json
"lore": {
  "warrior": "Your memories may be fragmented, but something tells you that to save the world, combat will be inevitable.",
  "pilgrim": "The world is unknown to you, but you know the journey will be long and fraught with peril. To accomplish your mission, everything will depend on this voyage.",
  "bard": "To fulfil your mission, your heart must be open and your mind curious to collect the stories that await you along the way."
}
```

- [ ] **Step 3: Verify JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('messages/fr.json','utf8')); JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('OK')"
```

Expected output: `OK`

- [ ] **Step 4: Commit**

```bash
git add messages/fr.json messages/en.json
git commit -m "feat: add archetype lore translation keys"
```

---

### Task 2: Create ArchetypeSelector component

**Files:**
- Create: `src/components/ArchetypeSelector/ArchetypeSelector.css`
- Create: `src/components/ArchetypeSelector/ArchetypeSelector.tsx`

- [ ] **Step 1: Create the CSS file**

Create `src/components/ArchetypeSelector/ArchetypeSelector.css`:

```css
.ArchetypeSelector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.ArchetypeSelector__Card {
  background: var(--ant-color-bg-container);
  border: 1.5px solid var(--ant-color-border);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}

.ArchetypeSelector__Card:hover {
  border-color: #8ab4a0;
  box-shadow: 0 2px 8px rgba(45, 106, 79, 0.12);
}

.ArchetypeSelector__Card--selected {
  border: 2px solid #2d6a4f;
  box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.12);
}

.ArchetypeSelector__Card:focus-visible {
  outline: 2px solid #2d6a4f;
  outline-offset: 2px;
}

.ArchetypeSelector__Image {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.ArchetypeSelector__Image--warrior {
  background: linear-gradient(160deg, #3d1f1f 0%, #6b2d2d 50%, #8b4a3a 100%);
}

.ArchetypeSelector__Image--pilgrim {
  background: linear-gradient(160deg, #1f2d3d 0%, #2d4a6b 50%, #3a6b8b 100%);
}

.ArchetypeSelector__Image--bard {
  background: linear-gradient(160deg, #3d3220 0%, #7a5c2a 50%, #a07840 100%);
}

.ArchetypeSelector__Icon {
  font-size: 36px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

.ArchetypeSelector__ImageHint {
  position: absolute;
  bottom: 6px;
  right: 8px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

.ArchetypeSelector__Card--selected .ArchetypeSelector__Image::after {
  content: '✓';
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #2d6a4f;
  color: white;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
}

.ArchetypeSelector__Body {
  padding: 12px 14px 14px;
}

.ArchetypeSelector__Name {
  font-size: 15px;
  font-weight: 700;
  color: #1f3a2a;
  margin-bottom: 8px;
}

.ArchetypeSelector__Card--selected .ArchetypeSelector__Name {
  color: #2d6a4f;
}

.ArchetypeSelector__Quote {
  font-size: 11.5px;
  font-style: italic;
  color: #7a6447;
  line-height: 1.5;
  margin: 0 0 10px;
  padding-left: 8px;
  border-left: 2px solid var(--ant-color-border);
}

.ArchetypeSelector__Card--selected .ArchetypeSelector__Quote {
  border-left-color: #2d6a4f;
}

.ArchetypeSelector__Stats {
  display: flex;
  gap: 4px;
  margin-bottom: 10px;
}

.ArchetypeSelector__StatPill {
  flex: 1;
  text-align: center;
  background: #f5ece0;
  border: 1px solid var(--ant-color-border-secondary);
  border-radius: 6px;
  padding: 4px 2px;
}

.ArchetypeSelector__StatLabel {
  display: block;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #9b8b72;
  margin-bottom: 2px;
}

.ArchetypeSelector__StatValue {
  display: block;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
}

.ArchetypeSelector__StatValue--health {
  color: #b94040;
}

.ArchetypeSelector__StatValue--courage {
  color: #c07820;
}

.ArchetypeSelector__StatValue--stamina {
  color: #2d7a50;
}

.ArchetypeSelector__Power {
  background: #f5ece0;
  border-radius: 6px;
  padding: 7px 9px;
  font-size: 11px;
  color: #5a4a2e;
  line-height: 1.45;
}

.ArchetypeSelector__PowerLabel {
  display: block;
  font-weight: 700;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9b8b72;
  margin-bottom: 3px;
}

@media (max-width: 600px) {
  .ArchetypeSelector {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Create the component**

Create `src/components/ArchetypeSelector/ArchetypeSelector.tsx`:

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { getDefaultPoolsForArchetype } from '@/lib/character/model'
import type { Archetype } from '@/lib/character/types'
import './ArchetypeSelector.css'

const ARCHETYPE_ICONS: Record<Archetype, string> = {
  warrior: '⚔️',
  pilgrim: '🧳',
  bard: '🎵',
}

const ARCHETYPES: Archetype[] = ['warrior', 'pilgrim', 'bard']

type Props = {
  value?: Archetype
  onChange?: (value: Archetype) => void
}

export function ArchetypeSelector({ value, onChange }: Props) {
  const t = useTranslations()

  return (
    <div className='ArchetypeSelector' role='radiogroup'>
      {ARCHETYPES.map(archetype => {
        const pools = getDefaultPoolsForArchetype(archetype)
        const isSelected = value === archetype

        return (
          <div
            key={archetype}
            className={`ArchetypeSelector__Card${isSelected ? ' ArchetypeSelector__Card--selected' : ''}`}
            role='radio'
            aria-checked={isSelected}
            tabIndex={0}
            onClick={() => onChange?.(archetype)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') onChange?.(archetype)
            }}>
            <div
              className={`ArchetypeSelector__Image ArchetypeSelector__Image--${archetype}`}>
              <span className='ArchetypeSelector__Icon'>
                {ARCHETYPE_ICONS[archetype]}
              </span>
              <span className='ArchetypeSelector__ImageHint'>
                illustration à venir
              </span>
            </div>
            <div className='ArchetypeSelector__Body'>
              <div className='ArchetypeSelector__Name'>
                {t(`common.archetypes.name.${archetype}`, {
                  gender: 'indeterminate',
                })}
              </div>
              <blockquote className='ArchetypeSelector__Quote'>
                {t(`common.archetypes.lore.${archetype}`)}
              </blockquote>
              <div className='ArchetypeSelector__Stats'>
                <div className='ArchetypeSelector__StatPill'>
                  <span className='ArchetypeSelector__StatLabel'>
                    {t('characters.identity.health_label_short')}
                  </span>
                  <span className='ArchetypeSelector__StatValue ArchetypeSelector__StatValue--health'>
                    {pools.health.max}
                  </span>
                </div>
                <div className='ArchetypeSelector__StatPill'>
                  <span className='ArchetypeSelector__StatLabel'>
                    {t('characters.identity.courage_label_short')}
                  </span>
                  <span className='ArchetypeSelector__StatValue ArchetypeSelector__StatValue--courage'>
                    {pools.courage.max}
                  </span>
                </div>
                <div className='ArchetypeSelector__StatPill'>
                  <span className='ArchetypeSelector__StatLabel'>
                    {t('characters.identity.stamina_label_short')}
                  </span>
                  <span className='ArchetypeSelector__StatValue ArchetypeSelector__StatValue--stamina'>
                    {pools.stamina.max}
                  </span>
                </div>
              </div>
              <div className='ArchetypeSelector__Power'>
                <span className='ArchetypeSelector__PowerLabel'>
                  {t('characters.identity.archetype_power_label')}
                </span>
                {t(`common.archetypes.power.${archetype}_description`)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Verify no lint errors**

```bash
npm run lint
```

Expected: no errors in the new files.

- [ ] **Step 4: Commit**

```bash
git add src/components/ArchetypeSelector/
git commit -m "feat: add ArchetypeSelector card picker component"
```

---

### Task 3: Restructure CharacterCreate

**Files:**
- Modify: `src/components/PageCharacterCreate/CharacterCreate.tsx`

- [ ] **Step 1: Rewrite CharacterCreate**

Replace the entire contents of `src/components/PageCharacterCreate/CharacterCreate.tsx` with:

```tsx
'use client'

import { Card, Col, Form, Input, Row, Select } from 'antd'
import { useTranslations } from 'next-intl'
import { ArchetypeSelector } from '@/components/ArchetypeSelector/ArchetypeSelector'
import { Button } from '@/components/Button/Button'
import { InheritanceCard } from '@/components/InheritanceCard/InheritanceCard'
import { Layout } from '@/components/Layout/Layout'
import { Spacing } from '@/components/Spacing/Spacing'
import { useCharacterCreate } from '@/hooks/useCharacterCreate'
import { useInheritanceCandidates } from '@/hooks/useInheritanceCandidates'
import type { Archetype } from '@/lib/character/types'
import { GENDERS } from '@/lib/constants/misc'
import type { Gender } from '@/lib/types'

type CharacterCreateFormValues = {
  name: string
  archetype: Archetype
  gender?: Gender
  inheritFromCharacterId?: string
}

export function CharacterCreate() {
  const t = useTranslations()
  const [form] = Form.useForm<CharacterCreateFormValues>()
  const handleCreate = useCharacterCreate()
  const candidates = useInheritanceCandidates()

  return (
    <Layout
      title={t('new_character.title')}
      bannerBiome='floodedPlains'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.characters'), path: '/characters' },
        { title: t('nav.new_character'), path: '/characters/new' },
      ]}>
      <Form<CharacterCreateFormValues>
        form={form}
        layout='vertical'
        colon={false}
        initialValues={{
          name: '',
          archetype: 'warrior',
          gender: undefined,
          inheritFromCharacterId: undefined,
        }}
        onFinish={handleCreate}>
        <Spacing>
          <Card title={t('characters.identity.identity_section')} id='identity'>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <Form.Item
                  rules={[{ required: true }]}
                  name='name'
                  label={t('characters.identity.name_label')}
                  style={{ marginBottom: 0 }}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name='gender'
                  label={t('characters.identity.gender_label')}
                  style={{ marginBottom: 0 }}>
                  <Select
                    allowClear
                    style={{ width: '100%' }}
                    options={GENDERS.map(gender => ({
                      value: gender,
                      label: t(`common.genders.${gender}`),
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Form.Item
            rules={[{ required: true }]}
            name='archetype'
            label={t('characters.identity.archetype_label')}>
            <ArchetypeSelector />
          </Form.Item>

          <InheritanceCard candidates={candidates} />

          <Spacing orientation='horizontal' wrap>
            <Button type='primary' htmlType='submit'>
              {t('new_character.create')}
            </Button>
            <Button htmlType='button' type='link' href='/characters'>
              {t('common.actions.cancel')}
            </Button>
          </Spacing>
        </Spacing>
      </Form>
    </Layout>
  )
}
```

- [ ] **Step 2: Verify no lint errors**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Verify production build compiles**

```bash
npm run build
```

Expected: exits 0 with no TypeScript errors.

- [ ] **Step 4: Smoke test in the browser**

Run `npm run dev` and open `http://localhost:3000/fr/characters/new`. Verify:
- Name and gender fields appear in the Identity card
- Three archetype cards render below, with the Warrior pre-selected (green border + checkmark)
- Clicking each card updates the selection
- Submitting with a name creates the character and redirects to the identity tab

- [ ] **Step 5: Verify the edit page is unaffected**

Open an existing character's identity tab (`/fr/characters/[id]/identity`). Verify the archetype field still renders as a readonly dropdown via `IdentityCard` — unchanged.

- [ ] **Step 6: Commit**

```bash
git add src/components/PageCharacterCreate/CharacterCreate.tsx
git commit -m "feat: redesign character creation with immersive archetype cards"
```
