import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { handleTrumpChoose, TrumpChooseAction } from "../trump-choose.action";
import { GameState } from "@/components/game/game-state/game-state.model";
import { Card } from "@/components/game/card/card.model";
import * as actionsUtil from "@/components/game/actions/actions.util";
import assert from "node:assert";

describe("trump-choose.action", () => {
  describe("handleTrumpChoose", () => {
    // Mock the deal function to return predictable values
    const mockDeal = jest.spyOn(actionsUtil, "deal");

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw an error if the current step is not 'chooseTrump'", () => {
      // Arrange
      const state: GameState = {
        step: { name: "init" },
        deck: [],
        players: {
          bottom: { id: "bottom-id", hand: [] },
          left: { id: "left-id", hand: [] },
          top: { id: "top-id", hand: [] },
          right: { id: "right-id", hand: [] },
        },
        scores: { us: 0, them: 0, target: 501 },
      };

      const action: TrumpChooseAction = {
        type: "trumpChoose",
        card: { type: "heart", value: "A" },
        player: "bottom",
        trump: "heart",
      };

      // Act & Assert
      expect(() => handleTrumpChoose(state, action)).toThrow(
        "Action trumpChoose impossible in this step init",
      );
    });

    it("should transition from 'chooseTrump' to 'play' step", () => {
      // Arrange
      const initialDeck: Card[] = [
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
        { type: "spade", value: "Q" },
        // ... more cards would be here in a real game
      ];

      const initialPlayers = {
        bottom: { id: "bottom-id", hand: [] },
        left: { id: "left-id", hand: [] },
        top: { id: "top-id", hand: [] },
        right: { id: "right-id", hand: [] },
      };

      const state = {
        step: {
          name: "chooseTrump",
          card: { type: "heart", value: "A" },
          starter: "bottom",
          turn: "bottom",
          round: 0,
        },
        deck: initialDeck,
        players: initialPlayers,
        scores: { us: 0, them: 0, target: 501 },
      } satisfies GameState;

      const action: TrumpChooseAction = {
        type: "trumpChoose",
        card: { type: "heart", value: "A" },
        player: "bottom",
        trump: "heart",
      };

      // Mock the deal function to return updated players and deck
      const updatedPlayers = {
        bottom: { id: "bottom-id", hand: [] },
        left: { id: "left-id", hand: [] },
        top: { id: "top-id", hand: [] },
        right: { id: "right-id", hand: [] },
      };
      const updatedDeck = initialDeck.slice(1);
      mockDeal.mockReturnValue([updatedPlayers, updatedDeck] as const);

      // Act
      const result = handleTrumpChoose(state, action);

      // Assert
      // Check that deal was called with the correct arguments
      expect(mockDeal).toHaveBeenCalledWith(
        "bottom", // starter
        initialPlayers, // players
        initialDeck, // deck
        {
          bottom: 2, // player who chose trump gets 2 cards
          left: 3,
          top: 3,
          right: 3,
        },
      );

      // Check that the card was added to the player's hand
      expect(result.players[action.player].hand).toContain(action.card);

      // Check that the state transitioned to 'play'
      expect(result.step.name).toBe("play");
      assert(result.step.name === "play");
      expect(result.step.trump).toBe(action.trump);
      expect(result.step.starter).toBe(state.step.starter);
      expect(result.step.leader).toBe(action.player);
      expect(result.step.scores).toEqual({ us: 0, them: 0 });
      expect(result.step.trick.num).toBe(0);
      expect(result.step.trick.turn).toBe(state.step.starter);
      expect(result.step.trick.board).toEqual({
        bottom: null,
        top: null,
        left: null,
        right: null,
      });
      expect(result.step.trick.askedType).toBeNull();
      expect(result.step.trick.previousTrick).toBeNull();
    });

    it("should deal the correct number of cards to each player", () => {
      // Arrange
      const initialDeck: Card[] = Array(32).fill({ type: "heart", value: "A" });
      const initialPlayers = {
        bottom: { id: "bottom-id", hand: [] },
        left: { id: "left-id", hand: [] },
        top: { id: "top-id", hand: [] },
        right: { id: "right-id", hand: [] },
      };

      const state: GameState = {
        step: {
          name: "chooseTrump",
          card: { type: "heart", value: "A" },
          starter: "bottom",
          turn: "left",
          round: 0,
        },
        deck: initialDeck,
        players: initialPlayers,
        scores: { us: 0, them: 0, target: 501 },
      };

      const action: TrumpChooseAction = {
        type: "trumpChoose",
        card: { type: "heart", value: "A" },
        player: "left",
        trump: "heart",
      };

      // Create mock players with hands to simulate deal
      const updatedPlayers = {
        bottom: {
          id: "bottom-id",
          hand: Array(3).fill({ type: "heart", value: "A" }),
        },
        left: {
          id: "left-id",
          hand: Array(2).fill({ type: "heart", value: "A" }),
        },
        top: {
          id: "top-id",
          hand: Array(3).fill({ type: "heart", value: "A" }),
        },
        right: {
          id: "right-id",
          hand: Array(3).fill({ type: "heart", value: "A" }),
        },
      };
      const updatedDeck = initialDeck.slice(11); // 11 cards dealt (3+2+3+3)
      mockDeal.mockReturnValue([updatedPlayers, updatedDeck] as const);

      // Act
      const result = handleTrumpChoose(state, action);

      // Assert
      // Check that deal was called with the correct arguments
      expect(mockDeal).toHaveBeenCalledWith(
        "bottom", // starter
        initialPlayers, // players
        initialDeck, // deck
        {
          bottom: 3,
          left: 2, // player who chose trump gets 2 cards
          top: 3,
          right: 3,
        },
      );

      // Check that the card was added to the player's hand
      expect(result.players[action.player].hand).toContain(action.card);

      // The player who chose trump should have 3 cards (2 from deal + 1 added)
      expect(result.players[action.player].hand.length).toBe(3);
    });
  });
});
