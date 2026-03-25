import { BraneButton } from "@/components/brane-button";
import { EmptyState } from "@/components/empty-state";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import { Colors } from "@/constants/colors";
import { type Scheme, MODAL_OVERLAY_COLOR } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import {
  hideAppLoader,
  priceFormatter,
  showAppLoader,
  showSuccess,
  toArray,
} from "@/utils/helpers";
import { Bank } from "iconsax-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type Stage = "choice" | "form" | "account" | "pin" | "success";
type WithdrawType = "wallet" | "dividend";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

interface WithdrawModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  walletChoiceLabel?: string;
  dividendChoiceLabel?: string;
  walletBalanceEndpoint?: string;
  dividendBalanceEndpoint?: string;
  walletBalanceTransform?: (res: any) => number;
  dividendBalanceTransform?: (res: any) => number;
  walletWithdrawEndpoint?: string;
  dividendWithdrawEndpoint?: string;
  loadingMessage?: string;
  successToastMessage?: string;
}

export function WithdrawModal({
  visible,
  onClose,
  title = "Withdraw",
  walletChoiceLabel = "Withdraw from wallet balance",
  dividendChoiceLabel = "Withdraw from total dividend",
  walletBalanceEndpoint = TRANSACTION_SERVICE.BALANCE,
  dividendBalanceEndpoint = STOCKS_SERVICE.WALLET_BALANCE,
  walletBalanceTransform,
  dividendBalanceTransform,
  walletWithdrawEndpoint = "/transactions-service/wallet/withdraw",
  dividendWithdrawEndpoint = "/stocks-service/wallet/withdraw-dividend",
  loadingMessage = "Processing withdrawal...",
  successToastMessage = "Withdrawal initiated successfully",
}: WithdrawModalProps) {
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [stage, setStage] = useState<Stage>("choice");
  const [withdrawType, setWithdrawType] = useState<WithdrawType>("wallet");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | undefined>();
  const [walletBalance, setWalletBalance] = useState(0);
  const [dividendBalance, setDividendBalance] = useState(0);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const fetchBalance = useCallback(async () => {
    setIsLoadingBalance(true);
    try {
      const [walletRes, dividendRes]: any[] = await Promise.all([
        BaseRequest.get(walletBalanceEndpoint),
        BaseRequest.get(dividendBalanceEndpoint),
      ]);
      setWalletBalance(
        walletBalanceTransform
          ? walletBalanceTransform(walletRes)
          : Number(walletRes?.data?.balance || walletRes?.balance || 0),
      );
      setDividendBalance(
        dividendBalanceTransform
          ? dividendBalanceTransform(dividendRes)
          : Number(
              dividendRes?.data?.dividendBalance ||
                dividendRes?.dividendBalance ||
                dividendRes?.data?.balance ||
                dividendRes?.balance ||
                0,
            ),
      );
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [
    dividendBalanceEndpoint,
    dividendBalanceTransform,
    walletBalanceEndpoint,
    walletBalanceTransform,
  ]);

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

  // Fetch balances when modal opens
  React.useEffect(() => {
    if (visible) {
      setStage("choice");
      setAmount("");
      setAmountError(undefined);
      setWithdrawType("wallet");
      fetchBalance();
    }
  }, [visible, fetchBalance]);

  const handleContinueForm = () => {
    const num = Number(amount);
    if (!amount || num <= 0) {
      setAmountError("Enter a valid amount");
      return;
    }
    if (num > currentBalance) {
      setAmountError("Insufficient balance");
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
    showAppLoader({ message: loadingMessage });
    try {
      const endpoint =
        withdrawType === "wallet"
          ? walletWithdrawEndpoint
          : dividendWithdrawEndpoint;

      await BaseRequest.post(endpoint, {
        amount: Number(amount),
        bankAccountId: selectedAccount?.id || selectedAccount?._id,
      });
      hideAppLoader();
      showSuccess(successToastMessage);
      setStage("success");
    } catch (error) {
      hideAppLoader();
      catchError(error);
    }
  };

  const handleClose = () => {
    setStage("choice");
    setAmount("");
    setAmountError(undefined);
    setSelectedAccount(null);
    setWithdrawType("wallet");
    onClose();
  };

  // Memoized helper to check if account is selected
  const isAccountSelected = useCallback(
    (item: any) => {
      return (
        selectedAccount?.id === item?.id || selectedAccount?._id === item?._id
      );
    },
    [selectedAccount?.id, selectedAccount?._id],
  );

  // Memoized preset button styles
  const getPresetButtonStyle = useCallback(
    (preset: number) => {
      return {
        backgroundColor:
          amount === String(preset) ? C.primary + "20" : C.inputBg,
        borderColor: amount === String(preset) ? C.primary : C.border,
      };
    },
    [amount, C.primary, C.inputBg, C.border],
  );

  const renderChoiceStage = () => (
    <View style={styles.choiceContainer}>
      <TouchableOpacity
        style={[
          styles.choiceCard,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
        onPress={() => {
          setWithdrawType("wallet");
          setStage("form");
        }}
      >
        <ThemedText style={[styles.choiceTitle, { color: C.text }]}>
          {walletChoiceLabel}
        </ThemedText>
        <ThemedText style={[styles.choiceAmount, { color: C.primary }]}>
          {priceFormatter(walletBalance, 2)}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.choiceCard,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
        onPress={() => {
          setWithdrawType("dividend");
          setStage("form");
        }}
      >
        <ThemedText style={[styles.choiceTitle, { color: C.text }]}>
          {dividendChoiceLabel}
        </ThemedText>
        <ThemedText style={[styles.choiceAmount, { color: C.primary }]}>
          {priceFormatter(dividendBalance, 2)}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  const currentBalance =
    withdrawType === "wallet" ? walletBalance : dividendBalance;

  const renderFormStage = () => (
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
            {withdrawType === "wallet"
              ? "Wallet Balance"
              : "Available Dividend Balance"}
          </ThemedText>
          {isLoadingBalance ? (
            <ActivityIndicator color={C.googleBg} size='small' />
          ) : (
            <ThemedText style={[styles.balanceValue, { color: C.googleBg }]}>
              {priceFormatter(currentBalance, 2)}
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
              style={[styles.presetBtn, getPresetButtonStyle(preset)]}
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

  const renderAccountStage = () => (
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
              <Bank size={40} color={C.muted} />
              <ThemedText
                style={{ color: C.muted, textAlign: "center", marginTop: 8 }}
              >
                No linked bank accounts found.
              </ThemedText>
            </EmptyState>
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
                  backgroundColor: isAccountSelected(item)
                    ? C.primary
                    : "transparent",
                }}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );

  const renderSuccessStage = () => (
    <View style={styles.successWrap}>
      <ThemedText style={[styles.successTitle, { color: C.text }]}>
        ✓ Withdrawal Successful
      </ThemedText>
      <ThemedText style={[styles.successDesc, { color: C.muted }]}>
        {priceFormatter(Number(amount), 2)} has been withdrawn to your bank
        account.
      </ThemedText>
      <BraneButton
        text='Done'
        onPress={handleClose}
        backgroundColor={C.primary}
        textColor={C.googleBg}
        height={52}
        radius={12}
        width='80%'
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.modalCard, { backgroundColor: C.background }]}
          onPress={() => {}}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ width: 44 }} />
            <ThemedText style={[styles.headerTitle, { color: C.text }]}>
              {stage === "success" ? "Done" : title}
            </ThemedText>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <ThemedText style={{ fontSize: 24, color: C.text }}>×</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {stage === "choice" && renderChoiceStage()}
          {stage === "form" && renderFormStage()}
          {stage === "account" && renderAccountStage()}
          {stage === "pin" && (
            <View style={styles.flex}>
              <View style={{ flex: 1 }} />
              <View style={styles.footer}>
                <BraneButton
                  text='Confirm with PIN'
                  onPress={() => setShowPin(true)}
                  backgroundColor={C.primary}
                  textColor={C.googleBg}
                  height={52}
                  radius={12}
                />
              </View>
            </View>
          )}
          {stage === "success" && renderSuccessStage()}

          {/* PIN Validator */}
          <TransactionPinValidator
            visible={showPin}
            onClose={() => setShowPin(false)}
            onTransactionPinValidated={handlePinValidated}
            onResetPin={() => {}}
            onValidatePin={async (pin) => {
              try {
                await BaseRequest.post(
                  "/auth-service/validate-transaction-pin",
                  {
                    pin,
                  },
                );
                return true;
              } catch {
                return false;
              }
            }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: MODAL_OVERLAY_COLOR,
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "95%",
    overflow: "hidden",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  flex: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
    paddingTop: 8,
  },
  balanceCard: {
    borderRadius: 14,
    padding: 20,
    gap: 6,
    marginBottom: 12,
    marginTop: 12,
  },
  balanceLabel: { fontSize: 12 },
  balanceValue: { fontSize: 28, fontWeight: "800" },
  fieldLabel: { fontSize: 12, marginBottom: 4, marginTop: 12 },
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
  footer: { paddingHorizontal: 16, paddingBottom: 20 },
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
  successWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  successTitle: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  successDesc: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  choiceContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: "center",
    gap: 16,
  },
  choiceCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    gap: 8,
  },
  choiceTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  choiceAmount: {
    fontSize: 18,
    fontWeight: "700",
  },
});
