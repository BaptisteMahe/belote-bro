import { StyleSheet } from "react-native";
import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import {
  ChooseTrumpGameStep,
  GameState,
} from "@/components/game/game-state/game-state.model";
import { CardView } from "@/components/game/card/CardView";
import {
  Card,
  CardType,
  CardTypes,
  TypeValueMap,
} from "@/components/game/card/card.model";
import { ThemedButton } from "@/components/ThemedButton";
import { isRed } from "@/components/game/card/card.util";
import { ThemedModal } from "@/components/ThemedModal";

export type ChooseTrumpModalProps = ThemedViewProps & {
  gameState: GameState;
  onChoose: (type: CardType, card: Card) => void;
  onDeny: () => void;
};

export function ChooseTrumpModal({
  gameState,
  onChoose,
  onDeny,
  style,
  ...rest
}: ChooseTrumpModalProps) {
  return (
    <ThemedModal
      visible={
        gameState.step.name === "chooseTrump" &&
        gameState.step.turn === "bottom"
      }
      onRequestClose={onDeny}
      style={[style, styles.container]}
      {...rest}
    >
      {gameState.step.name === "chooseTrump" && gameState.step.round === 0 && (
        <ModalContentFirstRound
          gameStep={gameState.step}
          onChoose={onChoose}
          onDeny={onDeny}
        ></ModalContentFirstRound>
      )}

      {gameState.step.name === "chooseTrump" && gameState.step.round === 1 && (
        <ModalContentSecondRound
          gameStep={gameState.step}
          onChoose={onChoose}
          onDeny={onDeny}
        ></ModalContentSecondRound>
      )}
    </ThemedModal>
  );
}

function ModalContentFirstRound({
  gameStep,
  onChoose,
  onDeny,
}: {
  gameStep: ChooseTrumpGameStep;
  onChoose: (type: CardType, card: Card) => void;
  onDeny: () => void;
}) {
  return (
    <>
      <CardView card={gameStep.card} face="straight"></CardView>
      <ThemedView style={[styles.buttonsContainer]}>
        <ThemedButton
          label="Choose"
          onPress={() => onChoose(gameStep.card.type, gameStep.card)}
        ></ThemedButton>
        <ThemedButton label="Deny" onPress={onDeny}></ThemedButton>
      </ThemedView>
    </>
  );
}

function ModalContentSecondRound({
  gameStep,
  onChoose,
  onDeny,
}: {
  gameStep: ChooseTrumpGameStep;
  onChoose: (type: CardType, card: Card) => void;
  onDeny: () => void;
}) {
  return (
    <>
      <CardView card={gameStep.card} face="straight"></CardView>
      <ThemedView style={[styles.buttonsContainer]}>
        {CardTypes.filter((type) => type !== gameStep.card.type).map((type) => (
          <ThemedButton
            key={type}
            label={`${TypeValueMap[type]}`}
            color={isRed(type) ? "red" : undefined}
            onPress={() => onChoose(type, gameStep.card)}
            style={[{ width: "100%" }]}
          ></ThemedButton>
        ))}
        <ThemedButton label="Deny" onPress={onDeny}></ThemedButton>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 5,
  },
});
