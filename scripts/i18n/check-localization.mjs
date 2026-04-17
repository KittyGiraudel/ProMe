import process from 'node:process'

import { runGlossaryCheck } from './check-glossary-consistency.mjs'
import { runLocaleParityCheck } from './check-locale-parity.mjs'
import { runUnusedKeysCheck } from './check-unused-keys.mjs'

async function run() {
  const parity = await runLocaleParityCheck()
  if (!parity.ok) {
    return 1
  }

  const unused = await runUnusedKeysCheck()
  if (!unused.ok) {
    return 1
  }

  const glossary = await runGlossaryCheck()
  if (!glossary.ok) {
    return 1
  }

  return 0
}

run()
  .then(code => {
    process.exit(code)
  })
  .catch(error => {
    console.error(error?.message ?? String(error))
    process.exit(1)
  })
