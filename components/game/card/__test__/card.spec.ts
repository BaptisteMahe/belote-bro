import { describe, expect, it } from "@jest/globals";
import { getId } from "@/components/game/card/card";

describe("card", () => {
  describe("getId", () => {
    it("should return the id of the card", () => {
      expect(getId({ value: "7", type: "heart" })).toBe("heart7");
      expect(getId({ value: "9", type: "club" })).toBe("club9");
      expect(getId({ value: "A", type: "spade" })).toBe("spadeA");
      expect(getId({ value: "J", type: "diamond" })).toBe("diamondJ");
    });
  });
});
