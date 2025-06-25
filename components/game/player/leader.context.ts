import { createContext } from "react";
import { PlayerType } from "@/components/game/player/player.model";

export const LeaderContext = createContext<PlayerType | null>(null);
