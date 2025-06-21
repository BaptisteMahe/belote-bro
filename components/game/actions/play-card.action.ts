import {
  Card,
  CardType,
  getId,
  NonTrumpValues,
  TrumpValues,
} from "@/components/game/card/card";
import {
  BoardFullState,
  BoardState,
  GameState,
  initGameState,
  RoundNum,
} from "@/components/game/game-state";
import { getPlayerOrder } from "@/components/game/actions/actions.util";
import { isUs, PlayerType, PlayerTypes } from "@/components/game/player/player";

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

  const order = getPlayerOrder(state.step.starter);
  const turnIndex = order.indexOf(state.step.round.turn);

  if (turnIndex === 3) {
    const board = {
      ...state.step.round.board,
      [action.player]: action.card,
    } as BoardFullState;

    const winner = computeWinner(
      board,
      state.step.round.askedType!,
      state.step.trump,
    );

    const boardScore = computeBoardScore(board, state.step.trump);

    const scores = {
      us: state.step.scores.us + (isUs(winner) ? boardScore : 0),
      them: state.step.scores.them + (!isUs(winner) ? boardScore : 0),
    };

    if (state.step.round.num === 7) {
      const roundResultScore = computeRoundResultScore(
        scores,
        state.step.leader,
      );

      const gameScore = {
        us: state.scores.us + roundResultScore.us,
        them: state.scores.them + roundResultScore.them,
      };

      if (
        gameScore.us >= state.scores.target ||
        gameScore.them >= state.scores.target
      )
        return {
          step: {
            name: "end",
            winners: gameScore.us > gameScore.them ? "us" : "them", // TODO: handle equality
          },
          deck: [],
          players: removeCardFromPlayersHand(state.players, action),
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
      players: removeCardFromPlayersHand(state.players, action),
      step: {
        ...state.step,
        scores,
        round: {
          ...state.step.round,
          num: (state.step.round.num + 1) as RoundNum,
          turn: winner,
          board: {
            bottom: null,
            top: null,
            left: null,
            right: null,
          },
          askedType: null,
          lastRound: { board, winner },
        },
      },
    };
  }

  return {
    ...state,
    players: removeCardFromPlayersHand(state.players, action),
    step: {
      ...state.step,
      round: {
        ...state.step.round,
        board: {
          ...state.step.round.board,
          [action.player]: action.card,
        },
        turn: order[(turnIndex + 1) % PlayerTypes.length],
        askedType: state.step.round.askedType ?? action.card.type,
      },
    },
  };
}

function removeCardFromPlayersHand(
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

function computeWinner(
  board: BoardFullState,
  askedType: CardType,
  trump: CardType,
): PlayerType {
  const cardsWithType: { card: Card; type: PlayerType }[] = [
    { card: board.bottom, type: "bottom" },
    { card: board.top, type: "top" },
    { card: board.left, type: "left" },
    { card: board.right, type: "right" },
  ];

  // If there is a trump, the biggest trump wins
  if (cardsWithType.some((cardWithType) => cardWithType.card.type === trump)) {
    const maxValue = Math.max(
      ...cardsWithType
        .filter((cardWithType) => cardWithType.card.type === trump)
        .map((cardWithType) => TrumpValues[cardWithType.card.value]),
    );
    return cardsWithType.find(
      (cardWithType) => TrumpValues[cardWithType.card.value] === maxValue,
    )!.type;
  }

  // If there isn't any trump, the biggest asked type wins
  const maxValue = Math.max(
    ...cardsWithType
      .filter((cardWithType) => cardWithType.card.type === askedType)
      .map((cardWithType) => NonTrumpValues[cardWithType.card.value]),
  );
  return cardsWithType.find(
    (cardWithType) => NonTrumpValues[cardWithType.card.value] === maxValue,
  )!.type;
}

function computeBoardScore(board: BoardState, trump: CardType) {
  const cards = [board.bottom, board.top, board.left, board.right];
  return cards
    .filter((card) => !!card)
    .reduce(
      (score, card) =>
        score +
        (card.type === trump
          ? TrumpValues[card.value]
          : NonTrumpValues[card.value]),
      0,
    );
}

function computeRoundResultScore(
  roundScore: { us: number; them: number },
  leader: PlayerType,
) {
  // Capot
  if (roundScore.us === 0)
    return {
      us: 0,
      them: 252,
    };
  if (roundScore.them === 0)
    return {
      us: 252,
      them: 0,
    };

  // Failed contract
  if (isUs(leader) && roundScore.us <= roundScore.them)
    return {
      us: 0,
      them: 162,
    };
  if (!isUs(leader) && roundScore.them <= roundScore.us)
    return {
      us: 162,
      them: 0,
    };

  return roundScore;
}
