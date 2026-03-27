import { StockInfoLineTwo } from "@/components";
import { BraneButton } from "@/components/brane-button";
import { Header } from "@/components/header";
import {
  PaymentMethodSelector,
  PaymentOption,
} from "@/components/payment-method-selector";
import StockBreakdownDetails from "@/components/portfolio/asset-card";
import { SuccessPage } from "@/components/success-page";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { onClearCheckouts } from "@/redux/slice/auth-slice";
import { useAppState } from "@/redux/store";
import { useReduxState } from "@/redux/useReduxState";
import BaseRequest, { parseNetworkError } from "@/services";
import { STOCKS_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import {
  collection,
  hideAppLoader,
  onShowInsufficientFunds,
  pluralize,
  priceFormatter,
  showAppLoader,
  showError,
  showSuccess,
} from "@/utils/helpers";
import { useRouter } from "expo-router";
import { CloseCircle } from "iconsax-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

type Scheme = "light" | "dark";

const Checkout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [render, setRender] = useReduxState("", "checkoutRender");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [message, setErrorMessage] = useState("");
  const { checkouts } = useAppState();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  // Fetch balances
  const { data: walletBalance = 0, isLoading: isLoadingWallet } = useRequest(
    TRANSACTION_SERVICE.BALANCE,
    { initialValue: 0, revalidateOnFocus: true, revalidateOnMount: true },
  );

  const [bracsBalance, setBracsBalance] = useState(0);
  const [isLoadingBracs, setIsLoadingBracs] = useState(true);

  const fetchBracsBalance = useCallback(async () => {
    setIsLoadingBracs(true);
    try {
      const res: any = await BaseRequest.get(STOCKS_SERVICE.BRAC_BALANCE);
      setBracsBalance(
        Number(
          res?.data?.balance || res?.balance || res?.data?.bracsBalance || 0,
        ),
      );
    } catch {
      setBracsBalance(0);
    } finally {
      setIsLoadingBracs(false);
    }
  }, []);

  useEffect(() => {
    fetchBracsBalance();
  }, [fetchBracsBalance]);

  const paymentOptions: PaymentOption[] = useMemo(
    () => [
      {
        id: "bracs",
        label: isLoadingBracs
          ? "Bracs Balance \u2013 \u2014"
          : `Bracs Balance \u2013 ${priceFormatter(bracsBalance, 2)}`,
        icon: "B",
      },
      {
        id: "brane_wallet",
        label: isLoadingWallet
          ? "Add From Wallet \u2013 \u2014"
          : `Add From Wallet \u2013 ${priceFormatter(walletBalance, 2)}`,
        icon: "B",
      },
    ],
    [bracsBalance, walletBalance, isLoadingBracs, isLoadingWallet],
  );

  const totalCharge = checkouts.reduce(
    (acc: any, curr: any) => acc + (curr.totalCharge || 0),
    0,
  );
  const netToBePaid = checkouts.reduce(
    (acc: any, curr: any) => acc + (curr.netPayable || 0),
    0,
  );

  // Handle Android back button — mirrors the web popstate listener
  useEffect(() => {
    const onBackPress = () => {
      if (render !== "") {
        setRender("");
        return true; // prevent default back
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [render, setRender]);

  const isDisabled = checkouts.length === 0 || paymentMethod === "";

  const onSubmit = async () => {
    try {
      showAppLoader({
        message: "Processing Transaction",
        style: { backgroundColor: "rgba(1, 61, 37, .60)" },
        textStyle: { color: "#FFFFFF" },
        spinnerColor: "#FFFFFF",
      });

      const { message }: any = await BaseRequest.post(STOCKS_SERVICE.BUY, {
        data: checkouts,
        netToBePaid,
        totalCharge,
        purchaseMode: paymentMethod.toUpperCase(),
      });

      dispatch(onClearCheckouts());
      showSuccess(message);
      setRender("success");
    } catch (err) {
      const { message: errMessage } = parseNetworkError(err);
      if (errMessage === "Insufficient wallet balance") {
        onShowInsufficientFunds();
      }
      setErrorMessage(errMessage);
      setRender("failed");
      showError(errMessage || "Something went wrong. Please try again.");
    } finally {
      hideAppLoader();
    }
  };

  // ── Render states ──────────────────────────────────────────

  if (render === "failed") {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: C.background }]}>
        <View style={styles.errorContent}>
          <CloseCircle size={80} color={C.error || "#CB010B"} variant='Bold' />
          <ThemedText style={[styles.errorTitle, { color: C.text }]}>
            Transaction Failed
          </ThemedText>
          <ThemedText style={[styles.errorText, { color: C.muted }]}>
            {message ||
              "Something went wrong while processing your transaction. Please try again."}
          </ThemedText>
          <View style={styles.errorBtnWrap}>
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
        </View>
      </SafeAreaView>
    );
  }

  // ── Main checkout screen ───────────────────────────────────

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <TransactionPinValidator
        visible={render === "validate-pin"}
        onClose={() => setRender("")}
        onTransactionPinValidated={onSubmit}
      />
      <SuccessPage
        visible={render === "success"}
        title='Stock Purchase Processing'
        text='Your order has been successfully submitted. See status update on the stock dashboard screen.'
        btnText='Dismiss'
        onBtnClick={() => {
          setRender("");
          router.push("/portfolio" as any);
        }}
      />
      <Header title='Asset Checkout' bgColor={C.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Horizontally scrollable checkout cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}
        >
          {collection(checkouts).map(
            ({
              tickerSymbol,
              quantity,
              brokerName,
              tenure,
              amount,
              name,
            }: any) => (
              <StockBreakdownDetails
                key={tickerSymbol}
                quantity={quantity}
                brokerName={brokerName}
                tickerSymbol={tickerSymbol}
                hasMore={checkouts?.length > 1}
                tenure={tenure}
                amount={amount}
                name={name}
              />
            ),
          )}
        </ScrollView>

        {/* Totals card */}
        <View style={styles.totalsCard}>
          <StockInfoLineTwo
            title='Net Total Charges'
            className={C.muted}
            value={priceFormatter(totalCharge, 2)}
          />
          <View style={styles.divider} />
          <StockInfoLineTwo
            title={
              <Text style={styles.netPaidLabel}>
                Net to be Paid on {pluralize(checkouts.length, "Asset")}
              </Text>
            }
            className={C.muted}
            value={priceFormatter(netToBePaid, 2)}
          />
        </View>

        {/* Payment method */}
        <View style={styles.paymentSection}>
          <PaymentMethodSelector
            options={paymentOptions}
            selectedId={paymentMethod}
            onSelect={setPaymentMethod}
            walletBalance={walletBalance}
            bracsBalance={bracsBalance}
            amount={netToBePaid}
            onFundWallet={() => router.push("/add-funds" as any)}
            isLoadingBalance={isLoadingWallet}
            isLoadingBracsBalance={isLoadingBracs}
          />
        </View>

        {/* Action button */}
        <View style={styles.actionsRow}>
          <BraneButton
            text='Confirm Payment'
            onPress={() => setRender("validate-pin")}
            disabled={isDisabled}
            backgroundColor={C.primary}
            textColor='#D2F1E4'
            height={48}
            radius={12}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Checkout;

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F7F7F8",
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
    gap: 12,
  },

  // Checkout cards horizontal scroll
  cardsRow: {
    paddingHorizontal: 16,
    gap: 16,
  },

  // Totals
  totalsCard: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#F7F7F8",
    marginVertical: 12,
  },
  netPaidLabel: {
    color: "#0B0014",
    fontSize: 12,
  },

  // Payment method
  paymentSection: {
    marginHorizontal: 16,
  },

  // Buttons
  actionsRow: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 50,
  },

  // Error view
  errorContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  errorBtnWrap: {
    width: "100%",
    marginTop: 32,
  },
});
