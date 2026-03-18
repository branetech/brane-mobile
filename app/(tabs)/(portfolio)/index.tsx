import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import { formatDate, priceFormatter } from "@/utils/helpers";
import { useRouter } from "expo-router";
import {
  ShoppingCart,
  More,
} from "iconsax-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Scheme = "light" | "dark";

const STOCK_CATEGORIES = [
  { label: "Stocks", key: "" },
  { label: "Gold", key: "gold" },
  { label: "Indexes", key: "index" },
  { label: "ETFs", key: "etf" },
  { label: "Fixed Income", key: "fixed-income" },
];

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

const getTextToImage = (text: string, C: any) => {
  const bgColor = C.inputBg.replace("#", "");
  const fgColor = C.primary.replace("#", "");
  return `https://dummyimage.com/80x80/${bgColor}/${fgColor}&text=${encodeURIComponent(text || "ST")}`;
};

export default function PortfolioScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("listing");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allStocks, setAllStocks] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const checkouts = useSelector((state: RootState) => state.auth?.checkouts || []);

  const fetchAll = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const [stocksRes, txRes]: [any, any] = await Promise.all([
        BaseRequest.get(STOCKS_SERVICE.STOCKS),
        BaseRequest.get(TRANSACTION_SERVICE.STOCK_TRANSACTION_LIST),
      ]);

      setAllStocks(toArray(stocksRes));
      setTransactions(toArray(txRes).slice(0, 10));
    } catch (error) {
      catchError(error, false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Top picks - stocks marked as top picks
  const topPicks = useMemo(() => {
    return allStocks.filter((s) => s?.isTopPick).slice(0, 5);
  }, [allStocks]);

  // Filtered stocks based on selected category
  const filteredStocks = useMemo(() => {
    return allStocks.filter((s) => {
      const cls = String(
        s?.assetClass || s?.asset_class || s?.braneStockCategory || "",
      ).toLowerCase();
      if (selectedCategory === "") {
        return cls === "" || cls.includes("stock");
      }
      return cls.includes(selectedCategory);
    });
  }, [allStocks, selectedCategory]);

  const renderStockCard = (item: any) => {
    const ticker = String(item?.tickerSymbol || "").toUpperCase();
    const logo = item?.logo || "";
    const currentPrice = Number(item?.currentPrice || item?.price || 0);
    const changePercent = Number(item?.changePercent || 0);
    const isUp = changePercent >= 0;

    return (
      <TouchableOpacity
        key={ticker}
        style={[styles.stockCard, { backgroundColor: C.inputBg, borderColor: C.border }]}
        onPress={() => router.push(`/portfolio/company/${item?.tickerSymbol}`)}
      >
        <View style={styles.stockCardLeft}>
          <Image
            source={{
              uri: logo && !String(logo).startsWith("/stock")
                ? logo
                : getTextToImage(ticker, C),
            }}
            style={[styles.stockLogo, { backgroundColor: C.inputBg }]}
          />
          <View style={styles.stockInfo}>
            <ThemedText style={[styles.stockTicker, { color: C.text }]}>
              {ticker}
            </ThemedText>
            <ThemedText style={[styles.stockCompany, { color: C.muted }]} numberOfLines={1}>
              {String(item?.companyName || "").substring(0, 20)}
            </ThemedText>
          </View>
        </View>

        <View style={styles.stockCardRight}>
          <ThemedText style={[styles.stockPrice, { color: C.text }]}>
            ₦{currentPrice.toFixed(2)}
          </ThemedText>
          <ThemedText style={[styles.stockReturn, { color: isUp ? C.primary : "#D50000" }]}>
            {isUp ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTopPickCard = (item: any) => {
    const ticker = String(item?.tickerSymbol || "").toUpperCase();
    const logo = item?.logo || "";
    const changePercent = Number(item?.changePercent || 0);
    const isUp = changePercent >= 0;

    return (
      <TouchableOpacity
        key={ticker}
        style={[styles.topPickCard, { backgroundColor: C.inputBg, borderColor: C.primary }]}
        onPress={() => router.push(`/portfolio/company/${item?.tickerSymbol}`)}
      >
        <Image
          source={{
            uri: logo && !String(logo).startsWith("/stock")
              ? logo
              : getTextToImage(ticker, C),
          }}
          style={styles.topPickLogo}
        />
        <ThemedText style={[styles.topPickTicker, { color: C.text }]}>
          {ticker}
        </ThemedText>
        <ThemedText style={[styles.topPickReturn, { color: isUp ? C.primary : "#D50000" }]}>
          {isUp ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
        </ThemedText>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          Assets
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.push("/portfolio/checkout")}
          style={styles.cartBtn}
        >
          <ShoppingCart size={22} color={C.text} />
          {checkouts && checkouts.length > 0 && (
            <View style={[styles.cartBadge, { backgroundColor: C.primary }]}>
              <ThemedText style={styles.cartBadgeText}>
                {checkouts.length}
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchAll(true)}
            tintColor={C.primary}
          />
        }
      >
        {/* Tab Toggle */}
        <View style={[styles.tabToggle, { backgroundColor: C.inputBg }]}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "listing" && { backgroundColor: C.primary },
            ]}
            onPress={() => setActiveTab("listing")}
          >
            <ThemedText
              style={[
                styles.tabButtonText,
                { color: activeTab === "listing" ? "#fff" : C.text },
              ]}
            >
              Listing
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "transactions" && { backgroundColor: C.primary },
            ]}
            onPress={() => setActiveTab("transactions")}
          >
            <ThemedText
              style={[
                styles.tabButtonText,
                { color: activeTab === "transactions" ? "#fff" : C.text },
              ]}
            >
              Transactions
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() => setShowMoreMenu(!showMoreMenu)}
          >
            <More size={20} color={C.text} />
          </TouchableOpacity>
        </View>

        {/* More Menu Modal */}
        {showMoreMenu && (
          <View
            style={[styles.moreMenu, { backgroundColor: C.inputBg, borderColor: C.border }]}
          >
            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => {
                router.push("/portfolio");
                setShowMoreMenu(false);
              }}
            >
              <ThemedText style={[styles.moreMenuItemText, { color: C.text }]}>
                View All Holdings
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.moreMenuItem, { borderTopColor: C.border }]}
              onPress={() => {
                router.push("/stock/withdraw");
                setShowMoreMenu(false);
              }}
            >
              <ThemedText style={[styles.moreMenuItemText, { color: C.text }]}>
                Withdraw
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "listing" ? (
          <>
            {/* Top Picks */}
            {topPicks.length > 0 && (
              <View style={styles.section}>
                <ThemedText style={[styles.sectionTitle, { color: C.muted }]}>
                  Top Picks
                </ThemedText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.topPicksRow}
                >
                  {topPicks.map((item) => renderTopPickCard(item))}
                </ScrollView>
              </View>
            )}

            {/* Category Tabs */}
            <View style={styles.section}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesRow}
              >
                {STOCK_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryTab,
                      selectedCategory === cat.key && {
                        backgroundColor: C.primary + "20",
                        borderColor: C.primary,
                      },
                    ]}
                    onPress={() => setSelectedCategory(cat.key)}
                  >
                    <ThemedText
                      style={[
                        styles.categoryTabText,
                        {
                          color:
                            selectedCategory === cat.key ? C.primary : C.muted,
                        },
                      ]}
                    >
                      {cat.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Stock List */}
            <View style={styles.section}>
              {filteredStocks.length > 0 ? (
                <FlatList
                  data={filteredStocks}
                  renderItem={({ item }) => renderStockCard(item)}
                  keyExtractor={(item, idx) =>
                    `${item?.tickerSymbol || idx}`
                  }
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => (
                    <View style={{ height: 8 }} />
                  )}
                />
              ) : (
                <ThemedText style={[styles.emptyText, { color: C.muted }]}>
                  No stocks found in this category
                </ThemedText>
              )}
            </View>
          </>
        ) : (
          <>
            {/* Transactions */}
            <View style={styles.section}>
              {transactions.length > 0 ? (
                transactions.map((tx, idx) => {
                  const isBuy = String(
                    tx?.type || tx?.transactionType || "",
                  ).toLowerCase().includes("buy");

                  return (
                    <View
                      key={idx}
                      style={[
                        styles.txRow,
                        {
                          backgroundColor: C.inputBg,
                          borderColor: C.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.txBadge,
                          {
                            backgroundColor: isBuy
                              ? C.primary + "15"
                              : "#FCE4E4",
                          },
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.txBadgeText,
                            {
                              color: isBuy ? C.primary : "#D50000",
                            },
                          ]}
                        >
                          {isBuy ? "BUY" : "SELL"}
                        </ThemedText>
                      </View>

                      <View style={styles.txInfo}>
                        <ThemedText
                          style={[styles.txTicker, { color: C.text }]}
                        >
                          {String(
                            tx?.tickerSymbol || tx?.ticker || "",
                          ).toUpperCase()}
                        </ThemedText>
                        <ThemedText
                          style={[styles.txDate, { color: C.muted }]}
                        >
                          {formatDate(tx?.createdAt || tx?.date, "MMM dd")}
                        </ThemedText>
                      </View>

                      <View style={{ alignItems: "flex-end" }}>
                        <ThemedText
                          style={[styles.txAmount, { color: C.text }]}
                        >
                          {priceFormatter(Number(tx?.amount || 0), 2)}
                        </ThemedText>
                        <ThemedText
                          style={[
                            styles.txQuantity,
                            { color: C.muted },
                          ]}
                        >
                          {tx?.quantity || 0} units
                        </ThemedText>
                      </View>
                    </View>
                  );
                })
              ) : (
                <ThemedText style={[styles.emptyText, { color: C.muted }]}>
                  No transactions yet
                </ThemedText>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  cartBtn: {
    position: "relative",
    padding: 8,
  },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  tabToggle: {
    flexDirection: "row",
    margin: 16,
    borderRadius: 8,
    padding: 4,
    alignItems: "center",
    gap: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  moreBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  moreMenu: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  moreMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  moreMenuItemText: {
    fontSize: 13,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  topPicksRow: {
    gap: 10,
  },
  topPickCard: {
    width: 120,
    borderRadius: 12,
    borderWidth: 2,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  topPickLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  topPickTicker: {
    fontSize: 13,
    fontWeight: "700",
  },
  topPickReturn: {
    fontSize: 11,
    fontWeight: "600",
  },
  categoriesRow: {
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: "500",
  },
  stockCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  stockCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  stockLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  stockInfo: {
    flex: 1,
    gap: 2,
  },
  stockTicker: {
    fontSize: 13,
    fontWeight: "700",
  },
  stockCompany: {
    fontSize: 11,
  },
  stockCardRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  stockPrice: {
    fontSize: 13,
    fontWeight: "700",
  },
  stockReturn: {
    fontSize: 11,
    fontWeight: "600",
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  txBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  txBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  txInfo: {
    flex: 1,
    gap: 2,
  },
  txTicker: {
    fontSize: 13,
    fontWeight: "700",
  },
  txDate: {
    fontSize: 11,
  },
  txAmount: {
    fontSize: 13,
    fontWeight: "700",
  },
  txQuantity: {
    fontSize: 10,
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 30,
  },
});
