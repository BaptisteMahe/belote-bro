import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { PlayGameStep } from "@/components/game/game-state/game-state.model";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 5,
    borderRadius: 15,
    height: 100,
    width: 100,
    display: "flex",
    alignItems: "center",
  },
});
