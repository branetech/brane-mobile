import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import { priceFormatter } from "@/utils/helpers";
import { useRouter } from "expo-router";
import {
  Eye,
  EyeSlash,
  Search,
} from "iconsax-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EXPLORE_ASSETS = [
  { label: "Stocks", bgColor: "#E1F4EC" },
  { label: "ETFs", bgColor: "#E3F2FD" },
  { label: "Gold", bgColor: "#FFF3E0" },
  { label: "REITs", bgColor: "#F3E5F5" },
  { label: "Index Funds", bgColor: "#FFF9C4" },
  { label: "Fixed Income", bgColor: "#FCE4EC" },
];

type Scheme = "light" | "dark";

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
  const [hideBalance, setHideBalance] = useState(false);
  const [portfolioBalance, setPortfolioBalance] = useState(0);
  const [dividendBalance, setDividendBalance] = useState(32000);
  const [topAssets, setTopAssets] = useState<any[]>([]);

  const fetchAll = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const [walletRes, stocksRes]: [any, any] = await Promise.all([
        BaseRequest.get(STOCKS_SERVICE.WALLET_USER),
        BaseRequest.get(STOCKS_SERVICE.STOCKS),
      ]);

      const wallet = walletRes?.data || walletRes;
      setPortfolioBalance(Number(wallet?.portfolioValue || wallet?.balance || 20000));
      setTopAssets(toArray(stocksRes).slice(0, 2));
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

  const renderAssetItem = (asset: any) => {
    const ticker = String(asset?.tickerSymbol || "").toUpperCase();
    const logo = asset?.logo || "";
    const changePercent = Number(asset?.changePercent || 0);
    const isUp = changePercent >= 0;

    return (
      <TouchableOpacity
        key={ticker}
        style={[styles.assetItem, { backgroundColor: C.inputBg, borderColor: C.border }]}
        onPress={() => router.push(`/portfolio/company/${asset?.tickerSymbol}` as any)}
      >
        <View style={styles.assetItemLeft}>
          <Image
            source={{
              uri: logo && !String(logo).startsWith("/stock") ? logo : getTextToImage(ticker, C),
            }}
            style={[styles.assetLogo, { backgroundColor: C.inputBg }]}
          />
          <View>
            <ThemedText style={[styles.assetTicker, { color: C.text }]}>
              {ticker}
            </ThemedText>
            <ThemedText style={[styles.assetName, { color: C.muted }]}>
              {String(asset?.companyName || "").substring(0, 20)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.assetItemRight}>
          <ThemedText style={[styles.assetValue, { color: C.text }]}>
            ₦{(Math.random() * 5000 + 1000).toFixed(2)}
          </ThemedText>
          <ThemedText style={[styles.assetReturn, { color: isUp ? C.primary : "#D50000" }]}>
            {isUp ? "+" : ""}{changePercent.toFixed(2)}%
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <ThemedText style={styles.headerTitle}>Portfolio</ThemedText>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Search size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
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
          {/* Portfolio Net Value */}
          <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: C.inputBg }]}>
              <View style={styles.cardHeader}>
                <ThemedText style={[styles.cardLabel, { color: C.muted }]}>
                  Portfolio Net Value
                </ThemedText>
                <TouchableOpacity onPress={() => setHideBalance((v) => !v)}>
                  {hideBalance ? (
                    <EyeSlash size={18} color={C.text} />
                  ) : (
                    <Eye size={18} color={C.text} />
                  )}
                </TouchableOpacity>
              </View>
              <ThemedText style={[styles.cardAmount, { color: C.text }]}>
                {hideBalance ? "••••••" : priceFormatter(portfolioBalance, 2)}
              </ThemedText>
            </View>
          </View>

          {/* Profit Return (Dividend) */}
          <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: C.inputBg }]}>
              <View style={styles.cardHeader}>
                <ThemedText style={[styles.cardLabel, { color: C.muted }]}>
                  Profit Return (Dividend)
                </ThemedText>
              </View>
              <View style={styles.dividendRow}>
                <ThemedText style={[styles.cardAmount, { color: C.text }]}>
                  {hideBalance ? "••••••" : priceFormatter(dividendBalance, 2)}
                </ThemedText>
                <BraneButton
                  text="Withdraw"
                  onPress={() => router.push("/wallet/withdraw")}
                  backgroundColor={C.primary}
                  textColor={C.googleBg}
                  height={36}
                  radius={8}
                  width={100}
                />
              </View>
            </View>
          </View>

          {/* Asset Holdings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
                Asset Holdings
              </ThemedText>
              <TouchableOpacity onPress={() => router.push("/(tabs)/(portfolio)/my-holdings")}>
                <ThemedText style={[styles.seeAllLink, { color: C.primary }]}>
                  All Holdings ›
                </ThemedText>
              </TouchableOpacity>
            </View>

            {topAssets.length > 0 ? (
              <View style={styles.assetsList}>
                {topAssets.map((asset) => renderAssetItem(asset))}
              </View>
            ) : (
              <ThemedText style={[styles.emptyText, { color: C.muted }]}>
                No assets yet
              </ThemedText>
            )}
          </View>

          {/* Explore Assets */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
              Explore Assets
            </ThemedText>
            <View style={styles.assetsGrid}>
              {EXPLORE_ASSETS.map((asset, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.assetCard, { backgroundColor: asset.bgColor }]}
                  onPress={() => router.push(`/portfolio/assets/${asset.label.toLowerCase()}`)}
                >
                  <ThemedText style={styles.assetCardLabel}>
                    {asset.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    padding: 8,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: "700",
  },
  dividendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  seeAllLink: {
    fontSize: 13,
    fontWeight: "600",
  },
  assetsList: {
    gap: 10,
  },
  assetItem: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  assetItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  assetLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  assetTicker: {
    fontSize: 14,
    fontWeight: "600",
  },
  assetName: {
    fontSize: 12,
    marginTop: 2,
  },
  assetItemRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  assetValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  assetReturn: {
    fontSize: 12,
    fontWeight: "600",
  },
  assetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  assetCard: {
    width: "48%",
    aspectRatio: 1.2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  assetCardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0B0014",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 20,
  },
});
