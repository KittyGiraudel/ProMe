import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guards against orphaned optional-catch-all folders (e.g. empty `[[...slug]]`)
 * shadowing real tab routes in dev, and against missing tab entry pages.
 */
const ID_SEGMENT_ROOT = join(__dirname)

describe('character sheet app routes (filesystem)', () => {
  it('has a page for each tab segment and no empty optional catch-all folder', () => {
    expect(existsSync(join(ID_SEGMENT_ROOT, 'identity', 'page.tsx'))).toBe(
      true
    )
    expect(existsSync(join(ID_SEGMENT_ROOT, 'map', 'page.tsx'))).toBe(
      true
    )
    expect(existsSync(join(ID_SEGMENT_ROOT, 'journal', 'page.tsx'))).toBe(true)
    expect(existsSync(join(ID_SEGMENT_ROOT, 'tools', 'page.tsx'))).toBe(true)
    expect(
      existsSync(join(ID_SEGMENT_ROOT, 'inventory', 'page.tsx'))
    ).toBe(true)

    const orphanCatchAll = join(ID_SEGMENT_ROOT, '[[...sheetTab]]')
    expect(existsSync(orphanCatchAll)).toBe(false)

    expect(existsSync(join(ID_SEGMENT_ROOT, 'page.tsx'))).toBe(false)
  })
})
