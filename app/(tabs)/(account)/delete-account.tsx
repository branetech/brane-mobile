import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { OTPInput } from "@/components/otp-input";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { logOut } from "@/redux/slice/auth-slice";
import BaseRequest, { catchError } from "@/services";
import { AUTH_SERVICE } from "@/services/routes";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const REASONS = [
  "I no longer need this account",
  "Privacy concerns",
  "Too many notifications",
  "Found a better alternative",
  "Other",
];

export default function DeleteAccountScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [stage, setStage] = useState<1 | 2>(1);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const onContinue = async () => {
    if (!selectedReason) return;
    setLoading(true);
    try {
      await BaseRequest.post(AUTH_SERVICE.INIT_DELETE, {
        reason: selectedReason,
      });
      setStage(2);
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  };

  const onConfirmDeletion = async () => {
    if (!otp || otp.length < 6) return;
    setLoading(true);
    try {
      await BaseRequest.post(AUTH_SERVICE.DELETE, { otp });
      dispatch(logOut());
      router.replace("/(auth)/login");
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={styles.headerTitle}>
          Delete Account
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'
      >
        {stage === 1 && (
          <>
            <ThemedText type='defaultSemiBold'>Why are you leaving?</ThemedText>
            <ThemedText style={[styles.subText, { color: C.muted }]}>
              Please select a reason for deleting your account.
            </ThemedText>

            <View style={{ marginTop: 20, gap: 12 }}>
              {REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    activeOpacity={0.7}
                    style={[
                      styles.reasonRow,
                      {
                        borderColor: isSelected ? C.primary : C.border,
                        backgroundColor: isSelected
                          ? C.primary + "20"
                          : C.background,
                      },
                    ]}
                    onPress={() => setSelectedReason(reason)}
                  >
                    <View
                      style={{
                        ...styles.radio,
                        borderColor: isSelected ? C.primary : C.muted,
                      }}
                    >
                      {isSelected && (
                        <View
                          style={[
                            styles.radioInner,
                            { backgroundColor: C.primary },
                          ]}
                        />
                      )}
                    </View>
                    <ThemedText style={styles.reasonText}>{reason}</ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>

            <BraneButton
              text='Continue'
              onPress={onContinue}
              loading={loading}
              disabled={!selectedReason}
              style={styles.button}
            />
          </>
        )}

        {stage === 2 && (
          <>
            <ThemedText type='defaultSemiBold'>Confirm deletion</ThemedText>
            <ThemedText style={[styles.subText, { color: C.muted }]}>
              Enter the OTP sent to your email to confirm deletion.
            </ThemedText>

            <View style={{ marginTop: 20 }}>
              <OTPInput onComplete={setOtp} />
            </View>

            <BraneButton
              text='Confirm Deletion'
              onPress={onConfirmDeletion}
              loading={loading}
              disabled={!otp || otp.length < 6}
              backgroundColor='#D50000'
              style={styles.button}
            />
          </>
        )}
      </ScrollView>
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
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  reasonText: {
    fontSize: 14,
    flex: 1,
  },
  button: {
    marginTop: 24,
  },
});
