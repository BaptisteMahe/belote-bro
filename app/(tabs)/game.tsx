import { GameView } from "@/components/game/GameView";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { HostLocalRoomModal } from "@/components/networking/local/modal/HostLocalRoomModal";
import { JoinLocalRoomModal } from "@/components/networking/local/modal/JoinLocalRoomModal";
import { LocalServer } from "@/components/networking/local/local-server.model";
import { LocalClient } from "@/components/networking/local/local-client.model";

export default function GameScreen() {
  const [localModalVisible, setLocalModalVisible] = useState<
    "host" | "join" | null
  >(null);

  const [server, setServer] = useState<LocalServer | null>(null);
  const [client, setClient] = useState<LocalClient | null>(null);

  const borderColor = useThemeColor(null, "text");

  if (!server && !client)
    return (
      <>
        {localModalVisible === "host" && (
          <HostLocalRoomModal
            visible={localModalVisible === "host"}
            onClose={(server) => {
              setLocalModalVisible(null);
              setServer(server);
            }}
          ></HostLocalRoomModal>
        )}

        {localModalVisible === "join" && (
          <JoinLocalRoomModal
            visible={localModalVisible === "join"}
            onClose={(client) => {
              setLocalModalVisible(null);
              setClient(client);
            }}
          ></JoinLocalRoomModal>
        )}

        <ThemedView style={[styles.container]}>
          <ThemedView
            style={[styles.sessionSelectionContainer, { borderColor }]}
          >
            <ThemedText type={"subtitle"}>
              🛜 Local session (on the same local network) 🛜
            </ThemedText>
            <ThemedButton
              label={"Create room"}
              onPress={() => setLocalModalVisible("host")}
            ></ThemedButton>
            <ThemedButton
              label={"Join room"}
              onPress={() => setLocalModalVisible("join")}
            ></ThemedButton>
          </ThemedView>

          <ThemedView
            style={[styles.sessionSelectionContainer, { borderColor }]}
          >
            <ThemedText type={"subtitle"}>
              🌐 Remote session (over the internet) 🌐-{">"} Yet to be developed
            </ThemedText>
            <ThemedButton label={"Create room"} disabled={true}></ThemedButton>
            <ThemedButton label={"Join room"} disabled={true}></ThemedButton>
          </ThemedView>
        </ThemedView>
      </>
    );

  return <GameView></GameView>; // TODO: add session params as input.
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: 10,
    flexDirection: "column",
    gap: 10,
  },
  sessionSelectionContainer: {
    padding: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderStyle: "dashed",
  },
});
