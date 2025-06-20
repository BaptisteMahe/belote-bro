import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Player } from "@/components/game/player/player.model";
import { PlayerView } from "@/components/game/player/PlayerView";
import { getRandomCard } from "@/components/game/card/card.model";
import { uuid } from "expo-modules-core";

const players: Player[] = [
  {
    id: uuid.v4(),
    hand: [
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
    ],
  },
  {
    id: uuid.v4(),
    hand: [
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
    ],
  },
  {
    id: uuid.v4(),
    hand: [
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
    ],
  },
  {
    id: uuid.v4(),
    hand: [
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
      getRandomCard(),
    ],
  },
];

export default function GameScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.topRow}>
        <PlayerView player={players[2]} type="top"></PlayerView>
      </ThemedView>
      <ThemedView style={styles.middleRow}>
        <PlayerView player={players[0]} type="left"></PlayerView>
        <ThemedView style={styles.table}></ThemedView>
        <PlayerView player={players[1]} type="right"></PlayerView>
      </ThemedView>
      <ThemedView style={styles.bottomRow}>
        <PlayerView player={players[3]} type="bottom"></PlayerView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  topRow: {
    width: "100%",
    height: "25%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  middleRow: {
    width: "100%",
    height: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomRow: {
    width: "100%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    borderColor: "red",
    borderWidth: 1,
    height: 50,
    width: 50,
  },
});
