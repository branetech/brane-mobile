import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { TouchableOpacity, Text } from "react-native";
import { View } from "@idimma/rn-widget";
import { ThemedText } from "../themed-text";
import { EmptyState } from "../empty-state";
import { TransactionCard } from "../transaction-card";
import { useRequest } from "@/services/useRequest";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { parseTransaction, formatDateWithSuffix } from "@/utils/helpers";
import { ITransactionDetail } from "@/utils/index";

export const Transactions = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const { data: _transactions, isLoading } = useRequest(
    TRANSACTION_SERVICE.TRANSACTION_LIST,
    {
      initialValue: [],
      params: { perPage: 5 },
      revalidateOnFocus: true,
      revalidateOnMount: true,
      noCache: true,
    },
  );

  // Parse and memoize transactions
  const transactions = useMemo(() => {
    if (!Array.isArray(_transactions)) return [];
    return _transactions.map((tx) => {
      const parsed = parseTransaction(tx as ITransactionDetail);
      return {
        ...parsed,
        id: parsed.id || parsed.transactionId || "",
        title:
          parsed.transactionDescription ||
          parsed.transactionType ||
          "Transaction",
        description: parsed.service || undefined,
        amount: Number(parsed.amount || 0),
        type:
          String(parsed.transactionType || "")
            .toLowerCase()
            .includes("debit") ||
          String(parsed.actionType || "")
            .toLowerCase()
            .includes("debit")
            ? "debit"
            : "credit",
        date: parsed.time || "",
      };
    });
  }, [_transactions]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        const date = tx.createdAt
          ? new Date(tx.createdAt).toISOString().split("T")[0]
          : "today";
        if (!acc[date]) acc[date] = [];
        acc[date].push({
          id: tx.id,
          title: tx.title,
          description: tx.description,
          amount: tx.amount,
          type: tx.type as "credit" | "debit",
          date: tx.date,
        });
        return acc;
      },
      {} as Record<
        string,
        {
          id: string;
          title: string;
          description?: string;
          amount: number;
          type: "credit" | "debit";
          date: string;
        }[]
      >,
    );
  }, [transactions]);

  const handleSeeAll = () => {
    router.push("/(tabs)/transactions");
  };

  const handleTransactionPress = (transactionId: string) => {
    router.push({
      pathname: "/transaction-history/[details]",
      params: { details: transactionId },
    });
  };

  return (
    <View w='100%' mt={24} mb={24} gap={20} minH={260}>
      {/* Header */}
      <View row spaced>
        <ThemedText type='defaultSemiBold'>Recent Transactions</ThemedText>
        <TouchableOpacity onPress={handleSeeAll}>
          <ThemedText
            type='link'
            style={{
              fontWeight: "800",
              fontSize: 14,
              textDecorationStyle: "dashed",
              textDecorationColor: C.primary,
            }}
          >
            See All
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View justified mt={10}>
        {isLoading ? (
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
        ) : transactions.length === 0 ? (
          <EmptyState>
            <ThemedText
              numberOfLines={2}
              style={{
                textAlign: "center",
                paddingHorizontal: 20,
                color: C.muted,
              }}
            >
              After initiating transactions, you can access the history of your
              transactions here.
            </ThemedText>
          </EmptyState>
        ) : (
          <View gap={16} w='100%'>
            {Object.keys(groupedTransactions)
              .sort()
              .reverse()
              .map((date) => (
                <View key={date} gap={8} w='100%'>
                  {/* Date Header */}
                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: 12,
                      color: C.muted,
                    }}
                  >
                    {formatDateWithSuffix(date)}
                  </Text>

                  {/* Transactions for this date */}
                  <View gap={8} w='100%'>
                    {groupedTransactions[date].map((transaction) => (
                      <TouchableOpacity
                        key={transaction.id}
                        onPress={() => handleTransactionPress(transaction.id)}
                        activeOpacity={0.7}
                      >
                        <TransactionCard
                          transaction={transaction}
                          onPress={() => {}}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
          </View>
        )}
      </View>
    </View>
  );
};
