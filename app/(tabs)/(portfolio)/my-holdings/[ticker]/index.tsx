import Back from "@/components/back";
import ChartComponent from "@/components/portfolio/chart";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { onAddToCheckouts } from "@/redux/slice/auth-slice";
// import { useAppState } from "@/redux/store";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import { textToImage, useRequest } from "@/services/useRequest";
import { collection, priceFormatter } from "@/utils/helpers";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { Eye, EyeSlash, Filter } from "iconsax-react-native";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useDispatch } from "react-redux";

// ─── Types ────────────────────────────────────────────────────────────────────

type MainTab = "Overview" | "History";
type HistorySubTab = "All" | "Buy" | "Sell" | "Returns";

const HISTORY_TABS: HistorySubTab[] = ["All", "Buy", "Sell", "Returns"];

const num = (v: any) => Number(v ?? 0);

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

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HoldingDetailScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { ticker } = useLocalSearchParams<{ ticker: string }>();
  const tickerSymbol = String(ticker ?? "");

  const rawScheme = useColorScheme();
  const scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const navigation = useNavigation();

  // Hide the bottom tab bar while on this screen
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: "none" } });
      return () => {
        parent?.setOptions({
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
              height: 80,
              paddingTop: 12,
              backgroundColor: C.inputBg,
            },
            default: { backgroundColor: C.inputBg, height: 80, paddingTop: 12 },
          }),
        });
      };
    }, [navigation, C.inputBg]),
  );

  // const { checkouts } = useAppState();
  // const inCart = Array.isArray(checkouts)
  //   ? checkouts.some((item: any) => item?.tickerSymbol === tickerSymbol)
  //   : false;

  const [mainTab, setMainTab] = useState<MainTab>("Overview");
  const [historyTab, setHistoryTab] = useState<HistorySubTab>("All");
  // const [timeFilter, setTimeFilter] = useState<TimeFilter>("1M");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [historyRaw, setHistoryRaw] = useState<any[]>([]);

  // ── Stock details (price, company name, logo etc.) ──
  const {
    data: stockDetail,
    isLoading: detailLoading,
    onRefresh: revalidateDetail,
  } = useRequest(STOCKS_SERVICE.DETAILS(tickerSymbol), {
    initialValue: { tickerSymbol },
    showError: true,
  });

  // ── User's holding for this ticker from wallet ──
  const { data: bracWallet, onRefresh: revalidateBrac } = useRequest(
    STOCKS_SERVICE.BRAC(tickerSymbol),
    {
      initialValue: null,
    },
  );

  // ── Historical chart data — direct fetch so we can inspect the real response ──
  const fetchHistory = useCallback(() => {
    if (!tickerSymbol) return;
    BaseRequest.get(STOCKS_SERVICE.HISTORY(tickerSymbol))
      .then((res: any) => {
        // Check every possible response shape
        const raw: any[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.records)
              ? res.records
              : Array.isArray(res?.data?.records)
                ? res.data.records
                : Array.isArray(res?.chartData)
                  ? res.chartData
                  : Array.isArray(res?.prices)
                    ? res.prices
                    : [];
        if (raw.length > 0) setHistoryRaw(raw);
      })
      .catch(() => {});
  }, [tickerSymbol]);

  // ── Fetch transaction history ──
  const fetchTransactions = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      setTxLoading(true);
      try {
        const res: any = await BaseRequest.get(
          TRANSACTION_SERVICE.BRAC(tickerSymbol),
        );
        setTransactions(toArray(res));
      } catch (e) {
        catchError(e);
      } finally {
        setTxLoading(false);
        setIsRefreshing(false);
      }
    },
    [tickerSymbol],
  );

  useEffect(() => {
    fetchHistory();
    fetchTransactions();
  }, [fetchHistory, fetchTransactions]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    revalidateDetail();
    revalidateBrac();
    fetchHistory();
    await fetchTransactions(true);
  }, [revalidateDetail, revalidateBrac, fetchHistory, fetchTransactions]);

  // ── Derived data ──
  const stock = useMemo(
    () => stockDetail || { tickerSymbol },
    [stockDetail, tickerSymbol],
  );

  const logoUri = useMemo(() => {
    const logo = (stock as any)?.logo;
    if (!logo || logo === "" || logo.startsWith("/stock"))
      return textToImage(tickerSymbol);
    return logo;
  }, [stock, tickerSymbol]);

  // Chart data filtered by time range (match About component)
  const trends = collection(historyRaw);

  const sliced = trends;
  const chartDates = sliced.map(([d]: any) => moment(d).format("Do MMM"));
  const chartValues = sliced.map(([, v]: any) => Number(v));

  const currentPrice = num((stock as any)?.currentPrice);
  const pct = num((stock as any)?.percentage);
  const ticker_raw = (stock as any)?.ticker;
  const tickerNum = Number(ticker_raw);
  const tickerIsDown = tickerNum < 0 || String(ticker_raw) === "down";
  const changeValue = !Number.isNaN(tickerNum)
    ? Math.abs(tickerNum)
    : (currentPrice * Math.abs(pct)) / 100;

  // Holding-level stats from brac wallet
  const wallet = (bracWallet as any) ?? {};
  const currentValue = num(wallet?.currentValue ?? wallet?.portfolioValue);
  const investedValue = num(wallet?.investedValue ?? wallet?.costBasis);
  const avgPrice = num(wallet?.averagePrice ?? wallet?.avgPrice);
  const unitsHeld = num(wallet?.quantity ?? wallet?.units);
  const totalGain = currentValue - investedValue;

  // Start date from earliest transaction
  const startDate = useMemo(() => {
    if (transactions.length === 0) return "—";
    const earliest = transactions.reduce(
      (o, t) =>
        new Date(t.createdAt ?? t.date ?? 0) <
        new Date(o.createdAt ?? o.date ?? 0)
          ? t
          : o,
      transactions[0],
    );
    return moment(earliest?.createdAt ?? earliest?.date).format("MMM DD");
  }, [transactions]);

  // Growth trend totals derived from transactions
  const growthTrend = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let todayAmt = 0,
      monthAmt = 0,
      dividends = 0,
      withdrawals = 0;
    transactions.forEach((t) => {
      const d = new Date(t.createdAt ?? t.date ?? 0);
      const amt = num(t.amount ?? t.value);
      const type = String(t.type ?? t.transactionType ?? "").toLowerCase();
      if (d >= todayStart) todayAmt += amt;
      if (d >= monthStart) monthAmt += amt;
      if (type.includes("dividend")) dividends += amt;
      if (type.includes("withdraw") || type.includes("sell"))
        withdrawals += amt;
    });
    return { today: todayAmt, month: monthAmt, dividends, withdrawals };
  }, [transactions]);

  // Filtered transaction list for History tab
  const filteredTx = useMemo(() => {
    if (historyTab === "All") return transactions;
    return transactions.filter((t) => {
      const type = String(t.type ?? t.transactionType ?? "").toLowerCase();
      if (historyTab === "Buy")
        return type.includes("buy") || type.includes("purchase");
      if (historyTab === "Sell") return type.includes("sell");
      if (historyTab === "Returns")
        return type.includes("dividend") || type.includes("return");
      return true;
    });
  }, [transactions, historyTab]);

  // Total return for history tab
  const totalReturn = useMemo(
    () =>
      transactions
        .filter((t) => {
          const type = String(t.type ?? t.transactionType ?? "").toLowerCase();
          return type.includes("dividend") || type.includes("return");
        })
        .reduce((s, t) => s + num(t.amount ?? t.value), 0),
    [transactions],
  );
  const returnPct = investedValue > 0 ? (totalGain / investedValue) * 100 : 0;

  const companyName = (stock as any)?.companyName ?? tickerSymbol;
  const dividendMessage = (stock as any)?.dividendMessage ?? null;

  const assetClass = String(
    (stock as any)?.assetClass ?? "stocks",
  ).toLowerCase();
  const chartColorMap: Record<string, any> = {
    stocks: "green",
    gold: "gold",
    etfs: "purple",
    indexes: "blue",
    "fixed-income": "red",
  };
  const chartColor = chartColorMap[assetClass] ?? "green";

  const isLoading = detailLoading;

  // ── Handlers ──
  const handleBuy = () => {
    dispatch(onAddToCheckouts(stock as any));
    router.push("/(tabs)/(portfolio)/checkout" as any);
  };

  const handleSell = () => {
    router.push(`/stock/withdraw` as any);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
        <View style={[styles.header, { borderBottomColor: C.border }]}>
          <Back onPress={() => router.back()} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <ThemedText style={[styles.headerTitle, { color: C.text }]}>
              {tickerSymbol}
            </ThemedText>
          </View>
          <View style={{ width: 36 }} />
        </View>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size='small' color={C.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      {/* ── Header ── */}
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <Back onPress={() => router.back()} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <ThemedText style={[styles.headerTitle, { color: C.text }]}>
            {tickerSymbol}
          </ThemedText>
          <ThemedText
            style={[styles.headerSubtitle, { color: C.muted }]}
            numberOfLines={1}
          >
            {companyName}
          </ThemedText>
        </View>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <Filter size={20} color={C.text} variant='Outline' />
        </TouchableOpacity>
      </View>

      {/* ── Dividend Banner ── */}
      {!!dividendMessage && (
        <View style={[styles.dividendBanner, { backgroundColor: C.primary }]}>
          <View style={styles.dividendDot} />
          <ThemedText style={styles.dividendText}>
            Dividend: {tickerSymbol} {dividendMessage}
          </ThemedText>
        </View>
      )}

      {/* ── Main Tabs ── */}
      <View style={[styles.mainTabRow, { borderBottomColor: C.border }]}>
        {(["Overview", "History"] as MainTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setMainTab(tab)}
            style={styles.mainTabItem}
            activeOpacity={0.8}
          >
            <ThemedText
              style={[
                styles.mainTabText,
                { color: mainTab === tab ? C.text : C.muted },
                mainTab === tab && styles.mainTabTextActive,
              ]}
            >
              {tab}
            </ThemedText>
            {mainTab === tab && (
              <View
                style={[
                  styles.mainTabUnderline,
                  { backgroundColor: C.primary },
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {mainTab === "Overview" ? (
          <OverviewTab
            C={C}
            logoUri={logoUri}
            tickerSymbol={tickerSymbol}
            currentPrice={currentPrice}
            changeValue={changeValue}
            pct={pct}
            tickerIsDown={tickerIsDown}
            chartDates={chartDates}
            chartValues={chartValues}
            chartColor={chartColor}
            currentValue={currentValue}
            investedValue={investedValue}
            avgPrice={avgPrice}
            unitsHeld={unitsHeld}
            totalGain={totalGain}
            startDate={startDate}
            txCount={transactions.length}
            growthTrend={growthTrend}
            onBuy={handleBuy}
          />
        ) : (
          <HistoryTab
            C={C}
            tickerSymbol={tickerSymbol}
            historyTab={historyTab}
            setHistoryTab={setHistoryTab}
            totalReturn={totalReturn}
            returnPct={returnPct}
            unitsHeld={unitsHeld}
            investedValue={investedValue}
            dividends={growthTrend.dividends}
            txCount={transactions.length}
            startDate={startDate}
            filteredTx={filteredTx}
            txLoading={txLoading}
          />
        )}
      </ScrollView>

      {/* ── Fixed Bottom Action Bar — Overview only ── */}
      {mainTab === "Overview" && (
        <View
          style={[
            styles.actionBar,
            { backgroundColor: C.background, borderTopColor: C.border },
          ]}
        >
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: C.primary }]}
            onPress={handleBuy}
            activeOpacity={0.85}
          >
            <ThemedText style={styles.actionBtnText}>+ Buy</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: C.primary }]}
            onPress={handleSell}
            activeOpacity={0.85}
          >
            <ThemedText style={styles.actionBtnText}>− Sell</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({
  C,
  logoUri,
  tickerSymbol,
  currentPrice,
  changeValue,
  pct,
  tickerIsDown,
  chartDates,
  chartValues,
  chartColor,
  timeFilter,
  setTimeFilter,
  currentValue,
  investedValue,
  avgPrice,
  unitsHeld,
  totalGain,
  startDate,
  txCount,
  growthTrend,
  onBuy,
}: any) {
  const [hideBalance, setHideBalance] = useState(false);
  const priceColor = tickerIsDown ? "#D50000" : "#0C8F5C";
  const gainColor = totalGain >= 0 ? "#0C8F5C" : "#D50000";
  const returnPct = investedValue > 0 ? (totalGain / investedValue) * 100 : 0;
  const mask = (v: string) => (hideBalance ? "****" : v);

  return (
    <>
      {/* Price row */}
      <View style={styles.priceRow}>
        <Image
          source={{ uri: logoUri }}
          style={[styles.logo, { backgroundColor: C.inputBg }]}
          resizeMode='contain'
        />
        <View style={{ flex: 1 }}>
          <ThemedText
            style={[styles.priceText, { color: C.text, paddingTop: 10 }]}
          >
            {priceFormatter(currentPrice, 2)}
          </ThemedText>
          <View style={styles.changeRow}>
            <ThemedText style={[styles.changeAmt, { color: priceColor }]}>
              {tickerIsDown ? "-" : "+"}
              {priceFormatter(changeValue, 2)}
            </ThemedText>
            <ThemedText style={[styles.changePct, { color: priceColor }]}>
              {tickerIsDown ? "▼" : "▲"} {Math.abs(pct).toFixed(2)}%
            </ThemedText>
            <ThemedText style={[styles.dot, { color: C.muted }]}>
              • Today
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Chart (full bleed) */}
      <View style={styles.chartWrap}>
        {chartValues.length > 1 ? (
          <ChartComponent
            dates={chartDates}
            values={chartValues}
            colorType={chartColor}
          />
        ) : (
          <View
            style={[styles.chartSkeleton, { backgroundColor: C.inputBg }]}
          />
        )}
      </View>

      {/* Time filters — plain text */}
      {/* <View style={[styles.timeRow, { borderBottomColor: C.border }]}>
        {TIME_FILTERS.map((tf) => (
          <TouchableOpacity
            key={tf}
            onPress={() => setTimeFilter(tf)}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.timeTxt,
                { color: timeFilter === tf ? C.text : C.muted },
                timeFilter === tf && styles.timeTxtActive,
              ]}
            >
              {tf}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View> */}

      {/* Stats — no card background */}
      <View style={styles.statsSection}>
        {/* Row 1: Current Value | Invested Value */}
        <View style={styles.statsTopRow}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginBottom: 4,
              }}
            >
              <ThemedText style={[styles.statLabel, { color: C.muted }]}>
                Current Value
              </ThemedText>
              <TouchableOpacity
                onPress={() => setHideBalance((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {hideBalance ? (
                  <EyeSlash size={14} color={C.muted} variant='Outline' />
                ) : (
                  <Eye size={14} color={C.muted} variant='Outline' />
                )}
              </TouchableOpacity>
            </View>
            <ThemedText
              style={[styles.statBigVal, { color: C.text, paddingTop: 5 }]}
            >
              {mask(priceFormatter(currentValue, 2))}
            </ThemedText>
            <ThemedText style={[styles.statChange, { color: gainColor }]}>
              {totalGain >= 0 ? "▲" : "▼"} ({returnPct >= 0 ? "+" : ""}
              {returnPct.toFixed(2)}%)
            </ThemedText>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <ThemedText
              style={[styles.statLabel, { color: C.muted, marginBottom: 4 }]}
            >
              Invested Value
            </ThemedText>
            <ThemedText
              style={[styles.statBigVal, { color: C.text, paddingTop: 5 }]}
            >
              {mask(priceFormatter(investedValue, 2))}
            </ThemedText>
            <ThemedText style={[styles.statMuted, { color: C.muted }]}>
              Avr Price: {priceFormatter(avgPrice, 2)}/unit
            </ThemedText>
          </View>
        </View>

        <View style={[styles.horizDivider, { backgroundColor: C.border }]} />

        {/* Row 2: 4 mini stats */}
        <View style={styles.statsBottomRow}>
          {[
            { label: "Units held", value: String(unitsHeld) },
            { label: "Total Gain", value: priceFormatter(totalGain, 2) },
            { label: "Start Date", value: startDate },
            { label: "Transactions", value: String(txCount) },
          ].map(({ label, value }, i, arr) => (
            <React.Fragment key={label}>
              <View
                style={{
                  flex: 1,
                  alignItems:
                    i === 0
                      ? "flex-start"
                      : i === arr.length - 1
                        ? "flex-end"
                        : "center",
                }}
              >
                <ThemedText
                  style={[
                    styles.statLabel,
                    { color: C.muted, marginBottom: 3 },
                  ]}
                >
                  {label}
                </ThemedText>
                <ThemedText style={[styles.statMiniVal, { color: C.text }]}>
                  {value}
                </ThemedText>
              </View>
              {i < arr.length - 1 && (
                <View
                  style={[styles.vertDivider, { backgroundColor: C.border }]}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Growth Trend — label lives inside the card */}
      <View style={styles.growthCard}>
        <ThemedText style={styles.growthCardTitle}>Growth Trend</ThemedText>
        <View style={{ flexDirection: "row" }}>
          {[
            { label: "Today", value: priceFormatter(growthTrend.today, 2) },
            {
              label: "This Month",
              value: priceFormatter(growthTrend.month, 2),
            },
            {
              label: "Dividends",
              value: priceFormatter(growthTrend.dividends, 2),
            },
            {
              label: "Withdrawal",
              value: priceFormatter(growthTrend.withdrawals, 2),
            },
          ].map(({ label, value }, i, arr) => (
            <React.Fragment key={label}>
              <View style={styles.growthItem}>
                <ThemedText style={styles.growthVal}>{value}</ThemedText>
                <ThemedText style={styles.growthLabel}>{label}</ThemedText>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Sally Recommendations */}
      <View style={styles.sallyCard}>
        <View style={styles.sallyHeaderRow}>
          <Svg width={24} height={24} viewBox='0 0 24 24' fill='none'>
            <Path
              d='M8.69629 21.1113C10.865 20.4972 13.1484 20.4965 15.3174 21.1094C15.4361 21.1447 15.4839 21.2532 15.4609 21.3418C15.4244 21.4475 15.3354 21.5 15.2598 21.5C15.2564 21.5 15.2495 21.5003 15.2412 21.499C15.234 21.4979 15.2296 21.4964 15.2285 21.4961L15.2178 21.4922L15.207 21.4893L14.8115 21.3848C12.834 20.897 10.7757 20.9309 8.80957 21.4873C8.69063 21.5194 8.58645 21.4482 8.5625 21.3604L8.55957 21.3477L8.55273 21.3105C8.54588 21.223 8.6029 21.1371 8.69043 21.1133L8.69629 21.1113Z'
              fill='#008753'
              stroke='#008753'
            />
            <Path
              d='M12.5049 6.75879C11.9338 6.50578 11.2435 6.71954 10.918 7.27734L10.916 7.28027L9.84668 9.14062L9.84473 9.14258C9.52454 9.70621 9.47163 10.358 9.79688 10.9199L9.7998 10.9248C10.1185 11.4608 10.6951 11.7508 11.3359 11.7578L10.916 12.4902V12.4912C10.5821 13.0756 10.7791 13.829 11.3613 14.1807V14.1816C11.3638 14.1832 11.3667 14.184 11.3691 14.1855C11.3721 14.1873 11.3749 14.1897 11.3779 14.1914V14.1904C11.58 14.3141 11.8013 14.3594 12 14.3594C12.4397 14.3593 12.8535 14.1233 13.082 13.7314L13.083 13.7285L14.1523 11.8711C14.4769 11.3129 14.5266 10.6493 14.2021 10.0889L14.1992 10.084C13.8802 9.54763 13.3034 9.2576 12.6621 9.25098L13.083 8.51855L13.084 8.51758C13.421 7.92764 13.2172 7.16465 12.6221 6.81738L12.5049 6.75879ZM8.35938 16.6533L8.13867 16.5039C5.9201 15.0154 4.46984 12.4535 4.46973 10.0498C4.46973 7.75048 5.49162 5.60497 7.29102 4.1709L7.29395 4.16895C9.08371 2.72596 11.4277 2.17983 13.7217 2.6875H13.7227C15.9082 3.16588 17.7908 4.62076 18.7617 6.58105V6.58203C20.6459 10.3691 18.8404 14.5226 15.9004 16.5049L15.6797 16.6533V17.6377C15.6896 17.9062 15.6805 18.2015 15.4658 18.4258C15.3048 18.5868 15.0376 18.7099 14.5898 18.71H9.45996C9.04783 18.71 8.72882 18.6571 8.53809 18.4609C8.35942 18.2768 8.34927 18.0507 8.35938 17.7676V16.6533Z'
              fill='#008753'
              stroke='#008753'
            />
          </Svg>
          <ThemedText style={styles.sallyHeaderTxt}>
            Sally Recommendations
          </ThemedText>
        </View>
        <ThemedText style={styles.sallyTitle}>
          {tickerSymbol} is rising
        </ThemedText>
        <ThemedText style={styles.sallyBody}>
          Nibh turpis ut sem dignissim tincidunt augue pellentesque urna velit.
          Ipsum dis a dolor enim arcu in at massa habise.
        </ThemedText>
        <TouchableOpacity
          style={styles.sallyBtn}
          onPress={onBuy}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.sallyBtnTxt}>+ Buy More</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={{ height: 24 }} />
    </>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────

function HistoryTab({
  C,
  tickerSymbol,
  historyTab,
  setHistoryTab,
  totalReturn,
  returnPct,
  unitsHeld,
  investedValue,
  dividends,
  txCount,
  startDate,
  filteredTx,
  txLoading,
}: any) {
  const returnsUp = totalReturn >= 0;

  return (
    <>
      {/* Sub-tabs — pill style */}
      <View style={styles.subTabRow}>
        {HISTORY_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setHistoryTab(tab)}
            style={[
              styles.subTab,
              historyTab === tab
                ? { backgroundColor: C.googleBg }
                : { backgroundColor: "transparent" },
            ]}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.subTabTxt, { color: C.primary }]}>
              {tab}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total Return — plain background, no card */}
      <View style={styles.returnSection}>
        <ThemedText style={[styles.returnLabel, { color: C.muted }]}>
          Total Return on {tickerSymbol}
        </ThemedText>
        <ThemedText style={[styles.returnAmt, { color: C.text }]}>
          {returnsUp ? "+" : "−"}₦
          {Math.abs(totalReturn).toLocaleString("en", {
            minimumFractionDigits: 2,
          })}
        </ThemedText>
        <ThemedText
          style={[
            styles.returnPct,
            { color: returnsUp ? "#0C8F5C" : "#D50000" },
          ]}
        >
          {returnsUp ? "▲" : "▼"} ({returnsUp ? "+" : ""}
          {returnPct.toFixed(2)}%)
        </ThemedText>

        {/* 4 mini stats */}
        <View style={[styles.statsBottomRow, { marginTop: 16 }]}>
          {[
            { label: "Holdings", value: String(unitsHeld) },
            { label: "Invested", value: startDate },
            { label: "Dividends", value: String(Math.round(dividends)) },
            { label: "Transactions", value: startDate },
          ].map(({ label, value }, i, arr) => (
            <React.Fragment key={label}>
              <View
                style={{
                  flex: 1,
                  alignItems:
                    i === 0
                      ? "flex-start"
                      : i === arr.length - 1
                        ? "flex-end"
                        : "center",
                }}
              >
                <ThemedText
                  style={[styles.statMiniVal, { color: C.text, fontSize: 15 }]}
                >
                  {value}
                </ThemedText>
                <ThemedText
                  style={[styles.statLabel, { color: C.muted, marginTop: 2 }]}
                >
                  {label}
                </ThemedText>
              </View>
              {i < arr.length - 1 && (
                <View
                  style={[styles.vertDivider, { backgroundColor: C.border }]}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      <View
        style={[
          styles.horizDivider,
          { backgroundColor: C.border, marginBottom: 20 },
        ]}
      />

      {/* Transaction History */}
      <ThemedText
        style={[
          styles.sectionTitle,
          { color: C.text, fontSize: 15, marginBottom: 16 },
        ]}
      >
        {tickerSymbol} Transaction History
      </ThemedText>

      {txLoading ? (
        <ActivityIndicator
          size='small'
          color={C.primary}
          style={{ marginTop: 20 }}
        />
      ) : filteredTx.length === 0 ? (
        <View style={{ alignItems: "center", paddingTop: 40 }}>
          <ThemedText style={{ color: C.muted }}>
            No transactions found.
          </ThemedText>
        </View>
      ) : (
        filteredTx.map((tx: any, i: number) => (
          <TxItem key={tx?.id ?? i} tx={tx} C={C} />
        ))
      )}

      <View style={{ height: 40 }} />
    </>
  );
}

// ─── Transaction Item ─────────────────────────────────────────────────────────

function TxItem({ tx, C }: { tx: any; C: any }) {
  const type = String(tx?.type ?? tx?.transactionType ?? "").toLowerCase();
  const isDividend = type.includes("dividend") || type.includes("return");
  const isBuy = type.includes("buy") || type.includes("purchase");
  const amt = Number(tx?.amount ?? tx?.value ?? 0);
  const label = isDividend
    ? "Dividend Earned"
    : isBuy
      ? "Stock Purchased"
      : "Stock Sold";
  const date = moment(tx?.createdAt ?? tx?.date).format(
    "MMM DD, YYYY [at] h:mm A",
  );
  const units = tx?.quantity ?? tx?.units;

  return (
    <View style={styles.txItem}>
      {/* Icon */}
      <View
        style={[
          styles.txIconWrap,
          { backgroundColor: isDividend ? "#FFF3E0" : "#E8F5F0" },
        ]}
      >
        <ThemedText style={{ fontSize: 18 }}>
          {isDividend ? "🎁" : isBuy ? "📊" : "📉"}
        </ThemedText>
      </View>

      {/* Label + date */}
      <View style={{ flex: 1 }}>
        <ThemedText style={[styles.txLabel, { color: C.text }]}>
          {label}
        </ThemedText>
        <ThemedText style={[styles.txDate, { color: C.muted }]}>
          {date}
        </ThemedText>
      </View>

      {/* Amount + units/date */}
      <View style={{ alignItems: "flex-end" }}>
        <ThemedText
          style={[styles.txAmt, { color: amt >= 0 ? "#0C8F5C" : "#D50000" }]}
        >
          {amt >= 0 ? "+" : "−"}
          {priceFormatter(Math.abs(amt), 2)}
        </ThemedText>
        {units != null ? (
          <ThemedText style={[styles.txDate, { color: C.muted }]}>
            {units} units
          </ThemedText>
        ) : (
          <ThemedText style={[styles.txDate, { color: C.muted }]}>
            {date}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 15, fontWeight: "700", textAlign: "center" },
  headerSubtitle: { fontSize: 11, marginTop: 1, textAlign: "center" },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  // Dividend banner
  dividendBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dividendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  dividendText: { fontSize: 13, color: "#fff", flex: 1 },

  // Main tabs
  mainTabRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  mainTabItem: {
    paddingVertical: 13,
    paddingHorizontal: 32,
    position: "relative",
  },
  mainTabText: { fontSize: 14 },
  mainTabTextActive: { fontWeight: "600" },
  mainTabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },

  scroll: { paddingTop: 20, paddingBottom: 120 },

  // Price row
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    paddingHorizontal: 16,
  },
  logo: { width: 46, height: 46, borderRadius: 23 },
  priceText: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  changeAmt: { fontSize: 13, fontWeight: "500" },
  changePct: { fontSize: 13, fontWeight: "500" },
  dot: { fontSize: 12 },

  // Chart
  chartWrap: { marginBottom: 0 },
  chartSkeleton: { height: 170 },

  // Time filters
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
  },
  timeTxt: { fontSize: 13 },
  timeTxtActive: { fontWeight: "700" },

  // Stats section (no background)
  statsSection: {
    padding: 16,
    marginVertical: 30,
    gap: 16,
    backgroundColor: "#F8FCFA",
    marginHorizontal: 16,
    borderRadius: 12,
  },
  statsTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsBottomRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  statLabel: { fontSize: 11 },
  statBigVal: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  statChange: { fontSize: 12, fontWeight: "500" },
  statMuted: { fontSize: 11, marginTop: 3 },
  statMiniVal: { fontSize: 13, fontWeight: "700" },
  horizDivider: { height: StyleSheet.hairlineWidth },
  vertDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    marginHorizontal: 8,
  },

  // Section title
  sectionTitle: { fontSize: 12, marginBottom: 10, paddingHorizontal: 16 },

  // Growth Trend card
  growthCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#CDFEEA",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  growthCardTitle: {
    fontSize: 12,
    color: "#85808A",
    marginBottom: 12,
    marginLeft: 16,
  },
  growthItem: { flex: 1, alignItems: "center", gap: 4 },
  growthVal: { fontSize: 16, fontWeight: "700", color: "#0B0014" },
  growthLabel: { fontSize: 13, color: "#85808A" },
  growthDivider: { width: StyleSheet.hairlineWidth, alignSelf: "stretch" },

  // Sally card
  sallyCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F8FCFA",
    padding: 16,
    marginBottom: 20,
  },
  sallyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sallyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#013D25",
  },
  sallyHeaderTxt: { fontSize: 13, fontWeight: "600", color: "#013D25" },
  sallyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B0014",
    marginBottom: 8,
  },
  sallyBody: { fontSize: 13, lineHeight: 20, color: "#555", marginBottom: 16 },
  sallyBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#D2F1E4",
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sallyBtnTxt: { fontSize: 14, fontWeight: "600", color: "#013D25" },

  // Bottom action bar
  actionBar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionBtn: {
    flex: 1,
    height: 52,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: { fontSize: 16, fontWeight: "600", color: "#D2F1E4" },

  // History sub-tabs
  subTabRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  subTab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
  },
  subTabTxt: { fontSize: 13, fontWeight: "500" },

  // Return section (no card)
  returnSection: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#F8FCFA",
    marginHorizontal: 16,
    borderRadius: 12,
  },
  returnLabel: { fontSize: 12, marginBottom: 8 },
  returnAmt: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 4,
    paddingTop: 10,
  },
  returnPct: { fontSize: 13, fontWeight: "500" },

  // Transaction items
  txItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0EFF2",
  },
  txIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  txLabel: { fontSize: 14, fontWeight: "600", marginBottom: 3 },
  txDate: { fontSize: 11 },
  txAmt: { fontSize: 14, fontWeight: "700", marginBottom: 3 },
});
