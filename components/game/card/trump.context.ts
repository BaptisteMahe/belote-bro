import { CardType } from "@/components/game/card/card.model";
import { createContext } from "react";

export const TrumpContext = createContext<CardType | null>(null);
