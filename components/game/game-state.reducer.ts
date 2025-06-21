import { GameState } from "@/components/game/game-state";
import { Reducer } from "react";
import { GameAction } from "@/components/game/actions/game-actions";
import { handleInitialised } from "@/components/game/actions/initialised.action";
import { handleTrumpChoose } from "@/components/game/actions/trump-choose.action";
import { handleTrumpDeny } from "@/components/game/actions/trump-deny.action";
import { handlePlayCard } from "@/components/game/actions/play-card.action";

export const gameStateReducer: Reducer<GameState, GameAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case "initialised":
      return handleInitialised(state);
    case "trumpChoose":
      return handleTrumpChoose(state, action);
    case "trumpDeny":
      return handleTrumpDeny(state, action);
    case "playCard":
      return handlePlayCard(state, action);
  }
};
