import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { OTPInput } from "@/components/otp-input";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { PASSWORD_RESET_ROUTE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { TickCircle } from "iconsax-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View as RNView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PasswordForm = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

const initialForm: PasswordForm = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
};

export default function ChangePasswordScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<PasswordForm>(initialForm);

  const canSubmitPassword = useMemo(() => {
    return (
      !!form.oldPassword &&
      !!form.password &&
      !!form.confirmPassword &&
      form.password.length >= 8 &&
      form.password === form.confirmPassword
    );
  }, [form]);

  const onResendOtp = useCallback(async () => {
    setLoading(true);
    try {
      await BaseRequest.get(PASSWORD_RESET_ROUTE);
      showSuccess("OTP sent successfully");
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmitOtp = useCallback(async () => {
    if (!otp || otp.length < 6) return;
    setLoading(true);
    try {
      await BaseRequest.post(PASSWORD_RESET_ROUTE, { otp });
      setStage(2);
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  }, [otp]);

  const onSubmitPassword = useCallback(async () => {
    if (!canSubmitPassword) return;
    setLoading(true);
    try {
      await BaseRequest.patch(PASSWORD_RESET_ROUTE, {
        otp,
        oldPassword: form.oldPassword,
        password: form.password,
      });
      setStage(3);
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  }, [canSubmitPassword, form, otp]);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.screen}
      >
        <View style={styles.header} row aligned>
          <Back onPress={() => router.back()} />
          <ThemedText type='subtitle' style={styles.headerTitle}>
            Change Password
          </ThemedText>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps='handled'
        >
          {stage === 1 && (
            <>
              <ThemedText type='defaultSemiBold'>Verify user</ThemedText>
              <ThemedText style={[styles.subText, { color: C.muted }]}>
                Enter the 6-digit code sent to your phone.
              </ThemedText>
              <View style={{ marginTop: 20 }}>
                <OTPInput onComplete={setOtp} />
              </View>
              <BraneButton
                text='Continue'
                onPress={onSubmitOtp}
                loading={loading}
                disabled={!otp || otp.length < 6}
                style={styles.button}
              />
              <BraneButton
                text='Resend OTP'
                onPress={onResendOtp}
                loading={loading}
                backgroundColor={C.inputBg}
                textColor={C.primary}
                style={styles.secondaryButton}
              />
            </>
          )}

          {stage === 2 && (
            <>
              <ThemedText type='defaultSemiBold'>Set new password</ThemedText>
              <ThemedText style={[styles.subText, { color: C.muted }]}>
                Use at least 8 characters and confirm your new password.
              </ThemedText>
              <View gap={12} style={{ marginTop: 16 }}>
                <FormInput
                  labelText='Current password'
                  secureTextEntry
                  value={form.oldPassword}
                  onChangeText={(value) =>
                    setForm((prev) => ({ ...prev, oldPassword: value }))
                  }
                />
                <FormInput
                  labelText='New password'
                  secureTextEntry
                  value={form.password}
                  onChangeText={(value) =>
                    setForm((prev) => ({ ...prev, password: value }))
                  }
                  error={
                    form.password && form.password.length < 8
                      ? "Password must be at least 8 characters"
                      : undefined
                  }
                />
                <FormInput
                  labelText='Confirm new password'
                  secureTextEntry
                  value={form.confirmPassword}
                  onChangeText={(value) =>
                    setForm((prev) => ({ ...prev, confirmPassword: value }))
                  }
                  error={
                    form.confirmPassword &&
                    form.password !== form.confirmPassword
                      ? "Passwords do not match"
                      : undefined
                  }
                />
              </View>
              <BraneButton
                text='Change Password'
                onPress={onSubmitPassword}
                loading={loading}
                disabled={!canSubmitPassword}
                style={styles.button}
              />
            </>
          )}

          {stage === 3 && (
            <View style={styles.successWrap}>
              <ThemedText type='subtitle'>Successful</ThemedText>
              <ThemedText style={[styles.subText, { color: C.muted }]}>
                Password change was successful.
              </ThemedText>
              <BraneButton
                text='Dismiss'
                onPress={() => router.push("/(tabs)")}
                style={styles.button}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={stage === 3}
        transparent
        animationType='fade'
        onRequestClose={() => router.push("/(tabs)")}
      >
        <Pressable
          style={[styles.modalBackdrop, { backgroundColor: "rgba(11, 0, 20, 0.5)" }]}
          onPress={() => router.push("/(tabs)")}
        >
          <RNView
            style={
              [
                styles.successCard,
                { backgroundColor: C.background, borderColor: C.border },
              ] as any
            }
          >
            <RNView style={{ alignItems: "center", marginBottom: 12 }}>
              <TickCircle size={48} color={C.primary} />
            </RNView>
            <ThemedText
              type='defaultSemiBold'
              style={[{ textAlign: "center", color: C.text, fontSize: 18 }]}
            >
              Success!
            </ThemedText>
            <ThemedText style={[styles.successText, { color: C.muted }]}>
              Your password has been changed successfully.
            </ThemedText>
            <BraneButton
              text='Continue'
              onPress={() => router.push("/(tabs)")}
              height={48}
              radius={10}
              style={{ marginTop: 20 }}
            />
          </RNView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 10,
  },
  subText: {
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    marginTop: 24,
  },
  secondaryButton: {
    marginTop: 12,
  },
  successWrap: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successCard: {
    borderRadius: 16,
    padding: 24,
    width: "85%",
    borderWidth: 1,
  },
  successText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
  },
});
