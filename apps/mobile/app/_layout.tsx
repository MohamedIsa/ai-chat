import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { SnackbarProvider, AppLoader, Button } from "@/components/ui";
import { Title, Text } from "@/components/typography";
import { palette, paperTheme } from "@/theme";

SplashScreen.preventAutoHideAsync();

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...paperTheme.colors,
  },
};

const HEALTH_URL = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/health`;

type AppState = "checking" | "ready" | "down";

export default function RootLayout() {
  const [appState, setAppState] = useState<AppState>("checking");

  async function checkHealth() {
    setAppState("checking");
    if (__DEV__) {
      await SplashScreen.hideAsync();
      setAppState("ready");
      return;
    }
    try {
      const res = await fetch(HEALTH_URL, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      setAppState(res.ok ? "ready" : "down");
    } catch {
      setAppState("down");
    } finally {
      await SplashScreen.hideAsync();
    }
  }

  useEffect(() => {
    checkHealth();
  }, []);

  if (appState === "checking") {
    return (
      <PaperProvider theme={theme}>
        <AppLoader />
      </PaperProvider>
    );
  }

  if (appState === "down") {
    return (
      <PaperProvider theme={theme}>
        <View style={styles.errorContainer}>
          <Title style={styles.errorTitle}>Service Unavailable</Title>
          <Text style={styles.errorMessage}>
            We're having trouble reaching our servers. Please check your
            connection and try again.
          </Text>
          <Button
            onPress={checkHealth}
            buttonColor={palette.button}
            textColor={palette.primaryText}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SnackbarProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.background },
          }}
        />
      </SnackbarProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  errorTitle: {
    textAlign: "center",
  },
  errorMessage: {
    textAlign: "center",
    opacity: 0.6,
  },
  retryButton: {
    marginTop: 8,
    borderRadius: 8,
  },
});
