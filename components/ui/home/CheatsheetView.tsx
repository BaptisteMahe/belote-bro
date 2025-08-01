import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Deck } from "@/components/game/deck/deck.model";
import { NonTrumpValues, TrumpValues } from "@/components/game/card/card.model";
import { getId } from "@/components/game/card/card.util";
import { XsCardView } from "@/components/game/card/XsCardView";
import { StyleSheet } from "react-native";

export function CheatsheetView() {
  return (
    <ThemedView style={[styles.cheatsheetContainer]}>
      <ThemedText style={[styles.cheatSheetTitle]}>
        Belote cheatsheet
      </ThemedText>
      <ThemedView style={[styles.trumpCheatsheet]}>
        <ThemedText style={{ width: 100 }}>Trump ❤</ThemedText>
        {[...Deck.filter((card) => card.type === "heart")]
          .sort((a, b) => TrumpValues[b.value] - TrumpValues[a.value])
          .map((card, index, array) => (
            <>
              <ThemedView key={getId(card)} style={[styles.cardWithPoints]}>
                <XsCardView card={card}></XsCardView>
                <ThemedText>{TrumpValues[card.value]}</ThemedText>
              </ThemedView>
              {index !== array.length - 1 && <ThemedText>{">"}</ThemedText>}
            </>
          ))}
      </ThemedView>
      <ThemedView style={[styles.nonTrumpCheatsheet]}>
        <ThemedText style={{ width: 100 }}>Non Trump ♠</ThemedText>
        {[...Deck.filter((card) => card.type === "spade")]
          .sort((a, b) => NonTrumpValues[b.value] - NonTrumpValues[a.value])
          .map((card, index, array) => (
            <>
              <ThemedView key={getId(card)} style={[styles.cardWithPoints]}>
                <XsCardView card={card}></XsCardView>
                <ThemedText>{NonTrumpValues[card.value]}</ThemedText>
              </ThemedView>
              {index !== array.length - 1 && <ThemedText>{">"}</ThemedText>}
            </>
          ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cheatSheetTitle: {
    textAlign: "center",
  },
  cheatsheetContainer: {
    display: "flex",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  trumpCheatsheet: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nonTrumpCheatsheet: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardWithPoints: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
