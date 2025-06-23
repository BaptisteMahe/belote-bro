import { StyleSheet } from "react-native";
import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { Player } from "@/components/game/player/player.model";
import { CardView } from "@/components/game/card/CardView";
import { Card } from "@/components/game/card/card.model";
import { getId } from "@/components/game/card/card.util";

export type PayerViewProps = ThemedViewProps & {
  player: Player;
  type: "left" | "right" | "top" | "bottom";
  inTurn: boolean;
};

export function PlayerView({
  player,
  type,
  inTurn,
  style,
  ...rest
}: PayerViewProps) {
  const numCards = player.hand.length;
  const centerIndex = (numCards - 1) / 2;
  const isMe = type === "bottom";

  const cardOverlap = isMe ? 30 : 80;
  const rotationPerCard = isMe ? 4 : 8;
  const yTranslationPerRotation = isMe ? 2.5 : 0.9;

  return (
    <ThemedView
      style={[
        styles.container,
        { transform: [{ rotate: `${TypeRotationMap[type]}deg` }] },
        inTurn ? styles.inTurnPlayer : null,
        style,
      ]}
      {...rest}
    >
      {orderCards(player.hand).map((card, index) => {
        const cardRotation = (index - centerIndex) * rotationPerCard;

        return (
          <CardView
            card={card}
            key={getId(card)}
            face={isMe ? "straight" : "verse"}
            style={{
              marginLeft: index > 0 ? -cardOverlap : 0,
              marginBottom: -Math.abs(cardRotation),
              transform: [
                { rotate: `${cardRotation}deg` },
                {
                  translateY: yTranslationPerRotation * Math.abs(cardRotation),
                },
              ],
            }}
          />
        );
      })}
    </ThemedView>
  );
}

const TypeRotationMap = {
  bottom: 0,
  left: 90,
  top: 180,
  right: 270,
} as const;

function orderCards(cards: Card[]) {
  return [...cards].sort((a, b) => getId(a).localeCompare(getId(b)));
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  inTurnPlayer: {
    borderColor: "red",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 10,
  },
});
