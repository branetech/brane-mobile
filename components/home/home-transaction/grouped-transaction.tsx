import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatDateWithSuffix, parseTransaction } from "@/utils/helpers";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { EmptyState } from "../../empty-state";
import { TransactionLineItem2 } from "../cards";

// ─── Helpers ─────────────────────────────────────────────────
function collection<T>(arr: T[]): T[] {
  return Array.isArray(arr) ? arr : [];
}

function groupBy<T extends Record<string, any>>(
  arr: T[],
  key: string,
): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const groupKey = item[key] ?? "Unknown";
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

// ─── Component ───────────────────────────────────────────────
export const GroupedTransactions = ({
  transactions: _transactions,
}: {
  transactions: any[];
}) => {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const transactions = useMemo(
    () => collection(_transactions).map(parseTransaction),
    [_transactions],
  );

  const groupedTransactions = useMemo(
    () => groupBy(transactions, "date"),
    [transactions],
  );

  const sortedDates = useMemo(
    () => Object.keys(groupedTransactions).sort().reverse(),
    [groupedTransactions],
  );

  if (!transactions.length) {
    return (
      <EmptyState>
        <ThemedText
          numberOfLines={2}
          style={{
            textAlign: "center",
            paddingHorizontal: 20,
            color: C.muted,
          }}
        >
          Loading transactions...
        </ThemedText>
      </EmptyState>
    );
  }

  return (
    <View style={styles.wrapper}>
      {sortedDates.map((date) => (
        <View key={date} style={styles.group}>
          {/* Date header */}
          <ThemedText style={styles.dateLabel}>
            {formatDateWithSuffix(date)}
          </ThemedText>

          {/* Transactions for this date */}
          <View style={styles.itemsCol}>
            {groupedTransactions[date]
              .filter((item): item is typeof item & { id: string } => !!item.id)
              .map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    router.push(`/transaction-history/${item.id}` as any)
                  }
                  activeOpacity={0.7}
                >
                  <TransactionLineItem2
                    id={item.id}
                    amount={Number(item.amount ?? 0)}
                    rebateAmount={item.rebateAmount ?? undefined}
                    time={item.time ?? ""}
                    date={item.date ?? ""}
                    transactionDescription={item.transactionDescription ?? ""}
                    transactionType={item.transactionType ?? ""}
                    borderColor='#f7f7f8'
                    borderRadius={12}
                  />
                </TouchableOpacity>
              ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flexDirection: "column", marginTop: 8 },
  group: { flexDirection: "column", marginBottom: 32, gap: 5 },
  dateLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#85808A",
    marginBottom: 4,
  },
  itemsCol: { flexDirection: "column", gap: 6 },
});
