import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { Scores } from "@/components/game/score/scores.model";

export type ScoreBoardViewProps = ThemedViewProps & {
  gameScores: Scores & { target: number };
  roundScores: Scores | null;
};

export function ScoreBoardView({
  gameScores,
  roundScores,
  style,
  ...rest
}: ScoreBoardViewProps) {
  const borderColor = useThemeColor(null, "text");

  return (
    <ThemedView style={[styles.container, { borderColor }, style]} {...rest}>
      <ThemedView style={[styles.target]}>
        <ThemedText>Target {gameScores.target}</ThemedText>
      </ThemedView>
      <ThemedView style={[styles.scoreTitles]}>
        <ThemedText>Us</ThemedText>
        <ThemedText>Them</ThemedText>
      </ThemedView>
      <ThemedView style={[styles.gameScores]}>
        <ThemedText>{gameScores.us}</ThemedText>
        <ThemedText>{gameScores.them}</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.roundScores]}>
        {roundScores && (
          <>
            <ThemedText>{roundScores.us}</ThemedText>
            <ThemedText>{roundScores.them}</ThemedText>
          </>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 15,
    height: 100,
    width: 100,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  target: {
    height: "25%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  scoreTitles: {
    height: "25%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gameScores: {
    height: "25%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roundScores: {
    height: "25%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
