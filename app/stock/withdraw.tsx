import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import {
    hideAppLoader,
    priceFormatter,
    showAppLoader,
    showSuccess,
} from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { TickCircle } from "iconsax-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    View as RNView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";
type Stage = "form" | "confirm" | "success";

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

export default function StockWithdrawScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [stage, setStage] = useState<Stage>("form");
  const [stockWalletBalance, setStockWalletBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWalletBalance = useCallback(async () => {
    setIsLoadingBalance(true);
    try {
      const res: any = await BaseRequest.get(STOCKS_SERVICE.WALLET_BALANCE);
      setStockWalletBalance(Number(res?.data?.balance || res?.balance || 0));
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  const fetchAccounts = useCallback(async () => {
    setIsLoadingAccounts(true);
    try {
      const res: any = await BaseRequest.get(TRANSACTION_SERVICE.BENEFICIARIES);
      setAccounts(toArray(res));
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoadingAccounts(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletBalance();
    fetchAccounts();
  }, [fetchWalletBalance, fetchAccounts]);

  const handleContinueForm = () => {
    const num = Number(amount);
    if (!amount || num <= 0) {
      setAmountError("Enter a valid amount");
      return;
    }
    if (num > stockWalletBalance) {
      setAmountError("Insufficient stock wallet balance");
      return;
    }
    if (!selectedAccount) {
      setAmountError("Please select a destination bank account");
      return;
    }
    setAmountError(undefined);
    setStage("confirm");
  };

  const handleSubmit = async () => {
    showAppLoader({ message: "Processing withdrawal..." });
    setIsSubmitting(true);
    try {
      await BaseRequest.post("/stocks-service/wallet/withdraw", {
        amount: Number(amount),
        bankAccountId: selectedAccount?.id || selectedAccount?._id,
      });
      hideAppLoader();
      showSuccess("Withdrawal initiated successfully");
      setStage("success");
    } catch (error) {
      hideAppLoader();
      catchError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stock Wallet Balance */}
        <View style={{ ...styles.balanceCard, backgroundColor: C.primary }}>
          <ThemedText style={styles.balanceLabelText}>
            Stock Wallet Balance
          </ThemedText>
          {isLoadingBalance ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <ThemedText style={styles.balanceAmount}>
              {priceFormatter(stockWalletBalance, 2)}
            </ThemedText>
          )}
        </View>

        {/* Amount */}
        <ThemedText style={[styles.fieldLabel, { color: C.muted }]}>
          Amount to Withdraw
        </ThemedText>
        <FormInput
          placeholder="Enter amount"
          keyboardType="number-pad"
          value={amount}
          onChangeText={(v) => {
            setAmount(v.replace(/\D/g, ""));
            setAmountError(undefined);
          }}
          error={amountError}
          inputContainerStyle={styles.input}
        />

        {/* Destination Account */}
        <ThemedText style={[styles.fieldLabel, { color: C.muted }]}>
          Destination Bank Account
        </ThemedText>
        {isLoadingAccounts ? (
          <ActivityIndicator color={C.primary} />
        ) : accounts.length === 0 ? (
          <TouchableOpacity
            onPress={() => router.push("/add-funds/bank")}
            style={styles.addBankLink}
          >
            <ThemedText style={[styles.addBankText, { color: C.primary }]}>
              + Add Bank Account
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <View style={styles.accountsList}>
            {accounts.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.accountCard,
                  {
                    borderColor:
                      selectedAccount?.id === item?.id ||
                      selectedAccount?._id === item?._id
                        ? C.primary
                        : C.border,
                    backgroundColor: C.inputBg,
                  },
                ]}
                onPress={() => setSelectedAccount(item)}
              >
                <View style={styles.accountInfo}>
                  <ThemedText style={[styles.accountBank, { color: C.text }]}>
                    {item?.bankName || item?.bank || "Bank"}
                  </ThemedText>
                  <ThemedText style={[styles.accountNum, { color: C.muted }]}>
                    {item?.accountNumber || item?.number || ""}
                  </ThemedText>
                </View>
                <View
                  style={{
                    ...styles.selectDot,
                    borderColor: C.primary,
                    backgroundColor:
                      selectedAccount?.id === item?.id ||
                      selectedAccount?._id === item?._id
                        ? C.primary
                        : "transparent",
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <BraneButton
          text="Continue"
          onPress={handleContinueForm}
          backgroundColor={C.primary}
          textColor="#D2F1E4"
          height={52}
          radius={12}
        />
      </View>
    </KeyboardAvoidingView>
  );

  const renderConfirm = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={{ ...styles.summaryCard, borderColor: C.border }}>
        <ThemedText style={[styles.summaryTitle, { color: C.text }]}>
          Confirm Withdrawal
        </ThemedText>
        {[
          { label: "Amount", value: priceFormatter(Number(amount), 2) },
          {
            label: "Bank",
            value: selectedAccount?.bankName || selectedAccount?.bank || "Bank",
          },
          {
            label: "Account Number",
            value:
              selectedAccount?.accountNumber || selectedAccount?.number || "",
          },
          {
            label: "Account Name",
            value: selectedAccount?.accountName || selectedAccount?.name || "",
          },
        ].map((row, i, arr) => (
          <RNView
            key={row.label}
            style={[
              styles.summaryRow,
              i < arr.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: C.border,
              },
            ]}
          >
            <ThemedText style={[styles.summaryLabel, { color: C.muted }]}>
              {row.label}
            </ThemedText>
            <ThemedText style={[styles.summaryValue, { color: C.text }]}>
              {row.value}
            </ThemedText>
          </RNView>
        ))}
      </View>
      <View style={styles.confirmButtons}>
        <BraneButton
          text="Back"
          onPress={() => setStage("form")}
          backgroundColor="#D2F1E4"
          textColor={C.primary}
          height={52}
          radius={12}
          style={styles.halfBtn}
        />
        <BraneButton
          text="Withdraw"
          onPress={handleSubmit}
          loading={isSubmitting}
          backgroundColor={C.primary}
          textColor="#D2F1E4"
          height={52}
          radius={12}
          style={styles.halfBtn}
        />
      </View>
    </ScrollView>
  );

  const renderSuccess = () => (
    <View style={styles.successWrap}>
      <TickCircle size={72} color="#013D25" variant="Bold" />
      <ThemedText style={[styles.successTitle, { color: C.text }]}>
        Withdrawal Successful
      </ThemedText>
      <ThemedText style={[styles.successDesc, { color: C.muted }]}>
        {priceFormatter(Number(amount), 2)} has been sent to your bank account.
      </ThemedText>
      <BraneButton
        text="Done"
        onPress={() => router.push("/(tabs)/portfolio")}
        backgroundColor={C.primary}
        textColor="#D2F1E4"
        height={52}
        radius={12}
        width="80%"
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back
          onPress={() => {
            if (stage === "confirm") setStage("form");
            else router.back();
          }}
        />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          {stage === "success" ? "Done" : "Withdraw Funds"}
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {stage === "form" && renderForm()}
      {stage === "confirm" && renderConfirm()}
      {stage === "success" && renderSuccess()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 20, gap: 14 },
  balanceCard: {
    borderRadius: 14,
    padding: 20,
    gap: 6,
  },
  balanceLabelText: { fontSize: 12, color: "#D2F1E4" },
  balanceAmount: { fontSize: 28, fontWeight: "800", color: "#fff" },
  fieldLabel: { fontSize: 12, marginBottom: 4 },
  input: { height: 48, borderRadius: 8 },
  accountsList: { gap: 10 },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  accountInfo: { flex: 1, gap: 2 },
  accountBank: { fontSize: 14, fontWeight: "600" },
  accountNum: { fontSize: 12 },
  selectDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  addBankLink: { alignItems: "center", paddingVertical: 14 },
  addBankText: { fontSize: 13, fontWeight: "600" },
  footer: { paddingHorizontal: 16, paddingBottom: 16 },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 13, fontWeight: "600" },
  confirmButtons: { flexDirection: "row", gap: 12 },
  halfBtn: { flex: 1 },
  successWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  successTitle: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  successDesc: { fontSize: 13, textAlign: "center", lineHeight: 20 },
});
