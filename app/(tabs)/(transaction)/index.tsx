import { MyCalendar } from "@/components/calandar";
import { EmptyState } from "@/components/empty-state";
import { FormInput } from "@/components/formInput";
import { GroupedTransactions } from "@/components/home/home-transaction/grouped-transaction";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { toArray } from "@/utils/helpers";
import { ITransactionDetail } from "@/utils/index";
import { useRouter } from "expo-router";
import { CloseCircle, SearchNormal1, Setting4 } from "iconsax-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, parseISO, isValid } from "date-fns";

type TxStatus = "" | "pending" | "success" | "failed";

type FilterOption = {
  label: string;
  value: string;
};

const STATUS_OPTIONS: FilterOption[] = [
  { label: "Pending", value: "pending" },
  { label: "Success", value: "success" },
  { label: "Failed", value: "failed" },
];

const TYPE_OPTIONS: FilterOption[] = [
  { label: "Airtime", value: "Airtime" },
  { label: "Data", value: "Data" },
  { label: "Stock", value: "Buy Stocks" },
  { label: "Bracs", value: "Stock Swap" },
  { label: "Wallet Top-up", value: "Wallet Top Up" },
  { label: "Wallet Deduction", value: "Wallet Deduction" },
  { label: "Dividend Withdrawals", value: "Stock Dividend" },
];

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, "MMM dd, yyyy") : dateStr;
  } catch {
    return dateStr;
  }
};

