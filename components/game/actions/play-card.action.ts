import { Card } from "@/components/game/card/card.model";
import {
  GameState,
  TrickNum,
} from "@/components/game/game-state/game-state.model";
import { getPlayerOrder } from "@/components/game/actions/actions.util";
import { PlayerType, PlayerTypes } from "@/components/game/player/player.model";
import {
  computeBoardScore,
  computeWinner,
} from "@/components/game/board/board.util";
import {
  BoardFullState,
  EmptyBoard,
} from "@/components/game/board/board.model";
import { isUs } from "@/components/game/player/player.util";
import { initGameState } from "@/components/game/game-state/game-state.util";
import { getId } from "@/components/game/card/card.util";

export type PlayCardAction = {
  type: "playCard";
  player: PlayerType;
  card: Card;
};

export function handlePlayCard(
  state: GameState,
  action: PlayCardAction,
): GameState {
  if (state.step.name !== "play")
    throw new Error(
      `Action ${action.type} impossible in this step ${state.step.name}`,
    );

  const order = getPlayerOrder(
    state.step.trick.previousTrick?.winner ?? state.step.starter,
  );
  const turnIndex = order.indexOf(state.step.trick.turn);

  if (turnIndex === 3) {
    const board = {
      ...state.step.trick.board,
      [action.player]: action.card,
    } as BoardFullState;

    const winner = computeWinner(
      board,
      state.step.trick.askedType!,
      state.step.trump,
    );

    const boardScore = computeBoardScore(
      board,
      state.step.trump,
      state.step.trick.num === 7,
    );

    const scores = {
      us: state.step.scores.us + (isUs(winner) ? boardScore : 0),
      them: state.step.scores.them + (!isUs(winner) ? boardScore : 0),
    };

    if (state.step.trick.num === 7) {
      const roundResultScore = computeRoundResultScore(
        scores,
        state.step.leader,
        state.step.hasBeloteAndRe,
      );

      const gameScore = {
        us: state.scores.us + roundResultScore.us,
        them: state.scores.them + roundResultScore.them,
      };

      if (
        (gameScore.us >= state.scores.target ||
          gameScore.them >= state.scores.target) &&
        gameScore.us !== gameScore.them
      )
        return {
          step: {
            name: "end",
            winners: gameScore.us > gameScore.them ? "us" : "them",
          },
          deck: [],
          players: removeCardFromPlayerHand(state.players, action),
          scores: {
            ...state.scores,
            ...gameScore,
          },
        };

      return initGameState({
        ...state.scores,
        ...gameScore,
      });
    }

    return {
      ...state,
      players: removeCardFromPlayerHand(state.players, action),
      step: {
        ...state.step,
        scores,
        trick: {
          ...state.step.trick,
          num: (state.step.trick.num + 1) as TrickNum,
          turn: winner,
          board: EmptyBoard,
          askedType: null,
          previousTrick: { board, winner },
        },
      },
    };
  }

  return {
    ...state,
    players: removeCardFromPlayerHand(state.players, action),
    step: {
      ...state.step,
      trick: {
        ...state.step.trick,
        board: {
          ...state.step.trick.board,
          [action.player]: action.card,
        },
        turn: order[(turnIndex + 1) % PlayerTypes.length],
        askedType: state.step.trick.askedType ?? action.card.type,
      },
    },
  };
}

function removeCardFromPlayerHand(
  players: GameState["players"],
  action: PlayCardAction,
) {
  return {
    ...players,
    [action.player]: {
      ...players[action.player],
      hand: players[action.player].hand.filter(
        (card) => getId(card) !== getId(action.card),
      ),
    },
  };
}

function computeRoundResultScore(
  roundScore: { us: number; them: number },
  leader: PlayerType,
  hasBeloteAndRe: PlayerType | null,
) {
  const addedScoreForBeloteAndRe = hasBeloteAndRe
    ? {
        us: isUs(hasBeloteAndRe) ? 20 : 0,
        them: !isUs(hasBeloteAndRe) ? 20 : 0,
      }
    : { us: 0, them: 0 };

  // Capot
  if (roundScore.us === 0)
    return {
      us: addedScoreForBeloteAndRe.us,
      them: 252 + addedScoreForBeloteAndRe.them,
    };
  if (roundScore.them === 0)
    return {
      us: 252 + addedScoreForBeloteAndRe.us,
      them: addedScoreForBeloteAndRe.them,
    };

  // Failed contract
  if (
    isUs(leader) &&
    roundScore.us + addedScoreForBeloteAndRe.us <=
      roundScore.them + addedScoreForBeloteAndRe.them
  )
    return {
      us: addedScoreForBeloteAndRe.us,
      them: 162 + addedScoreForBeloteAndRe.them,
    };
  if (
    !isUs(leader) &&
    roundScore.them + addedScoreForBeloteAndRe.them <=
      roundScore.us + addedScoreForBeloteAndRe.us
  )
    return {
      us: 162 + addedScoreForBeloteAndRe.us,
      them: addedScoreForBeloteAndRe.them,
    };

  return {
    us: roundScore.us + addedScoreForBeloteAndRe.us,
    them: roundScore.them + addedScoreForBeloteAndRe.them,
  };
}
