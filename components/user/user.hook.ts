import { storage } from "@/components/local/storage";
import { uuid } from "expo-modules-core";
import { useMMKVString } from "react-native-mmkv";
import { User } from "@/components/user/user.model";

export function useUser() {
  const [user] = useMMKVString("user");
  return user ? (JSON.parse(user) as User) : undefined;
}

export function saveUser(name: string) {
  const existingUser = storage.getString("user");
  storage.set(
    "user",
    JSON.stringify({
      id: existingUser ? JSON.parse(existingUser).id : uuid.v4(),
      name,
    }),
  );
}
