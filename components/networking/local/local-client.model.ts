import Socket from "react-native-tcp-socket/lib/types/Socket";
import { PlayerType } from "@/components/game/player/player.model";
import { GameAction } from "@/components/game/actions/game-actions.model";

export type LocalClient = {
  client: Socket;
  server: {
    ip: string;
    port: number;
  };
  me: PlayerType;
};

export type ClientMessages = PlayerIdentifierMessage | GameActionMessage;

export type PlayerIdentifierMessage = {
  type: "playerIdentifier";
  user: {
    id: string;
    name: string;
  };
};

export type GameActionMessage = {
  type: "gameAction";
  action: GameAction;
  from: { id: string };
};
