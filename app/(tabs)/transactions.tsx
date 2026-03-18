import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { formatDate, parseTransaction, priceFormatter } from "@/utils/helpers";
import { ITransactionDetail } from "@/utils/index";
import { useRouter } from "expo-router";
import { SearchNormal1, Setting3 } from "iconsax-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TxStatus = "pending" | "success" | "failed" | "";

const TX_TYPES = [
  "Airtime",
  "Data",
  "Electricity",
  "Cable",
  "Betting",
  "Wallet Top Up",
  "Wallet Deduction",
  "Buy Stocks",
  "Sell Stocks",
  "Stock Swap",
];

const toArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.records)) return value.records;
  if (Array.isArray(value?.data?.records)) return value.data.records;
  return [];
};

const getStatusStyles = (status?: string) => {
  const key = String(status || "").toLowerCase();
  if (key.includes("success")) {
    return { bg: "#EAF8F1", color: "#0E8A4D", border: "#CBECD9" };
  }
  if (key.includes("pending")) {
    return { bg: "#FFF7E8", color: "#B5760A", border: "#F1D9A8" };
  }
  return { bg: "#FDECEC", color: "#C53333", border: "#F6C8C8" };
};

export default function TransactionScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [transactions, setTransactions] = useState<ITransactionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TxStatus>("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const fetchTransactions = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const params = new URLSearchParams();
        params.append("perPage", "50");
        if (search.trim()) params.append("search", search.trim());
        if (statusFilter) params.append("status", statusFilter);
        if (typeFilter) params.append("type", typeFilter);

        const response: any = await BaseRequest.get(
          `${TRANSACTION_SERVICE.TRANSACTION_LIST}?${params.toString()}`,
        );

        const records = toArray(response)
          .map((item) => parseTransaction(item as ITransactionDetail))
          .sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));

        setTransactions(records);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [search, statusFilter, typeFilter],
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const grouped = useMemo(() => {
    return transactions.reduce<Record<string, ITransactionDetail[]>>(
      (acc, item) => {
        const key = formatDate(item.createdAt, "MMMM dd, yyyy");
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {},
    );
  }, [transactions]);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.title, { color: C.text }]}>
          Transaction History
        </ThemedText>
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Setting3 size={20} color={C.text} variant='Outline' />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.searchRow,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
      >
        <SearchNormal1 size={16} color={C.muted} variant='Outline' />
        <TextInput
          style={[styles.searchInput, { color: C.text }]}
          placeholder='Search transactions'
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => fetchTransactions()}
        />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchTransactions(true)}
              tintColor={C.primary}
            />
          }
        >
          {Object.keys(grouped).length < 1 ? (
            <ThemedText style={[styles.emptyText, { color: C.muted }]}>
              No transactions yet.
            </ThemedText>
          ) : (
            Object.entries(grouped).map(([date, records]) => (
              <View key={date} style={styles.groupWrap}>
                <ThemedText style={[styles.groupDate, { color: C.muted }]}>
                  {date}
                </ThemedText>
                {records.map((item) => {
                  const statusUI = getStatusStyles(item.status);
                  return (
                    <TouchableOpacity
                      key={String(item.id)}
                      style={[
                        styles.row,
                        { backgroundColor: C.screen, borderColor: C.border },
                      ]}
                      onPress={() =>
                        router.push({
                          pathname: "/transaction/[details]",
                          params: { details: String(item.id) },
                        })
                      }
                    >
                      <View style={styles.rowLeft}>
                        <ThemedText
                          style={[styles.rowTitle, { color: C.text }]}
                        >
                          {item.transactionDescription || item.transactionType}
                        </ThemedText>
                        <ThemedText style={[styles.rowSub, { color: C.muted }]}>
                          {formatDate(item.createdAt, "hh:mm a")}
                        </ThemedText>
                      </View>
                      <View style={styles.rowRight}>
                        <ThemedText
                          style={[styles.rowAmount, { color: C.text }]}
                        >
                          {priceFormatter(Number(item.amount || 0))}
                        </ThemedText>
                        <View
                          style={[
                            styles.statusPill,
                            {
                              backgroundColor: statusUI.bg,
                              borderColor: statusUI.border,
                            },
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.statusText,
                              { color: statusUI.color },
                            ]}
                          >
                            {String(item.status || "").toUpperCase()}
                          </ThemedText>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          )}
        </ScrollView>
      )}

      <Modal visible={showFilterModal} transparent animationType='slide'>
        <TouchableOpacity
          style={[
            styles.modalOverlay,
            {
              backgroundColor:
                scheme === "dark" ? "rgba(0,0,0,0.5)" : "rgba(11,0,20,0.35)",
            },
          ]}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.modalCard, { backgroundColor: C.background }]}
            onPress={() => {}}
          >
            <ThemedText style={[styles.modalTitle, { color: C.text }]}>
              Filter
            </ThemedText>

            <ThemedText style={[styles.filterHeading, { color: C.muted }]}>
              Status
            </ThemedText>
            <View style={styles.filterRow}>
              {(["", "pending", "success", "failed"] as TxStatus[]).map(
                (status) => (
                  <TouchableOpacity
                    key={status || "all"}
                    style={[
                      styles.filterChip,
                      statusFilter === status && {
                        backgroundColor: C.primary,
                      },
                      statusFilter !== status && {
                        backgroundColor: C.inputBg,
                        borderColor: C.border,
                      },
                    ]}
                    onPress={() => setStatusFilter(status)}
                  >
                    <ThemedText
                      style={[
                        styles.filterChipText,
                        {
                          color:
                            statusFilter === status ? C.background : C.text,
                        },
                      ]}
                    >
                      {status ? status : "All"}
                    </ThemedText>
                  </TouchableOpacity>
                ),
              )}
            </View>

            <ThemedText style={[styles.filterHeading, { color: C.muted }]}>
              Type
            </ThemedText>
            <View style={styles.filterRow}>
              {TX_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterChip,
                    typeFilter === type && {
                      backgroundColor: C.primary,
                    },
                    typeFilter !== type && {
                      backgroundColor: C.inputBg,
                      borderColor: C.border,
                    },
                  ]}
                  onPress={() =>
                    setTypeFilter((prev) => (prev === type ? "" : type))
                  }
                >
                  <ThemedText
                    style={[
                      styles.filterChipText,
                      {
                        color: typeFilter === type ? C.background : C.text,
                      },
                    ]}
                  >
                    {type}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.secondaryBtn, { borderColor: C.border }]}
                onPress={() => {
                  setStatusFilter("");
                  setTypeFilter("");
                }}
              >
                <ThemedText
                  style={[styles.secondaryBtnText, { color: C.text }]}
                >
                  Clear
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: C.primary }]}
                onPress={() => {
                  setShowFilterModal(false);
                  fetchTransactions();
                }}
              >
                <ThemedText
                  style={[styles.primaryBtnText, { color: C.background }]}
                >
                  Apply
                </ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  searchRow: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 10,
    height: 42,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
  groupWrap: {
    gap: 8,
  },
  groupDate: {
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  rowLeft: {
    flex: 1,
  },
  rowRight: {
    alignItems: "flex-end",
    gap: 5,
  },
  rowTitle: {
    fontSize: 12,
    fontWeight: "600",
  },
  rowSub: {
    fontSize: 10,
  },
  rowAmount: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(11,0,20,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    maxHeight: "80%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  filterHeading: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 16,
  },
  filterChipActive: {
  },
  filterChipText: {
    fontSize: 11,
    textTransform: "capitalize",
  },
  filterChipTextActive: {
    color: "#013D25",
    fontWeight: "700",
  },
  modalActions: {
    marginTop: 4,
    flexDirection: "row",
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  primaryBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
