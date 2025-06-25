import { describe, expect, it, jest } from "@jest/globals";
import { computeNewStarter, deal, getPlayerOrder } from "../actions.util";
import { GameState } from "@/components/game/game-state/game-state.model";
import { PlayerType, PlayerTypes } from "@/components/game/player/player.model";
import { Card } from "@/components/game/card/card.model";
import * as deckModule from "@/components/game/deck/deck.util";

describe("action.util", () => {
  describe("computeNewStarter", () => {
    it("should return the next player when there is an old starter", () => {
      const state: Partial<GameState> = {
        step: {
          name: "chooseTrump",
          starter: "bottom",
          card: {} as Card,
          turn: "bottom",
          round: 0,
        },
      };

      const result = computeNewStarter(state as GameState);

      expect(result).toBe("left");
    });

    it("should wrap around to the first player when the old starter is the last player", () => {
      const state: Partial<GameState> = {
        step: {
          name: "chooseTrump",
          starter: "right",
          card: {} as Card,
          turn: "right",
          round: 0,
        },
      };

      const result = computeNewStarter(state as GameState);

      expect(result).toBe("bottom");
    });

    it("should return a random player when there is no old starter", () => {
      const state: Partial<GameState> = {
        step: { name: "init" },
      };

      // Mock Math.random to return a predictable value
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.5) as () => number; // This should select the middle player

      const result = computeNewStarter(state as GameState);

      // Restore Math.random
      Math.random = originalRandom;

      expect(PlayerTypes).toContain(result);
      expect(result).toBe(PlayerTypes[Math.floor(0.5 * PlayerTypes.length)]);
    });
  });

  describe("deal", () => {
    it("should deal the specified number of cards to each player in order", () => {
      const starter: PlayerType = "bottom";
      const players: GameState["players"] = {
        bottom: { name: "1", hand: [] },
        left: { name: "2", hand: [] },
        top: { name: "3", hand: [] },
        right: { name: "4", hand: [] },
      };
      const mockDeck: Card[] = [
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
        { type: "spade", value: "Q" },
        { type: "club", value: "J" },
        { type: "heart", value: "10" },
        { type: "diamond", value: "9" },
        { type: "spade", value: "8" },
        { type: "club", value: "7" },
      ];
      const numCards = 2;

      // Mock getMultipleCards to return predictable results
      const getMultipleCardsSpy = jest.spyOn(deckModule, "getMultipleCards");
      getMultipleCardsSpy.mockImplementation((deck, num) => {
        const cards = deck.slice(0, num);
        return { cards, updatedDeck: deck.slice(num) };
      });

      const [updatedPlayers, remainingDeck] = deal(
        starter,
        players,
        mockDeck,
        numCards,
      );

      expect(updatedPlayers.bottom.hand).toEqual([
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
      ]);
      expect(updatedPlayers.left.hand).toEqual([
        { type: "spade", value: "Q" },
        { type: "club", value: "J" },
      ]);
      expect(updatedPlayers.top.hand).toEqual([
        { type: "heart", value: "10" },
        { type: "diamond", value: "9" },
      ]);
      expect(updatedPlayers.right.hand).toEqual([
        { type: "spade", value: "8" },
        { type: "club", value: "7" },
      ]);
      expect(remainingDeck).toEqual([]);
      expect(getMultipleCardsSpy).toHaveBeenCalledTimes(4);

      getMultipleCardsSpy.mockRestore();
    });

    it("should deal different numbers of cards to each player when numCards is an object", () => {
      const starter: PlayerType = "left";
      const players: GameState["players"] = {
        bottom: { name: "1", hand: [] },
        left: { name: "2", hand: [] },
        top: { name: "3", hand: [] },
        right: { name: "4", hand: [] },
      };
      const mockDeck: Card[] = [
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
        { type: "spade", value: "Q" },
        { type: "club", value: "J" },
        { type: "heart", value: "10" },
        { type: "diamond", value: "9" },
        { type: "spade", value: "8" },
        { type: "club", value: "7" },
        { type: "heart", value: "7" },
        { type: "diamond", value: "8" },
      ];
      const numCards = {
        left: 3,
        top: 2,
        right: 1,
        bottom: 4,
      };

      // Mock getMultipleCards to return predictable results
      const getMultipleCardsSpy = jest.spyOn(deckModule, "getMultipleCards");
      getMultipleCardsSpy.mockImplementation((deck, num) => {
        const cards = deck.slice(0, num);
        return { cards, updatedDeck: deck.slice(num) };
      });

      const [updatedPlayers, remainingDeck] = deal(
        starter,
        players,
        mockDeck,
        numCards,
      );

      expect(updatedPlayers.left.hand).toEqual([
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
        { type: "spade", value: "Q" },
      ]);
      expect(updatedPlayers.top.hand).toEqual([
        { type: "club", value: "J" },
        { type: "heart", value: "10" },
      ]);
      expect(updatedPlayers.right.hand).toEqual([
        { type: "diamond", value: "9" },
      ]);
      expect(updatedPlayers.bottom.hand).toEqual([
        { type: "spade", value: "8" },
        { type: "club", value: "7" },
        { type: "heart", value: "7" },
        { type: "diamond", value: "8" },
      ]);
      expect(remainingDeck).toEqual([]);
      expect(getMultipleCardsSpy).toHaveBeenCalledTimes(4);

      getMultipleCardsSpy.mockRestore();
    });

    it("should add cards to existing hands", () => {
      const starter: PlayerType = "top";
      const players: GameState["players"] = {
        bottom: { name: "1", hand: [{ type: "heart", value: "A" }] },
        left: { name: "2", hand: [{ type: "diamond", value: "K" }] },
        top: { name: "3", hand: [{ type: "spade", value: "Q" }] },
        right: { name: "4", hand: [{ type: "club", value: "J" }] },
      };
      const mockDeck: Card[] = [
        { type: "heart", value: "10" },
        { type: "diamond", value: "9" },
        { type: "spade", value: "8" },
        { type: "club", value: "7" },
      ];
      const numCards = 1;

      // Mock getMultipleCards to return predictable results
      const getMultipleCardsSpy = jest.spyOn(deckModule, "getMultipleCards");
      getMultipleCardsSpy.mockImplementation((deck, num) => {
        const cards = deck.slice(0, num);
        return { cards, updatedDeck: deck.slice(num) };
      });

      const [updatedPlayers, remainingDeck] = deal(
        starter,
        players,
        mockDeck,
        numCards,
      );

      expect(updatedPlayers.top.hand).toEqual([
        { type: "spade", value: "Q" },
        { type: "heart", value: "10" },
      ]);
      expect(updatedPlayers.right.hand).toEqual([
        { type: "club", value: "J" },
        { type: "diamond", value: "9" },
      ]);
      expect(updatedPlayers.bottom.hand).toEqual([
        { type: "heart", value: "A" },
        { type: "spade", value: "8" },
      ]);
      expect(updatedPlayers.left.hand).toEqual([
        { type: "diamond", value: "K" },
        { type: "club", value: "7" },
      ]);
      expect(remainingDeck).toEqual([]);
      expect(getMultipleCardsSpy).toHaveBeenCalledTimes(4);

      getMultipleCardsSpy.mockRestore();
    });
  });

  describe("getPlayerOrder", () => {
    it("should return players in order starting from the given player", () => {
      expect(getPlayerOrder("bottom")).toEqual([
        "bottom",
        "left",
        "top",
        "right",
      ]);
      expect(getPlayerOrder("left")).toEqual([
        "left",
        "top",
        "right",
        "bottom",
      ]);
      expect(getPlayerOrder("top")).toEqual(["top", "right", "bottom", "left"]);
      expect(getPlayerOrder("right")).toEqual([
        "right",
        "bottom",
        "left",
        "top",
      ]);
    });
  });
});
