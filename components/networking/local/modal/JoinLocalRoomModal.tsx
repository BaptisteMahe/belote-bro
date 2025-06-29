import { ThemedModal } from "@/components/ThemedModal";
import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { LogsView } from "@/components/networking/local/LocalRoomModal";
import { StyleSheet } from "react-native";
import { useZeroconfServiceScanner } from "@/components/networking/local/zeroconf";
import { useTcpClient } from "@/components/networking/local/tcp";
import { LocalClient } from "@/components/networking/local/local-client.model";
import { useEffect } from "react";

type JoinLocalRoomModalProps = ThemedViewProps & {
  visible: boolean;
  onClose: (server: LocalClient | null) => void;
};

export function JoinLocalRoomModal({
  visible,
  onClose,
  ...rest
}: JoinLocalRoomModalProps) {
  const [zeroconfLogs, scan, resolvedService] = useZeroconfServiceScanner();

  const [tcpClientLogs, client] = useTcpClient(
    resolvedService
      ? {
          address: resolvedService.addresses[0],
          port: resolvedService.port,
        }
      : null,
  );

  useEffect(() => scan(), []);

  useEffect(() => {
    client?.write(
      JSON.stringify({
        type: "playerIdentifier",
        user: {
          id: "string",
          name: "string",
        },
      }),
    );
  }, [client]);

  return (
    <ThemedModal visible={visible} {...rest}>
      <ThemedView style={styles.logContainer}>
        <ThemedText
          type={"subtitle"}
          style={[{ textAlign: "center" }]}
          onPress={() => onClose(null)}
        >
          Finding other players...
          <LogsView logs={[...zeroconfLogs, ...tcpClientLogs]}></LogsView>
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
