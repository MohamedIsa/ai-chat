import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput as PaperTextInput, HelperText } from "react-native-paper";
import type { TextInputProps as PaperTextInputProps } from "react-native-paper";
import type { StyleProp, ViewStyle } from "react-native";
import { palette } from "@/theme";

export interface TextInputProps extends Omit<PaperTextInputProps, "theme"> {
  errorText?: string;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function TextInput({
  errorText,
  helperText,
  containerStyle,
  secureTextEntry,
  style,
  ...props
}: TextInputProps) {
  const [hidden, setHidden] = useState(secureTextEntry ?? false);
  const hasError = Boolean(errorText);

  return (
    <View style={containerStyle}>
      <PaperTextInput
        mode="outlined"
        error={hasError}
        secureTextEntry={hidden}
        outlineStyle={styles.outline}
        style={[styles.input, style]}
        outlineColor={palette.border}
        activeOutlineColor={palette.accent}
        textColor={palette.text}
        placeholderTextColor={palette.textTertiary}
        right={
          secureTextEntry ? (
            <PaperTextInput.Icon
              icon={hidden ? "eye" : "eye-off"}
              onPress={() => setHidden((h) => !h)}
              color={palette.textTertiary}
            />
          ) : undefined
        }
        {...props}
      />

      {hasError ? (
        <HelperText type="error" visible padding="none" style={styles.helper}>
          {errorText}
        </HelperText>
      ) : helperText ? (
        <HelperText type="info" visible padding="none" style={styles.helper}>
          {helperText}
        </HelperText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: palette.inputBg,
    fontSize: 15,
  },
  outline: {
    borderRadius: 10,
  },
  helper: {
    paddingHorizontal: 0,
    fontSize: 12,
  },
});
