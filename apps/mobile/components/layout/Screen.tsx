import { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette } from "@/theme";

export interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  centered?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  bottomSpacing?: number;
}

export function Screen({
  children,
  scrollable = true,
  centered = false,
  style,
  contentContainerStyle,
  bottomSpacing = 0,
}: ScreenProps) {
  const inner = scrollable ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.content,
        centered && styles.centered,
        bottomSpacing ? { paddingBottom: bottomSpacing } : null,
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, centered && styles.centered, contentContainerStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, style]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {inner}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  centered: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
