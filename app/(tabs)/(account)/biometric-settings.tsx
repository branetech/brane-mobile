import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { showError, showSuccess } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

export default function BiometricSettingsScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const { isLoading, availability, clearCredentials } = useBiometricAuth();

  const [isEnabled, setIsEnabled] = useState(false);

  // Check biometric availability on mount
  useEffect(() => {
    setIsEnabled(availability.available);
  }, [availability.available]);

  const handleToggleBiometric = useCallback(
    async (value: boolean) => {
      try {
        if (value) {
          // Enable biometric
          if (!availability.available) {
            showError(
              "Biometric authentication is not available on this device",
            );
            setIsEnabled(false);
            return;
          }
          // User should navigate to login to set up biometric
          showError(
            "Please log out and log in again to set up biometric authentication",
          );
          setIsEnabled(false);
          return;
        } else {
          // Disable biometric - clear stored credentials
          await clearCredentials();
          setIsEnabled(false);
          showSuccess("Biometric authentication disabled");
        }
      } catch (error: any) {
        showError(error?.message || "An error occurred");
        setIsEnabled(!value);
      }
    },
    [availability, clearCredentials],
  );

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
                  {availability.biometricType || "Biometric"} Authentication
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
              Your biometric data is never stored on Brane servers. It&apos;s
              only used by your device to authenticate login requests. Your
              credentials are encrypted and securely stored locally.
            </ThemedText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
