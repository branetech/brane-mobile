import Back from "@/components/back";
import { KycGate } from "@/components/kyc-gate";
import { BraneButton } from "@/components/brane-button";
import {
  PaymentMethodSelector,
  type PaymentOption,
} from "@/components/payment-method-selector";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  onClearCheckouts,
  onRemoveFromCheckouts,
} from "@/redux/slice/auth-slice";
import { useAppState } from "@/redux/store";
import { useReduxState } from "@/redux/useReduxState";
import BaseRequest, { parseNetworkError } from "@/services";
import { AUTH_SERVICE, STOCKS_SERVICE } from "@/services/routes";
import {
  hideAppLoader,
  onShowInsufficientFunds,
  pluralize,
  priceFormatter,
  showAppLoader,
  showError,
  showSuccess,
} from "@/utils/helpers";
import { useRouter } from "expo-router";
import { Add, CloseCircle } from "iconsax-react-native";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

type Scheme = "light" | "dark";

type CheckoutStage = "" | "validate-pin" | "success" | "failed";

type CheckoutItem = {
  tickerSymbol: string;
  quantity: number;
  assetClass?: string;
  netPayable?: number;
  totalCharge?: number;
  companyName?: string;
};

export default function CheckoutScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [render, setRender] = useReduxState<CheckoutStage>(
    "",
    "checkoutRender",
  );
  const [paymentMethod, setPaymentMethod] = useState("");
  const [message, setErrorMessage] = useState("");

  const { checkouts, wallet, user } = useAppState("auth") || {};

  const isKycCompleted =
    user?.hasName && user?.identityKyc && user?.hasNextOfKin;
  const [showKycModal, setShowKycModal] = useState<boolean>(!isKycCompleted);
  const checkoutItems: CheckoutItem[] = useMemo(
    () => (Array.isArray(checkouts) ? checkouts : []),
    [checkouts],
  );

  const totalCharge = useMemo(
    () =>
      checkoutItems.reduce(
        (acc, curr) => acc + (Number(curr.totalCharge) || 0),
        0,
      ),
    [checkoutItems],
  );

  const netToBePaid = useMemo(
    () =>
      checkoutItems.reduce(
        (acc, curr) => acc + (Number(curr.netPayable) || 0),
        0,
      ),
    [checkoutItems],
  );

  const paymentOptions: PaymentOption[] = useMemo(
    () => [
      { id: "wallet", label: "Brane Wallet", icon: "W" },
      { id: "bracs", label: "Bracs", icon: "B" },
    ],
    [],
  );

  const walletBalance = Number(
    wallet?.balance ?? wallet?.availableBalance ?? 0,
  );
  const isDisabled = checkoutItems.length === 0 || paymentMethod === "";

  const onSubmit = async () => {
    try {
      showAppLoader({
        message: "Processing Transaction",
        style: { backgroundColor: "rgba(1, 61, 37, 0.60)" },
        textStyle: { color: "#FFFFFF" },
        spinnerColor: "#FFFFFF",
      });

      const response: any = await BaseRequest.post(STOCKS_SERVICE.BUY, {
        data: checkoutItems,
        netToBePaid,
        totalCharge,
        purchaseMode: paymentMethod.toUpperCase(),
      });

      dispatch(onClearCheckouts());
      showSuccess(response?.message || "Transaction submitted successfully");
      setRender("success");
    } catch (err) {
      const { message: parsedMessage } = parseNetworkError(err);
      const nextMessage =
        parsedMessage || "Something went wrong. Please try again.";

      if (nextMessage === "Insufficient wallet balance") {
        onShowInsufficientFunds();
      }

      setErrorMessage(nextMessage);
      setRender("failed");
      showError(nextMessage);
    } finally {
      hideAppLoader();
    }
  };

  if (render === "failed") {
    return (
      <SafeAreaView
        style={[styles.centeredScreen, { backgroundColor: C.background }]}
      >
        <View
          style={[
            styles.statusCard,
            { backgroundColor: C.inputBackground, borderColor: C.border },
          ]}
        >
          <ThemedText type='title' style={{ color: C.text }}>
            Transaction Failed
          </ThemedText>
          <ThemedText style={[styles.statusText, { color: C.muted }]}>
            {message ||
              "Something went wrong while processing your transaction."}
          </ThemedText>
          <BraneButton
            text='Dismiss'
            onPress={() => {
              setRender("");
              setErrorMessage("");
            }}
            backgroundColor={C.primary}
            textColor='#D2F1E4'
            height={52}
            radius={12}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (render === "success") {
    return (
      <SafeAreaView
        style={[styles.centeredScreen, { backgroundColor: C.background }]}
      >
        <View
          style={[
            styles.statusCard,
            { backgroundColor: C.inputBackground, borderColor: C.border },
          ]}
        >
          <ThemedText type='title' style={{ color: C.text }}>
            Stock Purchase Processing
          </ThemedText>
          <ThemedText style={[styles.statusText, { color: C.muted }]}>
            Your order has been successfully submitted. See status updates on
            the stock dashboard.
          </ThemedText>
          <BraneButton
            text='Done'
            onPress={() => {
              setRender("");
              router.push("/(tabs)/(portfolio)" as any);
            }}
            backgroundColor={C.primary}
            textColor='#D2F1E4'
            height={52}
            radius={12}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.headerRow}>
          <Back onPress={() => router.back()} />
          <ThemedText style={[styles.headerTitle, { color: C.text }]}>
            Asset Checkout
          </ThemedText>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: C.inputBackground, borderColor: C.border },
            ]}
          >
            <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
              Selected Assets
            </ThemedText>

            {checkoutItems.length === 0 ? (
              <ThemedText style={[styles.emptyText, { color: C.muted }]}>
                No assets in checkout.
              </ThemedText>
            ) : (
              checkoutItems.map((item) => (
                <View
                  key={item.tickerSymbol}
                  style={[styles.assetRow, { borderBottomColor: C.border }]}
                >
                  <View style={{ flex: 1 }}>
                    <ThemedText
                      type='defaultSemiBold'
                      style={{ color: C.text }}
                    >
                      {item.tickerSymbol?.toUpperCase() ||
                        item.companyName ||
                        "Asset"}
                    </ThemedText>
                    <ThemedText style={[styles.assetMeta, { color: C.muted }]}>
                      Qty: {item.quantity || 0} | {item.assetClass || "stocks"}
                    </ThemedText>
                    <ThemedText style={[styles.assetValue, { color: C.text }]}>
                      {priceFormatter(Number(item.netPayable || 0), 2)}
                    </ThemedText>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      dispatch(onRemoveFromCheckouts(item.tickerSymbol))
                    }
                    activeOpacity={0.7}
                    style={{ paddingLeft: 12, paddingVertical: 6 }}
                  >
                    <CloseCircle size={20} color={C.error} variant='Bold' />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          <View
            style={[
              styles.sectionCard,
              { backgroundColor: C.inputBackground, borderColor: C.border },
            ]}
          >
            <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
              Summary
            </ThemedText>

            <View style={styles.summaryRow}>
              <ThemedText style={[styles.summaryLabel, { color: C.muted }]}>
                Net Total Charges
              </ThemedText>
              <ThemedText style={[styles.summaryValue, { color: C.text }]}>
                {priceFormatter(totalCharge, 2)}
              </ThemedText>
            </View>

            <View style={[styles.divider, { backgroundColor: C.border }]} />

            <View style={styles.summaryRow}>
              <ThemedText type='defaultSemiBold' style={{ color: C.primary }}>
                Net to be Paid on {pluralize(checkoutItems.length, "Asset")}
              </ThemedText>
              <ThemedText type='defaultSemiBold' style={{ color: C.text }}>
                {priceFormatter(netToBePaid, 2)}
              </ThemedText>
            </View>
          </View>

          <PaymentMethodSelector
            options={paymentOptions}
            selectedId={paymentMethod}
            onSelect={setPaymentMethod}
            amount={netToBePaid}
            walletBalance={walletBalance}
            onFundWallet={() => router.push("/add-funds" as any)}
          />
        </ScrollView>

        <View
          style={[
            styles.footer,
            { borderTopColor: C.border, backgroundColor: C.background },
          ]}
        >
          <BraneButton
            text='Add'
            onPress={() => router.back()}
            backgroundColor={C.background}
            textColor={C.primary}
            rightIcon={<Add size={16} color={C.primary} />}
            height={52}
            radius={12}
            style={{ borderWidth: 1, borderColor: "#D3EBE1", flex: 0.35 }}
          />

          <BraneButton
            text='Checkout'
            onPress={() => setRender("validate-pin")}
            disabled={isDisabled}
            backgroundColor={C.primary}
            textColor='#D2F1E4'
            height={52}
            radius={12}
            style={{ flex: 0.65 }}
          />
        </View>

        <TransactionPinValidator
          visible={render === "validate-pin"}
          onClose={() => setRender("")}
          onTransactionPinValidated={onSubmit}
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
      </KeyboardAvoidingView>

      <KycGate
        visible={showKycModal}
        onClose={() => {
          setShowKycModal(false);
          router.back();
        }}
        message='Please complete your KYC to proceed to checkout.'
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredScreen: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  statusCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  statusText: {
    fontSize: 14,
    lineHeight: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 14,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
  },
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  assetMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  assetValue: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
});
