import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import { formatDate, priceFormatter } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { ArrowDown2, Eye, EyeSlash } from "iconsax-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    View as RNView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

type AssetCategory = {
  label: string;
  key: string;
};

const ASSET_CATEGORIES: AssetCategory[] = [
  { label: "Stocks", key: "stock" },
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

export default function StockPortfolioScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [portfolioBalance, setPortfolioBalance] = useState(0);
  const [bracsBalance, setBracsBalance] = useState(0);
  const [allStocks, setAllStocks] = useState<any[]>([]);
  const [unitBalance, setUnitBalance] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [openCategory, setOpenCategory] = useState<string>("stock");

  const fetchAll = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const [walletRes, stocksRes, unitRes, txRes]: [any, any, any, any] =
        await Promise.all([
          BaseRequest.get(STOCKS_SERVICE.WALLET_USER),
          BaseRequest.get(STOCKS_SERVICE.STOCKS),
          BaseRequest.get(STOCKS_SERVICE.STOCK_UNIT_BALANCE),
          BaseRequest.get(TRANSACTION_SERVICE.STOCK_TRANSACTION_LIST),
        ]);

      const wallet = walletRes?.data || walletRes;
      setPortfolioBalance(
        Number(wallet?.portfolioValue || wallet?.balance || 0),
      );
      setBracsBalance(Number(wallet?.bracsBalance || wallet?.bracs || 0));
      setAllStocks(toArray(stocksRes));
      setUnitBalance(unitRes?.data || unitRes);
      setTransactions(toArray(txRes).slice(0, 5));
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getStocksForCategory = (key: string) =>
    allStocks.filter((s) => {
      const cls = String(
        s?.assetClass || s?.asset_class || s?.category || "",
      ).toLowerCase();
      return cls.includes(key) || (key === "stock" && cls === "");
    });

  const now = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const totalAssetCount = allStocks.length || 1;

  const renderStockCard = (item: any, idx: number) => {
    const ticker = String(item?.tickerSymbol || "").toUpperCase();
    const logo = item?.logo || item?.image || "";
    const company = String(item?.companyName || item?.name || "");
    const currentPrice = Number(item?.currentPrice || item?.price || 0);
    const changePercent = Number(
      item?.changePercent || item?.percentChange || 0,
    );
    const isDown = changePercent < 0;
    const priceColor = isDown ? "#D50000" : C.primary;

    return (
      <TouchableOpacity
        key={`${ticker}-${idx}`}
        style={[
          styles.stockCard,
          {
            backgroundColor: C.inputBg,
            borderColor: C.border,
          },
        ]}
        onPress={() =>
          router.push(`/portfolio/company/${item?.tickerSymbol}` as any)
        }
      >
        <View style={styles.stockCardTop}>
          <Image
            source={{
              uri:
                logo && !String(logo).startsWith("/stock")
                  ? logo
                  : getTextToImage(ticker || "ST", C),
            }}
            style={[styles.stockLogo, { backgroundColor: C.inputBg }]}
          />
          <View style={styles.stockCardMeta}>
            <ThemedText style={[styles.stockTicker, { color: C.text }]}>
              {ticker}
            </ThemedText>
            <ThemedText
              style={[styles.stockCompany, { color: C.muted }]}
              numberOfLines={1}
            >
              {company}
            </ThemedText>
          </View>
        </View>

        <View style={styles.stockCardBottom}>
          <ThemedText
            style={[
              styles.stockPrice,
              { color: priceColor },
            ]}
          >
            {priceFormatter(currentPrice, 2)}
          </ThemedText>
          <ThemedText
            style={[
              styles.stockChange,
              { color: priceColor },
            ]}
          >
            {isDown ? "▼" : "▲"} {Math.abs(changePercent).toFixed(2)}%
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.contentWrap}>
      <View style={{ ...styles.holdingsCard, backgroundColor: C.inputBg }}>
        <View style={styles.holdingHeaderRow}>
          <View style={styles.balanceTitleWrap}>
            <ThemedText style={[styles.holdingsLabel, { color: C.muted }]}>
              Total Holdings
            </ThemedText>
            <TouchableOpacity onPress={() => setHideBalance((v) => !v)}>
              {hideBalance ? (
                <EyeSlash size={16} color={C.text} />
              ) : (
                <Eye size={16} color={C.text} />
              )}
            </TouchableOpacity>
          </View>
          <BraneButton
            text='Withdraw'
            onPress={() => router.push("/stock/withdraw")}
            backgroundColor={C.primary}
            textColor={C.googleBg}
            height={36}
            radius={10}
            width={118}
          />
        </View>

        <View style={styles.holdingsValueRow}>
          <ThemedText style={[styles.holdingsAmount, { color: C.text }]}>
            {hideBalance
              ? "•••••••"
              : priceFormatter(
                  Number(
                    unitBalance?.totalStockBalance || portfolioBalance || 0,
                  ),
                  2,
                )}
          </ThemedText>
          <ThemedText style={[styles.holdingsPercent, { color: "#27C840" }]}>+0.25%</ThemedText>
        </View>

        <ThemedText style={[styles.updatedAt, { color: C.muted }]}>
          Updated {now}
        </ThemedText>
      </View>

      <View style={{ ...styles.balanceCard, backgroundColor: C.primary }}>
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <ThemedText
              style={[styles.balanceLabelText, { color: C.googleBg }]}
            >
              Portfolio Balance
            </ThemedText>
            <ThemedText style={[styles.balanceAmount, { color: C.screen }]}>
              {hideBalance ? "••••••" : priceFormatter(portfolioBalance, 2)}
            </ThemedText>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceItem}>
            <ThemedText
              style={[styles.balanceLabelText, { color: C.googleBg }]}
            >
              BRACS Balance
            </ThemedText>
            <ThemedText style={[styles.balanceAmount, { color: C.screen }]}>
              {hideBalance ? "••••••" : bracsBalance.toFixed(4)}
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={() => setHideBalance((v) => !v)}
            style={styles.eyeBtn}
          >
            {hideBalance ? (
              <EyeSlash size={20} color={C.googleBg} />
            ) : (
              <Eye size={20} color={C.googleBg} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.assetHeader}>
        <ThemedText style={[styles.assetHeaderLabel, { color: C.muted }]}>
          Assets
        </ThemedText>
        <ThemedText style={[styles.assetHeaderLabel, { color: C.muted }]}>
          Exposure
        </ThemedText>
        <ThemedText style={[styles.assetHeaderLabel, { color: C.text }]}>
          Returns(%)
        </ThemedText>
      </View>

      {ASSET_CATEGORIES.map((cat) => {
        const catStocks = getStocksForCategory(cat.key);
        const exposure = `${Math.max(0, Math.round((catStocks.length / totalAssetCount) * 100))}%`;
        const avgReturn =
          catStocks.length > 0
            ? catStocks.reduce(
                (acc, s) =>
                  acc + Number(s?.changePercent || s?.percentChange || 0),
                0,
              ) / catStocks.length
            : 0;
        const isUp = avgReturn >= 0;

        return (
          <View
            key={cat.key}
            style={{ ...styles.categoryCard, borderColor: C.border }}
          >
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() =>
                setOpenCategory((prev) => (prev === cat.key ? "" : cat.key))
              }
            >
              <ThemedText style={[styles.assetColName, { color: C.text }]}>
                {cat.label}
              </ThemedText>
              <ThemedText style={[styles.assetColExposure, { color: C.muted }]}>
                {exposure}
              </ThemedText>
              <View style={styles.assetReturnWrap}>
                <ThemedText
                  style={[
                    styles.assetReturn,
                    {
                      color: isUp ? C.primary : "#D50000",
                      backgroundColor: isUp ? C.primary + "15" : "#FCE4E4",
                    },
                  ]}
                >
                  {isUp ? "+" : ""}
                  {avgReturn.toFixed(2)}%
                </ThemedText>
                <ArrowDown2
                  size={18}
                  color={C.primary}
                  style={{
                    transform: [
                      { rotate: openCategory === cat.key ? "180deg" : "0deg" },
                    ],
                  }}
                />
              </View>
            </TouchableOpacity>

            {openCategory === cat.key && (
              <View style={styles.categoryStocksWrap}>
                {catStocks.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.stockCardsRow}
                  >
                    {catStocks.map((item, idx) => renderStockCard(item, idx))}
                  </ScrollView>
                ) : (
                  <ThemedText
                    style={[styles.noHoldingText, { color: C.muted }]}
                  >
                    No {cat.label} holdings available.
                  </ThemedText>
                )}
              </View>
            )}
          </View>
        );
      })}

      <BraneButton
        text='My Stocks'
        onPress={() => router.push("/stock/portfolio/my-stocks")}
        backgroundColor={C.primary}
        textColor={C.googleBg}
        height={52}
        radius={12}
      />

      <View style={styles.txSection}>
        <View style={styles.txSectionHeader}>
          <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
            Recent Transactions
          </ThemedText>
          <TouchableOpacity
            onPress={() => router.push("/transaction/stocks/all" as any)}
          >
            <ThemedText style={[styles.seeAll, { color: C.primary }]}>
              See All
            </ThemedText>
          </TouchableOpacity>
        </View>

        {transactions.length === 0 ? (
          <ThemedText style={[styles.emptyText, { color: C.muted }]}>
            No transactions yet.
          </ThemedText>
        ) : (
          transactions.map((tx, idx) => {
            const isBuy = String(tx?.type || tx?.transactionType || "")
              .toLowerCase()
              .includes("buy");

            return (
              <RNView
                key={idx}
                style={[
                  styles.txRow,
                  idx < transactions.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: C.border,
                  },
                ]}
              >
                <View
                  style={{
                    ...styles.txBadge,
                    backgroundColor: isBuy ? C.primary + "15" : "#FCE4E4",
                  }}
                >
                  <ThemedText
                    style={[
                      styles.txBadgeText,
                      { color: isBuy ? C.primary : "#D50000" },
                    ]}
                  >
                    {isBuy ? "Buy" : "Sell"}
                  </ThemedText>
                </View>
                <View style={styles.txMeta}>
                  <ThemedText style={[styles.txTicker, { color: C.text }]}>
                    {String(tx?.tickerSymbol || tx?.ticker || "").toUpperCase()}
                  </ThemedText>
                  <ThemedText style={[styles.txDate, { color: C.muted }]}>
                    {formatDate(tx?.createdAt || tx?.date, "MMM dd, yyyy")}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.txAmount, { color: C.text }]}>
                  {priceFormatter(Number(tx?.amount || 0), 2)}
                </ThemedText>
              </RNView>
            );
          })
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          My Portfolio Holdings
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchAll(true)}
            />
          }
        >
          {renderHeader()}
        </ScrollView>
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
  loaderWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  scrollContent: { paddingBottom: 30 },

  contentWrap: { paddingHorizontal: 16, gap: 14 },
  holdingsCard: {
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  holdingHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  balanceTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  holdingsLabel: { fontSize: 12, fontWeight: "500" },
  holdingsValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  holdingsAmount: {
    fontSize: 27,
    fontWeight: "700",
    lineHeight: 36,
    paddingLeft: 1,
  },
  holdingsPercent: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  updatedAt: { fontSize: 12, fontWeight: "500" },

  balanceCard: {
    borderRadius: 16,
    padding: 18,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  balanceItem: { flex: 1, gap: 4 },
  balanceLabelText: { fontSize: 11, fontWeight: "600" },
  balanceAmount: { fontSize: 18, fontWeight: "800" },
  balanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(230,230,230,0.5)",
  },
  eyeBtn: { padding: 4 },

  assetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 2,
  },
  assetHeaderLabel: {
    width: "33.33%",
    fontSize: 12,
    fontWeight: "600",
  },
  categoryCard: {
    borderBottomWidth: 1,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  assetColName: { width: "33.33%", fontSize: 14, fontWeight: "500" },
  assetColExposure: {
    width: "20%",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
  assetReturnWrap: {
    width: "46.67%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  assetReturn: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  categoryStocksWrap: {
    paddingBottom: 14,
  },
  stockCardsRow: {
    gap: 10,
    paddingTop: 4,
  },
  stockCard: {
    width: 188,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  stockCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stockLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  stockCardMeta: { flex: 1 },
  stockTicker: { fontSize: 12, fontWeight: "700" },
  stockCompany: { fontSize: 11 },
  stockCardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stockPrice: { fontSize: 12, fontWeight: "700" },
  stockChange: { fontSize: 11, fontWeight: "600" },
  noHoldingText: { fontSize: 12, paddingTop: 6 },

  sectionTitle: { fontSize: 14, fontWeight: "700" },
  txSection: { gap: 8 },
  txSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: { fontSize: 12, fontWeight: "600" },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },
  txBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  txBadgeText: { fontSize: 11, fontWeight: "600" },
  txMeta: { flex: 1, gap: 2 },
  txTicker: { fontSize: 13, fontWeight: "600" },
  txDate: { fontSize: 11 },
  txAmount: { fontSize: 13, fontWeight: "700" },
  emptyText: { fontSize: 13 },
});
