import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Card, TypeValueMap } from "@/components/game/card/card.model";
import { useThemeColor } from "@/hooks/useThemeColor";
import { isRed } from "@/components/game/card/card.util";

export type CardViewProps = ThemedViewProps & {
  card: Card;
  face: "straight" | "verse";
};

export function CardView({ card, face, style, ...rest }: CardViewProps) {
  const borderColor = useThemeColor(
    { light: rest.lightColor, dark: rest.darkColor },
    "text",
  );

  return (
    <ThemedView style={[styles.container, { borderColor }, style]} {...rest}>
      {face === "verse" ? (
        <ThemedText>Verso</ThemedText>
      ) : (
        <>
          <ThemedView style={styles.value}>
            <ThemedText color={isRed(card.type) ? "red" : undefined}>
              {`${card.value}${TypeValueMap[card.type]}`}
            </ThemedText>
            <ThemedText color={isRed(card.type) ? "red" : undefined}>
              {`${card.value}${TypeValueMap[card.type]}`}
            </ThemedText>
          </ThemedView>
          <ThemedText
            style={[{ fontSize: 22 }]}
            color={isRed(card.type) ? "red" : undefined}
          >
            {TypeValueMap[card.type]}
          </ThemedText>
          <ThemedView style={styles.value}>
            <ThemedText color={isRed(card.type) ? "red" : undefined}>
              {`${card.value}${TypeValueMap[card.type]}`}
            </ThemedText>
            <ThemedText color={isRed(card.type) ? "red" : undefined}>
              {`${card.value}${TypeValueMap[card.type]}`}
            </ThemedText>
          </ThemedView>
        </>
      )}
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
