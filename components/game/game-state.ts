import {
  initPlayer,
  Player,
  PlayerType,
} from "@/components/game/player/player";
import { Card, CardType } from "@/components/game/card/card";
import { Deck, shuffle } from "@/components/game/deck/deck";
import { BoardFullState, BoardState } from "@/components/game/board/board";

export type GameState = {
  step: GameStep;
  deck: Card[];
  players: {
    bottom: Player;
    left: Player;
    top: Player;
    right: Player;
  };
  scores: Scores & { target: number };
};

export type GameStep =
  | { name: "init" }
  | {
      name: "chooseTrump";
      card: Card;
      starter: PlayerType;
      turn: PlayerType;
      round: 0 | 1;
    }
  | {
      name: "play";
      trump: CardType;
      starter: PlayerType;
      leader: PlayerType;
      scores: Scores;
      round: {
        num: RoundNum;
        turn: PlayerType;
        board: BoardState;
        askedType: CardType | null;
        lastRound: {
          board: BoardFullState;
          winner: PlayerType;
        } | null;
      };
    }
  | {
      name: "end";
      winners: "us" | "them";
    };

export type Scores = {
  us: number;
  them: number;
};

export type RoundNum = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function initGameState(
  scores: GameState["scores"] = {
    us: 0,
    them: 0,
    target: 501,
  },
): GameState {
  return {
    step: { name: "init" },
    deck: shuffle(Deck),
    players: {
      bottom: initPlayer(),
      top: initPlayer(),
      left: initPlayer(),
      right: initPlayer(),
    },
    scores,
  };
}
