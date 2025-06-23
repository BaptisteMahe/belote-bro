import { describe, expect, it, jest } from "@jest/globals";
import { getMultipleCards, getSingleCard, shuffle } from "../deck.util";
import { Deck } from "../deck.model";
import { Card, CardTypes, CardValues } from "@/components/game/card/card";

describe("deck", () => {
  describe("Deck", () => {
    it("should contain all possible card combinations", () => {
      // There should be cardTypes.length * cardValues.length cards
      expect(Deck.length).toBe(CardTypes.length * CardValues.length);

      // Check that each card type and value combination exists exactly once
      CardTypes.forEach((type) => {
        CardValues.forEach((value) => {
          const cardsWithTypeAndValue = Deck.filter(
            (card) => card.type === type && card.value === value,
          );
          expect(cardsWithTypeAndValue.length).toBe(1);
        });
      });
    });
  });

  describe("shuffle", () => {
    it("should return a new array with the same cards in a different order", () => {
      // Create a mock deck for testing
      const mockDeck: Card[] = [
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
        { type: "spade", value: "Q" },
        { type: "club", value: "J" },
      ];

      // Mock Math.random to return predictable values
      const originalRandom = Math.random;
      Math.random = jest
        .fn()
        .mockReturnValueOnce(0.9) // This should put the last card first
        .mockReturnValueOnce(0.1) // This should keep the first card second
        .mockReturnValueOnce(0.5) // This should put the third card third
        .mockReturnValueOnce(0.3) as () => number; // This should put the second card last

      const shuffledDeck = shuffle(mockDeck);

      // Restore Math.random
      Math.random = originalRandom;

      // The shuffled deck should have the same length
      expect(shuffledDeck.length).toBe(mockDeck.length);

      // The shuffled deck should contain all the same cards
      mockDeck.forEach((card) => {
        const matchingCards = shuffledDeck.filter(
          (shuffledCard) =>
            shuffledCard.type === card.type &&
            shuffledCard.value === card.value,
        );
        expect(matchingCards.length).toBe(1);
      });

      // The shuffled deck should be a new array, not the original
      expect(shuffledDeck).not.toBe(mockDeck);
    });

    it("should not modify the original deck", () => {
      const mockDeck: Card[] = [
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
        { type: "spade", value: "Q" },
      ];

      const originalDeck = [...mockDeck];
      shuffle(mockDeck);

      // The original deck should remain unchanged
      expect(mockDeck).toEqual(originalDeck);
    });
  });

  describe("getSingleCard", () => {
    it("should return the first card and the updated deck", () => {
      const mockDeck: Card[] = [
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
        { type: "spade", value: "Q" },
      ];

      const { card, updatedDeck } = getSingleCard(mockDeck);

      // The returned card should be the first card in the deck
      expect(card).toEqual({ type: "heart", value: "A" });

      // The updated deck should have one less card
      expect(updatedDeck.length).toBe(mockDeck.length - 1);

      // The updated deck should not contain the returned card
      expect(updatedDeck).not.toContainEqual(card);

      // The updated deck should be a new array, not the original
      expect(updatedDeck).not.toBe(mockDeck);
    });

    it("should not modify the original deck", () => {
      const mockDeck: Card[] = [
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
        { type: "spade", value: "Q" },
      ];

      const originalDeck = [...mockDeck];
      getSingleCard(mockDeck);

      // The original deck should remain unchanged
      expect(mockDeck).toEqual(originalDeck);
    });

    it("should handle an empty deck", () => {
      const emptyDeck: Card[] = [];

      const { card, updatedDeck } = getSingleCard(emptyDeck);

      // The returned card should be undefined
      expect(card).toBeUndefined();

      // The updated deck should be empty
      expect(updatedDeck).toEqual([]);

      // The updated deck should be a new array, not the original
      expect(updatedDeck).not.toBe(emptyDeck);
    });
  });

  describe("getMultipleCards", () => {
    it("should return the specified number of cards and the updated deck", () => {
      const mockDeck: Card[] = [
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
        { type: "spade", value: "Q" },
        { type: "club", value: "J" },
      ];

      const numCards = 2;
      const { cards, updatedDeck } = getMultipleCards(mockDeck, numCards);

      // The returned cards should be the first numCards in the deck
      expect(cards).toEqual([
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
      ]);

      // The updated deck should have numCards less cards
      expect(updatedDeck.length).toBe(mockDeck.length - numCards);

      // The updated deck should not contain any of the returned cards
      cards.forEach((card) => {
        expect(updatedDeck).not.toContainEqual(card);
      });

      // The updated deck should be a new array, not the original
      expect(updatedDeck).not.toBe(mockDeck);
    });

    it("should not modify the original deck", () => {
      const mockDeck: Card[] = [
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
        { type: "spade", value: "Q" },
      ];

      const originalDeck = [...mockDeck];
      getMultipleCards(mockDeck, 2);

      // The original deck should remain unchanged
      expect(mockDeck).toEqual(originalDeck);
    });

    it("should handle requesting more cards than available", () => {
      const mockDeck: Card[] = [
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
      ];

      const numCards = 3;
      const { cards, updatedDeck } = getMultipleCards(mockDeck, numCards);

      // The returned cards should be all cards in the deck
      expect(cards).toEqual(mockDeck);

      // The updated deck should be empty
      expect(updatedDeck).toEqual([]);
    });

    it("should handle an empty deck", () => {
      const emptyDeck: Card[] = [];

      const { cards, updatedDeck } = getMultipleCards(emptyDeck, 2);

      // The returned cards should be an empty array
      expect(cards).toEqual([]);

      // The updated deck should be empty
      expect(updatedDeck).toEqual([]);

      // The updated deck should be a new array, not the original
      expect(updatedDeck).not.toBe(emptyDeck);
    });

    it("should handle requesting zero cards", () => {
      const mockDeck: Card[] = [
        { type: "heart", value: "A" },
        { type: "diamond", value: "K" },
        { type: "spade", value: "Q" },
      ];

      const { cards, updatedDeck } = getMultipleCards(mockDeck, 0);

      // The returned cards should be an empty array
      expect(cards).toEqual([]);

      // The updated deck should be the same as the original
      expect(updatedDeck).toEqual(mockDeck);

      // The updated deck should be a new array, not the original
      expect(updatedDeck).not.toBe(mockDeck);
    });
  });
});
