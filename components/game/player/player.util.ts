import { uuid } from "expo-modules-core";
import { Player, PlayerType } from "@/components/game/player/player.model";

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
