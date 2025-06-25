import { uuid } from "expo-modules-core";
import { Player, PlayerType } from "@/components/game/player/player.model";
import { GameState } from "@/components/game/game-state/game-state.model";
import { CardType } from "@/components/game/card/card.model";

export function initPlayer(): Player {
  return {
    name: uuid.v4(),
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

export function hasBeloteAndRe(player: Player, trump: CardType) {
  return !!(
    player.hand.find((card) => card.type === trump && card.value === "K") &&
    player.hand.find((card) => card.type === trump && card.value === "Q")
  );
}
