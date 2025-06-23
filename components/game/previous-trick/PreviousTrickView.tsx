import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { PlayGameStep } from "@/components/game/game-state/game-state.model";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export type PreviousTrickViewProps = ThemedViewProps & {
  previousTrick: PlayGameStep["trick"]["previousTrick"];
};

export function PreviousTrickView({
  previousTrick,
  style,
  ...rest
}: PreviousTrickViewProps) {
  return (
    <ThemedView style={[style, styles.container]} {...rest}>
      <ThemedText>Last trick</ThemedText>
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
    display: "flex",
    alignItems: "center",
  },
});
