import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "credit" | "debit";
  date: string; // e.g. "09:41 AM"
  status?: "success" | "failed" | "pending";
  currency?: string; // defaults to "₦"
}

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

const STATUS_CONFIG = {
  success: { label: "SUCCESS", color: "#1a6644", bg: "#d6f0e3" },
  failed:  { label: "FAILED",  color: "#b91c1c", bg: "#fde8e8" },
  pending: { label: "PENDING", color: "#92400e", bg: "#fef3c7" },
};

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPress,
}) => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const status = transaction.status ?? "success";
  const badge = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const currency = transaction.currency ?? "₦";

  const formattedAmount = `${currency}${Math.abs(transaction.amount).toLocaleString()}`;

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: C.border, backgroundColor: C.inputBg }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left: title + time */}
      <View style={styles.left}>
        <ThemedText type="defaultSemiBold" style={[styles.title, { color: C.text }]}>
          {transaction.title}
        </ThemedText>
        <ThemedText style={[styles.time, { color: C.muted }]}>
          {transaction.date}
        </ThemedText>
      </View>

      {/* Right: amount + status badge */}
      <View style={styles.right}>
        <ThemedText type="defaultSemiBold" style={[styles.amount, { color: C.text }]}>
          {formattedAmount}
        </ThemedText>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <ThemedText style={[styles.badgeText, { color: badge.color }]}>
            {badge.label}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  left: {
    flex: 1,
    gap: 5,
    paddingRight: 12,
  },
  title: {
    fontSize: 13,
  },
  time: {
    fontSize: 10,
  },
  right: {
    alignItems: "flex-end",
    gap: 6,
  },
  amount: {
    fontSize: 13,
    fontWeight: "700",
  },
  badge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});