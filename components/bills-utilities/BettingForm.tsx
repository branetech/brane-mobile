import { BettingProviderModal } from "@/components/bills-utilities/Modals";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest from "@/services";
import { MOBILE_SERVICE } from "@/services/routes";
import { ArrowDown2 } from "iconsax-react-native";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { normalizeOption, toArray } from "./helpers";
import type { SelectOption, UtilityFormData, UtilityFormRef } from "./types";

type Props = {
  onReady: (data: UtilityFormData) => void;
};

export const BettingForm = forwardRef<UtilityFormRef, Props>(({ onReady }, ref) => {
  const scheme = useColorScheme();
  const themeKey: "light" | "dark" = scheme === "dark" ? "dark" : "light";
  const C = Colors[themeKey];
  const styles = createStyles(C as typeof Colors.light);

  // ── State ───────────────────────────────────────────────────────────────────
  const [providers, setProviders] = useState<SelectOption[]>([]);
  const [bettingProvider, setBettingProvider] = useState("");
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [customerIdError, setCustomerIdError] = useState<string | undefined>();
  const [amountError, setAmountError] = useState<string | undefined>();

  // ── Data loading ─────────────────────────────────────────────────────────────
  const fetchProviders = useCallback(async () => {
    try {
      const response: any = await BaseRequest.get(MOBILE_SERVICE.BETTING_SERVICE);
      const list = toArray(response).map(normalizeOption);
      setProviders(list);
      if (list.length > 0) setBettingProvider(list[0].id);
    } catch {
      setProviders([]);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // ── onReady emission ──────────────────────────────────────────────────────────
  useEffect(() => {
    onReady({
      service: "betting",
      amountToPay: Number(amount || 0),
      transactionTarget: customerId,
      bettingProviderId: bettingProvider,
      customerId,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bettingProvider, customerId, amount]);

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    setCustomerIdError(undefined);
    setAmountError(undefined);

    if (!bettingProvider) {
      setCustomerIdError("No betting provider available right now");
      return false;
    }
    if (customerId.trim().length < 6) {
      setCustomerIdError("This field is required");
      return false;
    }
    if (Number(amount) <= 0) {
      setAmountError("Enter a valid amount");
      return false;
    }
    return true;
  };

  useImperativeHandle(ref, () => ({ validate }));

  const selectedBettingProvider = providers.find((p) => p.id === bettingProvider);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <ThemedText style={styles.label}>Betting Provider</ThemedText>
      {providers.length > 0 ? (
        <TouchableOpacity
          style={styles.selectField}
          onPress={() => setShowProviderModal(true)}
          activeOpacity={0.85}
        >
          <ThemedText
            style={[
              styles.selectText,
              !selectedBettingProvider && styles.placeholderText,
            ]}
          >
            {selectedBettingProvider?.label || "Select betting provider"}
          </ThemedText>
          <ArrowDown2 size={18} color={C.muted} />
        </TouchableOpacity>
      ) : (
        <ThemedText style={styles.emptyText}>
          No betting provider available.
        </ThemedText>
      )}

      <ThemedText style={styles.label}>Customer ID</ThemedText>
      <FormInput
        placeholder="Enter customer ID"
        value={customerId}
        onChangeText={(v) => {
          setCustomerId(v);
          setCustomerIdError(undefined);
        }}
        error={customerIdError}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />

      <ThemedText style={styles.label}>Amount</ThemedText>
      <FormInput
        placeholder="Enter amount"
        keyboardType="number-pad"
        value={amount}
        onChangeText={(v) => {
          setAmount(v.replace(/\D/g, ""));
          setAmountError(undefined);
        }}
        error={amountError}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />

      <BettingProviderModal
        visible={showProviderModal}
        onClose={() => setShowProviderModal(false)}
        providers={providers}
        selectedId={bettingProvider}
        onSelect={(id) => {
          setBettingProvider(id);
          setShowProviderModal(false);
        }}
      />
    </>
  );
});

BettingForm.displayName = "BettingForm";

const createStyles = (C: typeof Colors.light) =>
  StyleSheet.create({
    label: { fontSize: 10, color: C.muted, marginTop: 4 },
    selectField: {
      minHeight: 48,
      borderRadius: 12,
      backgroundColor: C.inputBg,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: "#EEF0F3",
      marginTop: 4,
    },
    selectText: {
      fontSize: 12,
      color: C.text,
      fontWeight: "500",
      flex: 1,
    },
    placeholderText: {
      color: C.muted,
      fontWeight: "400",
    },
    emptyText: { fontSize: 10, color: C.muted, marginTop: 4 },
    inputContainer: { height: 40, borderRadius: 8, borderColor: "#F0F0F0" },
    inputText: { fontSize: 11 },
  });

