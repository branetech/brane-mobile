import Back from "@/components/Back";
import KycItem from "@/components/kyc/kyc-item";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import { useRequest } from "@/services/useRequest";
import { useRouter } from "expo-router";
import { Card, Note1 } from "iconsax-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KycInformationScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const { user } = useAppState();

  const { data: beneficiaries } = useRequest(
    "/transactions-service/banking-info/accounts",
    {
      initialValue: [],
      showLoading: false,
    },
  );

  const hasBank = Array.isArray(beneficiaries) && beneficiaries.length > 0;
  const hasBvn =
    String(
      user?.identityVerification?.bvnVerification?.status || "",
    ).toLowerCase() === "completed";

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.push("/kyc")} />
      </View>

      <View style={styles.content}>
        <ThemedText type="subtitle">Verify your identity</ThemedText>
        <ThemedText style={[styles.help, { color: C.muted }]}>
          Identity verification is a crucial step in ensuring the security and
          legitimacy of your account.
        </ThemedText>

        <View style={{ marginTop: 12 }}>
          <KycItem
            title="Bvn Verification"
            icon={<Note1 size={20} color="#013D25" />}
            isVerified={hasBvn}
            onPress={() => router.push("/kyc/information/bvn-verification")}
          />
          <KycItem
            title="Bank Verification"
            icon={<Card size={20} color="#013D25" />}
            isVerified={hasBank}
            onPress={() => router.push("/kyc/information/bank-details")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  help: {
    marginTop: 6,
    fontSize: 12,
  },
});
