import { Button, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { PlayerView } from "@/components/game/player/PlayerView";
import { useEffect, useReducer } from "react";
import { gameStateReducer } from "@/components/game/game-state/game-state.reducer";
import { GameBoardView } from "@/components/game/board/GameBoardView";
import { initGameState } from "@/components/game/game-state/game-state.util";
import { ScoreBoardView } from "@/components/game/score/ScoreBoardView";
import { PreviousTrickView } from "@/components/game/previous-trick/PreviousTrickView";
import { ChooseTrumpModal } from "@/components/game/choose-trump/ChooseTrumpModal";

export default function GameScreen() {
  const [gameState, dispatch] = useReducer(gameStateReducer, initGameState());

  useEffect(() => {
    if (gameState.step.name === "init") dispatch({ type: "initialised" });
  }, [gameState.step.name]);

  return (
    <ThemedView style={styles.container}>
      <ChooseTrumpModal
        gameState={gameState}
        onChoose={(type, card) =>
          dispatch({
            type: "trumpChoose",
            card,
            player: "bottom",
            trump: type,
          })
        }
        onDeny={() => dispatch({ type: "trumpDeny" })}
      ></ChooseTrumpModal>
      <ThemedView style={styles.topRow}>
        <PreviousTrickView
          previousTrick={
            gameState.step.name === "play"
              ? gameState.step.trick.previousTrick
              : null
          }
        ></PreviousTrickView>
        <PlayerView
          player={gameState.players.top}
          type="top"
          inTurn={"turn" in gameState.step && gameState.step.turn === "top"}
        ></PlayerView>
        <ScoreBoardView
          gameScores={gameState.scores}
          roundScores={
            "scores" in gameState.step ? gameState.step.scores : null
          }
        ></ScoreBoardView>
      </ThemedView>
      <ThemedView style={styles.middleRow}>
        <PlayerView
          player={gameState.players.left}
          type="left"
          inTurn={"turn" in gameState.step && gameState.step.turn === "left"}
        ></PlayerView>
        <GameBoardView gameStep={gameState.step}></GameBoardView>
        <PlayerView
          player={gameState.players.right}
          type="right"
          inTurn={"turn" in gameState.step && gameState.step.turn === "right"}
        ></PlayerView>
      </ThemedView>
      <ThemedView style={styles.bottomRow}>
        <PlayerView
          player={gameState.players.bottom}
          type="bottom"
          inTurn={"turn" in gameState.step && gameState.step.turn === "bottom"}
        ></PlayerView>
        <Button
          title="Reset"
          onPress={() => dispatch({ type: "reset" })}
        ></Button>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    height: "100%",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  topRow: {
    width: "100%",
    height: "25%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  middleRow: {
    width: "100%",
    height: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomRow: {
    width: "100%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
});
