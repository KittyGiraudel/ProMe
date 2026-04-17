import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

import {
  checkDisallowedTerms,
  collectStringValues,
  runGlossaryCheck,
} from './check-glossary-consistency.mjs'

const temporaryDirectories = []

async function createFixture({
  glossary = {
    protector: {
      fr: { preferred: ['Protecteur'], disallowed: [] },
      en: { preferred: ['Protector'], disallowed: ['Guardian'] },
    },
  },
  fr = { characters: { title: 'Protecteur' } },
  en = { characters: { title: 'Protector' } },
}) {
  const root = await mkdtemp(path.join(tmpdir(), 'i18n-glossary-'))
  temporaryDirectories.push(root)

  const glossaryPath = path.join(root, 'glossary.json')
  const frPath = path.join(root, 'fr.json')
  const enPath = path.join(root, 'en.json')

  await writeFile(glossaryPath, JSON.stringify(glossary), 'utf8')
  await writeFile(frPath, JSON.stringify(fr), 'utf8')
  await writeFile(enPath, JSON.stringify(en), 'utf8')

  return { glossaryPath, frPath, enPath }
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map(dir => rm(dir, { recursive: true, force: true }))
  )
})

describe('collectStringValues', () => {
  it('collects leaf string values with key paths', () => {
    const entries = collectStringValues({
      one: { two: 'value' },
      array: ['ignored'],
      other: 12,
    })
    expect(entries).toEqual([{ key: 'one.two', value: 'value' }])
  })
})

describe('checkDisallowedTerms', () => {
  it('reports disallowed term matches', () => {
    const entries = [{ key: 'k', value: 'The Guardian waits.' }]
    const glossary = { protector: { disallowed: ['Guardian'] } }
    const violations = checkDisallowedTerms(entries, glossary)

    expect(violations).toHaveLength(1)
    expect(violations[0].term).toBe('protector')
    expect(violations[0].key).toBe('k')
  })
})

describe('runGlossaryCheck', () => {
  it('passes when there are no violations', async () => {
    const fixture = await createFixture({})
    const result = await runGlossaryCheck(fixture)
    expect(result.code).toBe(0)
    expect(result.violations).toHaveLength(0)
  })

  it('fails when disallowed terms are present', async () => {
    const fixture = await createFixture({
      en: { characters: { title: 'Guardian' } },
    })
    const result = await runGlossaryCheck(fixture)

    expect(result.code).toBe(1)
    expect(result.violations.length).toBeGreaterThan(0)
  })

  it('fails gracefully on invalid glossary JSON', async () => {
    const fixture = await createFixture({})
    await writeFile(fixture.glossaryPath, '{"protector":', 'utf8')
    const result = await runGlossaryCheck(fixture)
    expect(result.code).toBe(1)
  })
})
