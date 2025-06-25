import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Card, TypeValueMap } from "@/components/game/card/card.model";
import { useThemeColor } from "@/hooks/useThemeColor";
import { isRed } from "@/components/game/card/card.util";

export type XsCardViewProps = ThemedViewProps & {
  card: Card;
};

export function XsCardView({ card, style, ...rest }: XsCardViewProps) {
  const borderColor = useThemeColor(
    { light: rest.lightColor, dark: rest.darkColor },
    "text",
  );

  return (
    <ThemedView style={[styles.container, { borderColor }, style]} {...rest}>
      <ThemedText color={isRed(card) ? "red" : undefined}>
        {`${card.value}${TypeValueMap[card.type]}`}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: 35,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
