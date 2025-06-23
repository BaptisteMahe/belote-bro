import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { GameStep } from "@/components/game/game-state/game-state.model";
import { CardView } from "@/components/game/card/CardView";
import { Card } from "../card/card";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getId } from "@/components/game/card/card.util";

export type GameTableViewProps = ThemedViewProps & {
  gameStep: GameStep;
  onCardTouched: (card: Card) => void;
};

export function GameBoardView({
  gameStep,
  onCardTouched,
  style,
  ...rest
}: GameTableViewProps) {
  const borderColor = useThemeColor(null, "text");

  if (gameStep.name === "chooseTrump")
    return (
      <ThemedView style={[styles.container, { borderColor }, style]} {...rest}>
        <CardView
          card={gameStep.card}
          face="straight"
          onTouchEnd={() => onCardTouched(gameStep.card)}
        ></CardView>
      </ThemedView>
    );

  if (gameStep.name === "play") {
    return (
      <ThemedView style={[styles.container, { borderColor }, style]} {...rest}>
        {Object.values(gameStep.round.board)
          .filter((card) => !!card)
          .map((card) => (
            <CardView key={getId(card)} card={card} face="straight"></CardView>
          ))}
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { borderColor }, style]}
      {...rest}
    ></ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: "dotted",
    borderRadius: 15,
    height: 100,
    width: 100,
  },
});
