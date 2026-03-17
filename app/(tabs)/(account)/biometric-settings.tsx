import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { disableBiometric, setBiometricMode } from "@/redux/slice/auth-slice";
import { showError, showSuccess } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Switch, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

type Scheme = "light" | "dark";

export default function BiometricSettingsScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const dispatch = useDispatch();
  const {
    deleteCredentials,
    hasStoredCredentials,
    getStoredMode,
    isLoading,
    availability,
  } = useBiometricAuth();

  const [isEnabled, setIsEnabled] = useState(false);
  const [currentMode, setCurrentMode] = useState<"auto-login" | "2fa" | null>(
    null,
  );
  const [isChecking, setIsChecking] = useState(true);

  // Load current biometric status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsChecking(true);
        const hasCredentials = await hasStoredCredentials();
        const mode = await getStoredMode();

        if (hasCredentials && mode) {
          setIsEnabled(true);
          setCurrentMode(mode);
        } else {
          setIsEnabled(false);
          setCurrentMode(null);
        }
      } catch {
        setIsEnabled(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, [hasStoredCredentials, getStoredMode]);

  const handleToggleBiometric = useCallback(
    async (value: boolean) => {
      try {
        if (value) {
          // Enable biometric
          if (!availability.available) {
            showError(
              "Biometric authentication is not available on this device",
            );
            return;
          }
          // User should navigate to login to set up biometric
          showError(
            "Please log out and log in again to set up biometric authentication",
          );
          return;
        } else {
          // Disable biometric
          const success = await deleteCredentials();
          if (success) {
            setIsEnabled(false);
            setCurrentMode(null);
            dispatch(disableBiometric());
            showSuccess("Biometric authentication disabled");
          } else {
            showError("Failed to disable biometric authentication");
          }
        }
      } catch (error: any) {
        showError(error?.message || "An error occurred");
      }
    },
    [availability, deleteCredentials, dispatch],
  );

  const handleModeChange = useCallback(
    async (mode: "auto-login" | "2fa") => {
      try {
        // Switch between modes
        dispatch(setBiometricMode(mode));
        setCurrentMode(mode);
        showSuccess(
          `Switched to ${mode === "auto-login" ? "Fast Login" : "Extra Security"} mode`,
        );
      } catch (error: any) {
        showError(error?.message || "Failed to change mode");
      }
    },
    [dispatch],
  );

  if (isChecking) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: C.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size='large' color={C.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Back onPress={() => router.back()} />
          <ThemedText
            type='subtitle'
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: C.text,
            }}
          >
            Biometric Settings
          </ThemedText>
          <View style={{ width: 44 }} />
        </View>

        {/* Main Content */}
        <View style={{ flex: 1 }}>
          {/* Status Card */}
          <View
            style={{
              backgroundColor: isEnabled ? C.primary + "15" : C.inputBg,
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: isEnabled ? C.primary : C.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <ThemedText
                  type='defaultSemiBold'
                  style={{
                    fontSize: 14,
                    color: C.text,
                    marginBottom: 4,
                  }}
                >
                  {availability.type || "Biometric"} Authentication
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 12,
                    color: C.muted,
                  }}
                >
                  {isEnabled ? "Enabled" : "Disabled"}
                </ThemedText>
              </View>
              <Switch
                value={isEnabled}
                onValueChange={handleToggleBiometric}
                disabled={isLoading}
                trackColor={{ false: C.border, true: C.primary }}
                thumbColor={isEnabled ? C.background : C.muted}
              />
            </View>
          </View>

          {/* Mode Selection (Only if enabled) */}
          {isEnabled && currentMode && (
            <>
              <ThemedText
                type='defaultSemiBold'
                style={{
                  fontSize: 14,
                  color: C.text,
                  marginBottom: 12,
                }}
              >
                Authentication Mode
              </ThemedText>

              {/* Fast Login Mode */}
              <TouchableOpacity
                onPress={() => handleModeChange("auto-login")}
                style={{
                  borderWidth: 2,
                  borderColor:
                    currentMode === "auto-login" ? C.primary : C.border,
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 12,
                  backgroundColor:
                    currentMode === "auto-login" ? C.primary + "15" : C.inputBg,
                }}
              >
                <ThemedText
                  type='defaultSemiBold'
                  style={{
                    fontSize: 13,
                    color: C.text,
                    marginBottom: 4,
                  }}
                >
                  Fast Login
                  {currentMode === "auto-login" && " ✓"}
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 11,
                    color: C.muted,
                    lineHeight: 16,
                  }}
                >
                  Log in instantly with {availability.type || "biometric"}{" "}
                  without entering your password.
                </ThemedText>
              </TouchableOpacity>

              {/* Extra Security Mode */}
              <TouchableOpacity
                onPress={() => handleModeChange("2fa")}
                style={{
                  borderWidth: 2,
                  borderColor: currentMode === "2fa" ? C.primary : C.border,
                  borderRadius: 12,
                  padding: 14,
                  backgroundColor:
                    currentMode === "2fa" ? C.primary + "15" : C.inputBg,
                }}
              >
                <ThemedText
                  type='defaultSemiBold'
                  style={{
                    fontSize: 13,
                    color: C.text,
                    marginBottom: 4,
                  }}
                >
                  Extra Security
                  {currentMode === "2fa" && " ✓"}
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 11,
                    color: C.muted,
                    lineHeight: 16,
                  }}
                >
                  Enter password first, then use{" "}
                  {availability.type || "biometric"} to confirm your identity.
                </ThemedText>
              </TouchableOpacity>

              <ThemedText
                style={{
                  fontSize: 11,
                  color: C.muted,
                  marginTop: 16,
                  lineHeight: 16,
                }}
              >
                Extra Security requires both your password and biometric
                verification, providing maximum protection for sensitive
                transactions.
              </ThemedText>
            </>
          )}

          {!isEnabled && (
            <View>
              <ThemedText
                style={{
                  fontSize: 12,
                  color: C.muted,
                  lineHeight: 18,
                  marginBottom: 12,
                }}
              >
                {availability.available
                  ? "Enable biometric authentication to log in faster and more securely."
                  : "Biometric authentication is not available on this device."}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View
          style={{
            backgroundColor: C.inputBg,
            borderRadius: 12,
            padding: 14,
            marginTop: "auto",
          }}
        >
          <ThemedText
            type='defaultSemiBold'
            style={{
              fontSize: 12,
              color: C.text,
              marginBottom: 8,
            }}
          >
            Security Info
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 11,
              color: C.muted,
              lineHeight: 16,
            }}
          >
            Your biometric data is never stored on Brane servers. It&apos;s only
            used by your device to authenticate login requests. Your credentials
            are encrypted and securely stored locally.
          </ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );
}
