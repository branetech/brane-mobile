import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePostBvn } from "@/services/data";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IdVerificationScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [serialNumber, setSerialNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const { fetchData } = usePostBvn(setLoading, () => {}, "nin");

  const onSubmit = async () => {
    const ok = await fetchData({ serialNumber }, serialNumber);
    if (ok) router.replace("/kyc/identity-verification");
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
      </View>

      <View style={styles.content}>
        <ThemedText type="subtitle">ID Verification</ThemedText>
        <ThemedText style={[styles.help, { color: C.muted }]}>
          Enter your NIN to complete identity verification.
        </ThemedText>

        <View style={{ marginTop: 16 }}>
          <FormInput
            labelText="NIN"
            placeholder="Enter NIN"
            keyboardType="number-pad"
            value={serialNumber}
            onChangeText={(value) =>
              setSerialNumber(value.replace(/[^\d]/g, "").slice(0, 11))
            }
          />
        </View>
      </View>

      <View style={styles.footer}>
        <BraneButton
          text="Proceed to Verify"
          onPress={onSubmit}
          loading={loading}
          disabled={!serialNumber || serialNumber.length < 11}
          height={50}
          radius={10}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8 },
  content: { paddingHorizontal: 16, marginTop: 10 },
  help: { marginTop: 6, fontSize: 12 },
  footer: { marginTop: "auto", paddingHorizontal: 16, paddingBottom: 16 },
});
