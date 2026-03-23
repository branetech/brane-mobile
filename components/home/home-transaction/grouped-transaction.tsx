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
  onPressTransaction,
}: {
  transactions: any[];
  onPressTransaction?: (id: string) => void;
}) => {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const transactions = useMemo(() => {
    return collection(_transactions).map((item) => {
      const tx: any = parseTransaction(item);
      const rawDate = tx?.createdAt || tx?.timestamp;
      const parsed = new Date(rawDate);
      const hasValidDate = !isNaN(parsed.getTime());

      const groupKey = hasValidDate
        ? parsed.toISOString().slice(0, 10)
        : String(tx?.date || "Unknown Date");

      const groupTs = hasValidDate ? parsed.getTime() : 0;
      const groupLabel = hasValidDate
        ? formatDateWithSuffix(groupKey)
        : tx?.date && tx.date !== "Invalid Date"
          ? String(tx.date)
          : "Unknown Date";

      return {
        ...tx,
        __groupKey: groupKey,
        __groupTs: groupTs,
        __groupLabel: groupLabel,
      };
    });
  }, [_transactions]);

  const groupedTransactions = useMemo(
    () => groupBy(transactions, "__groupKey"),
    [transactions],
  );

  const sortedDates = useMemo(() => {
    return Object.keys(groupedTransactions).sort((a, b) => {
      const aTs = Number(groupedTransactions[a]?.[0]?.__groupTs || 0);
      const bTs = Number(groupedTransactions[b]?.[0]?.__groupTs || 0);

      if (aTs && bTs) return bTs - aTs;
      return String(b).localeCompare(String(a));
    });
  }, [groupedTransactions]);

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
            {groupedTransactions[date]?.[0]?.__groupLabel || date}
          </ThemedText>

          {/* Transactions for this date */}
          <View style={styles.itemsCol}>
            {groupedTransactions[date]
              .filter((item): item is typeof item & { id: string } => !!item.id)
              .map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    if (onPressTransaction) {
                      onPressTransaction(String(item.id));
                      return;
                    }

                    router.push({
                      pathname: "/(tabs)/(transaction)/[details]" as any,
                      params: { details: String(item.id) },
                    });
                  }}
                  activeOpacity={0.7}
                >
                  {(() => {
                    const safeDate =
                      item?.date && item.date !== "Invalid Date"
                        ? item.date
                        : "";
                    const safeTime =
                      item?.time && item.time !== "Invalid Date"
                        ? item.time
                        : "";

                    return (
                      <TransactionLineItem2
                        id={item.id}
                        amount={Number(item.amount ?? 0)}
                        rebateAmount={item.rebateAmount ?? undefined}
                        time={safeTime}
                        date={safeDate}
                        transactionDescription={
                          item.transactionDescription ?? ""
                        }
                        transactionType={item.transactionType ?? ""}
                        borderColor='#f7f7f8'
                        borderRadius={12}
                      />
                    );
                  })()}
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
