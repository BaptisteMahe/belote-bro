import { GameState } from "@/components/game/game-state/game-state.model";
import { GameAction } from "@/components/game/actions/game-actions.model";
import { canPlayCard } from "@/components/game/card/can-play-card";
import { sleep } from "@/utils/sleep";

export async function autoPlay(
  gameState: GameState,
  dispatch: (action: GameAction) => void,
) {
  if (gameState.step.name === "chooseTrump") {
    if (gameState.step.turn === "bottom") return;

    await sleep(1000);

    return dispatch({ type: "trumpDeny" });
  }

  if (gameState.step.name === "play") {
    if (gameState.step.trick.turn === "bottom") return;

    const trick = gameState.step.trick;
    const trump = gameState.step.trump;
    const playerHand = gameState.players[trick.turn].hand;

    const playableCard = playerHand.find((card) =>
      canPlayCard(
        card,
        playerHand,
        trick.turn,
        trick.board,
        trick.askedType,
        trump,
      ),
    );

    if (!playableCard)
      throw new Error(
        `No playable card for player ${trick.turn}: ${gameState.players[trick.turn]}`,
      );

    await sleep(1000);

    return dispatch({
      type: "playCard",
      card: playableCard,
      player: trick.turn,
    });
  }
}
