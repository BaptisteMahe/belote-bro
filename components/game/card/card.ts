import { areOpponents, PlayerType } from "@/components/game/player/player";
import { BoardState, computeWinner } from "@/components/game/board/board";

export const CardTypes = ["heart", "diamond", "spade", "club"] as const;
export type CardType = (typeof CardTypes)[number];

export const CardValues = ["7", "8", "9", "10", "J", "Q", "K", "A"] as const;
export type CardValue = (typeof CardValues)[number];

export type Card = { value: CardValue; type: CardType };

export const NonTrumpValues = {
  "7": 0,
  "8": 0,
  "9": 0,
  J: 2,
  Q: 3,
  K: 4,
  "10": 10,
  A: 11,
} as const;

export const TrumpValues = {
  "7": 0,
  "8": 0,
  Q: 3,
  K: 4,
  "10": 10,
  A: 11,
  "9": 14,
  J: 20,
} as const;

export const TypeValueMap = {
  heart: "❤",
  diamond: "♦",
  spade: "♤",
  club: "♧",
} as const satisfies { [key in CardType]: string };

export function getId(Card: Card): `${CardType}${CardValue}` {
  return `${Card.type}${Card.value}`;
}

export function isTrump(card: Card, trump: CardType) {
  return card.type === trump;
}

export function canPlay(
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
