import { describe, expect, it } from "@jest/globals";
import { computeWinner } from "@/components/game/board/board";

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
