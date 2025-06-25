import { StyleSheet } from "react-native";
import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { Player } from "@/components/game/player/player.model";
import { CardView } from "@/components/game/card/CardView";
import {
  Card,
  CardType,
  NonTrumpValues,
  TrumpValues,
  TypeValueMap,
} from "@/components/game/card/card.model";
import { getId, isRed } from "@/components/game/card/card.util";
import { canPlayCard } from "@/components/game/card/can-play-card";
import { useContext } from "react";
import { TrumpContext } from "@/components/game/card/trump.context";
import { TrickContext } from "@/components/game/board/trick.context";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LeaderContext } from "@/components/game/player/leader.context";

export type PayerViewProps = ThemedViewProps & {
  player: Player;
  type: "left" | "right" | "top" | "bottom";
  inTurn: boolean;
  onCardPlayed: (car: Card) => void;
};

export function PlayerView({
  player,
  type,
  inTurn,
  onCardPlayed,
  style,
  ...rest
}: PayerViewProps) {
  const color = useThemeColor(null, "text");
  const trump = useContext(TrumpContext);
  const trick = useContext(TrickContext);
  const leader = useContext(LeaderContext);

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
        style,
      ]}
      {...rest}
    >
      <ThemedView style={[styles.handContainer]}>
        {orderCards(player.hand, trump).map((card, index) => {
          const cardRotation = (index - centerIndex) * rotationPerCard;
          const isCardPlayable =
            !!trump &&
            !!trick &&
            canPlayCard(
              card,
              player.hand,
              type,
              trick.board,
              trick.askedType,
              trump,
            );

          return (
            <CardView
              onTouchEnd={() => inTurn && isCardPlayable && onCardPlayed(card)}
              card={card}
              key={getId(card)}
              face={isMe ? "straight" : "verse"}
              playable={
                trick && trick.turn === type ? isCardPlayable : undefined
              }
              style={{
                marginLeft: index > 0 ? -cardOverlap : 0,
                marginBottom: -Math.abs(cardRotation),
                transform: [
                  { rotate: `${cardRotation}deg` },
                  {
                    translateY:
                      yTranslationPerRotation * Math.abs(cardRotation),
                  },
                ],
              }}
            />
          );
        })}
      </ThemedView>
      <ThemedView
        style={[
          styles.playerNameContainer,
          { borderColor: color },
          inTurn && styles.inTurnPlayer,
        ]}
      >
        <ThemedText>{`${player.name[0].toUpperCase()}${player.name[1]}`}</ThemedText>
        {trump && type === leader && (
          <ThemedText color={isRed(trump) ? "red" : undefined}>
            {TypeValueMap[trump]}
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const TypeRotationMap = {
  bottom: 0,
  left: 90,
  top: 180,
  right: 270,
} as const;

function orderCards(cards: Card[], trump: CardType | null) {
  return [...cards].sort(
    (a, b) =>
      (a.type === trump
        ? 1000 + TrumpValues[a.value]
        : NonTrumpValues[a.value]) +
      CardTypeValues[a.type] -
      ((b.type === trump
        ? 1000 + TrumpValues[b.value]
        : NonTrumpValues[b.value]) +
        CardTypeValues[b.type]),
  );
}

const CardTypeValues = {
  heart: 100,
  spade: 200,
  diamond: 300,
  club: 400,
} as const satisfies { [key in CardType]: number };

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  handContainer: {
    flexDirection: "row",
  },
  inTurnPlayer: {
    borderColor: "red",
    borderStyle: "dashed",
  },
  playerNameContainer: {
    marginTop: -20,
    borderWidth: 2,
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
