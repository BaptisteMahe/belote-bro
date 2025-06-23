import { Card } from "@/components/game/card/card.model";
import { NonNullableProps } from "@/utils/non-nullable-props";

export type BoardState = {
  bottom: Card | null;
  top: Card | null;
  left: Card | null;
  right: Card | null;
};

export type BoardFullState = NonNullableProps<BoardState>;
