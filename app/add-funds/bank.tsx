import { BankIcon } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { WalletNotFound } from "@/components/wallet-not-found";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { getUserFromState } from "@/utils";
import { showError, showSuccess } from "@/utils/helpers";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { Copy, ExportCurve } from "iconsax-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Share as RNShare,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const BANK_NAME = "FCMB MFB";

export function FundWithBankScren() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const { user: userFromRedux } = useAppState();
  const user = getUserFromState(userFromRedux);

  const [errorStatus, setErrorStatus] = useState("");

  const { data: account, isLoading } = useRequest(
    TRANSACTION_SERVICE.ROVA_ACCOUNT_NO,
    {
      handleError: (error: any) => {
        setErrorStatus(error?.message || "Wallet not found");
      },
    },
  );

  // ─── Guards ───────────────────────────────────────────────
  if (isLoading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size='small' color={C.primary} />
      </View>
    );
  if (errorStatus)
    return (
      <WalletNotFound
        message={errorStatus}
        onCompleteKYC={() => router.push("/kyc")}
      />
    );

  // ─── Data ─────────────────────────────────────────────────
  const accountName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const accountNumber = account?.accountNumber ?? "";

  // ─── Actions ──────────────────────────────────────────────
  const handleCopy = async () => {
    await Clipboard.setStringAsync(accountNumber);
    showSuccess("Copied to clipboard");
  };

  const handleShare = async () => {
    try {
      await RNShare.share({
        title: "Bank Transfer Details",
        message: `Account Name: ${accountName}\nAccount Number: ${accountNumber}\nBank: ${BANK_NAME}`,
      });
    } catch {
      showError("Unable to share at this time.");
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Section header */}

      {/* Outer sand card */}
      <View style={[styles.outerCard]}>
        {/* Bank Transfer label row */}
        <View style={styles.labelRow}>
          {/* Bank icon placeholder — swap with your <BankIcn /> SVG */}
          <BankIcon />
          <ThemedText style={[styles.labelText, { color: C.text }]}>
            Bank Transfer
          </ThemedText>
        </View>

        {/* Dark inner card */}
        <View style={[styles.innerCard, { backgroundColor: C.primary }]}>
          {/* Account details */}
          <View style={styles.detailsCol}>
            <ThemedText style={styles.accountName}>{accountName}</ThemedText>
            <ThemedText style={styles.accountNumber}>
              {accountNumber}
            </ThemedText>
            <ThemedText style={styles.bankName}>{BANK_NAME}</ThemedText>
          </View>

          {/* Action icons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity onPress={handleShare} activeOpacity={0.7}>
              <ExportCurve size={16} color='#AFC9BE' />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCopy} activeOpacity={0.7}>
              <Copy size={22} color='#AFC9BE' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },

  sectionHeader: {
    // paddingVertical: 12,
    borderBottomWidth: 2,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
  },

  // Outer sand card
  outerCard: {
    width: "100%",
    borderRadius: 12,
    // paddingHorizontal: 14,
    // paddingVertical: 16,
    gap: 16,
  },

  // Label row
  labelRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  bankIconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  labelText: { fontSize: 15, fontWeight: "600" },

  // Dark inner card
  innerCard: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 95,
  },
  detailsCol: { gap: 2 },
  accountName: { fontSize: 13, color: "#AFC9BE", textTransform: "capitalize" },
  accountNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginVertical: 2,
  },
  bankName: { fontSize: 13, color: "#AFC9BE" },

  actionsRow: { flexDirection: "row", gap: 16, alignItems: "center" },
});
