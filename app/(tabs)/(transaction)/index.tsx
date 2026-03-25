import { BraneButton } from "@/components/brane-button";
import { MyCalendar } from "@/components/calandar";
import { EmptyState } from "@/components/empty-state";
import { GroupedTransactions } from "@/components/home/home-transaction/grouped-transaction";
import { SearchInput } from "@/components/search-input";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { toArray } from "@/utils/helpers";
import { ITransactionDetail } from "@/utils/index";
import { format, isValid, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { CloseCircle, Setting4 } from "iconsax-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const toggleItem = (arr: string[], value: string): string[] =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

export default function TransactionScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [transactions, setTransactions] = useState<ITransactionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Applied filters — what the API actually uses
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Temp filters — staged in the modal until OK is pressed
  const [tempStatus, setTempStatus] = useState<string[]>([]);
  const [tempType, setTempType] = useState<string[]>([]);
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateTarget, setDateTarget] = useState<"start" | "end">("start");

  // Track whether the filter modal is in a date-picker round-trip so we
  // don't re-sync temp state when it re-opens after date selection.
  const isDatePickerRoundTrip = useRef(false);

  const fetchTransactions = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const params = new URLSearchParams();
        params.append("perPage", "50");
        if (search.trim()) params.append("search", search.trim());
        statusFilters.forEach((s) => params.append("status", s));
        typeFilters.forEach((t) => params.append("type", t));
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
    [endDate, search, startDate, statusFilters, typeFilters],
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Open the filter modal — seed temp state from live filters only on a
  // fresh open, not when returning from the date picker.
  const openFilterModal = useCallback(() => {
    if (!isDatePickerRoundTrip.current) {
      setTempStatus(statusFilters);
      setTempType(typeFilters);
      setTempStartDate(startDate);
      setTempEndDate(endDate);
    }
    isDatePickerRoundTrip.current = false;
    setShowFilterModal(true);
  }, [endDate, startDate, statusFilters, typeFilters]);

  // Active filter pills
  const activeFilters = useMemo(() => {
    const filters: { key: string; label: string }[] = [];
    statusFilters.forEach((s) =>
      filters.push({
        key: `status:${s}`,
        label: STATUS_OPTIONS.find((i) => i.value === s)?.label || s,
      }),
    );
    typeFilters.forEach((t) =>
      filters.push({
        key: `type:${t}`,
        label: TYPE_OPTIONS.find((i) => i.value === t)?.label || t,
      }),
    );
    if (startDate)
      filters.push({ key: "startDate", label: formatDisplayDate(startDate) });
    if (endDate)
      filters.push({ key: "endDate", label: formatDisplayDate(endDate) });
    return filters;
  }, [endDate, startDate, statusFilters, typeFilters]);

  const removeFilter = (key: string) => {
    if (key.startsWith("status:")) {
      const val = key.replace("status:", "");
      setStatusFilters((prev) => prev.filter((v) => v !== val));
    } else if (key.startsWith("type:")) {
      const val = key.replace("type:", "");
      setTypeFilters((prev) => prev.filter((v) => v !== val));
    } else if (key === "startDate") {
      setStartDate("");
    } else if (key === "endDate") {
      setEndDate("");
    }
  };

  const clearAllFilters = () => {
    setStatusFilters([]);
    setTypeFilters([]);
    setStartDate("");
    setEndDate("");
  };

  // Apply temp → live and close modal
  const applyFilters = () => {
    setStatusFilters(tempStatus);
    setTypeFilters(tempType);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setShowFilterModal(false);
  };

  // Clear only temp state inside the modal
  const resetTempFilters = () => {
    setTempStatus([]);
    setTempType([]);
    setTempStartDate("");
    setTempEndDate("");
  };

  const openDatePicker = (target: "start" | "end") => {
    setDateTarget(target);
    // Mark this as a round-trip so openFilterModal doesn't re-seed temp state
    isDatePickerRoundTrip.current = true;
    setShowFilterModal(false);
    setShowDatePicker(true);
  };

  const handleSelectDate = (date: string) => {
    if (dateTarget === "start") {
      setTempStartDate(date);
      if (tempEndDate && new Date(date) > new Date(tempEndDate)) {
        setTempEndDate(date);
      }
    } else {
      setTempEndDate(date);
      if (tempStartDate && new Date(date) < new Date(tempStartDate)) {
        setTempStartDate(date);
      }
    }
    setShowDatePicker(false);
    // Re-open filter modal — flag is already set so temp state is preserved
    openFilterModal();
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: C.text }]}>
          Transaction History
        </ThemedText>
        <TouchableOpacity onPress={openFilterModal}>
          <Setting4 size={20} color={C.text} variant='Outline' />
        </TouchableOpacity>
      </View>

      {/* Search */}
      {transactions.length > 0 && (
        <View style={[styles.searchRow, { backgroundColor: C.inputBg }]}>
          <SearchInput
            placeholder='Search transactions'
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
                  <CloseCircle size={14} color={C.primary} variant='Bold' />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={clearAllFilters}>
            <ThemedText style={[styles.clearFiltersText, { color: C.primary }]}>
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

      {/* Filter Modal */}
      <Modal visible={showFilterModal} transparent animationType='slide'>
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
                  const active = tempStatus.includes(status.value);
                  return (
                    <TouchableOpacity
                      key={status.value}
                      style={styles.filterOptionRow}
                      onPress={() =>
                        setTempStatus((prev) => toggleItem(prev, status.value))
                      }
                    >
                      <ThemedText
                        style={[styles.filterOptionText, { color: C.text }]}
                      >
                        {status.label}
                      </ThemedText>
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: active ? C.primary : C.borderColor,
                            backgroundColor: active ? C.primary : "transparent",
                          },
                        ]}
                      >
                        {active && (
                          <ThemedText style={styles.checkmark}>✓</ThemedText>
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
                  const active = tempType.includes(type.value);
                  return (
                    <TouchableOpacity
                      key={type.value}
                      style={styles.filterOptionRow}
                      onPress={() =>
                        setTempType((prev) => toggleItem(prev, type.value))
                      }
                    >
                      <ThemedText
                        style={[styles.filterOptionText, { color: C.text }]}
                      >
                        {type.label}
                      </ThemedText>
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: active ? C.primary : C.borderColor,
                            backgroundColor: active ? C.primary : "transparent",
                          },
                        ]}
                      >
                        {active && (
                          <ThemedText style={styles.checkmark}>✓</ThemedText>
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
                        style={{
                          color: tempStartDate ? C.text : C.muted,
                          fontSize: 12,
                        }}
                      >
                        {tempStartDate
                          ? formatDisplayDate(tempStartDate)
                          : "Select date"}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>

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
                        style={{
                          color: tempEndDate ? C.text : C.muted,
                          fontSize: 12,
                        }}
                      >
                        {tempEndDate
                          ? formatDisplayDate(tempEndDate)
                          : "Select date"}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.resetButton, { borderColor: C.primary }]}
                onPress={resetTempFilters}
              >
                <ThemedText style={[styles.resetText, { color: C.primary }]}>
                  Reset
                </ThemedText>
              </TouchableOpacity>

              <BraneButton
                text='OK'
                onPress={applyFilters}
                backgroundColor={C.primary}
                textColor={C.googleBg}
                height={44}
                radius={10}
                width='70%'
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType='slide'>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowDatePicker(false);
            openFilterModal();
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
              selectedDate={
                dateTarget === "start" ? tempStartDate : tempEndDate
              }
              minDate={
                dateTarget === "end" ? tempStartDate || undefined : undefined
              }
              maxDate={
                dateTarget === "start" ? tempEndDate || undefined : undefined
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
    paddingBottom: 40,
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
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "700",
    lineHeight: 14,
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
  modalActions: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  resetButton: {
    height: 44,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: {
    fontSize: 14,
    fontWeight: "600",
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
