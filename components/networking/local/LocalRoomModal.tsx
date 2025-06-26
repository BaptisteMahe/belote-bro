import { Animated, Modal, Platform, StyleSheet, View } from "react-native";
import { ThemedView, ThemedViewProps } from "@/components/ThemedView";
import { useEffect, useRef, useState } from "react";
import {
  SERVICE_DOMAIN,
  SERVICE_PORT,
  SERVICE_PROTOCOL,
  SERVICE_TYPE,
  zeroconf,
} from "@/components/networking/local/zeroconf.constants";
import { Service } from "react-native-zeroconf";
import { ThemedText } from "@/components/ThemedText";
import ScrollView = Animated.ScrollView;

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
  const [resolvedServices, setResolvedServices] = useState<Service[]>([]);

  // Use a ref to avoid re-creating the service name on each render
  const serviceName = useRef(`Belote Room by ${Platform.OS}`).current;

  // Helper to add logs
  const addLog = (message: string) => {
    console.log(message);
    setLogs((prevLogs) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prevLogs,
    ]);
  };

  useEffect(() => {
    // --- Event Listeners for Zeroconf ---

    zeroconf.on("start", () => addLog("Scan or Publish Started."));
    zeroconf.on("stop", () => addLog("Scan or Publish Stopped."));
    zeroconf.on("error", (err) => addLog(`Error: ${err}`));

    // Fired when a service is published successfully
    zeroconf.on("published", (service) => {
      addLog(`Hosted Service: ${service.name}`);
    });

    // Fired when a service is unpublished
    zeroconf.on("unpublished", () => {
      addLog(`Stopped hosting ${serviceName}`);
    });

    // Fired when a new service is found
    zeroconf.on("found", (name) => {
      addLog(`Found Service: ${name}`);
    });

    // Fired when a service is resolved (we get IP and port)
    zeroconf.on("resolved", (service) => {
      addLog(`Resolved ${service.name}: ${service.host}:${service.port}`);
      setResolvedServices([...new Set([...resolvedServices, service])]);
      // setIsScanning(false); // Stop scanning once we've connected
      // zeroconf.stop();
    });

    // Fired when a service is removed from the network
    zeroconf.on("remove", (serviceName) => {
      addLog(`Service Removed: ${serviceName}`);
      setResolvedServices((prevServices) =>
        prevServices.filter((service) => service.name !== serviceName),
      );
    });

    if (hosting) host();
    else scan();

    // --- Cleanup on component unmount ---
    return () => {
      addLog("Cleaning up Zeroconf...");
      zeroconf.stop();
      zeroconf.removeAllListeners();
    };
  }, []); // Empty dependency array ensures this runs only once

  // --- Handler Functions ---

  const host = () => {
    addLog("Attempting to host...");
    zeroconf.publishService(
      SERVICE_TYPE,
      SERVICE_PROTOCOL,
      SERVICE_DOMAIN,
      serviceName,
      SERVICE_PORT, // The port your game will run on
    );
  };

  const scan = () => {
    addLog("Starting scan for Belote games...");
    setResolvedServices([]);
    zeroconf.scan(SERVICE_TYPE, SERVICE_PROTOCOL, SERVICE_DOMAIN);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={[style, styles.modal]}>
        <ThemedView style={[style, styles.container]} {...rest}>
          <View style={styles.logContainer}>
            <ThemedView style={styles.logTitle}>Logs</ThemedView>
            <ScrollView style={styles.logScrollView}>
              {logs.map((log, index) => (
                <ThemedText key={index}>{log}</ThemedText>
              ))}
            </ScrollView>
          </View>
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
    flex: 1,
    marginTop: 20,
    padding: 10,
    backgroundColor: "#333",
    borderTopWidth: 1,
    borderTopColor: "#555",
  },
  logTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  logScrollView: { flex: 1 },
});
