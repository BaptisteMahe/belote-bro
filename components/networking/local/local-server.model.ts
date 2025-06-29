import Server from "react-native-tcp-socket/lib/types/Server";
import Socket from "react-native-tcp-socket/lib/types/Socket";
import { GameState } from "@/components/game/game-state/game-state.model";

export type LocalServer = {
  server: Server;
  players: {
    right: Socket;
    top: Socket;
    left: Socket;
  };
};

export type ServerMessages = GameStateUpdateMessage;

export type GameStateUpdateMessage = {
  type: "gameStateUpdate";
  newState: GameState;
};
