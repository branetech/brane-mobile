import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import {
  AUTH_SERVICE,
  STOCKS_SERVICE,
  TRANSACTION_SERVICE,
} from "@/services/routes";
import {
  hideAppLoader,
  priceFormatter,
  showAppLoader,
  showSuccess,
} from "@/utils/helpers";
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
  View,
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
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const fetchDividendBalance = useCallback(async () => {
    setIsLoadingBalance(true);
    try {
      const res: any = await BaseRequest.get(STOCKS_SERVICE.WALLET_BALANCE);
      setDividendBalance(
        Number(
          res?.data?.dividendBalance ??
            res?.dividendBalance ??
            res?.data?.balance ??
            res?.balance ??
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

  const onPinValidated = async () => {
    setShowPin(false);
    showAppLoader({ message: "Processing dividend withdrawal..." });
    try {
      const res: any = await BaseRequest.post(
        "/stocks-service/wallet/withdraw",
        {
          amount: Number(amount),
          accountNumber: selectedAccount?.accountNumber,
        },
      );
      showSuccess(res?.message ?? "Dividend withdrawal successful");
      setStage("success");
    } catch (error) {
      catchError(error);
    } finally {
      hideAppLoader();
    }
  };

  // ─ Stage: form ──────────────────────────────────────────────────────────────
  if (stage === "form") {
    return (
      <SafeAreaView style={[s.screen, { backgroundColor: C.background }]}>
        <View style={s.header}>
          <Back onPress={() => router.back()} />
          <ThemedText type='subtitle'>Dividend Withdraw</ThemedText>
          <View style={{ width: 44 }} />
        </View>
        <KeyboardAvoidingView
          style={s.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={s.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
          >
            <ThemedText style={[s.balanceHint, { color: C.muted }]}>
              Dividend balance:{" "}
              {isLoadingBalance ? "..." : priceFormatter(dividendBalance, 2)}
            </ThemedText>

            <FormInput
              placeholder='Amount'
              keyboardType='number-pad'
              value={amount}
              onChangeText={(t) => {
                setAmount(t);
                setAmountError(undefined);
              }}
              error={amountError}
              inputContainerStyle={{ height: 52, borderRadius: 10 }}
            />

            <BraneButton
              text='Continue'
              onPress={handleContinueForm}
              backgroundColor={C.primary}
              textColor='#D2F1E4'
              height={52}
              radius={12}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ─ Stage: account ───────────────────────────────────────────────────────────
  if (stage === "account") {
    return (
      <SafeAreaView style={[s.screen, { backgroundColor: C.background }]}>
        <View style={s.header}>
          <Back onPress={() => setStage("form")} />
          <ThemedText type='subtitle'>Select Account</ThemedText>
          <View style={{ width: 44 }} />
        </View>

        {isLoadingAccounts ? (
          <ActivityIndicator
            style={{ marginTop: 40 }}
            size='large'
            color={C.primary}
          />
        ) : (
          <FlatList
            data={accounts}
            keyExtractor={(item, i) =>
              String(item?.id ?? item?.accountNumber ?? i)
            }
            contentContainerStyle={s.content}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <ThemedText
                style={{ color: C.muted, textAlign: "center", marginTop: 40 }}
              >
                No saved accounts. Add a bank account first.
              </ThemedText>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  s.accountRow,
                  {
                    backgroundColor:
                      selectedAccount?.accountNumber === item?.accountNumber
                        ? C.primary + "18"
                        : C.inputBg,
                    borderColor:
                      selectedAccount?.accountNumber === item?.accountNumber
                        ? C.primary
                        : C.border,
                  },
                ]}
                onPress={() => setSelectedAccount(item)}
                activeOpacity={0.7}
              >
                <View style={s.accountInfo}>
                  <ThemedText
                    type='defaultSemiBold'
                    style={{ color: C.text, fontSize: 14 }}
                  >
                    {item?.accountName ?? item?.bankName ?? "Account"}
                  </ThemedText>
                  <ThemedText
                    style={{ color: C.muted, fontSize: 12, marginTop: 2 }}
                  >
                    {item?.accountNumber} • {item?.bankName ?? ""}
                  </ThemedText>
                </View>
                {selectedAccount?.accountNumber === item?.accountNumber && (
                  <TickCircle size={22} color={C.primary} variant='Bold' />
                )}
              </TouchableOpacity>
            )}
            ListFooterComponent={
              selectedAccount ? (
                <BraneButton
                  text={`Withdraw ${priceFormatter(Number(amount), 2)}`}
                  onPress={() => setShowPin(true)}
                  backgroundColor={C.primary}
                  textColor='#D2F1E4'
                  height={52}
                  radius={12}
                />
              ) : null
            }
          />
        )}

        <TransactionPinValidator
          visible={showPin}
          onClose={() => setShowPin(false)}
          onTransactionPinValidated={onPinValidated}
          onResetPin={() =>
            router.push("/account/reset-transaction-pin" as any)
          }
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

  // ─ Stage: success ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView
      style={[s.screen, s.successWrapper, { backgroundColor: C.background }]}
    >
      <View style={[s.successCard, { backgroundColor: C.inputBg }]}>
        <TickCircle size={64} color={C.primary} variant='Bold' />
        <ThemedText
          type='subtitle'
          style={{ color: C.text, marginTop: 16, textAlign: "center" }}
        >
          Withdrawal Successful
        </ThemedText>
        <ThemedText
          style={{
            color: C.muted,
            textAlign: "center",
            marginTop: 8,
            fontSize: 14,
            lineHeight: 22,
          }}
        >
          {priceFormatter(Number(amount), 2)} dividend has been sent to{"\n"}
          {selectedAccount?.accountName ?? "your account"}.
        </ThemedText>
        <BraneButton
          text='Done'
          onPress={() => router.replace("/wallet" as any)}
          backgroundColor={C.primary}
          textColor='#D2F1E4'
          height={52}
          radius={12}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  balanceHint: { fontSize: 13, textAlign: "right" },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  accountInfo: { flex: 1 },
  successWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  successCard: {
    width: "100%",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    gap: 0,
  },
});
