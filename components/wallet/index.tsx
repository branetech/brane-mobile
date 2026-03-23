import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { EmptyState } from "@/components/empty-state";
import { ThemedText } from "@/components/themed-text";
import { TransactionLineItem2 } from "@/components/home/cards";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE, STOCKS_SERVICE } from "@/services/routes";
import { formatDate, parseTransaction, priceFormatter, toArray } from "@/utils/helpers";
import { ITransactionDetail } from "@/utils/index";
import { useRouter } from "expo-router";
import { Add, ArrowDown2, Eye, EyeSlash, Receipt1, ArrowRight2 } from "iconsax-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { WithdrawIcn, TotalDiv } from "@/components/svg";
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

export default function WalletScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [balance, setBalance] = useState(0);
  const [dividendBalance, setDividendBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isLoadingDividend, setIsLoadingDividend] = useState(false);

  const fetchDividendBalance = useCallback(async () => {
    setIsLoadingDividend(true);
    try {
      const res: any = await BaseRequest.get(STOCKS_SERVICE.WALLET_BALANCE);
      setDividendBalance(
        Number(
          res?.data?.dividendBalance ??
            res?.dividendBalance ??
            res?.data?.balance ??
            res?.balance ??
            0,
        ),
      );
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoadingDividend(false);
    }
  }, []);

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

  const handleWithdrawModalOpen = () => {
    setShowWithdrawModal(true);
    fetchDividendBalance();
  };

  const ListHeader = (
    <>
      <View style={[styles.balanceCard, { backgroundColor: C.primary }]}>
        <View style={styles.cardRow}>
          <ThemedText style={[styles.balanceLabel, { color: C.googleBg }]}>Wallet balance</ThemedText>
          <TouchableOpacity
            onPress={() => setBalanceVisible((v) => !v)}
            hitSlop={8}
          >
            {balanceVisible ? (
              <Eye size={20} color={C.googleBg} />
            ) : (
              <EyeSlash size={20} color={C.googleBg} />
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
            onPress={handleWithdrawModalOpen}
            style={styles.cardBtn}
            backgroundColor={`${C.googleBg}40`}
            textColor={C.googleBg}
            leftIcon={<ArrowDown2 size={16} color={C.googleBg} />}
            height={44}
            radius={12}
          />
          <BraneButton
            text='Fund Wallet'
            onPress={() => router.push("/add-funds" as any)}
            style={styles.cardBtn}
            backgroundColor={C.googleBg}
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
          style={[styles.seeAllButton, { backgroundColor: C.googleBg }]}
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

      <Modal
        visible={showWithdrawModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: "rgba(1, 61, 37, 0.3)" }]}
          activeOpacity={1}
          onPress={() => setShowWithdrawModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.modalContent, { backgroundColor: C.background }]}
            onPress={() => {}}
          >
            <ThemedText style={[styles.modalTitle, { color: C.text }]}>
              Withdraw
            </ThemedText>

            <View style={[styles.modalDivider, { borderBottomColor: C.border }]}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setShowWithdrawModal(false);
                  router.push("/wallet/withdraw");
                }}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <WithdrawIcn />
                  <ThemedText style={[styles.optionTitle, { color: C.text,  }]}>
                    Withdraw from wallet balance
                  </ThemedText>
                </View>
                <ArrowRight2 size={20} color={C.muted} />
              </TouchableOpacity>
            </View>

            {/* <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowWithdrawModal(false);
                router.push("/wallet/withdraw/dividend");
              }}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <TotalDiv />
                <View style={{ flex: 1 }}>
                  <ThemedText style={[styles.optionTitle, { color: C.text }]}>
                    Withdraw from total dividend
                  </ThemedText>
                  <ThemedText style={[styles.optionSubtitle, { color: C.muted }]}>
                    Dividend balance - <ThemedText style={{ color: C.primary, fontWeight: "600" }}>
                      {priceFormatter(0, 2)}
                    </ThemedText>
                  </ThemedText>
                </View>
              </View>
              <ArrowRight2 size={20} color={C.muted} />
            </TouchableOpacity> */}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  balanceLabel: { fontSize: 14, fontWeight: "600" },

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
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 70,
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  modalDivider: {
    borderBottomWidth: 1,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(19, 201, 101, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  dividendIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  optionSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
});
