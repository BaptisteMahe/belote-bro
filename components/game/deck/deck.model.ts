import { Card, CardTypes, CardValues } from "@/components/game/card/card.model";

export const Deck: Card[] = CardTypes.flatMap((type) =>
  CardValues.map((value) => ({ type, value })),
);
