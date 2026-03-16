import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import { formatDate, priceFormatter } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";
type MainTab = "Listing" | "Transactions";
type AssetCategory = "Stocks" | "Gold" | "ETFs" | "Indexes" | "Fixed Income";

const ASSET_CATEGORIES: AssetCategory[] = [
  "Stocks",
  "Gold",
  "ETFs",
  "Indexes",
  "Fixed Income",
];

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

const categoryToAssetClass: Record<AssetCategory, string> = {
  Stocks: "stock",
  Gold: "gold",
  ETFs: "etf",
  Indexes: "index",
  "Fixed Income": "fixed-income",
};

export default function StockMarketScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [mainTab, setMainTab] = useState<MainTab>("Listing");
  const [activeCategory, setActiveCategory] = useState<AssetCategory>("Stocks");
  const [allStocks, setAllStocks] = useState<any[]>([]);
  const [topPicks, setTopPicks] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStocks = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const [stockRes, topRes]: [any, any] = await Promise.all([
        BaseRequest.get(STOCKS_SERVICE.STOCKS),
        BaseRequest.get(STOCKS_SERVICE.ASSET_PICKER).catch(() => ({
          data: [],
        })),
      ]);
      setAllStocks(toArray(stockRes));
      setTopPicks(toArray(topRes));
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const res: any = await BaseRequest.get(
        TRANSACTION_SERVICE.STOCK_TRANSACTION_LIST,
      );
      setTransactions(toArray(res));
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (mainTab === "Listing") fetchStocks();
    else fetchTransactions();
  }, [mainTab, fetchStocks, fetchTransactions]);

  const filteredStocks = allStocks.filter((s) => {
    const cls = String(
      s?.assetClass || s?.asset_class || s?.category || "",
    ).toLowerCase();
    const target = categoryToAssetClass[activeCategory].toLowerCase();
    return cls.includes(target) || (activeCategory === "Stocks" && cls === "");
  });

  const renderStockItem = ({ item }: { item: any }) => {
    const changePercent = Number(
      item?.changePercent || item?.percentChange || 0,
    );
    const isPositive = changePercent >= 0;
    const changeColor = isPositive ? C.primary : "#D50000";
    const changeBgColor = isPositive ? C.primary + "15" : "#FCE4E4";
    return (
      <TouchableOpacity
        style={[styles.stockRow, { borderBottomColor: C.border }]}
        onPress={() =>
          router.push(`/portfolio/company/${item.tickerSymbol}` as any)
        }
      >
        <View style={{ ...styles.tickerBadge, backgroundColor: C.inputBg }}>
          <ThemedText style={[styles.tickerText, { color: C.primary }]}>
            {String(item?.tickerSymbol || "").toUpperCase()}
          </ThemedText>
        </View>
        <View style={styles.stockMeta}>
          <ThemedText
            style={[styles.stockName, { color: C.text }]}
            numberOfLines={1}
          >
            {item?.companyName || item?.name || ""}
          </ThemedText>
          <ThemedText style={[styles.stockPrice, { color: C.muted }]}>
            {priceFormatter(Number(item?.currentPrice || item?.price || 0), 2)}
          </ThemedText>
        </View>
        <View
          style={{
            ...styles.changePill,
            backgroundColor: changeBgColor,
          }}
        >
          <ThemedText style={[styles.changeText, { color: changeColor }]}>
            {isPositive ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTransactionItem = ({ item }: { item: any }) => {
    const isBuy = String(item?.type || item?.transactionType || "")
      .toLowerCase()
      .includes("buy");
    const txBgColor = isBuy ? C.primary + "15" : "#FCE4E4";
    const txTextColor = isBuy ? C.primary : "#D50000";
    return (
      <View
        style={{
          ...styles.txRow,
          borderBottomColor: C.border,
          borderBottomWidth: 1,
        }}
      >
        <View
          style={{
            ...styles.txTypeBadge,
            backgroundColor: txBgColor,
          }}
        >
          <ThemedText
            style={[
              styles.txTypeText,
              { color: txTextColor },
            ]}
          >
            {isBuy ? "Buy" : "Sell"}
          </ThemedText>
        </View>
        <View style={styles.txMeta}>
          <ThemedText style={[styles.txTicker, { color: C.text }]}>
            {String(item?.tickerSymbol || item?.ticker || "").toUpperCase()}
          </ThemedText>
          <ThemedText style={[styles.txDate, { color: C.muted }]}>
            {formatDate(item?.createdAt || item?.date, "MMM dd, yyyy")}
          </ThemedText>
        </View>
        <ThemedText style={[styles.txAmount, { color: C.text }]}>
          {priceFormatter(Number(item?.amount || 0), 2)}
        </ThemedText>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          Stocks
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {/* Main Tabs */}
      <View style={{ ...styles.mainTabs, borderBottomColor: C.border }}>
        {(["Listing", "Transactions"] as MainTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.mainTab,
              mainTab === tab && {
                borderBottomWidth: 2,
                borderBottomColor: C.primary,
              },
            ]}
            onPress={() => setMainTab(tab)}
          >
            <ThemedText
              style={[
                styles.mainTabText,
                {
                  color: mainTab === tab ? C.primary : C.muted,
                  fontWeight: mainTab === tab ? "700" : "400",
                },
              ]}
            >
              {tab}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : mainTab === "Listing" ? (
        <FlatList
          data={filteredStocks}
          keyExtractor={(item, i) =>
            String(item?.tickerSymbol || item?.id || i)
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchStocks(true)}
              tintColor={C.primary}
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              {/* Asset Category Tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {ASSET_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryBtn,
                      {
                        backgroundColor:
                          activeCategory === cat ? C.primary : C.inputBg,
                        borderColor:
                          activeCategory === cat ? C.primary : C.border,
                      },
                    ]}
                    onPress={() => setActiveCategory(cat)}
                  >
                    <ThemedText
                      style={[
                        styles.categoryText,
                        {
                          color: activeCategory === cat ? "#fff" : C.muted,
                        },
                      ]}
                    >
                      {cat}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Top Picks */}
              {topPicks.length > 0 && (
                <View style={styles.topPicksSection}>
                  <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
                    Top Picks
                  </ThemedText>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.topPicksScroll}
                  >
                    {topPicks.map((item, i) => {
                      const chg = Number(
                        item?.changePercent || item?.percentChange || 0,
                      );
                      const pos = chg >= 0;
                      const topChangeColor = pos ? C.primary : "#D50000";
                      return (
                        <TouchableOpacity
                          key={i}
                          style={[
                            styles.topPickCard,
                            {
                              borderColor: C.border,
                              backgroundColor: C.inputBg,
                            },
                          ]}
                          onPress={() =>
                            router.push(
                              `/portfolio/company/${item.tickerSymbol}` as any,
                            )
                          }
                        >
                          <ThemedText
                            style={[styles.topPickTicker, { color: C.primary }]}
                          >
                            {String(item?.tickerSymbol || "").toUpperCase()}
                          </ThemedText>
                          <ThemedText
                            style={[styles.topPickName, { color: C.muted }]}
                            numberOfLines={1}
                          >
                            {item?.companyName || item?.name || ""}
                          </ThemedText>
                          <ThemedText
                            style={[styles.topPickPrice, { color: C.text }]}
                          >
                            {priceFormatter(
                              Number(item?.currentPrice || item?.price || 0),
                              2,
                            )}
                          </ThemedText>
                          <ThemedText
                            style={{
                              fontSize: 11,
                              fontWeight: "600",
                              color: topChangeColor,
                            }}
                          >
                            {pos ? "▲" : "▼"} {Math.abs(chg).toFixed(2)}%
                          </ThemedText>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
              <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
                {activeCategory}
              </ThemedText>
            </View>
          }
          renderItem={renderStockItem}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <ThemedText style={[styles.emptyText, { color: C.muted }]}>
                No stocks found.
              </ThemedText>
            </View>
          }
          contentContainerStyle={styles.flatContent}
        />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, i) => String(item?.id || item?._id || i)}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchTransactions(true)}
              tintColor={C.primary}
            />
          }
          renderItem={renderTransactionItem}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <ThemedText style={[styles.emptyText, { color: C.muted }]}>
                No transactions yet.
              </ThemedText>
            </View>
          }
          contentContainerStyle={styles.flatContent}
        />
      )}
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
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  mainTabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  mainTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  mainTabText: { fontSize: 14 },
  loaderWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  flatContent: { paddingBottom: 30 },
  listHeader: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },
  categoryScroll: { gap: 8, paddingBottom: 4 },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: { fontSize: 12, fontWeight: "500" },
  topPicksSection: { gap: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "700" },
  topPicksScroll: { gap: 10, paddingBottom: 4 },
  topPickCard: {
    width: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  topPickTicker: { fontSize: 11, fontWeight: "700" },
  topPickName: { fontSize: 10 },
  topPickPrice: { fontSize: 13, fontWeight: "700" },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  tickerBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tickerText: { fontSize: 10, fontWeight: "700" },
  stockMeta: { flex: 1, gap: 2 },
  stockName: { fontSize: 13, fontWeight: "600" },
  stockPrice: { fontSize: 12 },
  changePill: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changeText: { fontSize: 11, fontWeight: "600" },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  txTypeBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  txTypeText: { fontSize: 11, fontWeight: "600" },
  txMeta: { flex: 1, gap: 2 },
  txTicker: { fontSize: 13, fontWeight: "600" },
  txDate: { fontSize: 11 },
  txAmount: { fontSize: 13, fontWeight: "700" },
  emptyWrap: { alignItems: "center", paddingTop: 40 },
  emptyText: { fontSize: 14 },
});
