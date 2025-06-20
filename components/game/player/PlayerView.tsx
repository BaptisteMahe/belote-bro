import { StyleSheet } from "react-native";
import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { Player } from "@/components/game/player/player.model";
import { CardView } from "@/components/game/card/CardView";

export type PayerViewProps = ThemedViewProps & {
  player: Player;
  type: "left" | "right" | "top" | "bottom";
};

export function PlayerView({ player, type, style, ...rest }: PayerViewProps) {
  const rotation = getRotation(type);
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
        { transform: [{ rotate: `${rotation}deg` }] },
        style,
      ]}
      {...rest}
    >
      {player.hand.map((card, index) => {
        const cardRotation = (index - centerIndex) * rotationPerCard;

        return (
          <CardView
            card={card}
            key={`${card.value}${card.type}`}
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

function getRotation(type: "left" | "right" | "top" | "bottom") {
  switch (type) {
    case "left":
      return 90;
    case "right":
      return 270;
    case "bottom":
      return 0;
    case "top":
      return 180;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
