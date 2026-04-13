import { ElectricityProviderModal } from "@/components/bills-utilities/Modals";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest from "@/services";
import { MOBILE_SERVICE } from "@/services/routes";
import { ArrowDown2 } from "iconsax-react-native";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import {
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { normalizeElectricityProviders } from "./helpers";
import {
    ELECTRICITY_AMOUNTS,
    ELECTRICITY_PRODUCTS,
    type SelectOption,
    type UtilityFormData,
    type UtilityFormRef,
} from "./types";

type Props = {
  onReady: (data: UtilityFormData) => void;
};

export const ElectricityForm = forwardRef<UtilityFormRef, Props>(({ onReady }, ref) => {
  const scheme = useColorScheme();
  const themeKey: "light" | "dark" = scheme === "dark" ? "dark" : "light";
  const C = Colors[themeKey];
  const styles = createStyles(C as typeof Colors.light);

  // ── State ───────────────────────────────────────────────────────────────────
  const [electricityProviders, setElectricityProviders] = useState<SelectOption[]>([]);
  const [electricityProvider, setElectricityProvider] = useState("");
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [electricityProduct, setElectricityProduct] = useState(ELECTRICITY_PRODUCTS[0]);
  const [meterNumber, setMeterNumber] = useState("");
  const [electricityAccountName, setElectricityAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [addToBeneficiaries, setAddToBeneficiaries] = useState(false);
  const [cardError, setCardError] = useState<string | undefined>();
  const [amountError, setAmountError] = useState<string | undefined>();

  // ── Data loading ─────────────────────────────────────────────────────────────
  const fetchProviders = useCallback(async () => {
    try {
      const response: any = await BaseRequest.get(MOBILE_SERVICE.ELECTRICITY_GET_BILLER);
      const list = normalizeElectricityProviders(response?.data || response);
      setElectricityProviders(list);
      if (list.length > 0) setElectricityProvider(list[0].id);
    } catch {
      setElectricityProviders([]);
    }
  }, []);

  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const selectedElectricityProvider = electricityProviders.find((p) => p.id === electricityProvider);

  // ── onReady emission ──────────────────────────────────────────────────────────
  useEffect(() => {
    onReady({
      service: "electricity",
      amountToPay: Number(amount || 0),
      transactionTarget: meterNumber,
      electricityProviderId: electricityProvider,
      electricityProviderLabel: selectedElectricityProvider?.label,
      electricityProviderDescription: selectedElectricityProvider?.description,
      meterNumber,
      electricityProduct,
      electricityAccountName,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [electricityProvider, meterNumber, electricityProduct, electricityAccountName, amount]);

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    setCardError(undefined);
    setAmountError(undefined);

    if (!selectedElectricityProvider) {
      setCardError("No electricity provider available right now");
      return false;
    }
    if (meterNumber.trim().length < 6) {
      setCardError("Enter a valid meter number");
      return false;
    }
    if (Number(amount) <= 0) {
      setAmountError("Enter a valid amount");
      return false;
    }
    return true;
  };

  useImperativeHandle(ref, () => ({ validate }));

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const selectedProductLabel =
    electricityProduct.charAt(0).toUpperCase() + electricityProduct.slice(1);

  const toggleProduct = () => {
    const nextProduct =
      electricityProduct === ELECTRICITY_PRODUCTS[0]
        ? ELECTRICITY_PRODUCTS[1]
        : ELECTRICITY_PRODUCTS[0];
    setElectricityProduct(nextProduct);
    setCardError(undefined);
  };


  return (
    <View style={styles.container}>
      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Select Biller</ThemedText>
        {electricityProviders.length > 0 ? (
          <TouchableOpacity
            style={styles.selectField}
            onPress={() => setShowProviderModal(true)}
            activeOpacity={0.85}
          >
            <ThemedText
              style={[
                styles.selectText,
                !selectedElectricityProvider && styles.placeholderText,
              ]}
            >
              {selectedElectricityProvider
                ? selectedElectricityProvider.label.toUpperCase()
                : "Select a biller"}
            </ThemedText>
            <ArrowDown2 size={18} color={C.muted} />
          </TouchableOpacity>
        ) : (
          <ThemedText style={styles.helperText}>
            No electricity provider available.
          </ThemedText>
        )}
      </View>

      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Select Product</ThemedText>
        <TouchableOpacity
          style={styles.selectField}
          onPress={toggleProduct}
          activeOpacity={0.85}
        >
          <ThemedText style={styles.selectText}>
            {selectedProductLabel}
          </ThemedText>
          <ArrowDown2 size={18} color={C.muted} />
        </TouchableOpacity>
      </View>

      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Meter number</ThemedText>
        <View
          style={[
            styles.inputField,
            cardError ? styles.inputFieldError : undefined,
          ]}
        >
          <TextInput
            style={styles.inputText}
            placeholder="Input your meter number"
            placeholderTextColor={C.muted}
            keyboardType="number-pad"
            value={meterNumber}
            onChangeText={(value) => {
              setMeterNumber(value.replace(/\D/g, ""));
              setCardError(undefined);
            }}
          />
        </View>
        {cardError ? (
          <ThemedText style={styles.errorText}>{cardError}</ThemedText>
        ) : null}
        {electricityAccountName ? (
          <ThemedText style={styles.accountNameText}>
            {electricityAccountName}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Amount</ThemedText>
        <View style={styles.amountGrid}>
          {ELECTRICITY_AMOUNTS.map((preset) => (
            <TouchableOpacity
              key={preset}
              style={[
                styles.amountChip,
                amount === preset && styles.amountChipActive,
              ]}
              onPress={() => {
                setAmount(preset);
                setAmountError(undefined);
              }}
            >
              <ThemedText
                style={[
                  styles.amountChipText,
                  amount === preset && styles.amountChipTextActive,
                ]}
              >
                ₦ {preset}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={[
            styles.customAmountField,
            amountError ? styles.inputFieldError : undefined,
          ]}
        >
          <TextInput
            style={styles.inputText}
            placeholder="Enter custom amount"
            placeholderTextColor={C.muted}
            keyboardType="number-pad"
            value={amount}
            onChangeText={(v) => {
              setAmount(v.replace(/\D/g, ""));
              setAmountError(undefined);
            }}
          />
        </View>
        {amountError ? (
          <ThemedText style={styles.errorText}>{amountError}</ThemedText>
        ) : null}
      </View>

      <View style={styles.beneficiaryRow}>
        <ThemedText style={styles.beneficiaryText}>
          Save as beneficiaries
        </ThemedText>
        <Switch
          value={addToBeneficiaries}
          onValueChange={setAddToBeneficiaries}
          trackColor={{ false: "#D9D9DE", true: "#D2F1E4" }}
          thumbColor={addToBeneficiaries ? C.primary : "#FFFFFF"}
          ios_backgroundColor="#D9D9DE"
        />
      </View>

      <ElectricityProviderModal
        visible={showProviderModal}
        onClose={() => setShowProviderModal(false)}
        providers={electricityProviders}
        selectedId={electricityProvider}
        onSelect={(id) => {
          setElectricityProvider(id);
          setShowProviderModal(false);
        }}
      />
    </View>
  );
});

ElectricityForm.displayName = "ElectricityForm";

const createStyles = (C: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      gap: 18,
      paddingTop: 4,
    },
    fieldBlock: {
      gap: 8,
    },
    fieldLabel: {
      fontSize: 10,
      fontWeight: "500",
      color: C.muted,
    },
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
    helperText: {
      fontSize: 11,
      color: C.muted,
    },
    inputField: {
      minHeight: 48,
      borderRadius: 12,
      backgroundColor: C.inputBg,
      paddingHorizontal: 14,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#EEF0F3",
    },
    customAmountField: {
      minHeight: 48,
      borderRadius: 12,
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 14,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      marginTop: 10,
    },
    inputFieldError: {
      borderColor: C.error,
    },
    inputText: {
      fontSize: 12,
      color: C.text,
      paddingVertical: 0,
    },
    errorText: {
      fontSize: 11,
      color: C.error,
    },
    accountNameText: {
      fontSize: 11,
      color: C.primary,
      fontWeight: "500",
    },
    amountGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    amountChip: {
      width: "23%",
      minHeight: 40,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
    },
    amountChipActive: {
      borderColor: C.primary,
      backgroundColor: "#F4FBF7",
    },
    amountChipText: {
      fontSize: 11,
      color: C.text,
      fontWeight: "500",
    },
    amountChipTextActive: {
      color: C.primary,
    },
    beneficiaryRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 4,
    },
    beneficiaryText: {
      fontSize: 10,
      color: C.muted,
      fontWeight: "500",
    },
  });
