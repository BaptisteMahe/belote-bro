import { ThemedModal } from "@/components/ThemedModal";
import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { LocalServer } from "@/components/networking/local/local-server.model";
import { StyleSheet } from "react-native";
import { useZeroconfServicePublisher } from "@/components/networking/local/zeroconf";
import { useEffect } from "react";
import { useTcpServer } from "@/components/networking/local/tcp";
import { LogsView } from "@/components/networking/local/modal/LogsView";

type HostLocalRoomModalProps = ThemedViewProps & {
  visible: boolean;
  onClose: (server: LocalServer | null) => void;
};

export function HostLocalRoomModal({
  visible,
  onClose,
  ...rest
}: HostLocalRoomModalProps) {
  const [zeroconfLogs, publishService] = useZeroconfServicePublisher();

  const [tcpServerLogs, server, clients] = useTcpServer();

  useEffect(() => publishService(), []);
  useEffect(() => {
    if (clients.length < 3) return;
    onClose({
      server,
      players: {
        left: clients[0],
        top: clients[1],
        right: clients[2],
      },
    });
  }, [clients]);

  return (
    <ThemedModal visible={visible} {...rest}>
      <ThemedView style={styles.logContainer}>
        <ThemedText
          type={"subtitle"}
          style={[{ textAlign: "center" }]}
          onPress={() => onClose(null)}
        >
          Hosting new game...
          <LogsView logs={[...zeroconfLogs, ...tcpServerLogs]}></LogsView>
        </ThemedText>
      </ThemedView>
    </ThemedModal>
  );
}

const styles = StyleSheet.create({
  logContainer: {
    flexDirection: "column",
    gap: 10,
    padding: 10,
  },
});
