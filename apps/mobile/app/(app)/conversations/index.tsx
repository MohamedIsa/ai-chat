import { View, StyleSheet } from "react-native";
import { Title } from "@/components/typography";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/store/auth";
import { palette } from "@/theme";

export default function ConversationsScreen() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Conversations</Title>
      <Button
        mode="outlined"
        textColor={palette.error}
        style={styles.logoutBtn}
        onPress={logout}
      >
        Sign out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    padding: 24,
    justifyContent: "space-between",
  },
  title: { marginTop: 16 },
  logoutBtn: { borderColor: palette.error },
});
