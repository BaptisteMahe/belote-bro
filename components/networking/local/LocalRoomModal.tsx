import { Animated, Modal, StyleSheet, View } from "react-native";
import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import {
  SERVICE_DOMAIN,
  SERVICE_NAME,
  SERVICE_PORT,
  SERVICE_PROTOCOL,
  SERVICE_TYPE,
  zeroconf,
} from "@/components/networking/local/zeroconf.constants";
import { Service } from "react-native-zeroconf";
import { ThemedText } from "@/components/ThemedText";

export type LocalRoomModalProps = ThemedViewProps & {
  hosting: boolean;
  visible: boolean;
};

export function LocalRoomModal({
  hosting,
  visible,
  style,
  ...rest
}: LocalRoomModalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [resolvedService, setResolvedService] = useState<Service | null>(null);

  const addLog = (message: string) => {
    console.log(message);
    setLogs((logs) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...logs,
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
  };

  const scan = () => {
    addLog("Starting scan for Belote games...");
    setResolvedService(null);
    zeroconf.scan(SERVICE_TYPE, SERVICE_PROTOCOL, SERVICE_DOMAIN);
  };

  useEffect(() => {
    zeroconf.on("start", () =>
      addLog(`${hosting ? "Hosting" : "Scan"} started.`),
    );
    zeroconf.on("stop", () =>
      addLog(`${hosting ? "Hosting" : "Scan"} stopped.`),
    );
    zeroconf.on("error", (err) => addLog(`Error: ${err}`));
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
      addLog(`Resolved ${service.name}: ${service.host}:${service.port}`);
      setResolvedService(service);
      zeroconf.stop();
    });

    zeroconf.on("remove", (serviceName) => {
      addLog(`Service Removed: ${serviceName}`);
      setResolvedService(null);
    });

    if (hosting) host();
    else scan();

    return () => {
      addLog(`Stoping service ${hosting ? "hosting" : "discovery"}...`);
      zeroconf.stop();
      zeroconf.removeAllListeners();
    };
  }, []);

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={[style, styles.modal]}>
        <ThemedView style={[style, styles.container]} {...rest}>
          <ThemedView style={styles.logContainer}>
            <ThemedText type={"subtitle"} style={[{ textAlign: "center" }]}>
              Finding other players
            </ThemedText>
            <Animated.ScrollView style={styles.logScrollView}>
              {logs.map((log, index) => (
                <ThemedText key={index}>{log}</ThemedText>
              ))}
            </Animated.ScrollView>
          </ThemedView>
        </ThemedView>
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
  logContainer: {
    flexDirection: "column",
    gap: 10,
    padding: 10,
  },
  logScrollView: {
    flexDirection: "column",
  },
});
