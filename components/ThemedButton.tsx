import { Pressable, PressableProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";

export type ThemedButtonProps = PressableProps & {
  label: string;
  borderless?: boolean;
  color?: string;
};

export function ThemedButton({
  label,
  borderless,
  color,
  style,
  ...otherProps
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(null, "background");

  const borderColor = useThemeColor(null, "text");

  return (
    <Pressable
      style={[
        { backgroundColor, borderColor, borderRadius: 5 },
        styles.container,
        !borderless && { borderWidth: 2 },
        typeof style === "function"
          ? style({ pressed: false, hovered: false })
          : style,
      ]}
      {...otherProps}
    >
      <ThemedText
        style={[{ color: color ?? borderColor }, { textAlign: "center" }]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
});
