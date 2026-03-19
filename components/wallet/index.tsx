import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { EmptyState } from "@/components/empty-state";
import { ThemedText } from "@/components/themed-text";
import { TransactionLineItem2 } from "@/components/home/cards";
import { WithdrawModal } from "@/components/withdraw-modal";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { formatDate, parseTransaction, priceFormatter } from "@/utils/helpers";
import { ITransactionDetail } from "@/utils/index";
import { useRouter } from "expo-router";
import { Add, ArrowDown2, Eye, EyeSlash, Receipt1 } from "iconsax-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type WalletTransaction = {
  id: string;
  description: string;
  createdAt: string;
  transactionType: string;
  amount: number;
  rebateAmount: number;
  date: string;
  time: string;
};

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

export default function WalletScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const fetchData = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [balRes, txRes]: any[] = await Promise.all([
        BaseRequest.get(TRANSACTION_SERVICE.BALANCE),
        BaseRequest.get(TRANSACTION_SERVICE.TRANSACTION_LIST),
      ]);

      const bal = balRes?.data?.balance ?? balRes?.balance ?? balRes?.data ?? 0;
      setBalance(Number(bal));

      const records = toArray(txRes)
        .slice(0, 5)
        .map((item: any, idx: number) => {
          const parsed = parseTransaction(item as ITransactionDetail);
          const createdAt = String(
            parsed?.createdAt ?? new Date().toISOString(),
          );
          const dateObj = new Date(createdAt);

          return {
            id: String(parsed?.id ?? parsed?.transactionId ?? `tx-${idx}`),
            description: String(
              parsed?.transactionDescription ??
                parsed?.transactionType ??
                "Transaction",
            ),
            createdAt,
            transactionType: String(parsed?.transactionType ?? ""),
            amount: Number(parsed?.amount ?? 0),
            rebateAmount: Number(parsed?.rebateAmount ?? parsed?.rebate ?? 0),
            date: formatDate(createdAt, "MMM dd, yyyy"),
            time: formatDate(createdAt, "hh:mm a"),
          };
        });

      setTransactions(records);
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const ListHeader = (
    <>
      <View style={[styles.balanceCard, { backgroundColor: C.primary }]}>
        <View style={styles.cardRow}>
          <ThemedText style={styles.balanceLabel}>Wallet balance</ThemedText>
          <TouchableOpacity
            onPress={() => setBalanceVisible((v) => !v)}
            hitSlop={8}
          >
            {balanceVisible ? (
              <Eye size={20} color='#D2F1E4' />
            ) : (
              <EyeSlash size={20} color='#D2F1E4' />
            )}
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.balanceAmount}>
          {balanceVisible
            ? priceFormatter(balance, 0)
            : "\u20a6 \u2022\u2022\u2022\u2022\u2022\u2022"}
        </ThemedText>

        <View style={styles.cardBtns}>
          <BraneButton
            text='Withdraw'
            onPress={() => setShowWithdrawModal(true)}
            style={styles.cardBtn}
            backgroundColor='rgba(210,241,228,0.25)'
            textColor='#D2F1E4'
            leftIcon={<ArrowDown2 size={16} color='#D2F1E4' />}
            height={44}
            radius={12}
          />
          <BraneButton
            text='Fund Wallet'
            onPress={() => router.push("/add-funds" as any)}
            style={styles.cardBtn}
            backgroundColor='#D2F1E4'
            textColor={C.primary}
            leftIcon={<Add size={16} color={C.primary} />}
            height={44}
            radius={12}
          />
        </View>
      </View>

      <View style={styles.sectionRow}>
        <ThemedText
          type='defaultSemiBold'
          style={{ fontSize: 15, color: C.muted }}
        >
          Recent Transactions
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/(transaction)" as any)}
          style={styles.seeAllButton}
          activeOpacity={0.7}
        >
          <ThemedText
            style={{ color: C.primary, fontSize: 16, fontWeight: "600" }}
          >
            See All
          </ThemedText>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back />
        <ThemedText type='subtitle'>Wallet</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator
          style={styles.loader}
          size='small'
          color={C.primary}
        />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, i) => item.id || `tx-${i}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchData(true)}
              tintColor={C.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState>
              <Receipt1 size={40} color={C.muted} />
              <ThemedText
                style={{ color: C.muted, textAlign: "center", marginTop: 8 }}
              >
                No recent transactions
              </ThemedText>
            </EmptyState>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/(transaction)/[details]",
                  params: { details: item.id },
                })
              }
              style={{ marginBottom: 12 }}
            >
              <TransactionLineItem2
                id={item.id}
                amount={item.amount}
                rebateAmount={item.rebateAmount}
                time={item.time}
                date={item.date}
                transactionDescription={item.description}
                transactionType={item.transactionType}
                borderColor={C.border}
                borderRadius={12}
              />
            </TouchableOpacity>
          )}
        />
      )}

      <WithdrawModal
        visible={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  loader: { marginTop: 40 },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },

  balanceCard: {
    backgroundColor: "#013D25",
    borderRadius: 18,
    padding: 18,
    marginBottom: 28,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  balanceLabel: { color: "#AFC9BE", fontSize: 14, fontWeight: "600" },

  balanceAmount: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    color: "#fff",
    marginTop: 14,
    marginBottom: 2,
    textAlign: "center",
    includeFontPadding: false,
  },
  cardBtns: { flexDirection: "row", gap: 12, marginTop: 22 },
  cardBtn: { flex: 1 },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    marginBottom: 12,
  },
  seeAllButton: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D2F1E4",
  },
});
