import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PhotographVerificationScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    setLoading(true);
    try {
      await BaseRequest.post(
        "/auth-service/kyc/verify-identity/passport-photo",
        {},
      );
      router.replace("/kyc/identity-verification");
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
      </View>

      <View style={styles.content}>
        <ThemedText type="subtitle">Passport Photograph</ThemedText>
        <ThemedText style={[styles.help, { color: C.muted }]}>
          Submit your passport photo for verification.
        </ThemedText>
      </View>

      <View style={styles.footer}>
        <BraneButton
          text="Proceed to Verify"
          onPress={onVerify}
          loading={loading}
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
