import { describe, expect, it } from "vitest";
import { decodeVillageFactionParam } from "./villageFactionCodec";

describe("decodeVillageFactionParam", () => {
  it("accepts known faction slugs case-insensitively", () => {
    expect(decodeVillageFactionParam("bruja")).toBe("bruja");
    expect(decodeVillageFactionParam(" Cucurbitus ")).toBe("cucurbitus");
  });

  it("rejects unknown or empty values", () => {
    expect(decodeVillageFactionParam(null)).toBeNull();
    expect(decodeVillageFactionParam("")).toBeNull();
    expect(decodeVillageFactionParam("human")).toBeNull();
  });
});
