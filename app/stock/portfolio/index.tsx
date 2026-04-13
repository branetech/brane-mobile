import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { palette } from "@/constants";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import { formatDate, priceFormatter } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { ArrowDown2, Eye, EyeSlash, SearchNormal1 } from "iconsax-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SW } = Dimensions.get("window");
type Scheme = "light" | "dark";

type AssetCategory = { label: string; key: string };

const ASSET_CATEGORIES: AssetCategory[] = [
  { label: "Stocks", key: "stock" },
  { label: "Gold", key: "gold" },
  { label: "Indexes", key: "index" },
  { label: "ETFs", key: "etf" },
  { label: "Fixed Income", key: "fixed-income" },
];

const EXPLORE_BG: Record<string, string> = {
  stock: "#e8f5ee",
  etf: "#e8f0fe",
  gold: "#fef9e7",
  index: "#f5f0e8",
  "fixed-income": "#fdeee8",
};

const EXPLORE_DESC: Record<string, string> = {
  stock: "Invest in Nigeria and International(US) stocks",
  etf: "Invest in Nigeria and International(US) stocks",
  gold: "Invest in Nigeria and US stocks",
  index: "Invest in Nigeria and International(US) stocks",
  "fixed-income": "Invest in Nigeria and US stocks",
};

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

const getTextImage = (text: string, C: any) => {
  const bg = C.inputBg.replace("#", "");
  const fg = C.primary.replace("#", "");
  return `https://dummyimage.com/80x80/${bg}/${fg}&text=${encodeURIComponent(text || "ST")}`;
};

