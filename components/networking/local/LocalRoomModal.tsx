import { Animated, StyleSheet } from "react-native";
import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import {
  SERVICE_DOMAIN,
  SERVICE_NAME,
  SERVICE_PORT,
  SERVICE_PROTOCOL,
  SERVICE_TYPE,
  zeroconf,
} from "@/components/networking/local/zeroconf";
import { Service } from "react-native-zeroconf";
import { ThemedText } from "@/components/ThemedText";
import TcpSocket from "react-native-tcp-socket";
import Server from "react-native-tcp-socket/lib/types/Server";
import { ThemedModal } from "@/components/ThemedModal";

export type LocalRoomModalProps = ThemedViewProps & {
  hosting: boolean;
  visible: boolean;
  onClose: () => void;
};

export function LocalRoomModal({
  hosting,
  visible,
  onClose,
  style,
  ...rest
}: LocalRoomModalProps) {
  const [logs, setLogs] = useState<
    { content: string; type: "info" | "success" | "error" }[]
  >([]);
  const [resolvedService, setResolvedService] = useState<Service | null>(null);

  const addLog = (
    message: string,
    type: "info" | "success" | "error" = "info",
  ) => {
    console.log(message);
    setLogs((logs) => [
      ...logs,
      { content: `[${new Date().toLocaleTimeString()}] ${message}`, type },
    ]);
  };

  const host = () => {
    addLog("Start hosting...");
    zeroconf.publishService(
      SERVICE_TYPE,
      SERVICE_PROTOCOL,
      SERVICE_DOMAIN,
      SERVICE_NAME,
      SERVICE_PORT,
    );

    return createTCPServer();
  };

  const createTCPServer = () => {
    const server = TcpSocket.createServer((socket) => {
      socket.on("data", (data) => {
        addLog(
          `Received data from ${JSON.stringify(socket.address())}: ${data}`,
          "success",
        );
        socket.write(`Echo server ${data}`);
      });

      socket.on("error", (error) => {
        addLog(`An error occurred with client socket ${error}`, "error");
      });

      socket.on("close", (error) => {
        addLog(
          `Closed connection with ${JSON.stringify(socket.address())}, with error ${error} ?`,
        );
      });
    }).listen({ port: SERVICE_PORT });

    server.on("listening", () => {
      addLog(`TCP server: ${JSON.stringify(server.address())}`);
    });

    server.on("error", (error) => {
      addLog(`An error occurred with the TCP server ${error}`, "error");
    });

    server.on("close", () => {
      addLog("Server closed connection");
    });

    return server;
  };

  const scan = () => {
    addLog("Starting scan for Belote games...");
    setResolvedService(null);
    zeroconf.scan(SERVICE_TYPE, SERVICE_PROTOCOL, SERVICE_DOMAIN);
  };

  const createTCPClient = (host: string) => {
    const client = TcpSocket.createConnection(
      {
        port: SERVICE_PORT,
        host,
      },
      () => {
        addLog(`Connected to ${host}:${SERVICE_PORT} !`, "success");

        client.write("Hello server!");
      },
    );

    addLog(`Connecting to ${host}:${SERVICE_PORT}`);

    client.on("data", (data) => {
      addLog(`Message received from server ${data}`, "success");
    });

    client.on("error", (error) => {
      addLog(`Socket client errored: ${error}`, "error");
    });

    client.on("close", () => {
      addLog("Connection closed");
    });

    return client;
  };

  useEffect(() => {
    zeroconf.on("start", () =>
      addLog(`${hosting ? "Hosting" : "Scan"} started.`),
    );
    zeroconf.on("stop", () =>
      addLog(`${hosting ? "Hosting" : "Scan"} stopped.`),
    );
    zeroconf.on("error", (err) => addLog(`Error: ${err}`, "error"));
    zeroconf.on("published", (service) => {
      addLog(`Hosted Service: ${service.name}`);
    });
    zeroconf.on("unpublished", () => {
      addLog(`Stopped hosting ${SERVICE_NAME}`);
    });
    zeroconf.on("found", (name) => {
      addLog(`Found Service: ${name}`);
    });

    zeroconf.on("resolved", (service) => {
      addLog(`Resolved ${JSON.stringify(service)}`, "success");
      setResolvedService(service);
      zeroconf.stop();
    });

    zeroconf.on("remove", (serviceName) => {
      addLog(`Service Removed: ${serviceName}`);
      setResolvedService(null);
    });

    let server: Server | undefined = undefined;
    if (hosting) server = host();
    else scan();

    return () => {
      addLog(`Stoping service ${hosting ? "hosting" : "discovery"}...`);
      zeroconf.stop();
      zeroconf.removeAllListeners();
      server?.close();
    };
  }, []);

  useEffect(() => {
    if (hosting || !resolvedService) return;
    const tcpClient = createTCPClient(resolvedService.addresses[0]);

    return () => {
      tcpClient.destroy();
    };
  }, [hosting, resolvedService]);

  return (
    <ThemedModal visible={visible} {...rest}>
      <ThemedView style={styles.logContainer}>
        <ThemedText
          type={"subtitle"}
          style={[{ textAlign: "center" }]}
          onPress={onClose}
        >
          Finding other players...
          <LogsView logs={logs}></LogsView>
        </ThemedText>
      </ThemedView>
    </ThemedModal>
  );
}

export function LogsView({
  logs,
}: {
  logs: { date: Date; content: string; type: "info" | "error" | "success" }[];
}) {
  return (
    <Animated.ScrollView style={styles.logScrollView}>
      {[...logs]
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((log) => (
          <ThemedText
            style={[
              log.type !== "info" && { fontWeight: "bold" },
              log.type === "success" && { color: "green" },
              log.type === "error" && { color: "red" },
            ]}
            key={log.date.getTime()}
          >
            [{log.date.toLocaleTimeString()}] {log.content}
          </ThemedText>
        ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  logContainer: {
    flexDirection: "column",
    gap: 10,
    padding: 10,
  },
  logScrollView: {
    flexDirection: "column",
  },
});
