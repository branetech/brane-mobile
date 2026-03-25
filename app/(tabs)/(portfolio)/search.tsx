import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { MyCalendar } from "@/components/calandar";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE } from "@/services/routes";
import { priceFormatter } from "@/utils/helpers";
import { useRouter } from "expo-router";
import {
    CloseCircle,
    SearchNormal1,
    Setting4,
    ShoppingCart,
} from "iconsax-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

type AssetFilter = {
  label: string;
  key: string;
};

const ASSET_FILTERS: AssetFilter[] = [
  { label: "Stocks", key: "stock" },
  { label: "Gold", key: "gold" },
  { label: "ETFs", key: "etf" },
  { label: "Indexes", key: "index" },
  { label: "Fixed Income", key: "fixed-income" },
];

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

const toggleItem = (arr: string[], value: string): string[] =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

const getTextImage = (text: string, C: any) => {
  const bg = C.inputBg.replace("#", "");
  const fg = C.primary.replace("#", "");
  return `https://dummyimage.com/80x80/${bg}/${fg}&text=${encodeURIComponent(text || "ST")}`;
};

export default function StockSearchScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const [allStocks, setAllStocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter modal state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempAssetFilters, setTempAssetFilters] = useState<string[]>([]);
  const [activeAssetFilters, setActiveAssetFilters] = useState<string[]>([]);

  // Date filter state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateTarget, setDateTarget] = useState<"start" | "end">("start");
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [activeStartDate, setActiveStartDate] = useState("");
  const [activeEndDate, setActiveEndDate] = useState("");

  const isDateRoundTrip = useRef(false);

  // Load all stocks once
  useEffect(() => {
    (async () => {
      try {
        const res: any = await BaseRequest.get(STOCKS_SERVICE.STOCKS);
        setAllStocks(toArray(res));
      } catch (err) {
        catchError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Auto-focus input when screen mounts
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  const filteredStocks = allStocks.filter((s) => {
    const q = query.toLowerCase().trim();
    const matchQuery =
      !q ||
      String(s?.tickerSymbol || "")
        .toLowerCase()
        .includes(q) ||
      String(s?.companyName || s?.name || "")
        .toLowerCase()
        .includes(q);

    const cls = String(
      s?.assetClass || s?.asset_class || s?.category || "",
    ).toLowerCase();
    const matchAsset =
      activeAssetFilters.length === 0 ||
      activeAssetFilters.some(
        (f) => cls.includes(f) || (f === "stock" && cls === ""),
      );

    return matchQuery && matchAsset;
  });

  // Filter modal helpers
  const openFilterModal = useCallback(() => {
    if (!isDateRoundTrip.current) {
      setTempAssetFilters(activeAssetFilters);
      setTempStartDate(activeStartDate);
      setTempEndDate(activeEndDate);
    }
    isDateRoundTrip.current = false;
    setShowFilterModal(true);
  }, [activeAssetFilters, activeStartDate, activeEndDate]);

  const applyFilters = () => {
    setActiveAssetFilters(tempAssetFilters);
    setActiveStartDate(tempStartDate);
    setActiveEndDate(tempEndDate);
    setShowFilterModal(false);
  };

  const resetTempFilters = () => {
    setTempAssetFilters([]);
    setTempStartDate("");
    setTempEndDate("");
  };

  const openDatePicker = (target: "start" | "end") => {
    setDateTarget(target);
    isDateRoundTrip.current = true;
    setShowFilterModal(false);
    setShowDatePicker(true);
  };

  const handleSelectDate = (date: string) => {
    if (dateTarget === "start") {
      setTempStartDate(date);
      if (tempEndDate && new Date(date) > new Date(tempEndDate))
        setTempEndDate(date);
    } else {
      setTempEndDate(date);
      if (tempStartDate && new Date(date) < new Date(tempStartDate))
        setTempStartDate(date);
    }
    setShowDatePicker(false);
    openFilterModal();
  };

  const activeFilters = [
    ...activeAssetFilters.map((k) => ({
      key: `asset:${k}`,
      label: ASSET_FILTERS.find((f) => f.key === k)?.label ?? k,
    })),
    ...(activeStartDate
      ? [{ key: "startDate", label: `From: ${activeStartDate}` }]
      : []),
    ...(activeEndDate
      ? [{ key: "endDate", label: `To: ${activeEndDate}` }]
      : []),
  ];

  const removeFilter = (key: string) => {
    if (key.startsWith("asset:"))
      setActiveAssetFilters((p) =>
        p.filter((v) => v !== key.replace("asset:", "")),
      );
    else if (key === "startDate") setActiveStartDate("");
    else if (key === "endDate") setActiveEndDate("");
  };

  const clearAllFilters = () => {
    setActiveAssetFilters([]);
    setActiveStartDate("");
    setActiveEndDate("");
  };

  const renderItem = ({ item }: { item: any }) => {
    const ticker = String(item?.tickerSymbol || "").toUpperCase();
    const company = String(item?.companyName || item?.name || "");
    const price = Number(item?.currentPrice || item?.price || 0);
    const bracs = Number(item?.bracsReward || item?.bracs || 280);
    const logo = item?.logo || item?.image || "";

    return (
      <TouchableOpacity
        style={[styles.resultRow, { borderBottomColor: C.border }]}
        onPress={() =>
          router.push(`/portfolio/company/${item.tickerSymbol}` as any)
        }
        activeOpacity={0.75}
      >
        {/* Logo */}
        <Image
          source={{
            uri:
              logo && !String(logo).startsWith("/stock")
                ? logo
                : getTextImage(ticker, C),
          }}
          style={[styles.resultLogo, { backgroundColor: C.inputBg }]}
        />

        {/* Name */}
        <View style={styles.resultMeta}>
          <ThemedText style={[styles.resultTicker, { color: C.text }]}>
            {ticker}
          </ThemedText>
          <ThemedText
            style={[styles.resultCompany, { color: C.muted }]}
            numberOfLines={1}
          >
            {company}
          </ThemedText>
        </View>

        {/* Price + Bracs */}
        <View style={styles.resultRight}>
          <ThemedText style={[styles.resultPrice, { color: C.text }]}>
            {priceFormatter(price, 2)}
          </ThemedText>
          <ThemedText style={[styles.resultBracs, { color: C.muted }]}>
            {bracs}bracs
          </ThemedText>
        </View>

        {/* Cart icon */}
        <TouchableOpacity
          style={[styles.cartBtn]}
          onPress={() =>
            router.push(`/portfolio/company/${item.tickerSymbol}` as any)
          }
        >
          <ShoppingCart size={18} color={C.muted} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <View style={{ width: 44 }} />
        <TouchableOpacity onPress={openFilterModal} style={styles.filterBtn}>
          <Setting4 size={20} color={C.text} variant='Outline' />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View
        style={[
          styles.searchBar,
          {
            borderColor: C.primary,
            backgroundColor: C.background,
          },
        ]}
      >
        <SearchNormal1 size={18} color={C.muted} />
        <TextInput
          ref={inputRef}
          style={[styles.searchInput, { color: C.text }]}
          placeholder='Search stocks, ETFs, gold…'
          placeholderTextColor={C.muted}
          value={query}
          onChangeText={setQuery}
          returnKeyType='search'
          autoCorrect={false}
          autoCapitalize='none'
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <CloseCircle size={18} color={C.muted} variant='Bold' />
          </TouchableOpacity>
        )}
      </View>

      {/* Active filter pills */}
      {activeFilters.length > 0 && (
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
                  {
                    backgroundColor: C.googleBg,
                    borderColor: C.fingerBorder,
                  },
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
              Clear all
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Results */}
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredStocks}
          keyExtractor={(item, i) => String(item?.tickerSymbol || i)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps='handled'
          ListEmptyComponent={
            query.length > 0 ? (
              <ThemedText style={[styles.emptyText, { color: C.muted }]}>
                {'No results for "' + query + '"'}
              </ThemedText>
            ) : null
          }
        />
      )}

      {/* ── Filter Modal (same design as transaction page) ── */}
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
              {/* Asset Class */}
              <ThemedText style={[styles.filterHeading, { color: C.muted }]}>
                Asset Class
              </ThemedText>
              <View style={styles.filterList}>
                {ASSET_FILTERS.map((asset) => {
                  const active = tempAssetFilters.includes(asset.key);
                  return (
                    <TouchableOpacity
                      key={asset.key}
                      style={styles.filterOptionRow}
                      onPress={() =>
                        setTempAssetFilters((prev) =>
                          toggleItem(prev, asset.key),
                        )
                      }
                    >
                      <ThemedText
                        style={[styles.filterOptionText, { color: C.text }]}
                      >
                        {asset.label}
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

              {/* Date Range */}
              <ThemedText
                style={[
                  styles.filterHeading,
                  { color: C.muted, marginTop: 12 },
                ]}
              >
                Date Range
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
                      {tempStartDate || "Select date"}
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
                      {tempEndDate || "Select date"}
                    </ThemedText>
                  </TouchableOpacity>
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
  screen: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  filterBtn: { padding: 4 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    marginTop: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },

  // active filter pills  (identical to transaction page)
  activeFiltersWrap: {
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  filterPillsRow: { gap: 8, paddingRight: 10 },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  filterPillText: { fontSize: 10 },
  clearFiltersText: {
    fontSize: 10,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: { paddingHorizontal: 16, paddingBottom: 32 },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 14 },

  // Result row
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  resultLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  resultMeta: { flex: 1 },
  resultTicker: { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  resultCompany: { fontSize: 12 },
  resultRight: { alignItems: "flex-end" },
  resultPrice: { fontSize: 13, fontWeight: "700" },
  resultBracs: { fontSize: 11, marginTop: 2 },
  cartBtn: { paddingLeft: 8 },

  // Filter modal — identical layout to transaction page
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  calendarCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D0D0D0",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },
  filterHeading: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  filterList: { marginBottom: 4 },
  filterOptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E4E8",
  },
  filterOptionText: { fontSize: 14 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: { color: "#fff", fontSize: 12, fontWeight: "700" },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
  },
  dateInputWrap: { flex: 1 },
  dateLabel: { fontSize: 11, marginBottom: 4 },
  dateInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dateDivider: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  dateDividerLine: { width: 12, height: 2, borderRadius: 1 },
  modalActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
  },
  resetButton: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 20,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  resetText: { fontSize: 14, fontWeight: "600" },
});
