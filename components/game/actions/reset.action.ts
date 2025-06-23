import { initGameState } from "@/components/game/game-state/game-state.util";

export type ResetAction = {
  type: "reset";
};

export function handleReset() {
  return initGameState();
}
