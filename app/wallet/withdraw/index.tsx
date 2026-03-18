import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
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
type Stage = "form" | "account" | "pin" | "success";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

export default function WalletWithdrawScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [stage, setStage] = useState<Stage>("form");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | undefined>();
  const [walletBalance, setWalletBalance] = useState(0);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const fetchBalance = useCallback(async () => {
    setIsLoadingBalance(true);
    try {
      const res: any = await BaseRequest.get(TRANSACTION_SERVICE.BALANCE);
      setWalletBalance(Number(res?.data?.balance || res?.balance || 0));
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
    fetchBalance();
  }, [fetchBalance]);

  const handleContinueForm = () => {
    const num = Number(amount);
    if (!amount || num <= 0) {
      setAmountError("Enter a valid amount");
      return;
    }
    if (num > walletBalance) {
      setAmountError("Insufficient wallet balance");
      return;
    }
    setAmountError(undefined);
    fetchAccounts();
    setStage("account");
  };

  const handleSelectAccount = (account: any) => {
    setSelectedAccount(account);
    setStage("pin");
  };

  const handlePinValidated = async () => {
    setShowPin(false);
    showAppLoader({ message: "Processing withdrawal..." });
    try {
      await BaseRequest.post("/transactions-service/wallet/withdraw", {
        amount: Number(amount),
        bankAccountId: selectedAccount?.id || selectedAccount?._id,
      });
      hideAppLoader();
      showSuccess("Withdrawal initiated successfully");
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
          <ThemedText style={styles.balanceLabel}>Wallet Balance</ThemedText>
          {isLoadingBalance ? (
            <ActivityIndicator color={C.background} size='small' />
          ) : (
            <ThemedText style={styles.balanceValue}>
              {priceFormatter(walletBalance, 2)}
            </ThemedText>
          )}
        </View>

        <ThemedText style={[styles.fieldLabel, { color: C.muted }]}>
          Amount to Withdraw
        </ThemedText>
        <View style={styles.presetsRow}>
          {PRESET_AMOUNTS.map((preset) => (
            <TouchableOpacity
              key={preset}
              style={[
                styles.presetBtn,
                {
                  backgroundColor:
                    amount === String(preset) ? C.primary + "20" : C.inputBg,
                  borderColor: amount === String(preset) ? C.primary : C.border,
                },
              ]}
              onPress={() => {
                setAmount(String(preset));
                setAmountError(undefined);
              }}
            >
              <ThemedText style={[styles.presetText, { color: C.text }]}>
                ₦{preset.toLocaleString()}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <FormInput
          placeholder='Enter amount'
          keyboardType='number-pad'
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
          text='Continue'
          onPress={handleContinueForm}
          backgroundColor={C.primary}
          textColor={C.googleBg}
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
              onPress={() => handleSelectAccount(item)}
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
      <TickCircle size={72} color={C.primary} variant='Bold' />
      <ThemedText style={[styles.successTitle, { color: C.text }]}>
        Withdrawal Successful
      </ThemedText>
      <ThemedText style={[styles.successDesc, { color: C.muted }]}>
        You&apos;ve successfully withdrawn {priceFormatter(Number(amount), 2)}{" "}
        to your bank account.
      </ThemedText>
      <BraneButton
        text='Go Home'
        onPress={() => router.push("/(tabs)")}
        backgroundColor={C.primary}
        textColor={C.googleBg}
        height={52}
        radius={12}
        width='80%'
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back
          onPress={() => {
            if (stage === "account") setStage("form");
            else if (stage === "pin") setStage("account");
            else router.back();
          }}
        />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          {stage === "success" ? "Done" : "Withdraw"}
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {stage === "form" && renderStageForm()}
      {stage === "account" && renderStageAccount()}
      {stage === "pin" && (
        <View style={styles.flex}>
          <BraneButton
            text='Confirm with PIN'
            onPress={() => setShowPin(true)}
            backgroundColor={C.primary}
            textColor={C.googleBg}
            height={52}
            radius={12}
            style={styles.pinTriggerBtn}
          />
        </View>
      )}
      {stage === "success" && renderStageSuccess()}

      <TransactionPinValidator
        visible={showPin}
        onClose={() => {
          setShowPin(false);
          setStage("account");
        }}
        onTransactionPinValidated={handlePinValidated}
        onResetPin={() => router.push("/account/reset-transaction-pin")}
        onValidatePin={async (pin) => {
          try {
            await BaseRequest.post("/auth-service/validate-transaction-pin", {
              transactionPin: pin,
            });
            return true;
          } catch {
            return false;
          }
        }}
      />
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
  presetsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  presetText: { fontSize: 12, fontWeight: "500" },
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
  selectDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  addBankLink: { alignItems: "center", paddingVertical: 14 },
  addBankText: { fontSize: 13, fontWeight: "600" },
  emptyWrap: { alignItems: "center", paddingTop: 40 },
  emptyText: { fontSize: 14 },
  pinTriggerBtn: { margin: 16 },
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
