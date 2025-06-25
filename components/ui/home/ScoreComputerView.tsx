import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export function ScoreComputerView() {
  return (
    <ThemedView style={[styles.scoreContainer]}>
      <ThemedText style={[styles.scoreTitle]}>Scores</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scoreContainer: {
    display: "flex",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  scoreTitle: {
    textAlign: "center",
  },
});
