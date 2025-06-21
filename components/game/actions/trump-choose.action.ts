import { Card, CardType } from "@/components/game/card/card";
import { PlayerType } from "@/components/game/player/player";
import { GameState } from "@/components/game/game-state";
import { deal } from "@/components/game/actions/actions.util";

export type TrumpChooseAction = {
  type: "trumpChoose";
  card: Card;
  player: PlayerType;
  trump: CardType;
};

export function handleTrumpChoose(
  state: GameState,
  action: TrumpChooseAction,
): GameState {
  if (state.step.name !== "chooseTrump")
    throw new Error(
      `Action ${action.type} impossible in this step ${state.step.name}`,
    );

  const [players, deck] = deal(state.step.starter, state.players, state.deck, {
    bottom: action.player === "bottom" ? 2 : 3,
    left: action.player === "left" ? 2 : 3,
    top: action.player === "top" ? 2 : 3,
    right: action.player === "right" ? 2 : 3,
  });

  players[action.player].hand.push(action.card);

  return {
    ...state,
    players,
    deck,
    step: {
      name: "play",
      trump: action.trump,
      starter: state.step.starter,
      leader: action.player,
      scores: {
        us: 0,
        them: 0,
      },
      round: {
        num: 0,
        turn: state.step.starter,
        board: {
          bottom: null,
          top: null,
          left: null,
          right: null,
        },
        askedType: null,
        lastRound: null,
      },
    },
  };
}
