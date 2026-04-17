import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

import {
  classifyUnusedKeys,
  collectDynamicFamilyHits,
  collectTranslationKeyLiterals,
  collectUsedKeys,
  runUnusedKeysCheck,
} from './check-unused-keys.mjs'

const temporaryDirectories = []

async function createFixture({
  locale = { page: { title: 'Bonjour', unused: 'Unused text' } },
  codeFiles = [
    {
      file: 'feature.tsx',
      content: "const t = useTranslations('page'); t('title')",
    },
  ],
}) {
  const root = await mkdtemp(path.join(tmpdir(), 'i18n-unused-'))
  temporaryDirectories.push(root)
  const codeRoot = path.join(root, 'src')
  await mkdir(codeRoot, { recursive: true })

  const catalogPath = path.join(root, 'fr.json')
  await writeFile(catalogPath, JSON.stringify(locale), 'utf8')

  await Promise.all(
    codeFiles.map(async ({ file, content }) => {
      const fullPath = path.join(codeRoot, file)
      await mkdir(path.dirname(fullPath), { recursive: true })
      await writeFile(fullPath, content, 'utf8')
    })
  )

  return { catalogPath, codeRoot }
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map(dir => rm(dir, { recursive: true, force: true }))
  )
})

describe('collectUsedKeys', () => {
  it('extracts scoped translation calls and formatted message IDs', () => {
    const content = `
      const t = useTranslations('sheet')
      t('title')
      t.rich('intro')
      t.raw('rawContent')
      <FormattedMessage id="global.action.save" />
    `

    const used = collectUsedKeys(content)
    expect(used.has('sheet.title')).toBe(true)
    expect(used.has('sheet.intro')).toBe(true)
    expect(used.has('sheet.rawContent')).toBe(true)
    expect(used.has('global.action.save')).toBe(true)
  })
})

describe('collectDynamicFamilyHits', () => {
  it('captures template-based translation prefixes', () => {
    const content = `
      const t = useTranslations()
      t(\`biomes.\${biome}.name\`)
      t(\`common.gathering.\${biome}.\${roll}\`)
    `

    const families = collectDynamicFamilyHits(content)
    expect(families.has('biomes.')).toBe(true)
    expect(families.has('common.gathering.')).toBe(true)
  })
})

describe('collectTranslationKeyLiterals', () => {
  it('extracts translation key strings used as key references', () => {
    const content = `
      new ValidationError('characters.actions.save.invalid_money')
      const successKey = "characters.actions.save.success"
      const ignore = "not.a.translation.key"
    `

    const keys = collectTranslationKeyLiterals(
      content,
      new Set(['characters', 'common'])
    )

    expect(keys.has('characters.actions.save.invalid_money')).toBe(true)
    expect(keys.has('characters.actions.save.success')).toBe(true)
    expect(keys.has('not.a.translation.key')).toBe(false)
  })
})

describe('classifyUnusedKeys', () => {
  it('separates likely unused keys from dynamic-family covered keys', () => {
    const result = classifyUnusedKeys(
      ['biomes.shadowForest.name', 'home.title', 'custom.dynamic.something'],
      ['custom.dynamic.'],
      ['biomes.']
    )

    expect(result.coveredByDynamicFamily).toContain('biomes.shadowForest.name')
    expect(result.unknownDynamicPatterns).toContain('custom.dynamic.something')
    expect(result.unusedLikely).toContain('home.title')
  })
})

describe('runUnusedKeysCheck', () => {
  it('reports unused key', async () => {
    const fixture = await createFixture({})
    const result = await runUnusedKeysCheck(fixture)
    expect(result.unusedLikely).toContain('page.unused')
  })

  it('supports ignore list for known dynamic keys', async () => {
    const fixture = await createFixture({})
    const result = await runUnusedKeysCheck({
      ...fixture,
      ignoreList: ['page.unused'],
    })
    expect(result.unusedLikely).not.toContain('page.unused')
  })

  it('fails only when fail-on-unused is enabled', async () => {
    const fixture = await createFixture({})
    const normal = await runUnusedKeysCheck(fixture)
    const strict = await runUnusedKeysCheck({
      ...fixture,
      failOnUnused: true,
    })

    expect(normal.code).toBe(0)
    expect(strict.code).toBe(1)
  })

  it('fails gracefully when catalog JSON is invalid', async () => {
    const fixture = await createFixture({})
    await writeFile(fixture.catalogPath, '{"page":', 'utf8')
    const result = await runUnusedKeysCheck(fixture)

    expect(result.code).toBe(1)
  })

  it('classifies known dynamic families as covered', async () => {
    const fixture = await createFixture({
      locale: {
        biomes: { shadowForest: { name: 'Shadow Forest' } },
        page: { title: 'Bonjour' },
      },
      codeFiles: [
        {
          file: 'feature.tsx',
          content: 'const t = useTranslations(); t(`biomes.${biome}.name`)',
        },
      ],
    })

    const result = await runUnusedKeysCheck(fixture)
    expect(result.coveredByDynamicFamily).toContain('biomes.shadowForest.name')
  })

  it('marks referenced save keys as used through key literals', async () => {
    const fixture = await createFixture({
      locale: {
        characters: {
          actions: {
            save: {
              success: 'Saved',
              invalid_money: 'Invalid money',
            },
          },
        },
      },
      codeFiles: [
        {
          file: 'feature.ts',
          content: `
            new ValidationError('characters.actions.save.invalid_money')
            const successKey = 'characters.actions.save.success'
          `,
        },
      ],
    })

    const result = await runUnusedKeysCheck(fixture)

    expect(result.unusedLikely).not.toContain('characters.actions.save.success')
    expect(result.unusedLikely).not.toContain(
      'characters.actions.save.invalid_money'
    )
  })
})
