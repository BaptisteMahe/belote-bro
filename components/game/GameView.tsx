import { useEffect, useReducer } from "react";
import { gameStateReducer } from "@/components/game/game-state/game-state.reducer";
import { initGameState } from "@/components/game/game-state/game-state.util";
import { AutoPlay, Debug } from "@/constants/Env";
import { autoPlay } from "@/components/game/auto-play/auto-play";
import { TrickContext } from "@/components/game/board/trick.context";
import { TrumpContext } from "@/components/game/card/trump.context";
import { LeaderContext } from "@/components/game/player/leader.context";
import { ThemedView } from "@/components/ThemedView";
import { ChooseTrumpModal } from "@/components/game/choose-trump/ChooseTrumpModal";
import { PreviousTrickView } from "@/components/game/previous-trick/PreviousTrickView";
import { PlayerView } from "@/components/game/player/PlayerView";
import { isInTurn } from "@/components/game/player/player.util";
import { ScoreBoardView } from "@/components/game/score/ScoreBoardView";
import { GameBoardView } from "@/components/game/board/GameBoardView";
import { ThemedButton } from "@/components/ThemedButton";
import { StyleSheet } from "react-native";

export function GameView() {
  const [gameState, dispatch] = useReducer(gameStateReducer, initGameState());

  useEffect(() => {
    if (gameState.step.name === "init") dispatch({ type: "initialised" });
  }, [gameState.step.name]);

  useEffect(() => {
    if (Debug) console.log("GameState", gameState);
    if (!AutoPlay) autoPlay(gameState, dispatch);
  }, [gameState]);

  return (
    <TrickContext
      value={gameState.step.name === "play" ? gameState.step.trick : null}
    >
      <TrumpContext
        value={gameState.step.name === "play" ? gameState.step.trump : null}
      >
        <LeaderContext
          value={gameState.step.name === "play" ? gameState.step.leader : null}
        >
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
                inTurn={isInTurn(gameState, "top")}
                onCardPlayed={(card) =>
                  dispatch({ type: "playCard", player: "top", card })
                }
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
                inTurn={isInTurn(gameState, "left")}
                onCardPlayed={(card) =>
                  dispatch({ type: "playCard", player: "left", card })
                }
              ></PlayerView>
              <GameBoardView gameStep={gameState.step}></GameBoardView>
              <PlayerView
                player={gameState.players.right}
                type="right"
                inTurn={isInTurn(gameState, "right")}
                onCardPlayed={(card) =>
                  dispatch({ type: "playCard", player: "right", card })
                }
              ></PlayerView>
            </ThemedView>
            <ThemedView style={styles.bottomRow}>
              <PlayerView
                player={gameState.players.bottom}
                type="bottom"
                inTurn={isInTurn(gameState, "bottom")}
                onCardPlayed={(card) =>
                  dispatch({ type: "playCard", player: "bottom", card })
                }
              ></PlayerView>
              <ThemedButton
                label="Reset"
                disabled={
                  (gameState.step.name === "chooseTrump" &&
                    gameState.step.turn !== "bottom") ||
                  (gameState.step.name === "play" &&
                    gameState.step.trick.turn !== "bottom")
                }
                onPress={() => dispatch({ type: "reset" })}
              ></ThemedButton>
            </ThemedView>
          </ThemedView>
        </LeaderContext>
      </TrumpContext>
    </TrickContext>
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
