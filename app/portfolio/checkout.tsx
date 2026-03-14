import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import {
    PaymentMethodSelector,
    type PaymentOption,
} from "@/components/payment-method-selector";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE } from "@/services/routes";
import {
    hideAppLoader,
    priceFormatter,
    showAppLoader,
    showError,
} from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TickCircle } from "iconsax-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Stage = "form" | "preview" | "pin" | "success";
type Scheme = "light" | "dark";

export default function CheckoutScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const params = useLocalSearchParams();
  const ticker = String(params.ticker || "");
  const companyName = String(params.companyName || ticker);

  const [stage, setStage] = useState<Stage>("form");
  const [quantity, setQuantity] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [stockData, setStockData] = useState<any>(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState("wallet");
  const [walletBalance, setWalletBalance] = useState(0);
  const [pinVisible, setPinVisible] = useState(false);

  const total = currentPrice * Number(quantity || 0);

  const paymentOptions: PaymentOption[] = [
    {
      id: "wallet",
      label: `Wallet Balance - ${priceFormatter(walletBalance, 2)}`,
      icon: "₦",
    },
  ];

  const fetchStockAndBalance = useCallback(async () => {
    if (!ticker) return;
    setIsFetchingPrice(true);
    try {
      const [stockRes, balanceRes]: any[] = await Promise.allSettled([
        BaseRequest.get(STOCKS_SERVICE.DETAILS(ticker)),
        BaseRequest.get(STOCKS_SERVICE.WALLET_BALANCE),
      ]);
      const stockData =
        stockRes.status === "fulfilled"
          ? stockRes.value?.data || stockRes.value
          : null;
      if (stockData) {
        setStockData(stockData);
        setCurrentPrice(
          Number(stockData?.currentPrice || stockData?.price || 0),
        );
      }
      if (balanceRes.status === "fulfilled") {
        const bal = balanceRes.value?.data || balanceRes.value;
        setWalletBalance(Number(bal?.balance || bal?.availableBalance || 0));
      }
    } catch (error) {
      catchError(error);
    } finally {
      setIsFetchingPrice(false);
    }
  }, [ticker]);

  useEffect(() => {
    fetchStockAndBalance();
  }, [fetchStockAndBalance]);

  const handleContinue = () => {
    if (!quantity || Number(quantity) <= 0) {
      showError("Please enter a valid quantity");
      return;
    }
    setStage("preview");
  };

  const handleSubmit = async () => {
    setPinVisible(false);
    showAppLoader({ message: "Processing purchase..." });
    try {
      await BaseRequest.post(STOCKS_SERVICE.BUY, {
        tickerSymbol: ticker,
        quantity: Number(quantity),
        amount: total,
        paymentMethod: paymentMethodId,
      });
      setStage("success");
    } catch (error) {
      catchError(error);
    } finally {
      hideAppLoader();
    }
  };

  const renderForm = () => (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            ...StyleSheet.flatten(styles.infoCard),
            borderColor: C.border,
          }}
        >
          <ThemedText style={[styles.label, { color: C.muted }]}>
            Company
          </ThemedText>
          <ThemedText style={[styles.value, { color: C.text }]}>
            {companyName || stockData?.name || ticker}
          </ThemedText>
          <ThemedText style={[styles.label, { color: C.muted, marginTop: 8 }]}>
            Current Price
          </ThemedText>
          {isFetchingPrice ? (
            <ActivityIndicator size="small" color={C.primary} />
          ) : (
            <ThemedText style={[styles.value, { color: C.text }]}>
              {priceFormatter(currentPrice, 2)}
            </ThemedText>
          )}
        </View>

        <FormInput
          labelText="Quantity"
          placeholder="Enter number of units"
          value={quantity}
          onChangeText={(v) => setQuantity(v.replace(/\D/g, ""))}
          keyboardType="numeric"
        />

        {Number(quantity) > 0 && (
          <View
            style={{
              ...StyleSheet.flatten(styles.totalCard),
              borderColor: C.border,
            }}
          >
            <ThemedText style={[styles.totalLabel, { color: C.muted }]}>
              Total Amount
            </ThemedText>
            <ThemedText style={[styles.totalValue, { color: C.primary }]}>
              {priceFormatter(total, 2)}
            </ThemedText>
          </View>
        )}

        <PaymentMethodSelector
          options={paymentOptions}
          selectedId={paymentMethodId}
          onSelect={setPaymentMethodId}
        />

        <BraneButton
          text="Continue"
          onPress={handleContinue}
          backgroundColor={C.primary}
          textColor="#D2F1E4"
          height={52}
          radius={12}
          width="100%"
          disabled={!quantity || Number(quantity) <= 0}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderPreview = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View
        style={{ ...StyleSheet.flatten(styles.card), borderColor: C.border }}
      >
        <PreviewRow
          label="Stock"
          value={companyName || stockData?.name || ticker}
          C={C}
        />
        <PreviewRow label="Ticker" value={ticker.toUpperCase()} C={C} />
        <PreviewRow label="Quantity" value={`${quantity} units`} C={C} />
        <PreviewRow
          label="Price per Unit"
          value={priceFormatter(currentPrice, 2)}
          C={C}
        />
        <PreviewRow
          label="Total Amount"
          value={priceFormatter(total, 2)}
          C={C}
          highlighted
        />
        <PreviewRow
          label="Payment Method"
          value={
            paymentOptions.find((o) => o.id === paymentMethodId)?.label ||
            paymentMethodId
          }
          C={C}
        />
      </View>

      <View style={{ gap: 12 }}>
        <BraneButton
          text="Confirm Purchase"
          onPress={() => setPinVisible(true)}
          backgroundColor={C.primary}
          textColor="#D2F1E4"
          height={52}
          radius={12}
          width="100%"
        />
        <BraneButton
          text="Go Back"
          onPress={() => setStage("form")}
          backgroundColor="transparent"
          textColor={C.primary}
          height={52}
          radius={12}
          width="100%"
        />
      </View>
    </ScrollView>
  );

  const renderSuccess = () => (
    <View style={styles.successContainer}>
      <TickCircle size={80} color="#09734C" variant="Bold" />
      <ThemedText style={[styles.successTitle, { color: C.text }]}>
        Purchase Successful!
      </ThemedText>
      <ThemedText style={[styles.successSub, { color: C.muted }]}>
        You purchased {quantity} {quantity === "1" ? "unit" : "units"} of{" "}
        {companyName || ticker}
      </ThemedText>
      <View style={{ gap: 12, width: "100%", marginTop: 24 }}>
        <BraneButton
          text="View Portfolio"
          onPress={() => router.push("/(tabs)/portfolio")}
          backgroundColor={C.primary}
          textColor="#D2F1E4"
          height={52}
          radius={12}
          width="100%"
        />
        <BraneButton
          text="Go Home"
          onPress={() => router.push("/(tabs)")}
          backgroundColor="transparent"
          textColor={C.primary}
          height={52}
          radius={12}
          width="100%"
        />
      </View>
    </View>
  );

  const stageTitle: Record<Stage, string> = {
    form: "Buy Stock",
    preview: "Review Order",
    pin: "Enter PIN",
    success: "Success",
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {stage !== "success" && (
        <View style={styles.header}>
          <Back
            onPress={() => {
              if (stage === "preview") setStage("form");
              else router.back();
            }}
          />
          <ThemedText style={[styles.headerTitle, { color: C.text }]}>
            {stageTitle[stage]}
          </ThemedText>
          <View style={{ width: 44 }} />
        </View>
      )}

      {stage === "form" && renderForm()}
      {stage === "preview" && renderPreview()}
      {stage === "success" && renderSuccess()}

      <TransactionPinValidator
        visible={pinVisible}
        onClose={() => setPinVisible(false)}
        onTransactionPinValidated={handleSubmit}
      />
    </SafeAreaView>
  );
}

function PreviewRow({
  label,
  value,
  C,
  highlighted,
}: {
  label: string;
  value: string;
  C: (typeof Colors)["light"];
  highlighted?: boolean;
}) {
  return (
    <View style={styles.previewRow}>
      <ThemedText style={[styles.previewLabel, { color: C.muted }]}>
        {label}
      </ThemedText>
      <ThemedText
        style={[
          styles.previewValue,
          {
            color: highlighted ? C.primary : C.text,
            fontWeight: highlighted ? "800" : "600",
          },
        ]}
      >
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  content: { paddingHorizontal: 16, paddingBottom: 40, gap: 16 },
  infoCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  label: { fontSize: 12 },
  value: { fontSize: 15, fontWeight: "600" },
  totalCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 13 },
  totalValue: { fontSize: 18, fontWeight: "800" },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: { fontSize: 13, flex: 1 },
  previewValue: { fontSize: 13, textAlign: "right", flex: 1 },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  successTitle: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  successSub: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
});
