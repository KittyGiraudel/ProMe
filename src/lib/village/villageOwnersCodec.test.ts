import { describe, expect, it } from "vitest";
import {
  decodeInhabitantRollParam,
  encodeInhabitantRoll,
} from "../inhabitant/inhabitantUrlCodec";
import {
  decodeVillageOwnersParam,
  encodeVillageOwners,
} from "./villageOwnersCodec";

describe("villageOwnersCodec", () => {
  it("round-trips multiple owner blobs", () => {
    const a = decodeInhabitantRollParam("1H2C3111")!;
    const b = decodeInhabitantRollParam("3D4S5116")!;
    const encoded = encodeVillageOwners([a, b]);
    expect(decodeVillageOwnersParam(encoded)).toEqual([a, b]);
  });

  it("rejects empty string and invalid blobs; only tildes yield no owners", () => {
    expect(decodeVillageOwnersParam("")).toBeNull();
    expect(decodeVillageOwnersParam("~~~")).toEqual([]);
    expect(decodeVillageOwnersParam("1H2C3111~bad")).toBeNull();
  });

  it("encodeVillageOwners joins with ~", () => {
    const roll = decodeInhabitantRollParam("1H2C3111")!;
    expect(encodeVillageOwners([roll, roll])).toBe(
      `${encodeInhabitantRoll(roll)}~${encodeInhabitantRoll(roll)}`,
    );
  });
});
