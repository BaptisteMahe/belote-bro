import { ThemedModal } from "@/components/ThemedModal";
import { ThemedViewProps } from "@/components/ThemedView";
import { LocalServer } from "@/components/networking/local/local-server.model";
import Socket from "react-native-tcp-socket/lib/types/Socket";

export type ChooseTeamModalProps = ThemedViewProps & {
  players: { socket: Socket; id: string; name: string }[];
  visible: boolean;
  onClose: (server: LocalServer | null) => void;
};

export function ChooseTeamModal({
  visible,
  onClose,
  ...rest
}: ChooseTeamModalProps) {
  return <ThemedModal visible={visible} {...rest}></ThemedModal>;
}
