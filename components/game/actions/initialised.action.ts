import { GameState } from "@/components/game/game-state";
import { getSingleCard } from "@/components/game/deck/deck";
import {
  computeNewStarter,
  deal,
} from "@/components/game/actions/actions.util";

export type InitialisedAction = {
  type: "initialised";
};

export function handleInitialised(state: GameState): GameState {
  const newStarter = computeNewStarter(state);

  let [players, deck] = deal(newStarter, state.players, state.deck, 3);
  [players, deck] = deal(newStarter, players, deck, 2);
  const { card, updatedDeck } = getSingleCard(deck);

  return {
    ...state,
    players,
    deck: updatedDeck,
    step: {
      name: "chooseTrump",
      card,
      starter: newStarter,
      turn: newStarter,
      round: 0,
    },
  };
}
