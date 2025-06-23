import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { PlayGameStep } from "@/components/game/game-state/game-state.model";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useContext } from "react";
import { TrumpContext } from "@/components/game/card/trump.context";
import { TypeValueMap } from "@/components/game/card/card.model";

export type PreviousTrickViewProps = ThemedViewProps & {
  previousTrick: PlayGameStep["trick"]["previousTrick"];
};

export function PreviousTrickView({
  previousTrick,
  style,
  ...rest
}: PreviousTrickViewProps) {
  const borderColor = useThemeColor(null, "text");
  const trump = useContext(TrumpContext);

  return (
    <ThemedView style={[style, styles.container, { borderColor }]} {...rest}>
      {trump && <ThemedText>Trump: {TypeValueMap[trump]}</ThemedText>}
      <ThemedText>Last trick</ThemedText>
      {previousTrick && (
        <ThemedView style={[{ width: "100%" }]}>
          <ThemedText style={[styles.row, styles.topRow]}>
            {`${previousTrick.board.top.value}${TypeValueMap[previousTrick.board.top.type]}`}
          </ThemedText>
          <ThemedView style={[styles.row, styles.middleRow]}>
            <ThemedText>
              {`${previousTrick.board.left.value}${TypeValueMap[previousTrick.board.left.type]}`}
            </ThemedText>
            <ThemedText>
              {`${previousTrick.board.right.value}${TypeValueMap[previousTrick.board.right.type]}`}
            </ThemedText>
          </ThemedView>
          <ThemedText style={[styles.row, styles.row, styles.bottomRow]}>
            {`${previousTrick.board.bottom.value}${TypeValueMap[previousTrick.board.bottom.type]}`}
          </ThemedText>
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
    textAlign: "center",
  },
  middleRow: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  bottomRow: {
    textAlign: "center",
  },
});
