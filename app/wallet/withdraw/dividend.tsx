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
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";
type Stage = "form" | "account" | "success";

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

export default function DividendWithdrawScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [stage, setStage] = useState<Stage>("form");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | undefined>();
  const [dividendBalance, setDividendBalance] = useState(0);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  const fetchDividendBalance = useCallback(async () => {
    setIsLoadingBalance(true);
    try {
      const res: any = await BaseRequest.get(STOCKS_SERVICE.WALLET_BALANCE);
      setDividendBalance(
        Number(
          res?.data?.dividendBalance ||
            res?.dividendBalance ||
            res?.data?.balance ||
            res?.balance ||
            0,
        ),
      );
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
    fetchDividendBalance();
  }, [fetchDividendBalance]);

  const handleContinueForm = () => {
    const num = Number(amount);
    if (!amount || num <= 0) {
      setAmountError("Enter a valid amount");
      return;
    }
    if (num > dividendBalance) {
      setAmountError("Insufficient dividend balance");
      return;
    }
    setAmountError(undefined);
    fetchAccounts();
    setStage("account");
  };

  const handleSubmit = async (account: any) => {
    showAppLoader({ message: "Processing dividend withdrawal..." });
    try {
      await BaseRequest.post("/stocks-service/wallet/withdraw-dividend", {
        amount: Number(amount),
        bankAccountId: account?.id || account?._id,
      });
      hideAppLoader();
      showSuccess("Dividend withdrawal initiated");
      setStage("success");
    } catch (error) {
      hideAppLoader();
      catchError(error);
    }
  };

  const renderStageForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{ ...styles.balanceCard, backgroundColor: C.primary }}>
          <ThemedText style={styles.balanceLabel}>
            Available Dividend Balance
          </ThemedText>
          {isLoadingBalance ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <ThemedText style={styles.balanceValue}>
              {priceFormatter(dividendBalance, 2)}
            </ThemedText>
          )}
        </View>

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

  const renderStageAccount = () => (
    <View style={styles.flex}>
      {isLoadingAccounts ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item, i) => String(item?.id || item?._id || i)}
          contentContainerStyle={styles.scrollContent}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <ThemedText style={[styles.emptyText, { color: C.muted }]}>
                No linked bank accounts found.
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.accountCard,
                { borderColor: C.border, backgroundColor: C.inputBg },
              ]}
              onPress={() => handleSubmit(item)}
            >
              <View style={styles.accountInfo}>
                <ThemedText style={[styles.accountBank, { color: C.text }]}>
                  {item?.bankName || item?.bank || "Bank"}
                </ThemedText>
                <ThemedText style={[styles.accountNum, { color: C.muted }]}>
                  {item?.accountNumber || item?.number || ""}
                </ThemedText>
                <ThemedText style={[styles.accountName, { color: C.muted }]}>
                  {item?.accountName || item?.name || ""}
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity
              onPress={() => router.push("/add-funds/bank")}
              style={styles.addBankLink}
            >
              <ThemedText style={[styles.addBankText, { color: C.primary }]}>
                + Add Bank Account
              </ThemedText>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );

  const renderStageSuccess = () => (
    <View style={styles.successWrap}>
      <TickCircle size={72} color="#013D25" variant="Bold" />
      <ThemedText style={[styles.successTitle, { color: C.text }]}>
        Withdrawal Successful
      </ThemedText>
      <ThemedText style={[styles.successDesc, { color: C.muted }]}>
        You&apos;ve successfully withdrawn {priceFormatter(Number(amount), 2)}{" "}
        in dividends to your bank account.
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
            if (stage === "account") setStage("form");
            else router.back();
          }}
        />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          {stage === "success" ? "Done" : "Dividend Withdrawal"}
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {stage === "form" && renderStageForm()}
      {stage === "account" && renderStageAccount()}
      {stage === "success" && renderStageSuccess()}
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
  scrollContent: { paddingHorizontal: 16, paddingBottom: 20, gap: 12 },
  balanceCard: {
    borderRadius: 14,
    padding: 20,
    gap: 6,
    marginBottom: 4,
  },
  balanceLabel: { fontSize: 12, color: "#D2F1E4" },
  balanceValue: { fontSize: 28, fontWeight: "800", color: "#fff" },
  fieldLabel: { fontSize: 12, marginBottom: 4 },
  input: { height: 48, borderRadius: 8 },
  footer: { paddingHorizontal: 16, paddingBottom: 16 },
  loaderWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  accountInfo: { flex: 1, gap: 2 },
  accountBank: { fontSize: 14, fontWeight: "600" },
  accountNum: { fontSize: 12 },
  accountName: { fontSize: 11 },
  addBankLink: { alignItems: "center", paddingVertical: 14 },
  addBankText: { fontSize: 13, fontWeight: "600" },
  emptyWrap: { alignItems: "center", paddingTop: 40 },
  emptyText: { fontSize: 14 },
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
