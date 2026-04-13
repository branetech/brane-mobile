import Back from "@/components/back";
import { StockItemCard } from "@/components/home/cards";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { palette } from "@/constants";
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
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

type FilterTab = "All" | "Stocks" | "Gold" | "ETFs" | "REITs";

const FILTER_TABS: FilterTab[] = ["All", "Stocks", "Gold", "ETFs", "REITs"];
const CATEGORY_MAP: Record<FilterTab, string | string[] | null> = {
  All: null,
  Stocks: "stocks",
  Gold: "gold",
  ETFs: "etfs",
  REITs: ["indexes", "fixed-income"],
};

const toArray = (v: any): any[] =>
  Array.isArray(v)
    ? v
    : Array.isArray(v?.data)
      ? v.data
      : Array.isArray(v?.records)
        ? v.records
        : Array.isArray(v?.data?.records)
          ? v.data.records
          : [];

const getCategory = (s: any): string =>
  String(
    s?.braneStockCategory ??
      s?.assetClass ??
      s?.asset_class ??
      s?.category ??
      "stocks",
  ).toLowerCase();

const groupByCategory = (stocks: any[]): Record<string, any[]> =>
  stocks.reduce(
    (acc, s) => {
      const cat = getCategory(s);
      (acc[cat] ??= []).push(s);
      return acc;
    },
    {} as Record<string, any[]>,
  );

const categoryLabel = (cat: string): string =>
  ({
    stocks: "Stocks",
    gold: "Gold",
    etfs: "ETFs",
    "fixed-income": "Fixed Income",
    indexes: "Indexes",
    reits: "REITs",
  })[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1);

const num = (v: any) => Number(v ?? 0);

