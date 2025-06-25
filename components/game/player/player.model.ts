import { Card } from "@/components/game/card/card.model";

export const PlayerTypes = ["bottom", "left", "top", "right"] as const;
export type PlayerType = (typeof PlayerTypes)[number];

export type Player = {
  name: string;
  hand: Card[];
};
