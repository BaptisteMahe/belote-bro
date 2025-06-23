import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { initGameState } from "@/components/game/game-state/game-state.util";
import { shuffle } from "@/components/game/deck/deck.util";
import { initPlayer } from "@/components/game/player/player.util";
import { Deck } from "@/components/game/deck/deck.model";
import { Card } from "@/components/game/card/card.model";

// Mock dependencies
jest.mock("@/components/game/deck/deck.util", () => ({
  shuffle: jest.fn((deck: Card[]) => [...deck]),
}));

jest.mock("@/components/game/player/player.util", () => ({
  initPlayer: jest.fn(() => ({
    id: "mock-player-id",
    hand: [],
  })),
}));

describe("game-state", () => {
  describe("initGameState", () => {
    beforeEach(() => {
      // Clear mock calls before each test
      jest.clearAllMocks();
    });

    it("should initialize a game state with default scores", () => {
      const gameState = initGameState();

      // Check that the game state has the correct structure
      expect(gameState).toEqual({
        step: { name: "init" },
        deck: expect.any(Array),
        players: {
          bottom: expect.objectContaining({ id: "mock-player-id", hand: [] }),
          top: expect.objectContaining({ id: "mock-player-id", hand: [] }),
          left: expect.objectContaining({ id: "mock-player-id", hand: [] }),
          right: expect.objectContaining({ id: "mock-player-id", hand: [] }),
        },
        scores: {
          us: 0,
          them: 0,
          target: 501,
        },
      });

      // Check that shuffle was called with the Deck
      expect(shuffle).toHaveBeenCalledWith(Deck);

      // Check that initPlayer was called 4 times
      expect(initPlayer).toHaveBeenCalledTimes(4);
    });

    it("should initialize a game state with custom scores", () => {
      const customScores = {
        us: 100,
        them: 200,
        target: 1000,
      };

      const gameState = initGameState(customScores);

      // Check that the game state has the correct structure with custom scores
      expect(gameState).toEqual({
        step: { name: "init" },
        deck: expect.any(Array),
        players: {
          bottom: expect.objectContaining({ id: "mock-player-id", hand: [] }),
          top: expect.objectContaining({ id: "mock-player-id", hand: [] }),
          left: expect.objectContaining({ id: "mock-player-id", hand: [] }),
          right: expect.objectContaining({ id: "mock-player-id", hand: [] }),
        },
        scores: customScores,
      });

      // Check that shuffle was called with the Deck
      expect(shuffle).toHaveBeenCalledWith(Deck);

      // Check that initPlayer was called 4 times
      expect(initPlayer).toHaveBeenCalledTimes(4);
    });
  });
});
