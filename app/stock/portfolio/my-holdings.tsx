import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { StockInterface } from "@/utils/constants";
import { collection, priceFormatter } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { ArrowDown2, Eye, EyeSlash } from "iconsax-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

type Scheme = "light" | "dark";
type FilterTab = "All" | "Stocks" | "Gold" | "ETFs" | "REITs";

const FILTER_TABS: FilterTab[] = ["All", "Stocks", "Gold", "ETFs", "REITs"];

const CATEGORY_MAP: Record<FilterTab, string | string[] | null> = {
  All: null,
  Stocks: "stocks",
  Gold: "gold",
  ETFs: "etfs",
  REITs: ["indexes", "fixed-income"],
};

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

const getCategory = (stock: any): string =>
  String(
    stock?.braneStockCategory ||
      stock?.assetClass ||
      stock?.asset_class ||
      stock?.category ||
      "stocks",
  ).toLowerCase();

const groupByCategory = (stocks: any[]): Record<string, any[]> => {
  const groups: Record<string, any[]> = {};
  for (const s of stocks) {
    const cat = getCategory(s);
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  }
  return groups;
};

const categoryLabel = (cat: string): string => {
  const map: Record<string, string> = {
    stocks: "Stocks",
    gold: "Gold",
    etfs: "ETFs",
    "fixed-income": "Fixed Income",
    indexes: "Indexes",
    reits: "REITs",
  };
  return map[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1);
};

const fallbackUrl = (text: string) =>
  `https://dummyimage.com/80x80/F5F5F5/013D25&text=${encodeURIComponent(
    (text || "ST").slice(0, 2).toUpperCase(),
  )}`;

