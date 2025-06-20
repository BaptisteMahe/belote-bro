import { Player } from "@/components/game/player/player.model";
import { Card, CardType } from "@/components/game/card/card.model";

export const GameSteps = [
  "init",
  "chooseTrump",
  "start",
  "play",
  "end",
] as const;
export type GameStep = (typeof GameSteps)[number];

export type GameStepMeta = {
  init: {};
  chooseTrump: {
    card: Card;
  };
  start: {
    trump: CardType;
  };
  play: {
    trump: CardType;
    round: {
      num: number;
      cards: Card[];
      askedType: CardType;
      lastRound: Card[];
    };
  };
  end: {
    winners: Player[];
  };
};

export type GameState<T extends GameStep> = {
  step: T;
  metaStep: GameStepMeta[T];
  players: {
    bottom: Player;
    top: Player;
    left: Player;
    right: Player;
  };
  scores: {
    us: number;
    them: number;
    target: number;
  };
};
