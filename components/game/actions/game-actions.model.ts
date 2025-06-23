import { InitialisedAction } from "@/components/game/actions/initialised.action";
import { TrumpChooseAction } from "@/components/game/actions/trump-choose.action";
import { TrumpDenyAction } from "@/components/game/actions/trump-deny.action";
import { PlayCardAction } from "@/components/game/actions/play-card.action";
import { ResetAction } from "@/components/game/actions/reset.action";

export type GameAction =
  | InitialisedAction
  | TrumpChooseAction
  | TrumpDenyAction
  | PlayCardAction
  | ResetAction;
