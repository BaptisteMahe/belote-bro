import { Modal, ModalProps, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";

export type ThemedModalProps = Omit<
  ModalProps,
  "animationType" | "transparent"
>;

export function ThemedModal({ children, style, ...rest }: ThemedModalProps) {
  return (
    <Modal animationType="slide" transparent={true} {...rest}>
      <View style={[styles.modal]}>
        <ThemedView style={[style, styles.container]}>{children}</ThemedView>
      </View>
    </Modal>
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
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "gray",
    padding: 10,
  },
});
