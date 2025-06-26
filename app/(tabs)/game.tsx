import { GameView } from "@/components/game/GameView";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LocalRoomModal } from "@/components/networking/local/LocalRoomModal";

export default function GameScreen() {
  const [isInSession, setIsInSession] = useState<boolean>(false);
  const [localModalVisible, setLocalModalVisible] = useState<boolean>(false);
  const [hosting, setHosting] = useState<boolean>(false);

  const borderColor = useThemeColor(null, "text");

  if (!isInSession)
    return (
      <>
        {localModalVisible && (
          <LocalRoomModal
            visible={localModalVisible}
            hosting={hosting}
          ></LocalRoomModal>
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
              onPress={() => {
                setHosting(true);
                setLocalModalVisible(true);
              }}
            ></ThemedButton>
            <ThemedButton
              label={"Join room"}
              onPress={() => {
                setHosting(false);
                setLocalModalVisible(true);
              }}
            ></ThemedButton>
          </ThemedView>

          <ThemedView
            style={[styles.sessionSelectionContainer, { borderColor }]}
          >
            <ThemedText type={"subtitle"}>
              🌐 Remote session (over the internet) 🌐
            </ThemedText>
            <ThemedButton label={"Create room"}></ThemedButton>
            <ThemedButton label={"Join room"}></ThemedButton>
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
