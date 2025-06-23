import { createContext } from "react";
import { PlayGameStep } from "@/components/game/game-state/game-state.model";

export const TrickContext = createContext<PlayGameStep["trick"] | null>(null);
