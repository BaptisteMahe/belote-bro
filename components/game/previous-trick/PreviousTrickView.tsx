import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { PlayGameStep } from "@/components/game/game-state/game-state.model";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { XsCardView } from "@/components/game/card/XsCardView";

export type PreviousTrickViewProps = ThemedViewProps & {
  previousTrick: PlayGameStep["trick"]["previousTrick"];
};

export function PreviousTrickView({
  previousTrick,
  style,
  ...rest
}: PreviousTrickViewProps) {
  const borderColor = useThemeColor(null, "text");

  return (
    <ThemedView style={[style, styles.container, { borderColor }]} {...rest}>
      <ThemedText>Last trick</ThemedText>
      {previousTrick && (
        <ThemedView style={[{ width: "100%" }]}>
          <ThemedView style={[styles.row, styles.topRow]}>
            <XsCardView
              style={
                previousTrick.winner === "top"
                  ? [{ borderColor: "yellow" }]
                  : null
              }
              card={previousTrick.board.top}
            ></XsCardView>
          </ThemedView>

          <ThemedView style={[styles.row, styles.middleRow]}>
            <XsCardView
              style={
                previousTrick.winner === "left"
                  ? [{ borderColor: "yellow" }]
                  : null
              }
              card={previousTrick.board.left}
            ></XsCardView>
            <XsCardView
              style={
                previousTrick.winner === "right"
                  ? [{ borderColor: "yellow" }]
                  : null
              }
              card={previousTrick.board.right}
            ></XsCardView>
          </ThemedView>
          <ThemedView style={[styles.row, styles.bottomRow]}>
            <XsCardView
              style={
                previousTrick.winner === "bottom"
                  ? [{ borderColor: "yellow" }]
                  : null
              }
              card={previousTrick.board.bottom}
            ></XsCardView>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 5,
    borderRadius: 15,
    width: 100,
    display: "flex",
    alignItems: "center",
  },
  row: {
    width: "100%",
    flexDirection: "row",
  },
  topRow: {
    justifyContent: "center",
  },
  middleRow: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  bottomRow: {
    justifyContent: "center",
  },
});
