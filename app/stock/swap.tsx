import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
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
type Stage = "form" | "preview" | "pin" | "success";
type AssetType = "Stocks" | "Gold" | "ETF";

const ASSET_TYPES: AssetType[] = ["Stocks", "Gold", "ETF"];

const assetTypeToKey: Record<AssetType, string> = {
  Stocks: "stock",
  Gold: "gold",
  ETF: "etf",
};

export default function BracsSwapScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [stage, setStage] = useState<Stage>("form");
  const [bracsBalance, setBracsBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | undefined>();
  const [selectedAsset, setSelectedAsset] = useState<AssetType>("Stocks");
  const [showPin, setShowPin] = useState(false);

  const fetchBracsBalance = useCallback(async () => {
    setIsLoadingBalance(true);
    try {
      const res: any = await BaseRequest.get(STOCKS_SERVICE.BRAC_BALANCE);
      setBracsBalance(
        Number(
          res?.data?.balance || res?.balance || res?.data?.bracsBalance || 0,
        ),
      );
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  useEffect(() => {
    fetchBracsBalance();
  }, [fetchBracsBalance]);

  const handlePreview = () => {
    const num = Number(amount);
    if (!amount || num <= 0) {
      setAmountError("Enter a valid amount");
      return;
    }
    if (num > bracsBalance) {
      setAmountError("Insufficient BRACS balance");
      return;
    }
    setAmountError(undefined);
    setStage("preview");
  };

  const handleConfirmSwap = async () => {
    setShowPin(false);
    showAppLoader({ message: "Processing swap..." });
    try {
      await BaseRequest.post(STOCKS_SERVICE.WALLET_BALANCE_BREAKDOWN, {
        amount: Number(amount),
        assetType: assetTypeToKey[selectedAsset],
      });
      hideAppLoader();
      showSuccess("BRACS swapped successfully");
      setStage("success");
    } catch (error) {
      hideAppLoader();
      catchError(error);
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
        {/* BRACS Balance */}
        <View style={{ ...styles.balanceCard, backgroundColor: C.primary }}>
          <ThemedText style={styles.balanceLabelText}>BRACS Balance</ThemedText>
          {isLoadingBalance ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <ThemedText style={styles.balanceAmount}>
              {bracsBalance.toFixed(4)} BRACS
            </ThemedText>
          )}
        </View>

        {/* From */}
        <View style={{ ...styles.swapBox, borderColor: C.border }}>
          <ThemedText style={[styles.swapBoxLabel, { color: C.muted }]}>
            From (BRACS)
          </ThemedText>
          <FormInput
            placeholder="Amount to swap"
            keyboardType="number-pad"
            value={amount}
            onChangeText={(v) => {
              setAmount(v.replace(/\D/g, ""));
              setAmountError(undefined);
            }}
            error={amountError}
            inputContainerStyle={styles.input}
          />
        </View>

        {/* To: Asset Type */}
        <View style={{ ...styles.swapBox, borderColor: C.border }}>
          <ThemedText style={[styles.swapBoxLabel, { color: C.muted }]}>
            To (Asset Type)
          </ThemedText>
          <View style={styles.assetTypesRow}>
            {ASSET_TYPES.map((at) => (
              <TouchableOpacity
                key={at}
                style={[
                  styles.assetTypeBtn,
                  {
                    backgroundColor:
                      selectedAsset === at ? C.primary : C.inputBg,
                    borderColor: selectedAsset === at ? C.primary : C.border,
                  },
                ]}
                onPress={() => setSelectedAsset(at)}
              >
                <ThemedText
                  style={[
                    styles.assetTypeText,
                    { color: selectedAsset === at ? "#fff" : C.muted },
                  ]}
                >
                  {at}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <BraneButton
          text="Preview Swap"
          onPress={handlePreview}
          backgroundColor={C.primary}
          textColor="#D2F1E4"
          height={52}
          radius={12}
        />
      </View>
    </KeyboardAvoidingView>
  );

  const renderPreview = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={{ ...styles.previewCard, borderColor: C.border }}>
        <ThemedText style={[styles.previewTitle, { color: C.text }]}>
          Swap Summary
        </ThemedText>
        {[
          { label: "From", value: `${amount} BRACS` },
          { label: "To Asset", value: selectedAsset },
          {
            label: "Estimated Value",
            value: priceFormatter(Number(amount) * 0.1, 2),
          },
          {
            label: "Remaining BRACS",
            value: (bracsBalance - Number(amount)).toFixed(4),
          },
        ].map((row, i, arr) => (
          <RNView
            key={row.label}
            style={[
              styles.previewRow,
              i < arr.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: C.border,
              },
            ]}
          >
            <ThemedText style={[styles.previewLabel, { color: C.muted }]}>
              {row.label}
            </ThemedText>
            <ThemedText style={[styles.previewValue, { color: C.text }]}>
              {row.value}
            </ThemedText>
          </RNView>
        ))}
      </View>
      <View style={styles.previewButtons}>
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
          text="Confirm Swap"
          onPress={() => {
            setStage("pin");
            setShowPin(true);
          }}
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
        Swap Successful!
      </ThemedText>
      <View
        style={{ ...styles.previewCard, borderColor: C.border, width: "100%" }}
      >
        {[
          { label: "Amount Swapped", value: `${amount} BRACS` },
          { label: "Asset Type", value: selectedAsset },
          {
            label: "Estimated Value",
            value: priceFormatter(Number(amount) * 0.1, 2),
          },
        ].map((row, i, arr) => (
          <RNView
            key={row.label}
            style={[
              styles.previewRow,
              i < arr.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: C.border,
              },
            ]}
          >
            <ThemedText style={[styles.previewLabel, { color: C.muted }]}>
              {row.label}
            </ThemedText>
            <ThemedText style={[styles.previewValue, { color: C.text }]}>
              {row.value}
            </ThemedText>
          </RNView>
        ))}
      </View>
      <BraneButton
        text="Done"
        onPress={() => router.push("/stock/breakdown")}
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
            if (stage === "preview") setStage("form");
            else if (stage === "pin") setStage("preview");
            else router.back();
          }}
        />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          {stage === "success" ? "Done" : "Swap BRACS"}
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {stage === "form" && renderForm()}
      {stage === "preview" && renderPreview()}
      {stage === "pin" && (
        <View style={styles.flex}>
          <ThemedText style={[styles.pinHint, { color: C.muted }]}>
            Please confirm your transaction PIN to proceed.
          </ThemedText>
        </View>
      )}
      {stage === "success" && renderSuccess()}

      <TransactionPinValidator
        visible={showPin}
        onClose={() => {
          setShowPin(false);
          setStage("preview");
        }}
        onTransactionPinValidated={handleConfirmSwap}
        onResetPin={() => router.push("/account/reset-transaction-pin")}
        onValidatePin={async (pin) => {
          try {
            await BaseRequest.post("/auth-service/validate-transaction-pin", {
              pin,
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
  scrollContent: { paddingHorizontal: 16, paddingBottom: 20, gap: 14 },
  balanceCard: {
    borderRadius: 14,
    padding: 20,
    gap: 6,
  },
  balanceLabelText: { fontSize: 12, color: "#D2F1E4" },
  balanceAmount: { fontSize: 24, fontWeight: "800", color: "#fff" },
  swapBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  swapBoxLabel: { fontSize: 12, fontWeight: "600" },
  input: { height: 48, borderRadius: 8 },
  assetTypesRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  assetTypeBtn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  assetTypeText: { fontSize: 13, fontWeight: "500" },
  footer: { paddingHorizontal: 16, paddingBottom: 16 },
  previewCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 4,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  previewLabel: { fontSize: 13 },
  previewValue: { fontSize: 13, fontWeight: "600" },
  previewButtons: {
    flexDirection: "row",
    gap: 12,
  },
  halfBtn: { flex: 1 },
  pinHint: {
    textAlign: "center",
    fontSize: 13,
    padding: 20,
  },
  successWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  successTitle: { fontSize: 22, fontWeight: "800", textAlign: "center" },
});
