import Back from "@/components/Back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE } from "@/services/routes";
import { priceFormatter } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

type OwnedStock = {
  tickerSymbol: string;
  companyName: string;
  units: number;
  currentPrice: number;
};

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

export default function MyStocksScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [ownedStocks, setOwnedStocks] = useState<OwnedStock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const [userStocksRes, stocksRes]: [any, any] = await Promise.all([
        BaseRequest.get(STOCKS_SERVICE.USER_STOCKS),
        BaseRequest.get(STOCKS_SERVICE.STOCKS),
      ]);

      const userHoldings = toArray(userStocksRes);
      const marketStocks = toArray(stocksRes);

      const merged: OwnedStock[] = userHoldings.map((holding: any) => {
        const ticker = String(
          holding?.tickerSymbol || holding?.ticker || "",
        ).toUpperCase();
        const marketStock = marketStocks.find(
          (s: any) =>
            String(s?.tickerSymbol || s?.ticker || "").toUpperCase() === ticker,
        );
        return {
          tickerSymbol: ticker,
          companyName:
            holding?.companyName ||
            holding?.name ||
            marketStock?.companyName ||
            marketStock?.name ||
            ticker,
          units: Number(
            holding?.units || holding?.quantity || holding?.shares || 0,
          ),
          currentPrice: Number(
            marketStock?.currentPrice ||
              marketStock?.price ||
              holding?.currentPrice ||
              0,
          ),
        };
      });

      setOwnedStocks(merged);
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderStockCard = ({ item }: { item: OwnedStock }) => {
    const totalValue = item.units * item.currentPrice;
    return (
      <TouchableOpacity
        style={[
          styles.stockCard,
          { borderColor: C.border, backgroundColor: C.inputBg },
        ]}
        onPress={() =>
          router.push(`/portfolio/company/${item.tickerSymbol}` as any)
        }
      >
        <View style={{ ...styles.tickerBadge, backgroundColor: "#D2F1E4" }}>
          <ThemedText style={[styles.tickerText, { color: C.primary }]}>
            {item.tickerSymbol}
          </ThemedText>
        </View>
        <ThemedText
          style={[styles.companyName, { color: C.text }]}
          numberOfLines={2}
        >
          {item.companyName}
        </ThemedText>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <ThemedText style={[styles.statLabel, { color: C.muted }]}>
              Units
            </ThemedText>
            <ThemedText style={[styles.statValue, { color: C.text }]}>
              {item.units}
            </ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText style={[styles.statLabel, { color: C.muted }]}>
              Price
            </ThemedText>
            <ThemedText style={[styles.statValue, { color: C.text }]}>
              {priceFormatter(item.currentPrice, 2)}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={[styles.totalValue, { color: C.primary }]}>
          {priceFormatter(totalValue, 2)}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          My Stocks
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
        <FlatList
          data={ownedStocks}
          keyExtractor={(item, i) => String(item?.tickerSymbol || i)}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchData(true)}
            />
          }
          renderItem={renderStockCard}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <ThemedText style={[styles.emptyText, { color: C.muted }]}>
                You don&apos;t own any stocks yet.
              </ThemedText>
            </View>
          }
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
  loaderWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  flatContent: { paddingHorizontal: 12, paddingBottom: 30 },
  columnWrapper: { gap: 10, marginBottom: 10 },
  stockCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  tickerBadge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tickerText: { fontSize: 11, fontWeight: "800" },
  companyName: { fontSize: 12, fontWeight: "600", lineHeight: 16 },
  statsRow: { flexDirection: "row", gap: 8 },
  stat: { flex: 1, gap: 2 },
  statLabel: { fontSize: 10 },
  statValue: { fontSize: 12, fontWeight: "600" },
  totalValue: { fontSize: 14, fontWeight: "800" },
  emptyWrap: { alignItems: "center", paddingTop: 60 },
  emptyText: { fontSize: 14 },
});
