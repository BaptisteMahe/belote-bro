import Server from "react-native-tcp-socket/lib/types/Server";
import Socket from "react-native-tcp-socket/lib/types/Socket";
import { GameState } from "@/components/game/game-state/game-state.model";

export type LocalServer = {
  server: Server;
  players: {
    right: LocalClientUser;
    top: LocalClientUser;
    left: LocalClientUser;
  };
};

export type LocalClientUser = {
  id: string;
  name: string;
  socket: Socket;
};

export type ServerMessages = GameStateUpdateMessage;

export type GameStateUpdateMessage = {
  type: "gameStateUpdate";
  newState: GameState;
};
