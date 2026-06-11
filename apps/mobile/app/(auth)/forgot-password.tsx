import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { TextInput as PaperTextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Screen } from "@/components/layout";
import { Button, useSnackbar } from "@/components/ui";
import { FormField } from "@/components/forms";
import { Title, Text, Caption } from "@/components/typography";
import { useAuthForm } from "@/hooks/useAuthForm";
import { forgotPasswordSchema } from "@/validation/auth";
import type { ForgotPasswordInput } from "@/validation/auth";
import { apiClient, APIClientError } from "@/core/api-client";
import { palette } from "@/theme";

export default function ForgotPasswordScreen() {
  const { show } = useSnackbar();

  const { control, errors, handleSubmit, isLoading } =
    useAuthForm<ForgotPasswordInput>({
      schema: forgotPasswordSchema,
      onSubmit: async (data) => {
        await apiClient.post("/auth/forgot-password", data);
        show("Check your email for a reset link", { type: "success" });
        router.replace("/(auth)/login");
      },
      onError: (err) => {
        const message =
          err instanceof APIClientError
            ? err.message
            : "Something went wrong. Please try again.";
        show(message, { type: "error" });
      },
    });

  return (
    <Screen centered scrollable={false} style={styles.screen} contentContainerStyle={styles.scroll}>
      <View style={styles.inner}>
        {/* Back link */}
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.backBtn} hitSlop={8}>
            <MaterialCommunityIcons name="arrow-left" size={20} color={palette.textSecondary} />
            <Caption style={{ color: palette.textSecondary }}>Back</Caption>
          </TouchableOpacity>
        </Link>

        {/* Heading */}
        <View style={styles.heading}>
          <Title style={styles.title}>Reset password</Title>
          <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
            Enter your email and we'll send you a reset link.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <FormField<ForgotPasswordInput>
            name="email"
            control={control}
            label="Email"
            error={errors.email}
            keyboardType="email-address"
            autoComplete="email"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            left={<PaperTextInput.Icon icon="email-outline" />}
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
            Send reset link
          </Button>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: palette.background },
  scroll: { flexGrow: 1, padding: 0 },

  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 0,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginBottom: 40,
  },

  heading: { marginBottom: 36, gap: 8 },
  title: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5, color: palette.text },
  subtitle: { fontSize: 15, lineHeight: 22 },

  form: { gap: 14 },
  ctaContent: { height: 52 },
  ctaLabel: { fontSize: 16, fontWeight: "600", letterSpacing: 0.1 },
});
