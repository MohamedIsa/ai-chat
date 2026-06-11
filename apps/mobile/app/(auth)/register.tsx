import { StyleSheet, View } from "react-native";
import { Link, router } from "expo-router";
import { TextInput as PaperTextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Screen } from "@/components/layout";
import { Button, useSnackbar } from "@/components/ui";
import { FormField } from "@/components/forms";
import { Title, Text } from "@/components/typography";
import { useAuthForm } from "@/hooks/useAuthForm";
import { registerSchema } from "@/validation/auth";
import type { RegisterInput } from "@/validation/auth";
import { palette } from "@/theme";
import { supabase } from "@/lib/supabase";
import { mapAuthError } from "@/lib/authErrors";

export default function RegisterScreen() {
  const { show } = useSnackbar();

  const { control, errors, handleSubmit, isLoading } = useAuthForm<RegisterInput>({
    schema: registerSchema,
    onSubmit: async (data) => {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { name: data.name } },
      });
      if (error) throw error;
      router.replace("/(app)/conversations");
    },
    onError: (err) => {
      const error = err as { code?: string; message?: string } | null;
      show(mapAuthError(error), { type: "error" });
    },
  });

  return (
    <Screen scrollable style={styles.screen} contentContainerStyle={styles.scroll}>
      <View style={styles.inner}>
        <View style={styles.logoWrap}>
          <View style={styles.logoMark}>
            <MaterialCommunityIcons name="chat-outline" size={28} color={palette.background} />
          </View>
        </View>

        <View style={styles.heading}>
          <Title style={styles.title}>Create account</Title>
          <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
            Start chatting with AI today
          </Text>
        </View>

        <View style={styles.form}>
          <FormField<RegisterInput>
            name="name"
            control={control}
            label="Full name"
            error={errors.name}
            autoComplete="name"
            returnKeyType="next"
            left={<PaperTextInput.Icon icon="account-outline" />}
          />
          <FormField<RegisterInput>
            name="email"
            control={control}
            label="Email"
            error={errors.email}
            keyboardType="email-address"
            autoComplete="email"
            returnKeyType="next"
            left={<PaperTextInput.Icon icon="email-outline" />}
          />
          <FormField<RegisterInput>
            name="password"
            control={control}
            label="Password"
            error={errors.password}
            secureTextEntry
            autoComplete="new-password"
            returnKeyType="next"
            left={<PaperTextInput.Icon icon="lock-outline" />}
          />
          <FormField<RegisterInput>
            name="confirmPassword"
            control={control}
            label="Confirm password"
            error={errors.confirmPassword}
            secureTextEntry
            autoComplete="new-password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            left={<PaperTextInput.Icon icon="lock-check-outline" />}
          />

          <Button
            fullWidth
            loading={isLoading}
            onPress={handleSubmit}
            buttonColor={palette.button}
            textColor={palette.primaryText}
            contentStyle={styles.ctaContent}
            labelStyle={styles.ctaLabel}
          >
            Create account
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={{ color: palette.textSecondary }}>Already have an account? </Text>
          <Link href="/(auth)/login">
            <Text style={{ color: palette.accent, fontWeight: "600" }}>Sign in</Text>
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: palette.background },
  scroll: { flexGrow: 1, padding: 0 },
  inner: { flex: 1, paddingHorizontal: 24, paddingVertical: 48, gap: 0 },

  logoWrap: { alignItems: "center", marginBottom: 32 },
  logoMark: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: palette.accent,
    alignItems: "center", justifyContent: "center",
  },

  heading: { alignItems: "center", marginBottom: 36, gap: 6 },
  title: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5, color: palette.text },
  subtitle: { fontSize: 15 },

  form: { gap: 14 },
  ctaContent: { height: 52 },
  ctaLabel: { fontSize: 16, fontWeight: "600", letterSpacing: 0.1 },

  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 32 },
});
