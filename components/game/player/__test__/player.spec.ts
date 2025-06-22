import { describe, expect, it, jest } from "@jest/globals";
import { areOpponents, initPlayer, isUs } from "../player";
import { uuid } from "expo-modules-core";

// Mock uuid.v4 to return a predictable value
jest.mock("expo-modules-core", () => ({
  uuid: {
    v4: jest.fn().mockReturnValue("mock-uuid"),
  },
}));

describe("player", () => {
  describe("initPlayer", () => {
    it("should return a player with the expected structure", () => {
      const player = initPlayer();

      // Check that the player has the expected properties
      expect(player).toHaveProperty("id");
      expect(player).toHaveProperty("hand");

      // Check that the hand is initially empty
      expect(player.hand).toEqual([]);

      // Check that uuid.v4 was called to generate the ID
      expect(uuid.v4).toHaveBeenCalled();

      // Check that the ID is the mocked value
      expect(player.id).toBe("mock-uuid");
    });

    it("should create a player with a unique ID each time", () => {
      // Reset the mock to return different values
      (uuid.v4 as jest.Mock).mockReturnValueOnce("uuid-1");
      (uuid.v4 as jest.Mock).mockReturnValueOnce("uuid-2");

      const player1 = initPlayer();
      const player2 = initPlayer();

      // The players should have different IDs
      expect(player1.id).toBe("uuid-1");
      expect(player2.id).toBe("uuid-2");
      expect(player1.id).not.toBe(player2.id);
    });
  });

  describe("isUs", () => {
    it("should return true for 'bottom' and 'top' players", () => {
      expect(isUs("bottom")).toBe(true);
      expect(isUs("top")).toBe(true);
    });

    it("should return false for 'left' and 'right' players", () => {
      expect(isUs("left")).toBe(false);
      expect(isUs("right")).toBe(false);
    });
  });

  describe("areOpponents", () => {
    it("should return true for opponents", () => {
      expect(areOpponents("bottom", "right")).toBe(true);
    });

    it("should return false for allies", () => {
      expect(areOpponents("left", "right")).toBe(false);
    });
  });
});
