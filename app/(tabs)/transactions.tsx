import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
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
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={styles.title}>Transaction History</ThemedText>
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Setting3 size={20} color='#0B0014' variant='Outline' />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <SearchNormal1 size={16} color='#7A7A80' variant='Outline' />
        <TextInput
          style={styles.searchInput}
          placeholder='Search transactions'
          placeholderTextColor='#A4A4AA'
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => fetchTransactions()}
        />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color='#013D25' />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchTransactions(true)}
            />
          }
        >
          {Object.keys(grouped).length < 1 ? (
            <ThemedText style={styles.emptyText}>
              No transactions yet.
            </ThemedText>
          ) : (
            Object.entries(grouped).map(([date, records]) => (
              <View key={date} style={styles.groupWrap}>
                <ThemedText style={styles.groupDate}>{date}</ThemedText>
                {records.map((item) => {
                  const statusUI = getStatusStyles(item.status);
                  return (
                    <TouchableOpacity
                      key={String(item.id)}
                      style={styles.row}
                      onPress={() =>
                        router.push({
                          pathname: "/transaction/[details]",
                          params: { details: String(item.id) },
                        })
                      }
                    >
                      <View style={styles.rowLeft}>
                        <ThemedText style={styles.rowTitle}>
                          {item.transactionDescription || item.transactionType}
                        </ThemedText>
                        <ThemedText style={styles.rowSub}>
                          {formatDate(item.createdAt, "hh:mm a")}
                        </ThemedText>
                      </View>
                      <View style={styles.rowRight}>
                        <ThemedText style={styles.rowAmount}>
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
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalCard}
            onPress={() => {}}
          >
            <ThemedText style={styles.modalTitle}>Filter</ThemedText>

            <ThemedText style={styles.filterHeading}>Status</ThemedText>
            <View style={styles.filterRow}>
              {(["", "pending", "success", "failed"] as TxStatus[]).map(
                (status) => (
                  <TouchableOpacity
                    key={status || "all"}
                    style={[
                      styles.filterChip,
                      statusFilter === status && styles.filterChipActive,
                    ]}
                    onPress={() => setStatusFilter(status)}
                  >
                    <ThemedText
                      style={[
                        styles.filterChipText,
                        statusFilter === status && styles.filterChipTextActive,
                      ]}
                    >
                      {status ? status : "All"}
                    </ThemedText>
                  </TouchableOpacity>
                ),
              )}
            </View>

            <ThemedText style={styles.filterHeading}>Type</ThemedText>
            <View style={styles.filterRow}>
              {TX_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterChip,
                    typeFilter === type && styles.filterChipActive,
                  ]}
                  onPress={() =>
                    setTypeFilter((prev) => (prev === type ? "" : type))
                  }
                >
                  <ThemedText
                    style={[
                      styles.filterChipText,
                      typeFilter === type && styles.filterChipTextActive,
                    ]}
                  >
                    {type}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => {
                  setStatusFilter("");
                  setTypeFilter("");
                }}
              >
                <ThemedText style={styles.secondaryBtnText}>Clear</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  setShowFilterModal(false);
                  fetchTransactions();
                }}
              >
                <ThemedText style={styles.primaryBtnText}>Apply</ThemedText>
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
    backgroundColor: "#FFFFFF",
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
    color: "#0B0014",
  },
  searchRow: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ECECEF",
    borderRadius: 10,
    height: 42,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8F8FA",
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#0B0014",
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
    color: "#8C8893",
  },
  groupWrap: {
    gap: 8,
  },
  groupDate: {
    fontSize: 12,
    color: "#85808A",
    fontWeight: "600",
  },
  row: {
    borderWidth: 1,
    borderColor: "#EFEFF1",
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
    color: "#0B0014",
  },
  rowSub: {
    fontSize: 10,
    color: "#8A8790",
  },
  rowAmount: {
    fontSize: 12,
    fontWeight: "700",
    color: "#17131F",
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
    backgroundColor: "#FFFFFF",
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
    color: "#0B0014",
  },
  filterHeading: {
    fontSize: 12,
    color: "#625D69",
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
    borderColor: "#E8E8EB",
    borderRadius: 16,
  },
  filterChipActive: {
    borderColor: "#013D25",
    backgroundColor: "#EAF8F1",
  },
  filterChipText: {
    fontSize: 11,
    color: "#4F4C57",
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
    borderColor: "#DADADD",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontSize: 12,
    color: "#4F4C57",
    fontWeight: "600",
  },
  primaryBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#013D25",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: 12,
    color: "#D2F1E4",
    fontWeight: "700",
  },
});
