import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { GameStep } from "@/components/game/game-state/game-state.model";
import { CardView } from "@/components/game/card/CardView";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type GameTableViewProps = ThemedViewProps & {
  gameStep: GameStep;
};

export function GameBoardView({
  gameStep,
  style,
  ...rest
}: GameTableViewProps) {
  const borderColor = useThemeColor(null, "text");

  if (gameStep.name === "chooseTrump")
    return (
      <ThemedView style={[styles.container, { borderColor }, style]} {...rest}>
        <CardView
          style={[styles.trumpChooseCard]}
          card={gameStep.card}
          face="straight"
        ></CardView>
      </ThemedView>
    );

  if (gameStep.name === "play") {
    return (
      <ThemedView style={[styles.container, { borderColor }, style]} {...rest}>
        <ThemedView style={[styles.row, styles.topRow]}>
          {gameStep.trick.board.top && (
            <CardView
              card={gameStep.trick.board.top}
              face="straight"
            ></CardView>
          )}
        </ThemedView>

        <ThemedView style={[styles.row]}>
          {gameStep.trick.board.left && (
            <CardView
              style={[styles.leftCard]}
              card={gameStep.trick.board.left}
              face="straight"
            ></CardView>
          )}
          {gameStep.trick.board.right && (
            <CardView
              style={[styles.rightCard]}
              card={gameStep.trick.board.right}
              face="straight"
            ></CardView>
          )}
        </ThemedView>

        <ThemedView style={[styles.row, styles.bottomRow]}>
          {gameStep.trick.board.bottom && (
            <CardView
              card={gameStep.trick.board.bottom}
              face="straight"
            ></CardView>
          )}
        </ThemedView>
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
    height: 250,
    width: 250,
    display: "flex",
    marginHorizontal: "auto",
    justifyContent: "center",
  },
  trumpChooseCard: {
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
  },
  topRow: {
    alignItems: "center",
    justifyContent: "center",
  },
  bottomRow: {
    alignItems: "center",
    justifyContent: "center",
  },
  leftCard: {
    alignSelf: "flex-start",
  },
  rightCard: {
    alignSelf: "flex-end",
  },
});
