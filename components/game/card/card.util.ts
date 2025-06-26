import { Card, CardType, CardValue } from "@/components/game/card/card.model";

export function getId(card: Card): `${CardType}${CardValue}` {
  return `${card.type}${card.value}`;
}

export function isTrump(card: Card, trump: CardType) {
  return card.type === trump;
}

export function isRed(type: CardType) {
  return ["heart", "diamond"].includes(type);
}
