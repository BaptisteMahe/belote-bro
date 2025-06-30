import Zeroconf, { Service } from "react-native-zeroconf";
import { useEffect, useState } from "react";
import { Log } from "@/components/networking/local/modal/LogsView";

export const zeroconf = new Zeroconf();

export const SERVICE_TYPE = "belote-bro-game";
export const SERVICE_NAME = "belote-bro-game:room";
export const SERVICE_PROTOCOL = "tcp";
export const SERVICE_DOMAIN = "local.";
export const SERVICE_PORT = 6601;

export function useZeroconfServicePublisher() {
  const [logs, setLogs] = useState<Log[]>([]);

  function addLog(
    message: string,
    type: "info" | "success" | "error" = "info",
  ) {
    console.log(message);
    setLogs((logs) => [
      ...logs,
      { date: new Date(), content: `${message}`, type },
    ]);
  }

  useEffect(() => {
    zeroconf
      .on("start", () => addLog(`Start Zeroconf`))
      .on("stop", () => addLog(`Stop Zeroconf`))
      .on("error", (err) => addLog(`Zeroconf error: ${err}`, "error"));

    return () => {
      zeroconf.removeAllListeners();
    };
  }, []);

  function publishService() {
    addLog(`Start publishing Zeroconf service: ${SERVICE_NAME}`);
    zeroconf
      .on("published", (service) => {
        addLog(`Zeroconf service published: ${JSON.stringify(service)}`);
      })
      .on("unpublished", () => {
        addLog(`Zeroconf service unpublished: ${SERVICE_NAME}`);
      })
      .publishService(
        SERVICE_TYPE,
        SERVICE_PROTOCOL,
        SERVICE_DOMAIN,
        SERVICE_NAME,
        SERVICE_PORT,
      );
  }

  return [logs, publishService] as const;
}

export function useZeroconfServiceScanner() {
  const [logs, setLogs] = useState<
    { date: Date; content: string; type: "info" | "success" | "error" }[]
  >([]);
  const [resolvedService, setResolvedService] = useState<Service | null>(null);

  function addLog(
    message: string,
    type: "info" | "success" | "error" = "info",
  ) {
    console.log(message);
    setLogs((logs) => [
      ...logs,
      { date: new Date(), content: `${message}`, type },
    ]);
  }

  useEffect(() => {
    zeroconf
      .on("start", () => addLog(`Start Zeroconf`))
      .on("stop", () => addLog(`Stop Zeroconf`))
      .on("error", (err) => addLog(`Zeroconf error: ${err}`, "error"));

    return () => {
      zeroconf.removeAllListeners().stop();
    };
  }, []);

  function scan() {
    setResolvedService(null);
    addLog("Starting Zeroconf service scan");
    zeroconf
      .on("found", (name) => addLog(`Zeroconf service found: ${name}`))
      .on("resolved", (service) => {
        addLog(
          `Zeroconf service resolved: ${JSON.stringify(service)}`,
          "success",
        );
        setResolvedService(service);
        zeroconf.stop();
      })
      .on("remove", (name) => {
        addLog(`Zeroconf service removed: ${name}`);
        setResolvedService((resolvedService) =>
          resolvedService?.name === name ? null : resolvedService,
        );
      })
      .scan(SERVICE_TYPE, SERVICE_PROTOCOL, SERVICE_DOMAIN);
  }

  return [logs, scan, resolvedService] as const;
}
