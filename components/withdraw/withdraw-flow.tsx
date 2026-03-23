import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { EmptyState } from "@/components/empty-state";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import { Colors } from "@/constants/colors";
import { type Scheme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { AUTH_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import {
  hideAppLoader,
  priceFormatter,
  showAppLoader,
  showSuccess,
  toArray,
} from "@/utils/helpers";
import { useRouter } from "expo-router";
import { Bank, TickCircle } from "iconsax-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Stage = "form" | "account" | "pin" | "success";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

export interface WithdrawFlowProps {
  title: string;
  balanceLabel: string;
  balanceEndpoint: string;
  withdrawEndpoint: string;
  balanceTransform?: (res: any) => number;
  loadingMessage?: string;
  successToastMessage?: string;
  successTitle?: string;
  successCtaText?: string;
  successRoute?: string;
  insufficientBalanceMessage?: string;
  requiresPin?: boolean;
  accountPayloadKey?: string;
  accountValueResolver?: (account: any) => string | number | undefined;
}

const defaultBalanceTransform = (res: any) =>
  Number(res?.data?.balance ?? res?.balance ?? 0);

export default function WithdrawFlow({
  title,
  balanceLabel,
  balanceEndpoint,
  withdrawEndpoint,
  balanceTransform = defaultBalanceTransform,
  loadingMessage = "Processing withdrawal...",
  successToastMessage = "Withdrawal initiated successfully",
  successTitle = "Withdrawal Successful",
  successCtaText = "Done",
  successRoute = "/(tabs)",
  insufficientBalanceMessage = "Insufficient balance",
  requiresPin = false,
  accountPayloadKey = "bankAccountId",
  accountValueResolver = (account: any) => account?.id || account?._id,
}: WithdrawFlowProps) {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [stage, setStage] = useState<Stage>("form");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | undefined>();
  const [accountError, setAccountError] = useState<string | undefined>();
  const [balance, setBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const fetchBalance = useCallback(async () => {
    setIsLoadingBalance(true);
    try {
      const res: any = await BaseRequest.get(balanceEndpoint);
      setBalance(balanceTransform(res));
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [balanceEndpoint, balanceTransform]);

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

  const parsedAmount = useMemo(() => Number(amount || 0), [amount]);

  const handleContinueForm = () => {
    if (!amount || parsedAmount <= 0) {
      setAmountError("Enter a valid amount");
      return;
    }
    if (parsedAmount > balance) {
      setAmountError(insufficientBalanceMessage);
      return;
    }
    setAmountError(undefined);
    fetchAccounts();
    setStage("account");
  };

  const canContinueForm = !!amount && parsedAmount > 0;

  const submitWithdraw = useCallback(async () => {
    if (!selectedAccount) {
      setAccountError("Please select a destination bank account");
      return;
    }

    setAccountError(undefined);
    setIsSubmitting(true);
    showAppLoader({ message: loadingMessage });
    try {
      const accountValue = accountValueResolver(selectedAccount);

      await BaseRequest.post(withdrawEndpoint, {
        amount: parsedAmount,
        [accountPayloadKey]: accountValue,
      });

      hideAppLoader();
      showSuccess(successToastMessage);
      setStage("success");
    } catch (error) {
      hideAppLoader();
      catchError(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    loadingMessage,
    parsedAmount,
    selectedAccount,
    successToastMessage,
    withdrawEndpoint,
  ]);

  const handleContinueAccount = () => {
    if (!selectedAccount) {
      setAccountError("Please select a destination bank account");
      return;
    }

    if (requiresPin) {
      setStage("pin");
      return;
    }

    submitWithdraw();
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
        <View style={{ ...styles.balanceCard, backgroundColor: C.primary }}>
          <ThemedText style={[styles.balanceLabel, { color: C.googleBg }]}>
            {balanceLabel}
          </ThemedText>
          {isLoadingBalance ? (
            <ActivityIndicator color={C.googleBg} size='small' />
          ) : (
            <ThemedText style={styles.balanceValue}>
              {priceFormatter(balance, 2)}
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
                    amount === String(preset) ? `${C.primary}20` : C.inputBg,
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
          disabled={!canContinueForm}
          backgroundColor={C.primary}
          textColor={C.googleBg}
          height={52}
          radius={12}
        />
      </View>
    </KeyboardAvoidingView>
  );

  const renderAccount = () => (
    <View style={styles.flex}>
      {isLoadingAccounts ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={C.primary} size='small' />
        </View>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item, i) => String(item?.id || item?._id || i)}
          contentContainerStyle={styles.scrollContent}
          ListEmptyComponent={
            <EmptyState>
              <Bank size={38} color={C.muted} />
              <ThemedText
                style={{ color: C.muted, textAlign: "center", marginTop: 8 }}
              >
                No linked bank accounts found.
              </ThemedText>
            </EmptyState>
          }
          renderItem={({ item }) => {
            const isSelected =
              selectedAccount?.id === item?.id ||
              selectedAccount?._id === item?._id;

            return (
              <TouchableOpacity
                style={[
                  styles.accountCard,
                  {
                    borderColor: isSelected ? C.primary : C.border,
                    backgroundColor: C.inputBg,
                  },
                ]}
                onPress={() => {
                  setSelectedAccount(item);
                  setAccountError(undefined);
                }}
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
                    backgroundColor: isSelected ? C.primary : "transparent",
                  }}
                />
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={
            <>
              {!!accountError && (
                <ThemedText style={[styles.accountError, { color: C.error }]}>
                  {accountError}
                </ThemedText>
              )}
              <TouchableOpacity
                onPress={() => router.push("/add-funds/bank")}
                style={styles.addBankLink}
              >
                <ThemedText style={[styles.addBankText, { color: C.primary }]}>
                  + Add Bank Account
                </ThemedText>
              </TouchableOpacity>
              <BraneButton
                text={requiresPin ? "Continue" : "Withdraw"}
                onPress={handleContinueAccount}
                disabled={!selectedAccount}
                loading={isSubmitting}
                backgroundColor={C.primary}
                textColor={C.googleBg}
                height={52}
                radius={12}
              />
            </>
          }
        />
      )}
    </View>
  );

  const renderPin = () => (
    <View style={styles.pinWrap}>
      <BraneButton
        text='Confirm with PIN'
        onPress={() => setShowPin(true)}
        backgroundColor={C.primary}
        textColor={C.googleBg}
        height={52}
        radius={12}
        width='80%'
      />
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.successWrap}>
      <TickCircle size={72} color={C.primary} variant='Bold' />
      <ThemedText style={[styles.successTitle, { color: C.text }]}>
        {successTitle}
      </ThemedText>
      <ThemedText style={[styles.successDesc, { color: C.muted }]}>
        You&apos;ve successfully withdrawn {priceFormatter(parsedAmount, 2)} to
        your bank account.
      </ThemedText>
      <BraneButton
        text={successCtaText}
        onPress={() => router.push(successRoute as any)}
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
            else if (stage === "success") router.push(successRoute as any);
            else router.back();
          }}
        />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          {stage === "success" ? "Done" : title}
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {stage === "form" && renderForm()}
      {stage === "account" && renderAccount()}
      {stage === "pin" && renderPin()}
      {stage === "success" && renderSuccess()}

      <TransactionPinValidator
        visible={showPin}
        onClose={() => setShowPin(false)}
        onTransactionPinValidated={submitWithdraw}
        onResetPin={() => router.push("/account/reset-transaction-pin")}
        onValidatePin={async (pin) => {
          try {
            await BaseRequest.post(AUTH_SERVICE.PIN_VALIDATION, { pin });
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
  balanceLabel: { fontSize: 12 },
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
    width: 18,
    height: 18,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  accountError: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  addBankLink: { alignItems: "center", paddingVertical: 14 },
  addBankText: { fontSize: 13, fontWeight: "600" },
  pinWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
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