export default function MyHoldingsScreen() {
  const router = useRouter();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [hideBalance, setHideBalance] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [summary, setSummary] = useState({
    currentValue: 0,
    investedValue: 0,
    totalReturns: 0,
    returnsPct: 0,
    transactionCount: 0,
    startDate: "—",
  });

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

  const handleStockClick = (tickerSymbol: string) => {
    router.push(`/(tabs)/(portfolio)/my-holdings/${tickerSymbol}` as any);
  };

  const fetchSummary = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    try {
      const [walletRes, txRes]: [any, any] = await Promise.all([
        BaseRequest.get(STOCKS_SERVICE.WALLET_USER),
        BaseRequest.get(TRANSACTION_SERVICE.STOCK_TRANSACTION_LIST),
      ]);
      const wallet = walletRes?.data ?? walletRes;
      const cv = num(wallet?.portfolioValue ?? wallet?.currentValue);
      const iv = num(wallet?.investedValue ?? wallet?.costBasis);
      const ret = cv - iv;
      const txList = toArray(txRes);
      const earliest = txList.reduce(
        (o: any, t: any) =>
          new Date(t.createdAt ?? t.date ?? 0) <
          new Date(o.createdAt ?? o.date ?? 0)
            ? t
            : o,
        txList[0],
      );
      const startDate =
        txList.length > 0
          ? new Date(
              earliest?.createdAt ?? earliest?.date ?? 0,
            ).toLocaleDateString("en-GB", { month: "short", day: "2-digit" })
          : "—";
      setSummary({
        currentValue: cv,
        investedValue: iv,
        totalReturns: ret,
        returnsPct: iv > 0 ? (ret / iv) * 100 : 0,
        transactionCount: txList.length,
        startDate,
      });
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

  const filteredHoldings = useMemo(() => {
    const all = collection(data);
    const cat = CATEGORY_MAP[activeTab];
    if (!cat) return all;
    return all.filter((item: StockInterface) =>
      Array.isArray(cat)
        ? cat.includes(item.braneStockCategory ?? "")
        : item.braneStockCategory === cat,
    );
  }, [data, activeTab]);

  const grouped = useMemo(
    () => groupByCategory(filteredHoldings),
    [filteredHoldings],
  );

  const diversityCount = useMemo(
    () => new Set(collection(data).map(getCategory)).size,
    [data],
  );
  const totalUnits = useMemo(
    () =>
      collection(data).reduce(
        (s: number, x: any) => s + num(x?.quantity ?? x?.units),
        0,
      ),
    [data],
  );

  const groupVal = (list: any[]) =>
    list.reduce((s, x) => s + num(x?.currentValue ?? x?.value), 0);
  const groupPnl = (list: any[]) =>
    list.reduce((s, x) => s + num(x?.unrealizedPnl ?? x?.pnl), 0);
  const groupPct = (list: any[]) => {
    const cost = list.reduce(
      (s, x) => s + num(x?.costBasis ?? x?.investedValue),
      0,
    );
    const val = groupVal(list);
    return cost > 0 ? ((val - cost) / cost) * 100 : 0;
  };
  const totalPortfolioVal = useMemo(
    () => Object.values(grouped).reduce((s, l) => s + groupVal(l), 0),
    [grouped],
  );
  const groupShare = (list: any[]) =>
    totalPortfolioVal > 0
      ? Math.round((groupVal(list) / totalPortfolioVal) * 100)
      : 0;

  const mask = (v: string) => (hideBalance ? "****" : v);
  const {
    currentValue,
    investedValue,
    totalReturns,
    returnsPct,
    transactionCount,
    startDate,
  } = summary;
  const returnsUp = totalReturns >= 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
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
        {/* Summary Card */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: "rgba(172, 127, 94, 0.1)" },
          ]}
        >
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
                    fill={palette.brandDeep}
                  />
                </Svg>
              </View>
            ))}
          </View>

          <View style={styles.valuesRow}>
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
              <ThemedText style={styles.changeGreen}>
                ▲ ({returnsUp ? "+" : ""}
                {returnsPct.toFixed(2)}%)
              </ThemedText>
            </View>
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
                  style={{ color: palette.ink, fontSize: 12, fontWeight: "800" }}
                >
                  {mask(priceFormatter(totalReturns, 2))}
                </ThemedText>
              </ThemedText>
            </View>
          </View>

          <View style={[styles.horizDivider, { backgroundColor: C.border }]} />

          <View style={styles.statsRow}>
            {[
              {
                label: "Diversity",
                value: `${diversityCount} assets`,
                align: "flex-start",
              },
              {
                label: "Total Units",
                value: String(totalUnits),
                align: "center",
              },
              {
                label: "Transactions",
                value: String(transactionCount),
                align: "center",
              },
              { label: "Since", value: startDate, align: "flex-end" },
            ].map(({ label, value, align }, i, arr) => (
              <React.Fragment key={label}>
                <View style={{ flex: 1, alignItems: align as any }}>
                  <ThemedText style={[styles.statLabel, { color: C.muted }]}>
                    {label}
                  </ThemedText>
                  <ThemedText style={[styles.statValue, { color: C.text }]}>
                    {value}
                  </ThemedText>
                </View>
                {i < arr.length - 1 && (
                  <View
                    style={[styles.statDivider, { backgroundColor: C.border }]}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsRow}>
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    activeTab === tab ? C.googleBg : "transparent",
                },
              ]}
            >
              <ThemedText style={[styles.tabText, { color: C.primary }]}>
                {tab}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Holdings Groups */}
        {Object.entries(grouped).map(([cls, stocks]) => {
          const isOpen = openGroups[cls] !== false;
          const pnl = groupPnl(stocks);
          const pct = groupPct(stocks);
          const positive = pnl >= 0;
          const pnlColor = positive ? palette.brandMid : palette.error;

          return (
            <View key={cls} style={styles.group}>
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
                    ({groupShare(stocks)}%)
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

              {isOpen &&
                stocks.map((stock, idx) => (
                  <View key={stock?.id ?? idx}>
                    <StockItemCard
                      stockName={stock.tickerSymbol}
                      tickerSymbol={stock.tickerSymbol}
                      companyName={stock.companyName}
                      currentPrice={stock.currentPrice}
                      logo={stock.logo}
                      priceChange={stock.priceChange as any}
                      percentage={stock.percentage as any}
                      variant="list"
                      onClick={() => handleStockClick(stock.tickerSymbol)}
                      showCartIcon={false}
                      ticker={stock?.ticker}
                    />
                  </View>
                ))}
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
  changeGreen: { fontSize: 12, color: palette.brandMid, marginTop: 3 },
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
  tabsRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 20, alignItems: "center" },
  tabText: { fontSize: 13, fontWeight: "500" },
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
});
