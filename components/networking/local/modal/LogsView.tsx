import { Animated } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export function LogsView({
  logs,
}: {
  logs: { date: Date; content: string; type: "info" | "error" | "success" }[];
}) {
  return (
    <Animated.ScrollView style={[{ flexDirection: "column" }]}>
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
