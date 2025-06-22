import { Card } from "@/components/game/card/card";
import { uuid } from "expo-modules-core";

export const PlayerTypes = ["bottom", "left", "top", "right"] as const;
export type PlayerType = (typeof PlayerTypes)[number];

export type Player = {
  id: string;
  hand: Card[];
};

export function initPlayer(): Player {
  return {
    id: uuid.v4(),
    hand: [],
  };
}

export function isUs(player: PlayerType) {
  return ["bottom", "top"].includes(player);
}

export function areOpponents(player: PlayerType, other: PlayerType) {
  return isUs(other) !== isUs(player);
}
