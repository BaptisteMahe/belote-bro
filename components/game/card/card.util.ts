import { Card, CardType, CardValue } from "@/components/game/card/card.model";

export function getId(Card: Card): `${CardType}${CardValue}` {
  return `${Card.type}${Card.value}`;
}

export function isTrump(card: Card, trump: CardType) {
  return card.type === trump;
}
