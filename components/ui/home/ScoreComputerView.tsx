import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { Scores } from "@/components/game/score/scores.model";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedButton } from "@/components/ThemedButton";

export function ScoreComputerView() {
  const [scores, setScores] = useState<Scores[]>([]);

  const [us, setUs] = useState("");
  const usNum = parseInt(us);
  const [them, setThem] = useState("");
  const themNum = parseInt(them);

  const resetInputs = () => {
    setUs("");
    setThem("");
  };

  return (
    <ThemedView style={[styles.scoreContainer]}>
      <ThemedText type={"subtitle"} style={[styles.scoreTitle]}>
        Scores
      </ThemedText>
      <ThemedView style={[styles.scoreRow]}>
        <ThemedText type={"subtitle"}>Us</ThemedText>
        <ThemedText type={"subtitle"}>Them</ThemedText>
      </ThemedView>
      {scores.map((score, index) => (
        <ThemedView style={[styles.scoreRow]} key={index}>
          <ThemedText>{score.us}</ThemedText>
          <ThemedText>{score.them}</ThemedText>
        </ThemedView>
      ))}
      <ThemedView style={[styles.scoreRow]}>
        <ThemedTextInput
          style={[styles.scoreInput]}
          keyboardType="numeric"
          value={us}
          onChangeText={setUs}
        ></ThemedTextInput>
        <ThemedTextInput
          style={[styles.scoreInput]}
          keyboardType="numeric"
          value={them}
          onChangeText={setThem}
        ></ThemedTextInput>
      </ThemedView>
      <ThemedView style={[styles.scoreRow]}>
        <ThemedText type={"subtitle"}>
          {scores.reduce((acc, { us }) => acc + us, 0) +
            (isNaN(usNum) ? 0 : usNum)}
        </ThemedText>
        <ThemedText type={"subtitle"}>
          {scores.reduce((acc, { them }) => acc + them, 0) +
            (isNaN(themNum) ? 0 : themNum)}
        </ThemedText>
      </ThemedView>
      <ThemedView style={[styles.scoreRow]}>
        <ThemedButton
          label={"Reset"}
          onPress={() => {
            setScores([]);
            resetInputs();
          }}
        ></ThemedButton>
        <ThemedButton
          label={"Add"}
          onPress={() => {
            setScores([
              ...scores,
              {
                us: isNaN(usNum) ? 0 : usNum,
                them: isNaN(themNum) ? 0 : themNum,
              },
            ]);
            resetInputs();
          }}
        ></ThemedButton>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scoreContainer: {
    display: "flex",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  scoreTitle: {
    textAlign: "center",
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  scoreInput: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 5,
    textAlign: "center",
    fontSize: 20,
  },
});
