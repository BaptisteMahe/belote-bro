import {
  Card,
  CardType,
  NonTrumpValues,
  TrumpValues,
} from "@/components/game/card/card";
import { PlayerType } from "@/components/game/player/player";
import { NonNullableProps } from "@/utils/non-nullable-props";

export type BoardState = {
  bottom: Card | null;
  top: Card | null;
  left: Card | null;
  right: Card | null;
};

export type BoardFullState = NonNullableProps<BoardState>;

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

  // If there is a trump, the biggest trump wins
  if (cardsWithPlayer.some(([_, card]) => card.type === trump)) {
    const maxValue = Math.max(
      ...cardsWithPlayer
        .filter(([_, card]) => card.type === trump)
        .map(([_, card]) => TrumpValues[card.value]),
    );
    return cardsWithPlayer.find(
      ([_, card]) => TrumpValues[card.value] === maxValue,
    )![0];
  }

  // If there isn't any trump, the biggest asked type wins
  const maxValue = Math.max(
    ...cardsWithPlayer
      .filter(([_, card]) => card.type === askedType)
      .map(([_, card]) => NonTrumpValues[card.value]),
  );
  return cardsWithPlayer.find(
    ([_, card]) => NonTrumpValues[card.value] === maxValue,
  )![0];
}

export function computeBoardScore(board: BoardState, trump: CardType) {
  const cards = [board.bottom, board.top, board.left, board.right];
  return cards
    .filter((card) => !!card)
    .reduce(
      (score, card) =>
        score +
        (card.type === trump
          ? TrumpValues[card.value]
          : NonTrumpValues[card.value]),
      0,
    );
}
