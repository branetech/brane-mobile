import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { priceFormatter } from "@/utils/helpers";
import { Wallet } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface PaymentMethod {
  id: string;
  label: string;
  balance: number;
}

interface TransactionSummaryProps {
  recipientName: string;
  recipientBank: string;
  amount: number;
  paymentMethods: PaymentMethod[];
  selectedPaymentId: string;
  onPaymentMethodSelect: (methodId: string) => void;
  remark?: string;
}

export function TransactionSummary({
  recipientName,
  recipientBank,
  amount,
  paymentMethods,
  selectedPaymentId,
  onPaymentMethodSelect,
  remark,
}: TransactionSummaryProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: C.inputBg, borderColor: C.border },
      ]}
    >
      {/* Recipient Summary */}
      <View style={styles.section}>
        <ThemedText style={[styles.label, { color: C.muted }]}>
          Recipient
        </ThemedText>
        <ThemedText style={[styles.value, { color: C.text }]}>
          {recipientName}
        </ThemedText>
        <ThemedText style={[styles.secondary, { color: C.muted }]}>
          {recipientBank}
        </ThemedText>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: C.border }]} />

      {/* Amount */}
      <View style={styles.section}>
        <ThemedText style={[styles.label, { color: C.muted }]}>
          Amount
        </ThemedText>
        <ThemedText style={[styles.amountText, { color: C.primary }]}>
          ₦{priceFormatter(amount)}
        </ThemedText>
      </View>

      {/* Remark */}
      {remark && (
        <>
          <View style={[styles.divider, { backgroundColor: C.border }]} />
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: C.muted }]}>
              Remark
            </ThemedText>
            <ThemedText style={[styles.secondary, { color: C.text }]}>
              {remark}
            </ThemedText>
          </View>
        </>
      )}

      {/* Payment Method Selection */}
      <View style={[styles.divider, { backgroundColor: C.border }]} />
      <View style={styles.section}>
        <ThemedText style={[styles.label, { color: C.muted }]}>
          Pay from
        </ThemedText>
        <View style={styles.paymentMethods}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => onPaymentMethodSelect(method.id)}
              style={[
                styles.paymentMethod,
                {
                  backgroundColor: C.background,
                  borderColor:
                    selectedPaymentId === method.id ? C.primary : C.border,
                  borderWidth: selectedPaymentId === method.id ? 2 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.methodIcon,
                  { backgroundColor: C.primary + "20" },
                ]}
              >
                <Wallet size={20} color={C.primary} />
              </View>
              <View style={styles.methodInfo}>
                <ThemedText
                  style={[styles.methodLabel, { color: C.text }]}
                  numberOfLines={1}
                >
                  {method.label}
                </ThemedText>
                <ThemedText style={[styles.methodBalance, { color: C.muted }]}>
                  ₦{priceFormatter(method.balance)}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondary: {
    fontSize: 13,
    marginTop: 2,
  },
  amountText: {
    fontSize: 24,
    fontWeight: "700",
  },
  divider: {
    height: 1,
  },
  paymentMethods: {
    gap: 8,
  },
  paymentMethod: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    gap: 10,
  },
  methodIcon: {
    borderRadius: 50,
    padding: 8,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  methodBalance: {
    fontSize: 12,
    marginTop: 2,
  },
});
