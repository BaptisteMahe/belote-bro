import { Modal, StyleSheet, View } from "react-native";
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
      <View style={[style, styles.modal]}>
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
      </View>
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
  modal: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "gray",
    padding: 10,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 5,
  },
});
