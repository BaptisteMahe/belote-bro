import { BoardState } from "@/components/game/board/board.model";
import {
  Card,
  CardType,
  NonTrumpValues,
  TrumpValues,
} from "@/components/game/card/card.model";
import { PlayerType } from "@/components/game/player/player.model";

export function computeWinner(
  board: BoardState,
  askedType: CardType,
  trump: CardType,
): PlayerType {
  const cardsWithPlayer = Object.entries(board).filter(
    (cardWithPlayer): cardWithPlayer is [PlayerType, Card] =>
      cardWithPlayer[1] !== null,
  );

  if (cardsWithPlayer.length === 0)
    throw new Error("Can't compute winner on empty board");

  const trumps = cardsWithPlayer.filter(([_, card]) => card.type === trump);

  // If there is a trump, the biggest trump wins
  if (trumps.length > 0) {
    const maxValue = Math.max(
      ...trumps.map(([_, card]) => TrumpValues[card.value]),
    );
    return trumps.find(([_, card]) => TrumpValues[card.value] === maxValue)![0];
  }

  const askedTypes = cardsWithPlayer.filter(
    ([_, card]) => card.type === askedType,
  );

  // If there isn't any trump, the biggest asked type wins
  const maxValue = Math.max(
    ...askedTypes.map(([_, card]) => NonTrumpValues[card.value]),
  );
  return askedTypes.find(
    ([_, card]) => NonTrumpValues[card.value] === maxValue,
  )![0];
}

export function computeBoardScore(
  board: BoardState,
  trump: CardType,
  isLastTrick: boolean,
) {
  const cards = [board.bottom, board.top, board.left, board.right];
  return (
    cards
      .filter((card) => !!card)
      .reduce(
        (score, card) =>
          score +
          (card.type === trump
            ? TrumpValues[card.value]
            : NonTrumpValues[card.value]),
        0,
      ) + (isLastTrick ? 10 : 0)
  );
}
