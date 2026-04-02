import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { KycGate } from "@/components/kyc-gate";
import { BankIcon } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { getUserFromState } from "@/utils";
import { showError, showSuccess } from "@/utils/helpers";
import * as Clipboard from "expo-clipboard";
import { Copy, ExportCurve } from "iconsax-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Share,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BANK_NAME = "FCMB MFB";

export const BankTransferDetails = () => {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];
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

  const accountName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const accountNumber = account?.accountNumber ?? "";

  const handleCopy = async () => {
    await Clipboard.setStringAsync(accountNumber);
    showSuccess("Copied to clipboard");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: "Bank Transfer Details",
        message: `Account Name: ${accountName}\nAccount Number: ${accountNumber}\nBank: ${BANK_NAME}`,
      });
    } catch {
      showError("Unable to share at this time.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size='small' color={C.primary} />
      </View>
    );
  }

  if (errorStatus) {
    return (
      <KycGate
        visible={true}
        onClose={() => router.back()}
        message={errorStatus}
      />
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.sectionHeader, { borderBottomColor: C.border }]}>
        <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
          Quick save to your Brane wallet ⚡
        </ThemedText>
      </View>

      <View
        style={[
          styles.outerCard,
          { backgroundColor: scheme === "dark" ? C.inputBg : "#F3EED8" },
        ]}
      >
        <View style={styles.labelRow}>
          <BankIcon />
          <ThemedText style={[styles.labelText, { color: C.text }]}>
            Bank Transfer
          </ThemedText>
        </View>

        <View style={[styles.innerCard, { backgroundColor: C.primary }]}>
          <View style={styles.detailsCol}>
            <ThemedText style={styles.accountName}>{accountName}</ThemedText>
            <ThemedText style={styles.accountNumber}>
              {accountNumber}
            </ThemedText>
            <ThemedText style={styles.bankName}>{BANK_NAME}</ThemedText>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity onPress={handleShare} activeOpacity={0.7}>
              <ExportCurve size={16} color='#AFC9BE' />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCopy} activeOpacity={0.7}>
              <Copy size={20} color='#AFC9BE' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

type FundWalletProps = {
  show?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const FundWallet = ({ show, onOpenChange }: FundWalletProps) => {
  const rawScheme = useColorScheme();
  const scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const [internalOpen, setInternalOpen] = useState(false);

  const visible = typeof show === "boolean" ? show : internalOpen;
  const closeModal = () => {
    if (onOpenChange) onOpenChange(false);
    else setInternalOpen(false);
  };

  return (
    <>
      {!onOpenChange && typeof show !== "boolean" && (
        <BraneButton
          text='+ Fund Wallet'
          onPress={() => setInternalOpen(true)}
          backgroundColor='#D2F1E4'
          textColor='#013D25'
          height={40}
          radius={12}
          width={130}
        />
      )}

      <Modal
        visible={visible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={closeModal}
      >
        <SafeAreaView
          style={[styles.modalScreen, { backgroundColor: C.background }]}
        >
          <View style={styles.modalHeader}>
            <Back onPress={closeModal} />
            <ThemedText type='subtitle'>Fund Wallet</ThemedText>
            <View style={{ width: 44 }} />
          </View>
          <BankTransferDetails />
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalScreen: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  wrapper: { width: "100%", paddingHorizontal: 16, paddingTop: 8 },
  loader: { minHeight: 220, alignItems: "center", justifyContent: "center" },
  sectionHeader: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "500" },
  outerCard: {
    width: "100%",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 16,
  },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  labelText: { fontSize: 15, fontWeight: "600" },
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

export default FundWallet;
