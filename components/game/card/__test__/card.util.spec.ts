import { describe, expect, it } from "@jest/globals";
import { getId, isTrump } from "@/components/game/card/card.util";

describe("card", () => {
  describe("getId", () => {
    it("should return the id of the card", () => {
      expect(getId({ value: "7", type: "heart" })).toBe("heart7");
      expect(getId({ value: "9", type: "club" })).toBe("club9");
      expect(getId({ value: "A", type: "spade" })).toBe("spadeA");
      expect(getId({ value: "J", type: "diamond" })).toBe("diamondJ");
    });
  });

  describe("isTrump", () => {
    it("should return true if the card type matches the trump type", () => {
      expect(isTrump({ value: "7", type: "heart" }, "heart")).toBe(true);
    });

    it("should return false if the card type does not match the trump type", () => {
      expect(isTrump({ value: "9", type: "club" }, "spade")).toBe(false);
    });
  });
});
