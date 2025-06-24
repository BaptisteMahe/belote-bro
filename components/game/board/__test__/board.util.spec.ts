import { describe, expect, it } from "@jest/globals";
import {
  computeBoardScore,
  computeWinner,
} from "@/components/game/board/board.util";

describe("computeWinner", () => {
  it("should throw an error when board is empty", () => {
    expect(() =>
      computeWinner(
        {
          bottom: null,
          top: null,
          left: null,
          right: null,
        },
        "heart",
        "diamond",
      ),
    ).toThrow();
  });

  it("should give the correct winner on a non trump trick", () => {
    expect(
      computeWinner(
        {
          bottom: { value: "A", type: "heart" },
          top: { value: "10", type: "heart" },
          left: { value: "9", type: "heart" },
          right: { value: "7", type: "heart" },
        },
        "heart",
        "diamond",
      ),
    ).toBe("bottom");
  });

  it("should give the correct winner on a trump trick", () => {
    expect(
      computeWinner(
        {
          bottom: { value: "A", type: "heart" },
          top: { value: "10", type: "heart" },
          left: { value: "9", type: "heart" },
          right: { value: "7", type: "heart" },
        },
        "heart",
        "heart",
      ),
    ).toBe("left");
  });

  it("should give the correct winner on a cut trick", () => {
    expect(
      computeWinner(
        {
          bottom: { value: "A", type: "heart" },
          top: { value: "10", type: "diamond" },
          left: { value: "9", type: "heart" },
          right: { value: "7", type: "heart" },
        },
        "heart",
        "diamond",
      ),
    ).toBe("top");

    expect(
      computeWinner(
        {
          bottom: { value: "A", type: "heart" },
          top: { value: "10", type: "diamond" },
          left: { value: "J", type: "diamond" },
          right: { value: "7", type: "heart" },
        },
        "heart",
        "diamond",
      ),
    ).toBe("left");
  });

  it("should give the correct winner even on non full boards", () => {
    expect(
      computeWinner(
        {
          bottom: null,
          top: { value: "10", type: "heart" },
          left: { value: "9", type: "heart" },
          right: { value: "7", type: "heart" },
        },
        "heart",
        "diamond",
      ),
    ).toBe("top");

    expect(
      computeWinner(
        {
          bottom: null,
          top: null,
          left: null,
          right: { value: "7", type: "diamond" },
        },
        "diamond",
        "diamond",
      ),
    ).toBe("right");
  });
});

describe("computeBoardScore", () => {
  it("should give 0 on empty board", () => {
    expect(
      computeBoardScore(
        {
          bottom: null,
          top: null,
          left: null,
          right: null,
        },
        "heart",
        false,
      ),
    ).toBe(0);
  });

  it("should give the correct score on a non trump trick", () => {
    expect(
      computeBoardScore(
        {
          bottom: { value: "A", type: "heart" },
          top: { value: "10", type: "heart" },
          left: { value: "9", type: "heart" },
          right: { value: "7", type: "heart" },
        },
        "diamond",
        false,
      ),
    ).toBe(21);
  });

  it("should give the correct score on a trump trick", () => {
    expect(
      computeBoardScore(
        {
          bottom: { value: "A", type: "heart" },
          top: { value: "10", type: "heart" },
          left: { value: "J", type: "heart" },
          right: { value: "9", type: "heart" },
        },
        "heart",
        false,
      ),
    ).toBe(55);
  });

  it("should give the correct score on a cut trick", () => {
    expect(
      computeBoardScore(
        {
          bottom: { value: "A", type: "heart" },
          top: { value: "K", type: "diamond" },
          left: { value: "9", type: "heart" },
          right: { value: "7", type: "heart" },
        },
        "diamond",
        false,
      ),
    ).toBe(15);

    expect(
      computeBoardScore(
        {
          bottom: { value: "A", type: "heart" },
          top: { value: "Q", type: "diamond" },
          left: { value: "J", type: "diamond" },
          right: { value: "7", type: "heart" },
        },
        "heart",
        false,
      ),
    ).toBe(16);
  });

  it("should give the correct score even on non full boards", () => {
    expect(
      computeBoardScore(
        {
          bottom: null,
          top: { value: "10", type: "heart" },
          left: { value: "9", type: "heart" },
          right: { value: "7", type: "heart" },
        },
        "heart",
        false,
      ),
    ).toBe(24);

    expect(
      computeBoardScore(
        {
          bottom: null,
          top: null,
          left: null,
          right: { value: "7", type: "diamond" },
        },
        "diamond",
        false,
      ),
    ).toBe(0);
  });

  it("should add 10 when the trick is the last one", () => {
    expect(
      computeBoardScore(
        {
          bottom: { value: "A", type: "heart" },
          top: { value: "Q", type: "diamond" },
          left: { value: "J", type: "diamond" },
          right: { value: "7", type: "heart" },
        },
        "heart",
        false,
      ),
    ).toBe(16);

    expect(
      computeBoardScore(
        {
          bottom: { value: "A", type: "heart" },
          top: { value: "Q", type: "diamond" },
          left: { value: "J", type: "diamond" },
          right: { value: "7", type: "heart" },
        },
        "heart",
        true,
      ),
    ).toBe(26);
  });
});
