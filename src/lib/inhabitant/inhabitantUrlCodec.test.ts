import { describe, expect, it } from 'vitest'
import {
  decodeInhabitantRollParam,
  encodeInhabitantRoll,
} from './inhabitantUrlCodec'
import { lookupName } from './data/namesByFaction'
import { genderFromD6, factionFromD6 } from './maps'
import { testLocalize } from '@/lib/localization/testLocalize'

describe('inhabitantUrlCodec', () => {
  it('decodes legacy 8-char and round-trips through v2 encode', () => {
    const legacy = '1H2C3111'
    const roll = decodeInhabitantRollParam(legacy, testLocalize)
    expect(roll).not.toBeNull()
    expect(roll!.ageCard).toEqual(roll!.personalityCard)
    expect(encodeInhabitantRoll(roll!)).toBe('1H2H2C3111')
    expect(
      decodeInhabitantRollParam(encodeInhabitantRoll(roll!), testLocalize)
    ).toEqual(roll)
  })

  it('decodes legacy context rank 7 and round-trips', () => {
    const legacy = '1H2C71115'
    const roll = decodeInhabitantRollParam(legacy, testLocalize)
    expect(roll).not.toBeNull()
    expect(roll!.contextCard.rank).toBe('7')
    expect(roll!.contextSevenDie).toBe(5)
    expect(encodeInhabitantRoll(roll!)).toBe('1H2H2C71115')
    expect(
      decodeInhabitantRollParam(encodeInhabitantRoll(roll!), testLocalize)
    ).toEqual(roll)
  })

  it('decodes legacy context rank 10 with two spoken-name dice', () => {
    const legacy = '1H2DT31111'
    const roll = decodeInhabitantRollParam(legacy, testLocalize)
    expect(roll).not.toBeNull()
    expect(roll!.contextCard.rank).toBe('10')
    expect(roll!.contextSpokenNameDice).toEqual([1, 1])
    expect(roll!.contextSpokenName).toBeDefined()
    expect(encodeInhabitantRoll(roll!)).toBe('1H2H2DT31111')
    expect(
      decodeInhabitantRollParam(encodeInhabitantRoll(roll!), testLocalize)
    ).toEqual(roll)
  })

  it('round-trips v2 when age and personality cards differ', () => {
    const factionDie = 1
    const faction = factionFromD6(factionDie)
    const nameDice: [number, number] = [2, 3]
    const name = lookupName(faction, nameDice[0], nameDice[1])
    const gender = genderFromD6(4)
    const roll = {
      factionDie,
      faction,
      ageCard: { suit: 'hearts' as const, rank: '5' as const },
      personalityCard: { suit: 'spades' as const, rank: 'K' as const },
      contextCard: { suit: 'clubs' as const, rank: '3' as const },
      nameDice,
      name,
      contextText: testLocalize('inhabitant.context_by_rank.3', {
        name,
        gender,
      }),
      genderDie: 4,
      gender,
    }
    const encoded = encodeInhabitantRoll(roll)
    expect(encoded).toBe('1H5SKC3234')
    expect(decodeInhabitantRollParam(encoded, testLocalize)).toEqual(roll)
  })

  it('rejects wrong tail for context rank', () => {
    expect(decodeInhabitantRollParam('1H2C31115', testLocalize)).toBeNull()
    expect(decodeInhabitantRollParam('1H2C711112', testLocalize)).toBeNull()
  })

  it('rejects bad lengths and garbage', () => {
    expect(decodeInhabitantRollParam('', testLocalize)).toBeNull()
    expect(decodeInhabitantRollParam('1H2C311', testLocalize)).toBeNull()
    expect(decodeInhabitantRollParam('1H2C31111X', testLocalize)).toBeNull()
  })
})
