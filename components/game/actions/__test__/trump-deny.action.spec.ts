import { describe, expect, it, jest } from "@jest/globals";
import { handleTrumpDeny, TrumpDenyAction } from "../trump-deny.action";
import * as gameStateModule from "@/components/game/game-state";
import { GameState, initGameState } from "@/components/game/game-state";
import { Card } from "@/components/game/card/card";
import assert from "node:assert";

describe("trump-deny.action", () => {
  const mockCard: Card = { type: "heart", value: "A" };
  const mockAction: TrumpDenyAction = { type: "trumpDeny" };

  describe("handleTrumpDeny", () => {
    it("should throw an error when the step is not chooseTrump", () => {
      const state: GameState = {
        ...initGameState(),
        step: { name: "init" },
      };

      expect(() => handleTrumpDeny(state, mockAction)).toThrow(
        "Action trumpDeny impossible in this step init",
      );
    });

    it("should move to the next player's turn when not the last player", () => {
      const state: GameState = {
        ...initGameState(),
        step: {
          name: "chooseTrump",
          card: mockCard,
          starter: "bottom",
          turn: "bottom",
          round: 0,
        },
      };

      const result = handleTrumpDeny(state, mockAction);

      expect(result.step.name).toBe("chooseTrump");
      assert(result.step.name === "chooseTrump");
      expect(result.step.turn).toBe("left");
      expect(result.step.round).toBe(0);
      expect(result.step.starter).toBe("bottom");
    });

    it("should start the second round when the last player denies in the first round", () => {
      const state: GameState = {
        ...initGameState(),
        step: {
          name: "chooseTrump",
          card: mockCard,
          starter: "bottom",
          turn: "right",
          round: 0,
        },
      };

      const result = handleTrumpDeny(state, mockAction);

      expect(result.step.name).toBe("chooseTrump");
      assert(result.step.name === "chooseTrump");
      expect(result.step.turn).toBe("bottom");
      expect(result.step.round).toBe(1);
      expect(result.step.starter).toBe("bottom");
    });

    it("should reinitialize the game when the last player denies in the second round", () => {
      const mockScores = { us: 10, them: 20, target: 501 };
      const state: GameState = {
        ...initGameState(mockScores),
        step: {
          name: "chooseTrump",
          card: mockCard,
          starter: "bottom",
          turn: "right",
          round: 1,
        },
      };

      // Mock initGameState to verify it's called with the correct scores
      const initGameStateSpy = jest.spyOn(gameStateModule, "initGameState");
      initGameStateSpy.mockReturnValue({
        ...initGameState(mockScores),
      });

      const result = handleTrumpDeny(state, mockAction);

      expect(initGameStateSpy).toHaveBeenCalledWith(mockScores);
      expect(result.step.name).toBe("init");
      expect(result.scores).toEqual(mockScores);

      // Restore the original implementation
      initGameStateSpy.mockRestore();
    });
  });
});
