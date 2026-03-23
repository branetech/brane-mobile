import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { formatDateWithSuffix, parseTransaction } from "@/utils/helpers";
import { ITransactionDetail } from "@/utils/index";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Text, TouchableOpacity } from "react-native";
import { EmptyState } from "../../empty-state";
import { ThemedText } from "../../themed-text";
import { TransactionLineItem2 } from "../cards";

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
      const createdAt = parsed.createdAt || (tx as any)?.createdAt || "";
      const dateKey = createdAt
        ? new Date(createdAt).toISOString().split("T")[0]
        : String(parsed.date || "today");

      return {
        ...parsed,
        id: parsed.id || parsed.transactionId || "",
        amount: Number(parsed.amount || 0),
        rebateAmount:
          parsed.rebateAmount !== undefined
            ? Number(parsed.rebateAmount)
            : undefined,
        time: parsed.time || "",
        date: parsed.date || dateKey,
        transactionDescription:
          parsed.transactionDescription ||
          parsed.transactionType ||
          "Transaction",
        transactionType: parsed.transactionType || parsed.actionType || "",
        dateKey,
      };
    });
  }, [_transactions]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        const date = tx.dateKey || "today";
        if (!acc[date]) acc[date] = [];
        acc[date].push({
          id: tx.id,
          amount: tx.amount,
          rebateAmount: tx.rebateAmount,
          time: tx.time,
          date: tx.date,
          transactionDescription: tx.transactionDescription,
          transactionType: tx.transactionType,
        });
        return acc;
      },
      {} as Record<
        string,
        {
          id: string;
          amount: number;
          rebateAmount?: number;
          time: string;
          date: string;
          transactionDescription: string;
          transactionType: string;
        }[]
      >,
    );
  }, [transactions]);

  const handleSeeAll = () => {
    router.push("/(tabs)/transactions");
  };

  const handleTransactionPress = (transactionId: string) => {
    router.push({
      pathname: "/(tabs)/(transaction)/[details]",
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
                        <TransactionLineItem2
                          id={transaction.id}
                          amount={Number(transaction.amount || 0)}
                          rebateAmount={transaction.rebateAmount}
                          time={transaction.time || ""}
                          date={transaction.date || ""}
                          transactionDescription={
                            transaction.transactionDescription || "Transaction"
                          }
                          transactionType={transaction.transactionType || ""}
                          borderColor='#f7f7f8'
                          borderRadius={12}
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
