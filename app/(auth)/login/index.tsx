import { BraneButton } from "@/components/brane-button";
import ContinueWithGoogle from "@/components/continue-with-google";
import { FormInput, mapFormikProps } from "@/components/formInput";
import { PhoneInput } from "@/components/phone-input";
import { PassWrd } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFormHandler } from "@/hooks/use-formik";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { setRefreshToken, setToken, setUser } from "@/redux/slice/auth-slice";
import BaseRequest, { parseNetworkError } from "@/services";
import { VERSION } from "@/utils";
import { formatPhoneNumber, showError } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { Eye, EyeSlash, FingerScan } from "iconsax-react-native";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import * as yup from "yup";

const LOGIN_ENDPOINT = "/auth-service/signin";

function extractAuthData(response: any) {
  const authCredentials =
    response?.data?.authCredentials || response?.authCredentials;
  const user = response?.data
    ? { ...response.data, authCredentials: undefined }
    : response;
  return { authCredentials, user };
}

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const {
    isLoading: isBiometricLoading,
    availability,
    authenticate,
    retrieveCredentials,
    saveCredentials,
  } = useBiometricAuth();

  // ─── Shared post-login handler ──────────────────────────
  const handleLoginSuccess = async (response: any) => {
    const { authCredentials, user } = extractAuthData(response);
    if (!authCredentials?.accessToken) {
      showError("Unable to complete login. Please try again.");
      return false;
    }
    dispatch(setToken(authCredentials.accessToken));
    dispatch(setRefreshToken(authCredentials.refreshToken || null));
    try {
      // Fetch full user profile after login
      const fullUser = await BaseRequest.get("/auth-service/user");
      dispatch(setUser(fullUser));
    } catch {
      // fallback to partial user if profile fetch fails
      dispatch(setUser(user));
    }
    return true;
  };

  // ─── Biometric login ────────────────────────────────────
  const handleBiometricLogin = async () => {
    setIsLoading(true);
    try {
      const authResult = await authenticate();
      if (!authResult.success) {
        showError(authResult.error || "Biometric authentication failed");
        return;
      }

      const credResult = await retrieveCredentials();
      if (credResult.error || !credResult.credentials) {
        showError("No stored credentials found. Please login manually.");
        return;
      }

      const response: any = await BaseRequest.post(LOGIN_ENDPOINT, {
        phone: credResult.credentials.phoneNumber,
        password: credResult.credentials.password,
      });

      if (await handleLoginSuccess(response)) {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      showError(parseNetworkError(error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Form login ─────────────────────────────────────────
  const { form, isDisabled } = useFormHandler({
    initialValues: { phone: "", password: "" },
    validationSchema: yup.object().shape({
      phone: yup
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .required("Phone number is required"),
      password: yup
        .string()
        .min(8, "Password cannot be less than 8 characters")
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.,_-])(?=.{8,})/,
          "Must have 8+ chars, a digit, uppercase, and special character",
        ),
    }),
    onSubmit: async (data) => {
      setIsLoading(true);
      try {
        const payload = {
          phone: formatPhoneNumber(data.phone),
          password: data.password,
        };

        const response: any = await BaseRequest.post(LOGIN_ENDPOINT, payload);

        if (await handleLoginSuccess(response)) {
          // Save credentials for future biometric logins
          await saveCredentials(payload.phone, data.password);
          router.replace("/(tabs)");
        }
      } catch (error: any) {
        showError(parseNetworkError(error).message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const busy = isLoading || isBiometricLoading;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          {/* ── Top section ── */}
          <View style={styles.topSection}>
            {/* Title */}
            <View style={styles.titleWrap}>
              <ThemedText type='subtitle'>Welcome back!</ThemedText>
            </View>

            {/* Fields */}
            <View style={styles.fields}>
              {/* Phone */}
              <View>
                <ThemedText style={[styles.fieldLabel, { color: C.muted }]}>
                  Phone Number
                </ThemedText>
                <PhoneInput
                  value={form.values.phone}
                  onPhoneChange={(val) => form.setFieldValue("phone", val)}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  placeholder='810 123 4567'
                />
              </View>

              {/* Password */}
              <View style={styles.passwordWrap}>
                <FormInput
                  ref={passwordRef}
                  leftContent={
                    <PassWrd
                      color={
                        form.errors.password && form.touched.password
                          ? C.error
                          : C.muted
                      }
                      size={20}
                    />
                  }
                  placeholder='Enter password'
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={() => form.handleSubmit()}
                  rightContent={
                    <TouchableOpacity
                      onPress={() => setShowPassword((p) => !p)}
                    >
                      {showPassword ? (
                        <EyeSlash size='20' color={C.muted} />
                      ) : (
                        <Eye size='20' color={C.muted} />
                      )}
                    </TouchableOpacity>
                  }
                  {...mapFormikProps("password", form)}
                  labelText='Password'
                />
                <TouchableOpacity
                  onPress={() => router.push("/forgot-password")}
                >
                  <ThemedText style={[styles.forgotPw, { color: C.primary }]}>
                    I Forgot My Password
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ── Bottom section ── */}
          <View style={styles.bottomSection}>
            {/* Login + Biometric row */}
            <View style={styles.loginRow}>
              <BraneButton
                text='Login'
                onPress={() => form.handleSubmit()}
                disabled={isDisabled || busy}
                loading={isLoading}
                textColor={C.googleBg}
                backgroundColor={C.primary}
                height={52}
                radius={12}
                style={styles.loginBtn}
              />

              {availability.available && (
                <TouchableOpacity
                  onPress={handleBiometricLogin}
                  disabled={busy}
                  style={[
                    styles.biometricBtn,
                    {
                      borderColor: C.fingerBorder,
                      opacity: busy ? 0.6 : 1,
                    },
                  ]}
                >
                  <FingerScan size={32} color={C.icon} />
                </TouchableOpacity>
              )}
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View
                style={[styles.dividerLine, { backgroundColor: C.border }]}
              />
              <ThemedText
                style={[
                  styles.dividerText,
                  { color: C.muted, backgroundColor: C.inputBg },
                ]}
              >
                or
              </ThemedText>
              <View
                style={[styles.dividerLine, { backgroundColor: C.border }]}
              />
            </View>

            {/* Google */}
            <ContinueWithGoogle action='Continue with Google' />

            {/* Sign up */}
            <View style={styles.signupRow}>
              <ThemedText style={[styles.signupText, { color: C.muted }]}>
                Are you a new user?{" "}
                <ThemedText
                  style={[styles.signupLink, { color: C.primary }]}
                  onPress={() => router.replace("/signup")}
                >
                  Create Account
                </ThemedText>
              </ThemedText>
            </View>

            {/* Version */}
            <View style={styles.versionWrap}>
              <ThemedText style={[styles.version, { color: C.muted }]}>
                Version {VERSION}
              </ThemedText>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: "6%" as any,
    paddingTop: 24,
  },

  topSection: { gap: 30 },
  titleWrap: { alignItems: "center", gap: 8 },
  fields: { gap: 16 },
  fieldLabel: { fontSize: 12, marginBottom: 6 },

  passwordWrap: { gap: 8 },
  forgotPw: { fontSize: 12, fontWeight: "500" },

  bottomSection: { gap: 16, marginTop: 28 },

  loginRow: { flexDirection: "row", alignItems: "center", marginBottom: 32 },
  loginBtn: { flex: 1, marginRight: 12 },
  biometricBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  dividerRow: { flexDirection: "row", alignItems: "center", marginBottom: 32 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    paddingHorizontal: 6,
    paddingBottom: 2,
    fontWeight: "500",
    borderRadius: 6,
  },

  signupRow: { alignItems: "center", marginTop: 32 },
  signupText: { fontSize: 12 },
  signupLink: { fontWeight: "400", fontSize: 12 },

  versionWrap: { alignItems: "center", marginTop: 20 },
  version: { fontSize: 12 },
});
