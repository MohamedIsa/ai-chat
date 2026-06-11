import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { Link, router } from "expo-router";
import { TextInput as PaperTextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Screen } from "@/components/layout";
import { Button, useSnackbar } from "@/components/ui";
import { FormField } from "@/components/forms";
import { Title, Text, Caption } from "@/components/typography";
import { useAuthForm } from "@/hooks/useAuthForm";
import { loginSchema } from "@/validation/auth";
import type { LoginInput } from "@/validation/auth";
import { palette } from "@/theme";
import { supabase } from "@/lib/supabase";
import { mapAuthError } from "@/lib/authErrors";

export default function LoginScreen() {
  const { show } = useSnackbar();

  const { control, errors, handleSubmit, isLoading } = useAuthForm<LoginInput>({
    schema: loginSchema,
    onSubmit: async (data) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
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
    <Screen centered scrollable={false} style={styles.screen}>
      <View style={styles.inner}>
        <View style={styles.logoWrap}>
          <View style={styles.logoMark}>
            <MaterialCommunityIcons name="chat-outline" size={28} color={palette.background} />
          </View>
        </View>

        <View style={styles.heading}>
          <Title style={styles.title}>Welcome back</Title>
          <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
            Sign in to AI Chat
          </Text>
        </View>

        <View style={styles.form}>
          <FormField<LoginInput>
            name="email"
            control={control}
            label="Email"
            error={errors.email}
            keyboardType="email-address"
            autoComplete="email"
            returnKeyType="next"
            left={<PaperTextInput.Icon icon="email-outline" />}
          />
          <FormField<LoginInput>
            name="password"
            control={control}
            label="Password"
            error={errors.password}
            secureTextEntry
            autoComplete="current-password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            left={<PaperTextInput.Icon icon="lock-outline" />}
          />

          <TouchableOpacity style={styles.forgot} hitSlop={8}>
            <Link href="/(auth)/forgot-password">
              <Caption style={{ color: palette.accent }}>Forgot password?</Caption>
            </Link>
          </TouchableOpacity>

          <Button
            fullWidth
            loading={isLoading}
            onPress={handleSubmit}
            buttonColor={palette.button}
            textColor={palette.primaryText}
            contentStyle={styles.ctaContent}
            labelStyle={styles.ctaLabel}
          >
            Continue
          </Button>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: palette.border }]} />
            <Caption style={[styles.dividerText, { color: palette.textTertiary }]}>or</Caption>
            <View style={[styles.dividerLine, { backgroundColor: palette.border }]} />
          </View>

          {Platform.OS === "ios" && (
            <Button
              fullWidth
              mode="outlined"
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="apple" size={size} color={color} />
              )}
              textColor={palette.text}
              style={[styles.socialBtn, { borderColor: palette.border }]}
              contentStyle={styles.socialContent}
            >
              Continue with Apple
            </Button>
          )}
          <Button
            fullWidth
            mode="outlined"
            icon={({ size, color }) => (
              <MaterialCommunityIcons name="google" size={size} color={color} />
            )}
            textColor={palette.text}
            style={[styles.socialBtn, { borderColor: palette.border }]}
            contentStyle={styles.socialContent}
            onPress={() => show("Google sign-in coming soon", { type: "info" })}
          >
            Continue with Google
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={{ color: palette.textSecondary }}>Don't have an account? </Text>
          <Link href="/(auth)/register">
            <Text style={{ color: palette.accent, fontWeight: "600" }}>Sign up</Text>
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: palette.background },
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
  forgot: { alignSelf: "flex-end", marginTop: -4 },
  ctaContent: { height: 52 },
  ctaLabel: { fontSize: 16, fontWeight: "600", letterSpacing: 0.1 },

  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 4 },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth },
  dividerText: { fontSize: 13 },

  socialBtn: { borderRadius: 10 },
  socialContent: { height: 48 },

  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 32 },
});
