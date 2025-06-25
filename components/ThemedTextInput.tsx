import { TextInput, TextInputProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export function ThemedTextInput({ style, ...otherProps }: TextInputProps) {
  const backgroundColor = useThemeColor(null, "background");

  const color = useThemeColor(null, "text");

  return (
    <TextInput
      style={[{ backgroundColor, color, borderColor: color }, style]}
      {...otherProps}
    />
  );
}
