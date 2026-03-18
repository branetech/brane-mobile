import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRequest } from "@/services/useRequest";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { CheckCircle, CloseCircle } from "iconsax-react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KycBankDetailsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const { data: beneficiaries } = useRequest(
    "/transactions-service/banking-info/accounts",
    {
      initialValue: [],
      showLoading: false,
    },
  );

  const hasLinkedBank =
    Array.isArray(beneficiaries) && beneficiaries.length > 0;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle'>Bank Verification</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.statusCard,
            { backgroundColor: C.inputBg, borderColor: C.border },
          ]}
        >
          <View row aligned gap={8}>
            <ThemedText type='defaultSemiBold'>Status</ThemedText>
            {hasLinkedBank ? (
              <CheckCircle size={18} color={C.primary} />
            ) : (
              <CloseCircle size={18} color={C.error} />
            )}
          </View>
          <ThemedText
            style={[
              styles.status,
              { color: hasLinkedBank ? C.primary : C.error },
            ]}
          >
            {hasLinkedBank ? "Completed" : "Pending"}
          </ThemedText>
          <ThemedText style={[styles.help, { color: C.muted }]}>
            {hasLinkedBank
              ? "Your account has a linked bank beneficiary and bank verification is complete."
              : "Add a bank beneficiary from your account section to complete bank verification."}
          </ThemedText>
        </View>
      </View>
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statusCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  status: {
    fontSize: 13,
    fontWeight: "700",
  },
  help: {
    fontSize: 12,
    lineHeight: 18,
  },
});
