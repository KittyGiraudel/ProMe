import { describe, expect, it } from 'vitest'
import { testLocalize } from '@/lib/localization/testLocalize'
import { lookupName } from './data/namesByFaction'
import {
  generateInhabitantWithFaction,
  getAgeBand,
  getPersonality,
  type InhabitantRoll,
  mapKindFromContextSevenDie,
  rerollInhabitantPart,
  setInhabitantAgeBand,
  setInhabitantFaction,
  setInhabitantGender,
  setInhabitantNameDice,
  setInhabitantPersonality,
} from './generate'

function makeRoll(over: Partial<InhabitantRoll> = {}): InhabitantRoll {
  return {
    factionDie: 1,
    faction: 'bruja',
    ageCard: { suit: 'hearts', rank: '2' },
    personalityCard: { suit: 'hearts', rank: '2' },
    contextCard: { suit: 'clubs', rank: '3' },
    nameDice: [1, 1],
    name: lookupName('bruja', 1, 1),
    contextText: '',
    genderDie: 1,
    gender: 'man',
    ...over,
  }
}

describe('inhabitant/generate', () => {
  it('mapKindFromContextSevenDie splits 1–3 vs 4–6', () => {
    expect(mapKindFromContextSevenDie(1)).toBe('localisation')
    expect(mapKindFromContextSevenDie(3)).toBe('localisation')
    expect(mapKindFromContextSevenDie(4)).toBe('biome')
    expect(mapKindFromContextSevenDie(6)).toBe('biome')
  })

  it('generateInhabitantWithFaction uses canonical faction die', () => {
    const rng = () => 0.0001
    const roll = generateInhabitantWithFaction('cucurbitus', testLocalize, rng)
    expect(roll.faction).toBe('cucurbitus')
    expect(roll.factionDie).toBe(3)
  })

  it('getAgeBand uses suit of age card; getPersonality uses rank of personality card', () => {
    const roll = makeRoll({
      ageCard: { suit: 'spades', rank: '2' },
      personalityCard: { suit: 'hearts', rank: 'Q' },
    })
    expect(getAgeBand(roll)).toBe('elderly')
    expect(getPersonality(roll)).toBe('joyful')
  })

  it('rerollInhabitantPart ageCard and personalityCard are independent', () => {
    const roll = makeRoll()
    const nextAge = rerollInhabitantPart(
      roll,
      'ageCard',
      testLocalize,
      () => 0.5
    )
    expect(nextAge.personalityCard).toEqual(roll.personalityCard)
    const nextPers = rerollInhabitantPart(
      roll,
      'personalityCard',
      testLocalize,
      () => 0.5
    )
    expect(nextPers.ageCard).toEqual(roll.ageCard)
  })

  it('rerollInhabitantPart faction updates name for new faction grid', () => {
    const roll = makeRoll({ faction: 'bruja', nameDice: [1, 1] })
    const next = rerollInhabitantPart(
      roll,
      'faction',
      testLocalize,
      () => 0.999
    )
    expect(next.factionDie).toBe(6)
    expect(next.faction).toBe('mousseron')
    expect(next.name).toBe(lookupName('mousseron', 1, 1))
  })

  it('rerollInhabitantPart contextSevenDie is a no-op when context is not 7', () => {
    const roll = makeRoll()
    const next = rerollInhabitantPart(
      roll,
      'contextSevenDie',
      testLocalize,
      () => 0.99
    )
    expect(next).toBe(roll)
  })

  it('rerollInhabitantPart contextSpokenNameDice is a no-op when context is not 10', () => {
    const roll = makeRoll()
    const next = rerollInhabitantPart(
      roll,
      'contextSpokenNameDice',
      testLocalize,
      () => 0.99
    )
    expect(next).toBe(roll)
  })

  it('setInhabitantNameDice updates name string', () => {
    const roll = makeRoll({ faction: 'bruja', nameDice: [1, 1] })
    const next = setInhabitantNameDice(roll, [2, 3])
    expect(next.nameDice).toEqual([2, 3])
    expect(next.name).toBe(lookupName('bruja', 2, 3))
  })

  it('setInhabitantFaction uses canonical die and recomputes name', () => {
    const roll = makeRoll({ faction: 'bruja', nameDice: [1, 1] })
    const next = setInhabitantFaction(roll, 'kiore')
    expect(next.factionDie).toBe(5)
    expect(next.faction).toBe('kiore')
    expect(next.name).toBe(lookupName('kiore', 1, 1))
  })

  it('setInhabitantAgeBand changes suit only', () => {
    const roll = makeRoll({
      ageCard: { suit: 'hearts', rank: '5' },
    })
    const next = setInhabitantAgeBand(roll, 'elderly')
    expect(next.ageCard).toEqual({ suit: 'spades', rank: '5' })
    expect(getAgeBand(next)).toBe('elderly')
  })

  it('setInhabitantPersonality changes rank only', () => {
    const roll = makeRoll({
      personalityCard: { suit: 'diamonds', rank: '2' },
    })
    const next = setInhabitantPersonality(roll, 'sad')
    expect(next.personalityCard).toEqual({ suit: 'diamonds', rank: 'K' })
    expect(getPersonality(next)).toBe('sad')
  })

  it('setInhabitantGender uses canonical die', () => {
    const roll = makeRoll({ genderDie: 2, gender: 'man' })
    const next = setInhabitantGender(roll, 'woman')
    expect(next.genderDie).toBe(3)
    expect(next.gender).toBe('woman')
  })
})
