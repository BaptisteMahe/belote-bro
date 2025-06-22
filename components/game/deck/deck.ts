import { Card, CardTypes, CardValues } from "@/components/game/card/card";

export const Deck: Card[] = CardTypes.flatMap((type) =>
  CardValues.map((value) => ({ type, value })),
);

export function shuffle(deck: Card[]) {
  return [...deck].sort(() => Math.random() - 0.5);
}

export function getSingleCard(deck: Card[]) {
  const card = deck[0];
  return { card, updatedDeck: deck.slice(1) };
}

export function getMultipleCards(deck: Card[], num: number) {
  const cards = deck.slice(0, num);
  return { cards, updatedDeck: deck.slice(num) };
}