export default function MyHoldingsScreen() {
  const router = useRouter();
  const scheme: Scheme = useColorScheme() === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [hideBalance, setHideBalance] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [currentValue, setCurrentValue] = useState(0);
  const [investedValue, setInvestedValue] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);
  const [returnsPct, setReturnsPct] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [startDate, setStartDate] = useState("—");

  // Primary data source — full stock list with braneStockCategory
  const {
    data,
    isLoading,
    onRefresh: revalidate,
  } = useRequest(STOCKS_SERVICE.STOCKS, {
    initialValue: [],
    params: { currentPage: 1, perPage: 400 },
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    showError: true,
  });

  // Wallet summary + transaction history
  const fetchSummary = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    try {
      const [walletRes, txRes]: [any, any] = await Promise.all([
        BaseRequest.get(STOCKS_SERVICE.WALLET_USER),
        BaseRequest.get(TRANSACTION_SERVICE.STOCK_TRANSACTION_LIST),
      ]);
      const wallet = walletRes?.data || walletRes;
      const cv = Number(wallet?.portfolioValue ?? wallet?.currentValue ?? 0);
      const iv = Number(wallet?.investedValue ?? wallet?.costBasis ?? 0);
      const ret = cv - iv;
      setCurrentValue(cv);
      setInvestedValue(iv);
      setTotalReturns(ret);
      setReturnsPct(iv > 0 ? (ret / iv) * 100 : 0);
      const txList = toArray(txRes);
      setTransactionCount(txList.length);
      if (txList.length > 0) {
        const earliest = txList.reduce(
          (oldest: any, t: any) =>
            new Date(t.createdAt ?? t.date ?? 0) <
            new Date(oldest.createdAt ?? oldest.date ?? 0)
              ? t
              : oldest,
          txList[0],
        );
        const d = new Date(earliest.createdAt ?? earliest.date ?? 0);
        setStartDate(
          d.toLocaleDateString("en-GB", { month: "short", day: "2-digit" }),
        );
      }
    } catch (e) {
      catchError(e);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleRefresh = useCallback(async () => {
    revalidate();
    await fetchSummary(true);
  }, [revalidate, fetchSummary]);

  const topPicks = useMemo(
    () => collection(data)?.filter((item: StockInterface) => item.isTopPick),
    [data],
  );

  const filteredHoldings = useMemo(() => {
    const _collection = collection(data);
    const cat = CATEGORY_MAP[activeTab];
    if (!cat) return _collection;
    if (Array.isArray(cat))
      return _collection.filter((item: StockInterface) =>
        cat.includes(item.braneStockCategory ?? ""),
      );
    return _collection.filter(
      (item: StockInterface) => item.braneStockCategory === cat,
    );
  }, [data, activeTab]);

  const grouped = useMemo(
    () => groupByCategory(filteredHoldings),
    [filteredHoldings],
  );

  // Derive stats directly from the holdings list
  const diversityCount = useMemo(
    () => new Set(collection(data).map(getCategory)).size,
    [data],
  );
  const totalUnits = useMemo(
    () =>
      collection(data).reduce(
        (s: number, x: any) => s + Number(x?.quantity ?? x?.units ?? 0),
        0,
      ),
    [data],
  );

  const totalPortfolioVal = useMemo(
    () =>
      Object.values(grouped).reduce(
        (s, list) =>
          s +
          list.reduce(
            (ss, x) => ss + Number(x?.currentValue ?? x?.value ?? 0),
            0,
          ),
        0,
      ),
    [grouped],
  );

  const groupVal = (list: any[]) =>
    list.reduce((s, x) => s + Number(x?.currentValue ?? x?.value ?? 0), 0);
  const groupPnl = (list: any[]) =>
    list.reduce((s, x) => s + Number(x?.unrealizedPnl ?? x?.pnl ?? 0), 0);
  const groupPct = (list: any[]) => {
    const cost = list.reduce(
      (s, x) => s + Number(x?.costBasis ?? x?.investedValue ?? 0),
      0,
    );
    const val = groupVal(list);
    return cost > 0 ? ((val - cost) / cost) * 100 : 0;
  };
  const groupShare = (list: any[]) =>
    totalPortfolioVal > 0
      ? Math.round((groupVal(list) / totalPortfolioVal) * 100)
      : 0;

  const mask = (v: string) => (hideBalance ? "****" : v);
  const returnsUp = totalReturns >= 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      {/* Header */}
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          My Holdings
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing || isLoading}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* ── Summary Card ── */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: "rgba(172, 127, 94, 0.1)" },
          ]}
        >
          {/* Decorative background shapes */}
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {[0, 44, 88].map((offsetX) => (
              <View
                key={offsetX}
                style={{
                  position: "absolute",
                  bottom: -10,
                  left: offsetX,
                  opacity: 0.12,
                }}
              >
                <Svg width={110} height={30} viewBox="0 0 87 129">
                  <Path
                    d="M64.2362 0C63.6737 0 63.1594 0.317997 62.9081 0.821294L0.158244 126.493C-0.334553 127.48 0.383172 128.641 1.48631 128.641H21.9187C22.4812 128.641 22.9954 128.323 23.2467 127.819L85.9966 2.14755C86.4894 1.16061 85.7717 0 84.6686 0H64.2362Z"
                    fill="#013D25"
                  />
                </Svg>
              </View>
            ))}
          </View>

          {/* Values row */}
          <View style={styles.valuesRow}>
            {/* Current Value */}
            <View style={{ flex: 1 }}>
              <View style={styles.labelRow}>
                <ThemedText style={[styles.valueLabel, { color: C.muted }]}>
                  Current Value
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setHideBalance((v) => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {hideBalance ? (
                    <EyeSlash size={15} color={C.muted} variant="Outline" />
                  ) : (
                    <Eye size={15} color={C.muted} variant="Outline" />
                  )}
                </TouchableOpacity>
              </View>
              <ThemedText style={[styles.bigAmount, { color: C.text }]}>
                {mask(priceFormatter(currentValue, 2))}
              </ThemedText>
              <View style={styles.changeRow}>
                <ThemedText style={styles.changeGreen}>
                  ▲ ({returnsUp ? "+" : ""}
                  {returnsPct.toFixed(2)}%)
                </ThemedText>
              </View>
            </View>

            {/* Invested Value */}
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <ThemedText style={[styles.valueLabel, { color: C.muted }]}>
                Invested Value
              </ThemedText>
              <ThemedText style={[styles.bigAmount, { color: C.text }]}>
                {mask(priceFormatter(investedValue, 2))}
              </ThemedText>
              <ThemedText style={[styles.returnsText, { color: C.muted }]}>
                Total returns:{" "}
                <ThemedText
                  style={{
                    color: returnsUp ? "#0B0014" : "#0B0014",
                    fontSize: 12,
                    fontWeight: "800",
                  }}
                >
                  {mask(priceFormatter(totalReturns, 2))}
                </ThemedText>
              </ThemedText>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.horizDivider, { backgroundColor: C.border }]} />

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.statLabel, { color: C.muted }]}>
                Diversity
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: C.text }]}>
                {diversityCount} assets
              </ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: C.border }]} />
            <View style={{ flex: 1, alignItems: "center" }}>
              <ThemedText style={[styles.statLabel, { color: C.muted }]}>
                Total Units
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: C.text }]}>
                {totalUnits}
              </ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: C.border }]} />
            <View style={{ flex: 1, alignItems: "center" }}>
              <ThemedText style={[styles.statLabel, { color: C.muted }]}>
                Transactions
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: C.text }]}>
                {transactionCount}
              </ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: C.border }]} />
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <ThemedText style={[styles.statLabel, { color: C.muted }]}>
                Since
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: C.text }]}>
                {startDate}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* ── Filter Tabs ── */}
        <View style={styles.tabsRow}>
          {FILTER_TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
                style={[
                  styles.tab,
                  active
                    ? { backgroundColor: C.googleBg }
                    : { backgroundColor: "none" },
                ]}
              >
                <ThemedText
                  style={[
                    styles.tabText,
                    { color: active ? C.primary : C.primary },
                  ]}
                >
                  {tab}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Holdings Groups ── */}
        {Object.entries(grouped).map(([cls, stocks]) => {
          const isOpen = openGroups[cls] !== false;
          const pnl = groupPnl(stocks);
          const pct = groupPct(stocks);
          const totalVal = groupVal(stocks);
          const share = groupShare(stocks);
          const positive = pnl >= 0;
          const pnlColor = positive ? "#0C8F5C" : "#D50000";

          return (
            <View key={cls} style={styles.group}>
              {/* Section header */}
              <TouchableOpacity
                style={styles.groupHeader}
                onPress={() =>
                  setOpenGroups((prev) => ({ ...prev, [cls]: !isOpen }))
                }
                activeOpacity={0.7}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <ThemedText style={[styles.groupTitle, { color: C.text }]}>
                    {categoryLabel(cls)}
                  </ThemedText>
                  <ThemedText style={[styles.groupShare, { color: C.muted }]}>
                    ({share}%)
                  </ThemedText>
                </View>
                <View style={styles.groupRight}>
                  <ThemedText style={[styles.groupVal, { color: pnlColor }]}>
                    {positive ? "" : "-"}
                    {priceFormatter(Math.abs(pnl), 2)}
                  </ThemedText>
                  <ThemedText style={[styles.groupPct, { color: pnlColor }]}>
                    {positive ? "▲" : "▼"} ({positive ? "+" : ""}
                    {pct.toFixed(2)}%)
                  </ThemedText>
                  <ArrowDown2
                    size={16}
                    color={C.muted}
                    variant="Outline"
                    style={
                      isOpen ? undefined : { transform: [{ rotate: "180deg" }] }
                    }
                  />
                </View>
              </TouchableOpacity>

              {/* Stock rows */}
              {isOpen &&
                stocks.map((stock, idx) => {
                  const ticker: string = stock?.tickerSymbol ?? "";
                  const name: string =
                    stock?.companyName ?? stock?.name ?? ticker ?? "—";
                  const units = Number(stock?.quantity ?? stock?.units ?? 0);
                  const val = Number(stock?.currentValue ?? stock?.value ?? 0);
                  const pnlStock = Number(
                    stock?.unrealizedPnl ?? stock?.pnl ?? 0,
                  );
                  const costStock = Number(
                    stock?.costBasis ?? stock?.investedValue ?? 1,
                  );
                  const pnlPct =
                    costStock > 0 ? (pnlStock / costStock) * 100 : 0;
                  const up = pnlStock >= 0;
                  const stockColor = up ? "#0C8F5C" : "#D50000";
                  const logoUrl: string | undefined =
                    stock?.logo ?? stock?.logoUrl ?? stock?.image;

                  return (
                    <View
                      key={stock?.id ?? idx}
                      style={[
                        styles.stockRow,
                        { backgroundColor: C.background },
                      ]}
                    >
                      <View
                        style={[
                          styles.logoCircle,
                          { backgroundColor: C.inputBg },
                        ]}
                      >
                        <Image
                          source={{
                            uri: logoUrl ?? fallbackUrl(ticker || name),
                          }}
                          style={styles.logo}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <ThemedText
                          style={[styles.stockName, { color: C.text }]}
                        >
                          {ticker || name}
                        </ThemedText>
                        <ThemedText
                          style={[styles.stockUnits, { color: C.muted }]}
                        >
                          {units.toLocaleString()} Units
                        </ThemedText>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <ThemedText
                          style={[styles.stockVal, { color: C.text }]}
                        >
                          {priceFormatter(val, 2)}
                        </ThemedText>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 3,
                            marginTop: 2,
                          }}
                        >
                          <ThemedText
                            style={{ fontSize: 12, color: stockColor }}
                          >
                            {priceFormatter(Math.abs(pnlStock), 2)}
                          </ThemedText>
                          <ThemedText
                            style={{ fontSize: 12, color: stockColor }}
                          >
                            {up ? "▲" : "▼"} ({up ? "+" : ""}
                            {pnlPct.toFixed(2)}%)
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                  );
                })}
            </View>
          );
        })}

        {Object.keys(grouped).length === 0 && (
          <View style={{ alignItems: "center", paddingTop: 60 }}>
            <ThemedText style={{ color: C.muted, textAlign: "center" }}>
              No holdings found.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 17, fontWeight: "600" },

  scroll: { paddingHorizontal: 16, paddingBottom: 40 },

  // ── Summary Card ──
  summaryCard: {
    borderRadius: 12,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginBottom: 20,
    gap: 16,
    overflow: "hidden",
  },
  valuesRow: { flexDirection: "row", gap: 8 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  valueLabel: { fontSize: 12 },
  bigAmount: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    paddingTop: 4,
  },
  changeRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  changeGreen: { fontSize: 12, color: "#0C8F5C" },
  returnsText: { fontSize: 12, marginTop: 3 },
  horizDivider: { height: StyleSheet.hairlineWidth },
  statsRow: { flexDirection: "row", alignItems: "flex-start" },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    marginHorizontal: 8,
  },
  statLabel: { fontSize: 11, marginBottom: 3 },
  statValue: { fontSize: 13, fontWeight: "600" },

  // ── Filter Tabs ──
  tabsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
  },
  tabText: { fontSize: 13, fontWeight: "500" },

  // ── Group ──
  group: { marginBottom: 4 },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  groupTitle: { fontSize: 15, fontWeight: "700" },
  groupShare: { fontSize: 14, fontWeight: "400" },
  groupRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  groupVal: { fontSize: 13, fontWeight: "600" },
  groupPct: { fontSize: 12 },

  // ── Stock Row ──
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 44, height: 44, borderRadius: 22 },
  stockName: { fontSize: 14, fontWeight: "600" },
  stockUnits: { fontSize: 12, marginTop: 2 },
  stockVal: { fontSize: 14, fontWeight: "600" },

  // ── Decorative card shapes ──
  decorShape: {
    position: "absolute",
    backgroundColor: "rgba(1, 61, 37, 0.10)",
    borderRadius: 999,
  },
  decorShape1: {
    width: 130,
    height: 90,
    bottom: -20,
    right: 50,
    transform: [{ rotate: "-20deg" }],
  },
  decorShape2: {
    width: 100,
    height: 70,
    bottom: 10,
    right: -10,
    transform: [{ rotate: "10deg" }],
  },
  decorShape3: {
    width: 80,
    height: 55,
    bottom: 35,
    right: 100,
    transform: [{ rotate: "-40deg" }],
  },
});
