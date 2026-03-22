import { describe, expect, it } from "vitest";
import {
  decodeCharacterRollParam,
  encodeCharacterRoll,
} from "../character/characterUrlCodec";
import {
  decodeVillageOwnersParam,
  encodeVillageOwners,
} from "./villageOwnersCodec";

describe("villageOwnersCodec", () => {
  it("round-trips multiple owner blobs", () => {
    const a = decodeCharacterRollParam("1H2C3111")!;
    const b = decodeCharacterRollParam("3D4S5116")!;
    const encoded = encodeVillageOwners([a, b]);
    expect(decodeVillageOwnersParam(encoded)).toEqual([a, b]);
  });

  it("rejects empty string and invalid blobs; only tildes yield no owners", () => {
    expect(decodeVillageOwnersParam("")).toBeNull();
    expect(decodeVillageOwnersParam("~~~")).toEqual([]);
    expect(decodeVillageOwnersParam("1H2C3111~bad")).toBeNull();
  });

  it("encodeVillageOwners joins with ~", () => {
    const roll = decodeCharacterRollParam("1H2C3111")!;
    expect(encodeVillageOwners([roll, roll])).toBe(
      `${encodeCharacterRoll(roll)}~${encodeCharacterRoll(roll)}`,
    );
  });
});
