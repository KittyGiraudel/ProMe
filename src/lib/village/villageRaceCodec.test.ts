import { describe, expect, it } from "vitest";
import { decodeVillageRaceParam } from "./villageRaceCodec";

describe("decodeVillageRaceParam", () => {
  it("accepts known race slugs case-insensitively", () => {
    expect(decodeVillageRaceParam("bruja")).toBe("bruja");
    expect(decodeVillageRaceParam(" Cucurbitus ")).toBe("cucurbitus");
  });

  it("rejects unknown or empty values", () => {
    expect(decodeVillageRaceParam(null)).toBeNull();
    expect(decodeVillageRaceParam("")).toBeNull();
    expect(decodeVillageRaceParam("human")).toBeNull();
  });
});
