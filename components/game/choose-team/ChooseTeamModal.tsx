import { StyleSheet } from "react-native";
import { ThemedModal } from "@/components/ThemedModal";
import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import {
  LocalClientUser,
  LocalServer,
} from "@/components/networking/local/local-server.model";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useUser } from "@/components/user/user.hook";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Draggable,
  Droppable,
  DropProvider,
} from "react-native-reanimated-dnd";

export type ChooseTeamModalProps = ThemedViewProps & {
  users: LocalClientUser[];
  visible: boolean;
  onClose: (server: LocalServer["players"]) => void;
};

export function ChooseTeamModal({
  users,
  visible,
  onClose,
  style,
  ...rest
}: ChooseTeamModalProps) {
  const me = useUser();
  const [players, setPlayers] = useState<LocalServer["players"]>({
    left: users[0],
    top: users[1],
    right: users[2],
  });

  return (
    <ThemedModal visible={visible} {...rest} style={[style, styles.modal]}>
      <GestureHandlerRootView>
        <DropProvider>
          <ThemedView style={[styles.playerContainer]}>
            <ThemedView style={[styles.topRow]}>
              <Droppable<LocalClientUser>
                dropAlignment={"center"}
                droppableId={"top"}
                onDrop={(player) =>
                  setPlayers((players) =>
                    onDropPlayer(players, { player, position: "top" }),
                  )
                }
              >
                <Draggable draggableId={players.top.id} data={players.top}>
                  <UserView user={players.top}></UserView>
                </Draggable>
              </Droppable>
            </ThemedView>
            <ThemedView style={[styles.middleRow]}>
              <Droppable<LocalClientUser>
                droppableId={"left"}
                dropAlignment={"center"}
                onDrop={(player) =>
                  setPlayers((players) =>
                    onDropPlayer(players, { player, position: "left" }),
                  )
                }
              >
                <Draggable draggableId={players.left.id} data={players.left}>
                  <UserView user={players.left}></UserView>
                </Draggable>
              </Droppable>

              <Droppable<LocalClientUser>
                dropAlignment={"center"}
                droppableId={"right"}
                onDrop={(player) =>
                  setPlayers((players) =>
                    onDropPlayer(players, { player, position: "right" }),
                  )
                }
              >
                <Draggable draggableId={players.right.id} data={players.right}>
                  <UserView user={players.right}></UserView>
                </Draggable>
              </Droppable>
            </ThemedView>
            <ThemedView style={[styles.bottomRow]}>
              <UserView user={me!}></UserView>
            </ThemedView>
          </ThemedView>
        </DropProvider>
      </GestureHandlerRootView>

      <ThemedButton
        label={"Validate"}
        onPress={() => onClose(players)}
      ></ThemedButton>
    </ThemedModal>
  );
}

function onDropPlayer(
  players: LocalServer["players"],
  dropped: { player: LocalClientUser; position: "top" | "left" | "right" },
) {
  const draggedFrom = Object.entries(players).find(
    ([_, player]) => player.id === dropped.player.id,
  )?.[0] as "top" | "left" | "right" | undefined;

  if (!draggedFrom) return players;

  return {
    ...players,
    [dropped.position]: dropped.player,
    [draggedFrom]: players[dropped.position]!,
  };
}

function UserView({ user }: { user: Omit<LocalClientUser, "socket"> }) {
  const color = useThemeColor(null, "text");

  return (
    <ThemedView style={[styles.user]}>
      <IconSymbol name={"character.circle"} color={color}></IconSymbol>
      <ThemedText>{user.name}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  modal: {
    flexDirection: "column",
    justifyContent: "center",
  },
  playerContainer: {
    flexDirection: "column",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  middleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  user: {
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
    padding: 5,
    borderRadius: 15,
  },
});
