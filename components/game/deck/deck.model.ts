import { Card, CardTypes, CardValues } from "@/components/game/card/card";

export type Deck = Card[];
export const Deck: Card[] = CardTypes.flatMap((type) =>
  CardValues.map((value) => ({ type, value })),
);
