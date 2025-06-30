import { ThemedModal, ThemedModalProps } from "@/components/ThemedModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { useState } from "react";
import { ThemedTextInput } from "@/components/ThemedTextInput";

type UserNameModalProps = ThemedModalProps & {
  onClose: (username: string) => void;
};

export function UserNameModal({ visible, style, onClose }: UserNameModalProps) {
  const [username, setUsername] = useState("");
  return (
    <ThemedModal visible={visible} style={[style]}>
      <ThemedText>Choose username</ThemedText>
      <ThemedTextInput
        value={username}
        onChangeText={setUsername}
      ></ThemedTextInput>
      <ThemedButton
        label={"Done"}
        onPress={() => onClose(username)}
        disabled={username.length === 0}
      ></ThemedButton>
    </ThemedModal>
  );
}
