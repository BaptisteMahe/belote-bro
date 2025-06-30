import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { CheatsheetView } from "@/components/ui/home/CheatsheetView";
import { ScoreComputerView } from "@/components/ui/home/ScoreComputerView";
import { saveUser, useUser } from "@/components/user/user.hook";
import { UserNameModal } from "@/components/user/UserNameModal";

export default function HomeScreen() {
  const user = useUser();

  return (
    <>
      <UserNameModal visible={!user} onClose={saveUser}></UserNameModal>
      <ParallaxScrollView>
        <ThemedText type="title" style={[styles.title]}>
          Welcome to Belote Bro !
        </ThemedText>

        <Link href={"/game"}>
          <ThemedText type="subtitle">
            Don&#39;t have cards ? Play in the app with your friends →
          </ThemedText>
        </Link>

        <ThemedText type="subtitle">
          Ready with your cards, keep scores just here ↓
        </ThemedText>

        <CheatsheetView></CheatsheetView>

        <ScoreComputerView></ScoreComputerView>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
});