export default function TransactionScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [transactions, setTransactions] = useState<ITransactionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Single source of truth for all filters — mirrors web's `params` pattern
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TxStatus>("");
  const [typeFilter, setTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateTarget, setDateTarget] = useState<"start" | "end">("start");

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
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const response: any = await BaseRequest.get(
          `${TRANSACTION_SERVICE.TRANSACTION_LIST}?${params.toString()}`,
        );

        setTransactions(toArray(response) as ITransactionDetail[]);
      } catch (error) {
        catchError(error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [endDate, search, startDate, statusFilter, typeFilter],
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Active filter pills — mirrors web's `filters` useMemo
  const activeFilters = useMemo(() => {
    const filters: { key: string; label: string }[] = [];
    if (statusFilter)
      filters.push({
        key: "status",
        label:
          STATUS_OPTIONS.find((i) => i.value === statusFilter)?.label ||
          statusFilter,
      });
    if (typeFilter)
      filters.push({
        key: "type",
        label:
          TYPE_OPTIONS.find((i) => i.value === typeFilter)?.label || typeFilter,
      });
    if (startDate)
      filters.push({ key: "startDate", label: formatDisplayDate(startDate) });
    if (endDate)
      filters.push({ key: "endDate", label: formatDisplayDate(endDate) });
    return filters;
  }, [endDate, startDate, statusFilter, typeFilter]);

  // Mirrors web's removeParam
  const removeFilter = (key: string) => {
    if (key === "status") setStatusFilter("");
    if (key === "type") setTypeFilter("");
    if (key === "startDate") setStartDate("");
    if (key === "endDate") setEndDate("");
  };

  // Mirrors web's clearFilters
  const clearAllFilters = () => {
    setStatusFilter("");
    setTypeFilter("");
    setStartDate("");
    setEndDate("");
  };

  // Filters apply immediately on select — mirrors web's onChangeParams
  const handleStatusChange = (value: TxStatus) => {
    setStatusFilter((prev) => (prev === value ? "" : value));
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter((prev) => (prev === value ? "" : value));
  };

  const openDatePicker = (target: "start" | "end") => {
    setDateTarget(target);
    setShowFilterModal(false);
    setShowDatePicker(true);
  };

  const handleSelectDate = (date: string) => {
    if (dateTarget === "start") {
      setStartDate(date);
      if (endDate && new Date(date) > new Date(endDate)) {
        setEndDate(date);
      }
    } else {
      setEndDate(date);
      if (startDate && new Date(date) < new Date(startDate)) {
        setStartDate(date);
      }
    }
    setShowDatePicker(false);
    setShowFilterModal(true);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: C.text }]}>
          Transaction History
        </ThemedText>
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Setting4 size={20} color={C.text} variant="Outline" />
        </TouchableOpacity>
      </View>

      {/* Search — hidden when no transactions, mirrors web */}
      {transactions.length > 0 && (
        <View style={[styles.searchRow, { backgroundColor: C.inputBg }]}>
          <FormInput
            leftContent={<SearchNormal1 size={16} color={C.muted} />}
            placeholder="Search transactions"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => fetchTransactions()}
          />
        </View>
      )}

      {/* Active filter pills */}
      {!!activeFilters.length && (
        <View style={styles.activeFiltersWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsRow}
          >
            {activeFilters.map((filter) => (
              <View
                key={filter.key}
                style={[
                  styles.filterPill,
                  { backgroundColor: C.googleBg, borderColor: C.fingerBorder },
                ]}
              >
                <ThemedText
                  style={[styles.filterPillText, { color: C.primary }]}
                >
                  {filter.label}
                </ThemedText>
                <TouchableOpacity onPress={() => removeFilter(filter.key)}>
                  <CloseCircle size={14} color={C.primary} variant="Bold" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={clearAllFilters}>
            <ThemedText
              style={[styles.clearFiltersText, { color: C.primary }]}
            >
              Clear all Filters
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Transaction list */}
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
          {transactions.length < 1 ? (
            <View style={styles.emptyContainer}>
              <EmptyState>
                <ThemedText style={[styles.emptyTitle, { color: C.text }]}>
                  Transaction Log is Empty
                </ThemedText>
                <ThemedText style={[styles.emptyHint, { color: C.muted }]}>
                  You can keep track of all your transactions, and keep track of
                  your tickets
                </ThemedText>
              </EmptyState>
            </View>
          ) : (
            <GroupedTransactions
              transactions={transactions}
              onPressTransaction={(id) =>
                router.push({
                  pathname: "/(tabs)/(transaction)/[details]" as any,
                  params: { details: id },
                })
              }
            />
          )}
        </ScrollView>
      )}

      {/* Filter Modal — filters apply immediately on select, no "Show Result" needed */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.modalCard, { backgroundColor: C.background }]}
            onPress={() => {}}
          >
            <View style={styles.modalHandle} />
            <ThemedText style={[styles.modalTitle, { color: C.text }]}>
              Filter
            </ThemedText>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Status */}
              <ThemedText style={[styles.filterHeading, { color: C.muted }]}>
                Status
              </ThemedText>
              <View style={styles.filterList}>
                {STATUS_OPTIONS.map((status) => {
                  const active = statusFilter === status.value;
                  return (
                    <TouchableOpacity
                      key={status.value}
                      style={styles.filterOptionRow}
                      onPress={() =>
                        handleStatusChange(status.value as TxStatus)
                      }
                    >
                      <ThemedText
                        style={[styles.filterOptionText, { color: C.text }]}
                      >
                        {status.label}
                      </ThemedText>
                      <View
                        style={[
                          styles.radioOuter,
                          { borderColor: active ? C.primary : C.borderColor },
                        ]}
                      >
                        {active && (
                          <View
                            style={[
                              styles.radioInner,
                              { backgroundColor: C.primary },
                            ]}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Type */}
              <ThemedText
                style={[
                  styles.filterHeading,
                  { color: C.muted, marginTop: 12 },
                ]}
              >
                Type
              </ThemedText>
              <View style={styles.filterList}>
                {TYPE_OPTIONS.map((type) => {
                  const active = typeFilter === type.value;
                  return (
                    <TouchableOpacity
                      key={type.value}
                      style={styles.filterOptionRow}
                      onPress={() => handleTypeChange(type.value)}
                    >
                      <ThemedText
                        style={[styles.filterOptionText, { color: C.text }]}
                      >
                        {type.label}
                      </ThemedText>
                      <View
                        style={[
                          styles.radioOuter,
                          { borderColor: active ? C.primary : C.borderColor },
                        ]}
                      >
                        {active && (
                          <View
                            style={[
                              styles.radioInner,
                              { backgroundColor: C.primary },
                            ]}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Date */}
              <View style={styles.dateSection}>
                <ThemedText
                  style={[
                    styles.filterHeading,
                    { color: C.muted, marginTop: 12 },
                  ]}
                >
                  Date
                </ThemedText>
                <View style={styles.dateRow}>
                  <View style={styles.dateInputWrap}>
                    <ThemedText style={[styles.dateLabel, { color: C.muted }]}>
                      Start Date
                    </ThemedText>
                    <TouchableOpacity
                      style={[
                        styles.dateInput,
                        { borderColor: C.border, backgroundColor: C.inputBg },
                      ]}
                      onPress={() => openDatePicker("start")}
                      activeOpacity={0.8}
                    >
                      <ThemedText
                        style={{ color: startDate ? C.text : C.muted, fontSize: 12 }}
                      >
                        {startDate ? formatDisplayDate(startDate) : "Select date"}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>

                  {/* Divider — mirrors web's <span> dash between date pickers */}
                  <View style={styles.dateDivider}>
                    <View
                      style={[
                        styles.dateDividerLine,
                        { backgroundColor: C.primary },
                      ]}
                    />
                  </View>

                  <View style={styles.dateInputWrap}>
                    <ThemedText style={[styles.dateLabel, { color: C.muted }]}>
                      End Date
                    </ThemedText>
                    <TouchableOpacity
                      style={[
                        styles.dateInput,
                        { borderColor: C.border, backgroundColor: C.inputBg },
                      ]}
                      onPress={() => openDatePicker("end")}
                      activeOpacity={0.8}
                    >
                      <ThemedText
                        style={{ color: endDate ? C.text : C.muted, fontSize: 12 }}
                      >
                        {endDate ? formatDisplayDate(endDate) : "Select date"}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>


          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowDatePicker(false);
            setShowFilterModal(true);
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.calendarCard, { backgroundColor: C.background }]}
            onPress={() => {}}
          >
            <View style={styles.modalHandle} />
            <ThemedText style={[styles.modalTitle, { color: C.text }]}>
              {dateTarget === "start" ? "Select Start Date" : "Select End Date"}
            </ThemedText>

            <MyCalendar
              selectedDate={dateTarget === "start" ? startDate : endDate}
              minDate={
                dateTarget === "end" ? startDate || undefined : undefined
              }
              maxDate={
                dateTarget === "start" ? endDate || undefined : undefined
              }
              onSelectDate={handleSelectDate}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: "#F2F3F5",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  searchRow: {
    marginHorizontal: 16,
  },
  activeFiltersWrap: {
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  filterPillsRow: {
    gap: 8,
    paddingRight: 10,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  filterPillText: {
    fontSize: 10,
  },
  clearFiltersText: {
    fontSize: 10,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 90,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    minHeight: 420,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
  },
  emptyHint: {
    textAlign: "center",
    fontSize: 11,
    lineHeight: 15,
    maxWidth: 300,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#013D254D",
    justifyContent: "flex-end",
  },
  modalCard: {
    maxHeight: "86%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 12,
  },
  modalHandle: {
    width: 46,
    height: 4,
    borderRadius: 20,
    backgroundColor: "#DDE2DF",
    alignSelf: "center",
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  filterHeading: {
    fontSize: 12,
    fontWeight: "600",
  },
  filterList: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F3F5",
    paddingBottom: 6,
    gap: 2,
  },
  filterOptionRow: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 8,
  },
  dateSection: {
    gap: 8,
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "flex-end",
  },
  dateInputWrap: {
    flex: 1,
    gap: 4,
  },
  dateLabel: {
    fontSize: 10,
  },
  dateInput: {
    height: 38,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  dateDivider: {
    paddingBottom: 10,
    justifyContent: "flex-end",
    alignItems: "center",
    width: 16,
  },
  dateDividerLine: {
    width: 12,
    height: 2,
    borderRadius: 2,
    opacity: 0.7,
  },

  calendarCard: {
    maxHeight: "70%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 12,
  },
});