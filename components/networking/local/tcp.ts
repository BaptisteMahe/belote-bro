import { useEffect, useState } from "react";
import TcpSocket from "react-native-tcp-socket";
import { SERVICE_PORT } from "@/components/networking/local/zeroconf";
import Server from "react-native-tcp-socket/lib/types/Server";
import Socket from "react-native-tcp-socket/lib/types/Socket";
import { Log } from "@/components/networking/local/modal/LogsView";

export function useTcpServer() {
  const [logs, setLogs] = useState<Log[]>([]);

  const [server] = useState<Server>(TcpSocket.createServer());
  const [clients, setClients] = useState<Socket[]>([]);

  function addLog(
    message: string,
    type: "info" | "success" | "error" = "info",
  ) {
    console.log(message);
    setLogs((logs) => [...logs, { date: new Date(), content: message, type }]);
  }

  useEffect(() => {
    server
      .on("listening", () => {
        addLog(`TCP server listening: ${JSON.stringify(server.address())}`);
      })
      .on("connection", (newClient) => {
        setClients((previousClients) => [...previousClients, newClient]);
        addLog(
          `TCP connection to ${JSON.stringify(newClient.address())} established`,
          "success",
        );
        newClient
          .on("error", (error) => {
            addLog(
              `An error occurred with ${JSON.stringify(newClient.address())}: ${error}`,
              "error",
            );
          })
          .on("close", (error) => {
            addLog(
              `Closed connection with ${JSON.stringify(newClient.address())}`,
            );
          });
      })
      .on("error", (error) => {
        addLog(`An error occurred with the TCP server ${error}`, "error");
      })
      .on("close", () => addLog("TCP Server closed connection"))
      .listen({ port: SERVICE_PORT });
  }, []);

  return [logs, server, clients] as const;
}

export function useTcpClient(
  connectTo: {
    address: string;
    port: number;
  } | null,
) {
  const [logs, setLogs] = useState<
    { date: Date; content: string; type: "info" | "success" | "error" }[]
  >([]);

  const [client, setClient] = useState<Socket | null>(null);

  function addLog(
    message: string,
    type: "info" | "success" | "error" = "info",
  ) {
    console.log(message);
    setLogs((logs) => [...logs, { date: new Date(), content: message, type }]);
  }

  useEffect(() => {
    if (!connectTo) return;
    const { address, port } = connectTo;

    setClient(TcpSocket.createConnection({ port, host: address }, () => {}));
  }, [connectTo]);

  useEffect(() => {
    if (!client || !connectTo) return;
    const { address, port } = connectTo;
    addLog(`Connecting to ${address}:${port}`);

    client
      .on("connect", () => {
        addLog(`Connected to ${address}:${port}`, "success");
      })
      .on("error", (error) => {
        addLog(`Socket client errored: ${error}`, "error");
      })
      .on("close", () => addLog("Connection closed"));
  }, [connectTo, client]);

  return [logs, client] as const;
}