export default function PortfolioScreen() {
  const router = useRouter();
  const scheme: Scheme = useColorScheme() === "dark" ? "dark" : "light";
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
    } catch (e) {
      catchError(e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getStocksFor = (key: string) =>
    allStocks.filter((s) => {
      const cls = String(
        s?.assetClass || s?.asset_class || s?.category || "",
      ).toLowerCase();
      return cls.includes(key) || (key === "stock" && cls === "");
    });

  const totalCount = allStocks.length || 1;

  const mask = (val: string) => (hideBalance ? "₦•••••" : val);

  // ─── Stock card ──────────────────────────────────────────
  const StockCard = ({ item, idx }: { item: any; idx: number }) => {
    const ticker = String(item?.tickerSymbol || "").toUpperCase();
    const logo = item?.logo || item?.image || "";
    const company = String(item?.companyName || item?.name || "");
    const price = Number(item?.currentPrice || item?.price || 0);
    const pct = Number(item?.changePercent || item?.percentChange || 0);
    const isDown = pct < 0;
    const col = isDown ? palette.error : C.primary;

    return (
      <TouchableOpacity
        key={`${ticker}-${idx}`}
        style={[
          s.stockCard,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
        onPress={() =>
          router.push(`/portfolio/company/${item?.tickerSymbol}` as any)
        }
        activeOpacity={0.8}
      >
        <View style={s.stockTop}>
          <Image
            source={{
              uri:
                logo && !String(logo).startsWith("/stock")
                  ? logo
                  : getTextImage(ticker, C),
            }}
            style={[s.stockLogo, { backgroundColor: C.inputBg }]}
          />
          <View style={{ flex: 1 }}>
            <ThemedText style={[s.stockTicker, { color: C.text }]}>
              {ticker}
            </ThemedText>
            <ThemedText
              style={[s.stockCompany, { color: C.muted }]}
              numberOfLines={1}
            >
              {company}
            </ThemedText>
          </View>
        </View>
        <View style={s.stockBottom}>
          <ThemedText style={[s.stockPrice, { color: col }]}>
            {priceFormatter(price, 2)}
          </ThemedText>
          <ThemedText style={[s.stockChange, { color: col }]}>
            {isDown ? "▼" : "▲"} {Math.abs(pct).toFixed(2)}%
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[s.screen, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={s.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[s.headerTitle, { color: C.text }]}>
          Portfolio
        </ThemedText>
        <View style={s.headerRight}>
          <View style={s.flagCircle}>
            <View style={[s.flagSeg, { backgroundColor: C.primary }]} />
            <View style={[s.flagSeg, { backgroundColor: palette.white }]} />
            <View style={[s.flagSeg, { backgroundColor: C.primary }]} />
          </View>
          <TouchableOpacity style={s.iconBtn}>
            <SearchNormal1 size={20} color={C.text} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={s.loader}>
          <ActivityIndicator color={C.primary} size='small' />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchAll(true)}
            />
          }
        >
          {/* ── Net Value Card ── */}
          <View style={s.netCard}>
            <View
              style={[s.blob, { width: 80, height: 80, top: -24, right: 70 }]}
            />
            <View
              style={[
                s.blob,
                { width: 54, height: 54, top: 20, right: 18, opacity: 0.15 },
              ]}
            />
            <View
              style={[
                s.blob,
                { width: 36, height: 36, bottom: 28, right: 110, opacity: 0.1 },
              ]}
            />

            <View style={s.netTopRow}>
              <ThemedText style={[s.netLabel, { color: C.muted }]}>
                Portfolio Net Value
              </ThemedText>
              <TouchableOpacity onPress={() => setHideBalance((v) => !v)}>
                {hideBalance ? (
                  <EyeSlash size={18} color={C.muted} />
                ) : (
                  <Eye size={18} color={C.muted} />
                )}
              </TouchableOpacity>
            </View>

            <ThemedText style={[s.netAmount, { color: C.text }]}>
              {mask(
                priceFormatter(
                  Number(
                    unitBalance?.totalStockBalance || portfolioBalance || 0,
                  ),
                  2,
                ),
              )}
            </ThemedText>

            <View style={[s.profitCard, { backgroundColor: palette.white }]}>
              <View>
                <ThemedText style={[s.profitLabel, { color: C.muted }]}>
                  Profit Return (Dividend)
                </ThemedText>
                <ThemedText style={[s.profitAmount, { color: C.text }]}>
                  {mask(priceFormatter(bracsBalance, 2))}
                </ThemedText>
              </View>
              <BraneButton
                text='Withdraw'
                onPress={() => router.push("/stock/withdraw")}
                backgroundColor={C.primary}
                textColor={C.googleBg}
                height={42}
                radius={20}
                width={120}
              />
            </View>
          </View>

          {/* ── Asset Holdings horizontal ── */}
          <View style={s.sectionRow}>
            <ThemedText style={[s.sectionTitle, { color: C.muted }]}>
              Asset Holdings
            </ThemedText>
            <TouchableOpacity
              style={s.seeAllBtn}
              onPress={() => router.push("/stock/portfolio/my-holdings" as any)}
            >
              <ThemedText style={[s.seeAllLabel, { color: C.primary }]}>
                All Holdings
              </ThemedText>
              <ArrowDown2
                size={14}
                color={C.primary}
                style={{ transform: [{ rotate: "-90deg" }] }}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.holdingsRow}
          >
            {ASSET_CATEGORIES.map((cat) => {
              const stocks = getStocksFor(cat.key);
              const total = stocks.reduce(
                (a, st) => a + Number(st?.currentPrice || 0),
                0,
              );
              const avgPct =
                stocks.length > 0
                  ? stocks.reduce(
                      (a, st) => a + Number(st?.changePercent || 0),
                      0,
                    ) / stocks.length
                  : 0;
              const isUp = avgPct >= 0;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={s.holdingCard}
                  onPress={() => setOpenCategory(cat.key)}
                  activeOpacity={0.8}
                >
                  <ThemedText style={[s.holdingLabel, { color: C.muted }]}>
                    {cat.label}
                  </ThemedText>
                  <ThemedText style={[s.holdingAmount, { color: C.text }]}>
                    {mask(priceFormatter(total, 2))}
                  </ThemedText>
                  <ThemedText
                    style={[
                      s.holdingChange,
                      { color: isUp ? "#2e7d32" : palette.error },
                    ]}
                  >
                    {isUp ? "▲" : "▼"} {Math.abs(avgPct).toFixed(2)}% return
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── Explore Assets ── */}
          <ThemedText
            style={[
              s.sectionTitle,
              {
                color: C.muted,
                marginHorizontal: 16,
                marginTop: 24,
                marginBottom: 14,
              },
            ]}
          >
            Explore Assets
          </ThemedText>
          <View style={s.exploreGrid}>
            {ASSET_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  s.exploreCard,
                  { backgroundColor: EXPLORE_BG[cat.key] ?? palette.surface200 },
                ]}
                onPress={() => router.push(`/explore/${cat.key}` as any)}
                activeOpacity={0.8}
              >
                <ThemedText style={[s.exploreLabel, { color: C.text }]}>
                  {cat.label}
                </ThemedText>
                <ThemedText style={[s.exploreDesc, { color: C.muted }]}>
                  {EXPLORE_DESC[cat.key]}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Asset accordion table ── */}
          <View
            style={[s.sectionRow, { marginTop: 24, paddingHorizontal: 16 }]}
          >
            <ThemedText
              style={[s.sectionTitle, { color: C.muted, width: "33%" }]}
            >
              Assets
            </ThemedText>
            <ThemedText
              style={[
                s.sectionTitle,
                { color: C.muted, width: "20%", textAlign: "center" },
              ]}
            >
              Exposure
            </ThemedText>
            <ThemedText
              style={[
                s.sectionTitle,
                { color: C.text, flex: 1, textAlign: "right" },
              ]}
            >
              Returns(%)
            </ThemedText>
          </View>

          <View style={{ paddingHorizontal: 16 }}>
            {ASSET_CATEGORIES.map((cat) => {
              const stocks = getStocksFor(cat.key);
              const exposure = `${Math.max(0, Math.round((stocks.length / totalCount) * 100))}%`;
              const avgPct =
                stocks.length > 0
                  ? stocks.reduce(
                      (a, st) =>
                        a + Number(st?.changePercent || st?.percentChange || 0),
                      0,
                    ) / stocks.length
                  : 0;
              const isUp = avgPct >= 0;

              return (
                <View
                  key={cat.key}
                  style={[s.catCard, { borderColor: C.border }]}
                >
                  <TouchableOpacity
                    style={s.catHeader}
                    onPress={() =>
                      setOpenCategory((p) => (p === cat.key ? "" : cat.key))
                    }
                  >
                    <ThemedText style={[s.catName, { color: C.text }]}>
                      {cat.label}
                    </ThemedText>
                    <ThemedText style={[s.catExposure, { color: C.muted }]}>
                      {exposure}
                    </ThemedText>
                    <View style={s.catReturnRow}>
                      <ThemedText
                        style={[
                          s.catReturnBadge,
                          {
                            color: isUp ? C.primary : palette.error,
                            backgroundColor: isUp
                              ? C.primary + "15"
                              : palette.statusFailedBg,
                          },
                        ]}
                      >
                        {isUp ? "+" : ""}
                        {avgPct.toFixed(2)}%
                      </ThemedText>
                      <ArrowDown2
                        size={16}
                        color={C.primary}
                        style={{
                          transform: [
                            {
                              rotate:
                                openCategory === cat.key ? "180deg" : "0deg",
                            },
                          ],
                        }}
                      />
                    </View>
                  </TouchableOpacity>

                  {openCategory === cat.key && (
                    <View style={{ paddingBottom: 14 }}>
                      {stocks.length > 0 ? (
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ gap: 10, paddingTop: 4 }}
                        >
                          {stocks.map((item, idx) => (
                            <StockCard key={idx} item={item} idx={idx} />
                          ))}
                        </ScrollView>
                      ) : (
                        <ThemedText style={[s.noHolding, { color: C.muted }]}>
                          No {cat.label} holdings available.
                        </ThemedText>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* ── My Stocks CTA ── */}
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <BraneButton
              text='My Stocks'
              onPress={() => router.push("/stock/portfolio/my-stocks")}
              backgroundColor={C.primary}
              textColor={C.googleBg}
              height={52}
              radius={12}
            />
          </View>

          {/* ── Recent Transactions ── */}
          <View style={s.txSection}>
            <View style={s.sectionRow}>
              <ThemedText
                style={[s.sectionTitle, { color: C.text, fontSize: 15 }]}
              >
                Recent Transactions
              </ThemedText>
              <TouchableOpacity
                onPress={() => router.push("/transaction/stocks/all" as any)}
              >
                <ThemedText style={[s.seeAllLabel, { color: C.primary }]}>
                  See All
                </ThemedText>
              </TouchableOpacity>
            </View>

            {transactions.length === 0 ? (
              <ThemedText style={[{ color: C.muted, fontSize: 13 }]}>
                No transactions yet.
              </ThemedText>
            ) : (
              transactions.map((tx, idx) => {
                const isBuy = String(tx?.type || tx?.transactionType || "")
                  .toLowerCase()
                  .includes("buy");
                return (
                  <View
                    key={idx}
                    style={[
                      s.txRow,
                      idx < transactions.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: C.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        s.txBadge,
                        {
                          backgroundColor: isBuy ? C.primary + "15" : palette.statusFailedBg,
                        },
                      ]}
                    >
                      <ThemedText
                        style={[
                          s.txBadgeText,
                          { color: isBuy ? C.primary : palette.error },
                        ]}
                      >
                        {isBuy ? "Buy" : "Sell"}
                      </ThemedText>
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <ThemedText style={[s.txTicker, { color: C.text }]}>
                        {String(
                          tx?.tickerSymbol || tx?.ticker || "",
                        ).toUpperCase()}
                      </ThemedText>
                      <ThemedText style={[{ fontSize: 11, color: C.muted }]}>
                        {formatDate(tx?.createdAt || tx?.date, "MMM dd, yyyy")}
                      </ThemedText>
                    </View>
                    <ThemedText style={[s.txAmount, { color: C.text }]}>
                      {priceFormatter(Number(tx?.amount || 0), 2)}
                    </ThemedText>
                  </View>
                );
              })
            )}
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { paddingBottom: 30 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  flagCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  flagSeg: { flex: 1, height: "100%" },
  iconBtn: { padding: 4 },

  netCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: palette.brandMintPale,
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: palette.brandDeep,
    opacity: 0.22,
  },
  netTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  netLabel: { fontSize: 13 },
  netAmount: { fontSize: 34, fontWeight: "800", marginBottom: 20 },
  profitCard: {
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profitLabel: { fontSize: 12, marginBottom: 4 },
  profitAmount: { fontSize: 18, fontWeight: "700" },

  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 14, fontWeight: "600" },
  seeAllBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  seeAllLabel: {
    fontSize: 13,
    fontWeight: "700",
    textDecorationLine: "underline",
    textDecorationStyle: "dashed",
  },

  holdingsRow: { paddingHorizontal: 16, gap: 12 },
  holdingCard: {
    width: SW * 0.46,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    backgroundColor: palette.statusFailedBg,
  },
  holdingLabel: { fontSize: 13 },
  holdingAmount: { fontSize: 18, fontWeight: "700" },
  holdingChange: { fontSize: 12, fontWeight: "600" },

  exploreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  exploreCard: {
    width: (SW - 44) / 2,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    minHeight: 110,
  },
  exploreLabel: { fontSize: 16, fontWeight: "700" },
  exploreDesc: { fontSize: 12, lineHeight: 18 },

  catCard: { borderBottomWidth: 1, overflow: "hidden" },
  catHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  catName: { width: "33%", fontSize: 14, fontWeight: "500" },
  catExposure: {
    width: "20%",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
  catReturnRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  catReturnBadge: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  noHolding: { fontSize: 12, paddingVertical: 8 },

  stockCard: {
    width: 188,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  stockTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  stockLogo: { width: 40, height: 40, borderRadius: 20 },
  stockTicker: { fontSize: 12, fontWeight: "700" },
  stockCompany: { fontSize: 11 },
  stockBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stockPrice: { fontSize: 12, fontWeight: "700" },
  stockChange: { fontSize: 11, fontWeight: "600" },

  txSection: { paddingHorizontal: 16, marginTop: 20, gap: 8 },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },
  txBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  txBadgeText: { fontSize: 11, fontWeight: "600" },
  txTicker: { fontSize: 13, fontWeight: "600" },
  txAmount: { fontSize: 13, fontWeight: "700" },
});
