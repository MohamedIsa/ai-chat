import { useTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";

export type AppTheme = MD3Theme & {
  colors: MD3Theme["colors"] & { textTertiary: string };
};

export const palette = {
  background: "#000000",
  surface: "#0d0d0d",
  inputBg: "#1a1a1a",
  border: "#2d2d2d",
  text: "#ffffff",
  textSecondary: "#8e8ea0",
  textTertiary: "#6b6b6b",
  primary: "#ffffff",
  primaryText: "#000000",
  accent: "#10a37f",
  button: "#ffffff",
  error: "#ef4444",
  success: "#10a37f",
  warning: "#f59e0b",
  info: "#3b82f6",
};

export const paperTheme = {
  colors: {
    background: palette.background,
    surface: palette.surface,
    surfaceVariant: palette.inputBg,
    onSurface: palette.text,
    onSurfaceVariant: palette.textSecondary,
    onBackground: palette.text,
    primary: palette.accent,
    onPrimary: palette.text,
    secondary: palette.inputBg,
    onSecondary: palette.text,
    outline: palette.border,
    outlineVariant: palette.border,
    error: palette.error,
    onError: palette.text,
    textTertiary: palette.textTertiary,
  },
};

export function useAppTheme() {
  return useTheme<AppTheme>();
}
