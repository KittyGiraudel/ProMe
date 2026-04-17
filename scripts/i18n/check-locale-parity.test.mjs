import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

import { flattenKeys, runLocaleParityCheck } from './check-locale-parity.mjs'

const temporaryDirectories = []

async function createFixture({
  source = { home: { title: 'Bonjour' } },
  target = { home: { title: 'Hello' } },
  sourceRaw,
  targetRaw,
  includeFaqSource = true,
  includeFaqTarget = true,
}) {
  const root = await mkdtemp(path.join(tmpdir(), 'i18n-parity-'))
  temporaryDirectories.push(root)

  const sourcePath = path.join(root, 'fr.json')
  const targetPath = path.join(root, 'en.json')
  const faqSourcePath = path.join(root, 'faq.fr.md')
  const faqTargetPath = path.join(root, 'faq.en.md')

  await writeFile(sourcePath, sourceRaw ?? JSON.stringify(source), 'utf8')
  await writeFile(targetPath, targetRaw ?? JSON.stringify(target), 'utf8')

  if (includeFaqSource) {
    await writeFile(faqSourcePath, '# FAQ FR', 'utf8')
  }

  if (includeFaqTarget) {
    await writeFile(faqTargetPath, '# FAQ EN', 'utf8')
  }

  return { sourcePath, targetPath, faqSourcePath, faqTargetPath }
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map(dir => rm(dir, { recursive: true, force: true }))
  )
})

describe('flattenKeys', () => {
  it('returns nested key paths', () => {
    const keys = flattenKeys({ foo: { bar: { baz: 'value' } } })
    expect(keys).toContain('foo.bar.baz')
  })
})

describe('runLocaleParityCheck', () => {
  it('fails when target has missing keys', async () => {
    const fixture = await createFixture({
      source: { home: { title: 'Bonjour', subtitle: 'Salut' } },
      target: { home: { title: 'Hello' } },
    })

    const result = await runLocaleParityCheck(fixture)

    expect(result.code).toBe(1)
  })

  it('warns for extra keys but succeeds', async () => {
    const fixture = await createFixture({
      source: { home: { title: 'Bonjour' } },
      target: { home: { title: 'Hello', subtitle: 'Hi' } },
    })

    const result = await runLocaleParityCheck(fixture)

    expect(result.code).toBe(0)
  })

  it('fails on invalid json input', async () => {
    const fixture = await createFixture({
      sourceRaw: '{"home":{"title":"Bonjour"}}',
      targetRaw: '{"home":{"title":"Hello"',
    })

    const result = await runLocaleParityCheck(fixture)

    expect(result.code).toBe(1)
  })

  it('fails when source root is not an object', async () => {
    const fixture = await createFixture({
      sourceRaw: '[]',
      targetRaw: '{"home":{"title":"Hello"}}',
    })
    const result = await runLocaleParityCheck(fixture)

    expect(result.code).toBe(1)
  })

  it('reports deeply nested missing keys', async () => {
    const fixture = await createFixture({
      source: { one: { two: { three: { four: 'v' } } } },
      target: { one: { two: {} } },
    })
    const result = await runLocaleParityCheck(fixture)

    expect(result.code).toBe(1)
  })
})
