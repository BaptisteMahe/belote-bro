import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, View, ViewProps } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Card, TypeValueMap } from "@/components/game/card/card.model";
import { useThemeColor } from "@/hooks/useThemeColor";
import { isRed } from "@/components/game/card/card.util";
import { useContext } from "react";
import { TrumpContext } from "@/components/game/card/trump.context";

export type CardViewProps = ViewProps & {
  card: Card;
  face: "straight" | "verse";
  playable?: boolean;
};

export function CardView({
  card,
  face,
  playable,
  style,
  ...rest
}: CardViewProps) {
  const backgroundColor = useThemeColor(
    face === "straight" && playable !== undefined && !playable
      ? { light: "lightgray", dark: "dimgray" }
      : null,
    "background",
  );
  const trump = useContext(TrumpContext);
  const borderColor = useThemeColor(
    face === "straight" && card.type === trump
      ? { light: "darkgoldenrod", dark: "yellow" }
      : null,
    "text",
  );

  if (face === "verse") {
    return (
      <ThemedView
        style={[styles.container, { borderColor, backgroundColor }, style]}
        {...rest}
      >
        <ThemedText>Verso</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { borderColor, backgroundColor }, style]}
      {...rest}
    >
      <View style={styles.value}>
        <ThemedText color={isRed(card.type) ? "red" : undefined}>
          {`${card.value}${TypeValueMap[card.type]}`}
        </ThemedText>
        <ThemedText color={isRed(card.type) ? "red" : undefined}>
          {`${card.value}${TypeValueMap[card.type]}`}
        </ThemedText>
      </View>
      <ThemedText
        style={[{ fontSize: 22 }]}
        color={isRed(card.type) ? "red" : undefined}
      >
        {TypeValueMap[card.type]}
      </ThemedText>
      <View style={styles.value}>
        <ThemedText color={isRed(card.type) ? "red" : undefined}>
          {`${card.value}${TypeValueMap[card.type]}`}
        </ThemedText>
        <ThemedText color={isRed(card.type) ? "red" : undefined}>
          {`${card.value}${TypeValueMap[card.type]}`}
        </ThemedText>
      </View>
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
