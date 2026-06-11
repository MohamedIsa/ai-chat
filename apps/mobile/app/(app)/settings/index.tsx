import { View, StyleSheet } from "react-native";
import { Title, Text } from "@/components/typography";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/store/auth";
import { palette } from "@/theme";

export default function SettingsScreen() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Settings</Title>

      {/* Account section — placeholder for future settings */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Account</Text>
        <Button
          mode="outlined"
          textColor={palette.error}
          style={styles.logoutBtn}
          onPress={logout}
        >
          Sign out
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    padding: 24,
  },
  title: { marginTop: 16, marginBottom: 32 },
  section: { gap: 12 },
  sectionLabel: {
    color: palette.textSecondary,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  logoutBtn: { borderColor: palette.error },
});
