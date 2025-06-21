import { GameState } from "@/components/game/game-state";
import { PlayerType, PlayerTypes } from "@/components/game/player/player";
import { Card } from "@/components/game/card/card";
import { getMultipleCards } from "@/components/game/deck/deck";

export function computeNewStarter(state: GameState) {
  const oldStarter = "starter" in state.step ? state.step.starter : undefined;

  if (oldStarter)
    return PlayerTypes[
      (PlayerTypes.indexOf(oldStarter) + 1) % PlayerTypes.length
    ];

  return PlayerTypes[Math.floor(Math.random() * PlayerTypes.length)];
}

export function deal(
  starter: PlayerType,
  players: GameState["players"],
  deck: Card[],
  numCards: number | { [key in PlayerType]: number },
) {
  let newDeck = [...deck];
  const updatedPlayers = { ...players };

  for (const playerType of getPlayerOrder(starter)) {
    const { cards, updatedDeck } = getMultipleCards(
      newDeck,
      typeof numCards === "number" ? numCards : numCards[playerType],
    );
    updatedPlayers[playerType].hand = [
      ...updatedPlayers[playerType].hand,
      ...cards,
    ];
    newDeck = updatedDeck;
  }

  return [updatedPlayers, newDeck] as const;
}

export function getPlayerOrder(start: PlayerType) {
  const startIndex = PlayerTypes.indexOf(start);
  return [
    ...PlayerTypes.slice(startIndex),
    ...PlayerTypes.slice(0, startIndex),
  ];
}
