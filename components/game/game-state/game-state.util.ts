import { shuffle } from "@/components/game/deck/deck.util";
import { initPlayer } from "@/components/game/player/player.util";
import { GameState } from "@/components/game/game-state/game-state.model";
import { Deck } from "@/components/game/deck/deck.model";

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
