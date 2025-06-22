import { describe, expect, it } from "@jest/globals";
import { canPlay, getId, isTrump } from "@/components/game/card/card";

describe("card", () => {
  describe("getId", () => {
    it("should return the id of the card", () => {
      expect(getId({ value: "7", type: "heart" })).toBe("heart7");
      expect(getId({ value: "9", type: "club" })).toBe("club9");
      expect(getId({ value: "A", type: "spade" })).toBe("spadeA");
      expect(getId({ value: "J", type: "diamond" })).toBe("diamondJ");
    });
  });

  describe("canPlay", () => {
    it("should return true if the askedType is null", () => {
      expect(
        canPlay(
          { value: "7", type: "heart" },
          [{ value: "7", type: "heart" }],
          "bottom",
          {
            bottom: null,
            left: null,
            top: null,
            right: null,
          },
          null,
          "diamond",
        ),
      ).toBe(true);
    });

    it("should return true if the card is not a trump and the same as the askedType", () => {
      expect(
        canPlay(
          { value: "8", type: "heart" },
          [{ value: "8", type: "heart" }],
          "bottom",
          {
            bottom: null,
            left: null,
            top: null,
            right: { value: "7", type: "heart" },
          },
          "heart",
          "diamond",
        ),
      ).toBe(true);
    });

    it("should return true if the hand is empty of trump and asked type cards", () => {
      expect(
        canPlay(
          { value: "8", type: "heart" },
          [
            { value: "8", type: "heart" },
            { value: "7", type: "diamond" },
          ],
          "bottom",
          {
            bottom: null,
            left: null,
            top: null,
            right: { value: "7", type: "spade" },
          },
          "spade",
          "club",
        ),
      ).toBe(true);
    });

    it("should return true if trump is asked and the card is a trump higher than all trumps on board ", () => {
      expect(
        canPlay(
          { value: "A", type: "heart" },
          [{ value: "8", type: "heart" }],
          "bottom",
          {
            bottom: null,
            left: null,
            top: null,
            right: { value: "7", type: "heart" },
          },
          "heart",
          "heart",
        ),
      ).toBe(true);
    });

    it("should return true if trump is asked and the card is a trump and player hasn't any trump higher than on board", () => {
      expect(
        canPlay(
          { value: "8", type: "heart" },
          [
            { value: "7", type: "heart" },
            { value: "8", type: "heart" },
          ],
          "bottom",
          {
            bottom: null,
            left: null,
            top: null,
            right: { value: "A", type: "heart" },
          },
          "heart",
          "heart",
        ),
      ).toBe(true);
    });

    it("should return true if the player has trump and not asked card and no trump has been player", () => {
      expect(
        canPlay(
          { value: "8", type: "heart" },
          [
            { value: "7", type: "heart" },
            { value: "8", type: "heart" },
          ],
          "bottom",
          {
            bottom: null,
            left: null,
            top: null,
            right: { value: "A", type: "diamond" },
          },
          "diamond",
          "heart",
        ),
      ).toBe(true);
    });

    it("should return true if the player has trump and not any higher trump than played before", () => {
      expect(
        canPlay(
          { value: "8", type: "heart" },
          [
            { value: "7", type: "heart" },
            { value: "8", type: "heart" },
          ],
          "bottom",
          {
            bottom: null,
            left: { value: "A", type: "diamond" },
            top: { value: "9", type: "diamond" },
            right: { value: "A", type: "heart" },
          },
          "diamond",
          "heart",
        ),
      ).toBe(true);
    });

    it("should return true if the player has trump higher than any trump than played before", () => {
      expect(
        canPlay(
          { value: "J", type: "heart" },
          [
            { value: "J", type: "heart" },
            { value: "7", type: "heart" },
            { value: "8", type: "heart" },
          ],
          "bottom",
          {
            bottom: null,
            left: { value: "A", type: "diamond" },
            top: { value: "9", type: "diamond" },
            right: { value: "A", type: "heart" },
          },
          "diamond",
          "heart",
        ),
      ).toBe(true);
    });

    it("should return true if the card is not a trump and player has not the asked type which is not a trump in hand and has trump but it's his partner who has the trick with a trump", () => {
      expect(
        canPlay(
          { value: "J", type: "heart" },
          [
            { value: "J", type: "heart" },
            { value: "7", type: "heart" },
            { value: "8", type: "diamond" },
          ],
          "bottom",
          {
            bottom: null,
            left: { value: "7", type: "spade" },
            top: { value: "9", type: "diamond" },
            right: { value: "A", type: "spade" },
          },
          "spade",
          "diamond",
        ),
      ).toBe(true);
    });

    it("should return true if the card is not a trump and player has not the asked type which is not a trump in hand and has trump but it's his partner who has the trick without a trump", () => {
      expect(
        canPlay(
          { value: "J", type: "heart" },
          [
            { value: "J", type: "heart" },
            { value: "7", type: "heart" },
            { value: "8", type: "diamond" },
          ],
          "bottom",
          {
            bottom: null,
            left: { value: "7", type: "spade" },
            top: { value: "A", type: "spade" },
            right: { value: "10", type: "spade" },
          },
          "spade",
          "diamond",
        ),
      ).toBe(true);
    });

    it("should return false if the card is not of asked type and the player has asked type in hand", () => {
      expect(
        canPlay(
          { value: "J", type: "heart" },
          [
            { value: "J", type: "heart" },
            { value: "7", type: "heart" },
            { value: "8", type: "diamond" },
          ],
          "bottom",
          {
            bottom: null,
            left: { value: "A", type: "diamond" },
            top: { value: "9", type: "diamond" },
            right: { value: "A", type: "heart" },
          },
          "diamond",
          "heart",
        ),
      ).toBe(false);
    });

    it("should return false if the asked type is trump and the card is lower than played before and the player have higher card than board in hand", () => {
      expect(
        canPlay(
          { value: "7", type: "heart" },
          [
            { value: "J", type: "heart" },
            { value: "7", type: "heart" },
            { value: "8", type: "diamond" },
          ],
          "bottom",
          {
            bottom: null,
            left: null,
            top: null,
            right: { value: "A", type: "heart" },
          },
          "heart",
          "heart",
        ),
      ).toBe(false);
    });

    it("should return false if the asked type is not trump and the player hasn't any asked type card and has trump and the card is not a trump and it's the opponent who's wining the trick", () => {
      expect(
        canPlay(
          { value: "7", type: "heart" },
          [
            { value: "J", type: "heart" },
            { value: "7", type: "heart" },
            { value: "8", type: "diamond" },
          ],
          "bottom",
          {
            bottom: null,
            left: null,
            top: null,
            right: { value: "A", type: "spade" },
          },
          "spade",
          "diamond",
        ),
      ).toBe(false);
    });

    it("should return false if the asked type is not trump and the player hasn't any asked type card and has trump and the card is not a trump and it's the opponent who's wining the trick with a trump", () => {
      expect(
        canPlay(
          { value: "7", type: "heart" },
          [
            { value: "J", type: "heart" },
            { value: "7", type: "heart" },
            { value: "8", type: "diamond" },
          ],
          "bottom",
          {
            bottom: null,
            left: null,
            top: { value: "9", type: "spade" },
            right: { value: "A", type: "diamond" },
          },
          "spade",
          "diamond",
        ),
      ).toBe(false);
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
