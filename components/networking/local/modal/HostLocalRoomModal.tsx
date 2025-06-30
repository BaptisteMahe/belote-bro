import { ThemedModal } from "@/components/ThemedModal";
import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
  LocalClientUser,
  LocalServer,
} from "@/components/networking/local/local-server.model";
import { StyleSheet } from "react-native";
import { useZeroconfServicePublisher } from "@/components/networking/local/zeroconf";
import { useEffect, useState } from "react";
import { useTcpServer } from "@/components/networking/local/tcp";
import { Log, LogsView } from "@/components/networking/local/modal/LogsView";
import { ChooseTeamModal } from "@/components/game/choose-team/ChooseTeamModal";
import Socket from "react-native-tcp-socket/lib/types/Socket";

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

  const [clientsLogs, setClientsLogs] = useState<Log[]>([]);

  const [users, setUsers] = useState<LocalClientUser[]>([
    {
      id: "1",
      name: "Player1",
      socket: undefined as unknown as Socket,
    },
    {
      id: "2",
      name: "Player2",
      socket: undefined as unknown as Socket,
    },
    {
      id: "3",
      name: "Player3",
      socket: undefined as unknown as Socket,
    },
  ]);

  const [chooseTeamModalVisible, setChooseTeamModalVisible] = useState(false);

  useEffect(() => publishService(), []);

  useEffect(() => {
    clients.forEach((client) => {
      client.on("data", (data) => {
        try {
          const parsedData = JSON.parse(data.toString());
          if ("type" in parsedData && parsedData.type === "playerIdentifier") {
            setUsers((previousUsers) => [
              ...previousUsers,
              {
                ...parsedData,
                socket: clients,
              },
            ]);
            setClientsLogs((previousLogs) => [
              ...previousLogs,
              {
                date: new Date(),
                content: `User authed: ${parsedData}`,
                type: "success",
              },
            ]);
          }
        } catch (error) {
          setClientsLogs((previousLogs) => [
            ...previousLogs,
            {
              date: new Date(),
              content: error?.toString() ?? "Unknown error",
              type: "error",
            },
          ]);
        }
      });
    });
  }, [clients]);

  useEffect(() => {
    if (users.length < 3) return;
    setChooseTeamModalVisible(true);
  }, [users]);

  return (
    <>
      <ChooseTeamModal
        onClose={(teams) =>
          onClose({
            server,
            players: teams,
          })
        }
        users={users}
        visible={chooseTeamModalVisible}
      ></ChooseTeamModal>
      <ThemedModal visible={visible} {...rest}>
        <ThemedView style={styles.logContainer}>
          <ThemedText
            type={"subtitle"}
            style={[{ textAlign: "center" }]}
            onPress={() => onClose(null)}
          >
            Hosting new game...
          </ThemedText>
          <LogsView
            logs={[...zeroconfLogs, ...tcpServerLogs, ...clientsLogs]}
          ></LogsView>
        </ThemedView>
      </ThemedModal>
    </>
  );
}

const styles = StyleSheet.create({
  logContainer: {
    flexDirection: "column",
    gap: 10,
    padding: 10,
    width: "80%",
  },
});
