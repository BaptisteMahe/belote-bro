import { uuid } from "expo-modules-core";
import { Player, PlayerType } from "@/components/game/player/player.model";
import { GameState } from "@/components/game/game-state/game-state.model";

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

export function isInTurn(
  gameState: GameState,
  playerType: PlayerType,
): boolean {
  return (
    (gameState.step.name === "chooseTrump" &&
      gameState.step.turn === playerType) ||
    (gameState.step.name === "play" && gameState.step.trick.turn === playerType)
  );
}
