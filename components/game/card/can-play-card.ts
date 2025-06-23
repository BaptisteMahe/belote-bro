import { Card, CardType, TrumpValues } from "@/components/game/card/card";
import { areOpponents } from "../player/player.util";

import { computeWinner } from "../board/board.util";
import { BoardState } from "../board/board.model";
import { PlayerType } from "@/components/game/player/player.model";

export function canPlayCard(
  card: Card,
  hand: Card[],
  player: PlayerType,
  board: BoardState,
  askedType: CardType | null,
  trump: CardType,
): boolean {
  if (askedType === null) return true;

  if (card.type === askedType) {
    if (askedType === trump) {
      const highestTrump = findHighestTrump(board, trump);

      if (!highestTrump) return true;

      // If the card is higher than the highest trump on board, it can be played
      if (TrumpValues[card.value] > TrumpValues[highestTrump.value])
        return true;

      // Check if the player has any higher trump than the highest on board
      const hasHigherTrump = playerHasHigherTrump(hand, trump, highestTrump);

      // If the player has a higher trump, they must play it
      if (hasHigherTrump) {
        return false;
      }

      // If the player doesn't have a higher trump, they can play any trump
      return true;
    }

    // If it's not a trump but matches the asked type, it can be played
    return true;
  }

  // If the card doesn't match the asked type, check if the player has any card of the asked type
  const hasAskedType = hand.some((card) => card.type === askedType);
  if (hasAskedType) return false; // Player must play a card of the asked type if they have one

  // If the card is a trump
  if (card.type === trump) {
    // Find any trumps on the board
    const highestTrump = findHighestTrump(board, trump);

    if (!highestTrump) return true;

    // If the card is higher than the highest trump on board, it can be played
    if (TrumpValues[card.value] > TrumpValues[highestTrump.value]) return true;

    // Check if the player has any higher trump than the highest on board
    const hasHigherTrump = playerHasHigherTrump(hand, trump, highestTrump);

    // If the player has a higher trump, they must play it
    if (hasHigherTrump) return false;
  }

  // If the player doesn't have the asked type and the card is not a trump
  if (card.type !== trump) {
    // Check if the player has any trump cards
    const hasTrump = hand.some((c) => c.type === trump);

    if (hasTrump) {
      const playedCards = Object.entries(board).filter(
        (playerAndCard): playerAndCard is [string, Card] =>
          playerAndCard[1] !== null,
      );

      if (playedCards.length > 0) {
        const winner = computeWinner(board, askedType, trump);

        // Check if an opponent is winning
        // In Belote, bottom and top are partners, left and right are partners
        const isOpponentWinning = areOpponents(winner, player);

        // If an opponent is winning and the player has a trump, they must play a trump
        if (isOpponentWinning && hasTrump) {
          return false;
        }
      }
    }
  }

  // If the player doesn't have the asked type and the card is not a trump,
  // or if they can't beat the highest trump, or if a partner is winning the trick,
  // they can play any card
  return true;
}

function findHighestTrump(board: BoardState, trump: CardType) {
  const trumpsOnBoard = Object.values(board).filter(
    (card): card is Card => card !== null && card.type === trump,
  );

  if (trumpsOnBoard.length === 0) return null;

  return trumpsOnBoard.reduce(
    (highest, current) =>
      TrumpValues[current.value] > TrumpValues[highest.value]
        ? current
        : highest,
    trumpsOnBoard[0],
  );
}

function playerHasHigherTrump(
  hand: Card[],
  trump: CardType,
  highestTrump: Card,
) {
  return hand.some(
    (card) =>
      card.type === trump &&
      TrumpValues[card.value] > TrumpValues[highestTrump.value],
  );
}
