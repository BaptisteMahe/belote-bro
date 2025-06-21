import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Card, TypeValueMap } from "@/components/game/card/card";
import { useThemeColor } from "@/hooks/useThemeColor";

export type CardViewProps = ThemedViewProps & {
  card: Card;
  face: "straight" | "verse";
};

export function CardView({ card, face, style, ...rest }: CardViewProps) {
  const borderColor = useThemeColor(
    { light: rest.lightColor, dark: rest.darkColor },
    "text",
  );

  if (face === "verse")
    return (
      <ThemedView style={[styles.container, { borderColor }, style]} {...rest}>
        <ThemedText>Verso</ThemedText>
      </ThemedView>
    );

  return (
    <ThemedView style={[styles.container, { borderColor }, style]} {...rest}>
      <ThemedView style={styles.value}>
        <ThemedText>{card.value}</ThemedText>
        <ThemedText>{card.value}</ThemedText>
      </ThemedView>
      <ThemedText style={[{ fontSize: 22 }]}>
        {TypeValueMap[card.type]}
      </ThemedText>
      <ThemedView style={styles.value}>
        <ThemedText>{card.value}</ThemedText>
        <ThemedText>{card.value}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 132,
    width: 94,
    borderWidth: 3,
    borderRadius: 10,
    padding: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
