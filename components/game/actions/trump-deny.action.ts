import { GameState } from "@/components/game/game-state/game-state.model";
import { getPlayerOrder } from "@/components/game/actions/actions.util";
import { PlayerTypes } from "@/components/game/player/player.model";
import { initGameState } from "@/components/game/game-state/game-state.util";

export type TrumpDenyAction = {
  type: "trumpDeny";
};

export function handleTrumpDeny(
  state: GameState,
  action: TrumpDenyAction,
): GameState {
  if (state.step.name !== "chooseTrump")
    throw new Error(
      `Action ${action.type} impossible in this step ${state.step.name}`,
    );

  const order = getPlayerOrder(state.step.starter);
  const turnIndex = order.indexOf(state.step.turn);

  if (turnIndex === 3) {
    if (state.step.round === 0) {
      return {
        ...state,
        step: {
          ...state.step,
          turn: state.step.starter,
          round: 1,
        },
      };
    }

    return initGameState(state.scores);
  }

  return {
    ...state,
    step: {
      ...state.step,
      turn: order[(turnIndex + 1) % PlayerTypes.length],
    },
  };
}
