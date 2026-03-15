import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ArrowRight } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface Transaction {
  id: string;
  title: string;
  description?: string;
  amount: number;
  type: "credit" | "debit";
  date: string;
  icon?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPress,
}) => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const isCredit = transaction.type === "credit";
  const amountColor = isCredit ? "#013D25" : "#CB010B";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor: C.border,
          backgroundColor: C.inputBackground,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {transaction.icon ? (
          <ThemedText style={styles.icon}>{transaction.icon}</ThemedText>
        ) : (
          <View
            style={[
              styles.iconPlaceholder,
              {
                backgroundColor: isCredit ? "#D2F1E4" : "#FFE5E5",
              },
            ]}
          />
        )}
      </View>

      <View style={styles.content}>
        <ThemedText
          type='defaultSemiBold'
          style={[styles.title, { color: C.text }]}
        >
          {transaction.title}
        </ThemedText>
        {transaction.description && (
          <ThemedText style={[styles.description, { color: C.muted }]}>
            {transaction.description}
          </ThemedText>
        )}
        <ThemedText style={[styles.date, { color: C.muted }]}>
          {transaction.date}
        </ThemedText>
      </View>

      <View style={styles.amountContainer}>
        <ThemedText
          type='defaultSemiBold'
          style={[styles.amount, { color: amountColor }]}
        >
          {isCredit ? "+" : "-"}
          {Math.abs(transaction.amount).toLocaleString()}
        </ThemedText>
        {onPress && <ArrowRight size={16} color={C.muted} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 24,
  },
  iconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
  },
  description: {
    fontSize: 12,
  },
  date: {
    fontSize: 11,
  },
  amountContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
  },
});
