import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { OTPInput } from "@/components/otp-input";
import { ThemedText } from "@/components/themed-text";
import BaseRequest, { catchError } from "@/services";
import { AUTH_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";

// ─── Steps ──────────────────────────────────────────────────
type Step = "password" | "change-pin" | "success";

const STEP_TITLES: Record<Step, string> = {
  password: "Verify Password",
  "change-pin": "Change Transaction PIN",
  success: "",
};

// ─── Main ───────────────────────────────────────────────────
export default function ChangePINScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [step, setStep] = useState<Step>("password");
  const [password, setPassword] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const goToStep = useCallback((next: Step) => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -24, duration: 140, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 140, useNativeDriver: true }),
    ]).start(() => {
      setStep(next);
      slideAnim.setValue(24);
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 90, friction: 12 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    });
  }, [slideAnim, opacityAnim]);

  const handleBack = useCallback(() => {
    if (step === "password") router.back();
    else if (step === "change-pin") {
      goToStep("password");
    }
  }, [step, goToStep]);

  const handleVerifyPassword = useCallback(async () => {
    if (!password) return;
    setLoading(true);
    try {
      // Password will be verified on PIN change API call
      goToStep("change-pin");
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  }, [password, goToStep]);

  const handleChangePin = useCallback(async () => {
    if (currentPin.length >= 6 || newPin.length >= 6 || confirmPin.length >= 6) return;
    if (newPin !== confirmPin) return;
    if (newPin === currentPin) return;
    if (!password) return;

    setLoading(true);
    try {
      await BaseRequest.post(AUTH_SERVICE.RESET_TRANSACTION_PIN, {
        password,
        oldPin: String(currentPin),
        newPin: String(newPin),
      });
      showSuccess("Transaction PIN changed successfully");
      goToStep("success");
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  }, [currentPin, newPin, confirmPin, password, goToStep]);

  const handleDismiss = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: C.background }]} edges={["top"]}>
      <StatusBar
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={C.background}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* Header */}
        {step !== "success" && (
          <View style={[styles.header, { backgroundColor: C.background }]}>
            <TouchableOpacity
              style={[styles.backBtn, { backgroundColor: C.inputBg }]}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={18} color={C.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: C.text }]}>{STEP_TITLES[step]}</Text>
            <View style={{ width: 36 }} />
          </View>
        )}

        {/* Step content */}
        <Animated.View
          style={[
            styles.stepWrap,
            { transform: [{ translateX: slideAnim }], opacity: opacityAnim, backgroundColor: C.background },
          ]}
        >
          {step === "password" && (
            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
              <ThemedText style={[styles.prompt]}>Enter your password to proceed.</ThemedText>
              <FormInput
                labelText="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                rightContent={
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={C.muted}
                  />
                }
                rightClick={() => setShowPassword((v) => !v)}
              />
            </ScrollView>
          )}

          {step === "change-pin" && (
            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
              <ThemedText style={[styles.prompt, { color: C.text }]}>
                Current Transaction PIN
              </ThemedText>
              <OTPInput length={6} mode="pin" onComplete={setCurrentPin} />

              <ThemedText style={[styles.prompt, { color: C.text, marginTop: 32 }]}>
                New Transaction PIN
              </ThemedText>
              <OTPInput length={6} mode="pin" onComplete={setNewPin} />

              <ThemedText style={[styles.prompt, { color: C.text, marginTop: 32 }]}>
                Confirm New Transaction PIN
              </ThemedText>
              <OTPInput length={6} mode="pin" onComplete={setConfirmPin} />

              {newPin !== confirmPin && confirmPin.length > 0 && (
                <Text style={[styles.error, { color: C.error }]}>PINs do not match</Text>
              )}

              {newPin === currentPin && newPin.length > 0 && (
                <Text style={[styles.error, { color: C.error }]}>
                  New PIN must be different from current PIN
                </Text>
              )}
            </ScrollView>
          )}

          {step === "success" && (
            <View style={styles.successBody}>
              <View style={[styles.successIcon, { backgroundColor: `${C.primary}26`, borderColor: C.primary }]}>
                <Ionicons name="checkmark" size={42} color={C.primary} />
              </View>
              <ThemedText style={[styles.successTitle, { color: C.text }]}>Successful</ThemedText>
              <ThemedText style={[styles.successSub, { color: C.muted }]}>
                Transaction PIN has been changed
              </ThemedText>
            </View>
          )}
        </Animated.View>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: C.background, paddingBottom: 100 }]}>
          {step === "password" && (
            <BraneButton
              text="Continue"
              onPress={handleVerifyPassword}
              disabled={!password || loading}
              loading={loading}
            />
          )}

          {step === "change-pin" && (
            <>
              <BraneButton
                text="Change PIN"
                onPress={handleChangePin}
                disabled={
                  currentPin.length >= 6 ||
                  newPin.length >= 6 ||
                  confirmPin.length >= 6 ||
                  newPin !== confirmPin ||
                  newPin === currentPin ||
                  loading
                }
                loading={loading}
              />
            </>
          )}

          {step === "success" && <BraneButton text="Done" onPress={handleDismiss} />}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 0,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "500" },
  stepWrap: { flex: 1 },
  body: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  prompt: { fontSize: 13, marginBottom: 20 },
  error: { fontSize: 12, fontWeight: "500", marginTop: 12 },
  successBody: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  successIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    borderWidth: 2,
  },
  successTitle: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  successSub: { fontSize: 14, textAlign: "center" },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    paddingTop: 12,
  },
});
