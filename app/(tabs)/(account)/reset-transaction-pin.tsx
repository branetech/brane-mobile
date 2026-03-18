import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { AUTH_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetTransactionPinScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);

  const pinError = useMemo(() => {
    if (!confirmPin) return "";
    return newPin !== confirmPin ? "PIN does not match" : "";
  }, [newPin, confirmPin]);

  const canSubmit =
    oldPin.length >= 4 &&
    newPin.length >= 4 &&
    confirmPin.length >= 4 &&
    !pinError;

  const onSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await BaseRequest.post(AUTH_SERVICE.PIN_VALIDATION, { pin: oldPin });
      await BaseRequest.patch(AUTH_SERVICE.RESET_TRANSACTION_PIN, {
        transactionPin: newPin,
      });
      showSuccess("Transaction PIN updated successfully");
      router.push("/(tabs)/(account)");
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.screen}
      >
        <View style={styles.header} row aligned>
          <Back onPress={() => router.back()} />
          <ThemedText type='subtitle'>Reset Transaction PIN</ThemedText>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText style={[styles.help, { color: C.muted }]}>
            Use a secure 4-digit PIN that is easy for you to remember.
          </ThemedText>

          <FormInput
            labelText='Current PIN'
            placeholder='Enter current PIN'
            value={oldPin}
            onChangeText={setOldPin}
            keyboardType='number-pad'
            secureTextEntry
            maxLength={4}
          />

          <FormInput
            labelText='New PIN'
            placeholder='Enter new PIN'
            value={newPin}
            onChangeText={setNewPin}
            keyboardType='number-pad'
            secureTextEntry
            maxLength={4}
          />

          <FormInput
            labelText='Confirm PIN'
            placeholder='Re-enter new PIN'
            value={confirmPin}
            onChangeText={setConfirmPin}
            keyboardType='number-pad'
            secureTextEntry
            maxLength={4}
          />

          {!!pinError && (
            <ThemedText style={[styles.error, { color: C.error }]}>
              {pinError}
            </ThemedText>
          )}

          <BraneButton
            text='Update PIN'
            onPress={onSubmit}
            disabled={!canSubmit}
            loading={loading}
            style={{ marginTop: 18 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  help: { fontSize: 12, marginBottom: 8 },
  error: { marginTop: 8, fontSize: 12 },
});
