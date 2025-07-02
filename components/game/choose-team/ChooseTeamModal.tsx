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

  function handleDrop(
    player: LocalClientUser,
    position: "top" | "left" | "right",
  ) {
    setPlayers(
      onDropPlayer(players, {
        player,
        position,
      }),
    );
  }

  return (
    <ThemedModal visible={visible} style={[style, styles.modal]} {...rest}>
      <ThemedText style={{ padding: 10 }} type={"title"}>
        Choose team (by dragging players)
      </ThemedText>
      <GestureHandlerRootView>
        <DropProvider>
          <ThemedView style={[styles.playerContainer]}>
            <ThemedView style={[styles.topRow]}>
              <Droppable<LocalClientUser>
                style={[{ zIndex: 1 }]}
                dropAlignment={"center"}
                droppableId={"top"}
                onDrop={(player) => handleDrop(player, "top")}
              >
                <Draggable
                  key={players.top.id}
                  draggableId={players.top.id}
                  data={players.top}
                >
                  <UserView user={players.top}></UserView>
                </Draggable>
              </Droppable>
            </ThemedView>
            <ThemedView style={[styles.middleRow]}>
              <Droppable<LocalClientUser>
                style={[{ zIndex: 1 }]}
                droppableId={"left"}
                dropAlignment={"center"}
                onDrop={(player) => handleDrop(player, "left")}
              >
                <Draggable
                  key={players.left.id}
                  draggableId={players.left.id}
                  data={players.left}
                >
                  <UserView user={players.left}></UserView>
                </Draggable>
              </Droppable>

              <Droppable<LocalClientUser>
                style={[{ zIndex: 1 }]}
                dropAlignment={"center"}
                droppableId={"right"}
                onDrop={(player) => handleDrop(player, "right")}
              >
                <Draggable
                  key={players.right.id}
                  draggableId={players.right.id}
                  data={players.right}
                >
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
        label={"Start game"}
        onPress={() => onClose(players)}
      ></ThemedButton>
    </ThemedModal>
  );
}

export function onDropPlayer(
  players: LocalServer["players"],
  dropped: { player: LocalClientUser; position: keyof LocalServer["players"] },
) {
  const draggedFrom = Object.entries(players).find(
    ([_, player]) => player.id === dropped.player.id,
  )?.[0] as keyof LocalServer["players"] | undefined;

  if (!draggedFrom) return players;

  return {
    ...players,
    [dropped.position]: dropped.player,
    [draggedFrom]: players[dropped.position],
  };
}

function UserView({ user }: { user: Omit<LocalClientUser, "socket"> }) {
  const color = useThemeColor(null, "text");

  return (
    <ThemedView style={[styles.user]}>
      <IconSymbol
        name={"character.circle"}
        color={color}
        size={48}
      ></IconSymbol>
      <ThemedText>{user.name}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  modal: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "50%",
    gap: 100,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    zIndex: 2000,
  },
});
