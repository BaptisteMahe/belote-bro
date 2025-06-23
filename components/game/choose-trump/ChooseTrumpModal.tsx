import { Button, Modal, StyleSheet } from "react-native";
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={
        gameState.step.name === "chooseTrump" &&
        gameState.step.turn === "bottom"
      }
      onRequestClose={onDeny}
    >
      <ThemedView style={[style, styles.container]} {...rest}>
        {gameState.step.name === "chooseTrump" &&
          gameState.step.round === 0 && (
            <ModalContentFirstRound
              gameStep={gameState.step}
              onChoose={onChoose}
              onDeny={onDeny}
            ></ModalContentFirstRound>
          )}

        {gameState.step.name === "chooseTrump" &&
          gameState.step.round === 1 && (
            <ModalContentSecondRound
              gameStep={gameState.step}
              onChoose={onChoose}
              onDeny={onDeny}
            ></ModalContentSecondRound>
          )}
      </ThemedView>
    </Modal>
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
        <Button
          title="Choose"
          onPress={() => onChoose(gameStep.card.type, gameStep.card)}
        ></Button>
        <Button title="Deny" onPress={onDeny}></Button>
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
          <Button
            key={type}
            title={`${TypeValueMap[type]}`}
            onPress={() => onChoose(type, gameStep.card)}
          ></Button>
        ))}
        <Button title="Deny" onPress={onDeny}></Button>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
  },
});
