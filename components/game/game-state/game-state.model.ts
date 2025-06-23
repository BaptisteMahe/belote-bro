import { Card, CardType } from "@/components/game/card/card.model";
import {
  BoardFullState,
  BoardState,
} from "@/components/game/board/board.model";
import { Player, PlayerType } from "@/components/game/player/player.model";
import { Scores } from "@/components/game/score/scores.model";

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
  | InitGameStep
  | ChooseTrumpGameStep
  | PlayGameStep
  | EndGameStep;

export type InitGameStep = { name: "init" };

export type ChooseTrumpGameStep = {
  name: "chooseTrump";
  card: Card;
  starter: PlayerType;
  turn: PlayerType;
  round: 0 | 1;
};

export type PlayGameStep = {
  name: "play";
  trump: CardType;
  starter: PlayerType;
  leader: PlayerType;
  scores: Scores;
  trick: {
    num: TrickNum;
    turn: PlayerType;
    board: BoardState;
    askedType: CardType | null;
    previousTrick: {
      board: BoardFullState;
      winner: PlayerType;
    } | null;
  };
};

export type EndGameStep = {
  name: "end";
  winners: "us" | "them";
};

export type TrickNum = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
