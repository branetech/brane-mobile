import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE } from "@/services/routes";
import { priceFormatter } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";
type Tab = "about" | "financials";

export default function CompanyDetailsScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const { details } = useLocalSearchParams();
  const ticker = String(details || "");

  const [stock, setStock] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("about");

  const fetchStock = useCallback(
    async (refresh = false) => {
      if (!ticker) return;
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      try {
        const res: any = await BaseRequest.get(STOCKS_SERVICE.DETAILS(ticker));
        setStock(res?.data || res);
      } catch (error) {
        catchError(error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [ticker],
  );

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const change = Number(stock?.change || stock?.priceChange || 0);
  const changePercent = Number(
    stock?.changePercent || stock?.percentChange || 0,
  );
  const isPositive = changePercent >= 0;
  const changeColor = isPositive ? C.primary : "#D50000";
  const changeBgColor = isPositive ? C.primary + "15" : "#FCE4E4";

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          {stock?.name || stock?.companyName || ticker}
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchStock(true)}
              tintColor={C.primary}
            />
          }
        >
          {/* Price card */}
          <View
            style={{
              ...StyleSheet.flatten(styles.priceCard),
              borderColor: C.border,
            }}
          >
            <ThemedText style={[styles.ticker, { color: C.muted }]}>
              {ticker.toUpperCase()}
            </ThemedText>
            <ThemedText style={[styles.price, { color: C.text }]}>
              {priceFormatter(
                Number(stock?.currentPrice || stock?.price || 0),
                2,
              )}
            </ThemedText>
            <View
              style={{
                ...StyleSheet.flatten(styles.changePill),
                backgroundColor: changeBgColor,
              }}
            >
              <ThemedText style={[styles.changeText, { color: changeColor }]}>
                {isPositive ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}% (
                {priceFormatter(Math.abs(change), 2)})
              </ThemedText>
            </View>
          </View>

          {/* Tabs */}
          <View style={[styles.tabs, { borderBottomColor: C.border }]}>
            {(["about", "financials"] as Tab[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab && {
                    borderBottomColor: C.primary,
                    borderBottomWidth: 2,
                  },
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <ThemedText
                  style={[
                    styles.tabLabel,
                    {
                      color: activeTab === tab ? C.primary : C.muted,
                      fontWeight: activeTab === tab ? "700" : "400",
                    },
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab content */}
          {activeTab === "about" ? (
            <View
              style={{
                ...StyleSheet.flatten(styles.card),
                borderColor: C.border,
              }}
            >
              <InfoRow
                label='Exchange'
                value={String(stock?.exchange || stock?.stockExchange || "-")}
                C={C}
              />
              <InfoRow
                label='Sector'
                value={String(stock?.sector || stock?.industry || "-")}
                C={C}
              />
              <InfoRow
                label='Current Price'
                value={priceFormatter(
                  Number(stock?.currentPrice || stock?.price || 0),
                  2,
                )}
                C={C}
              />
              {!!(stock?.description || stock?.about) && (
                <View style={styles.descriptionBlock}>
                  <ThemedText style={[styles.descLabel, { color: C.muted }]}>
                    About
                  </ThemedText>
                  <ThemedText style={[styles.descText, { color: C.text }]}>
                    {stock?.description || stock?.about}
                  </ThemedText>
                </View>
              )}
            </View>
          ) : (
            <View
              style={{
                ...StyleSheet.flatten(styles.card),
                borderColor: C.border,
              }}
            >
              <InfoRow
                label='Market Cap'
                value={priceFormatter(
                  Number(stock?.marketCap || stock?.mktCap || 0),
                  2,
                )}
                C={C}
              />
              <InfoRow
                label='P/E Ratio'
                value={
                  stock?.peRatio != null
                    ? String(Number(stock.peRatio).toFixed(2))
                    : "-"
                }
                C={C}
              />
              <InfoRow
                label='52-Week High'
                value={priceFormatter(
                  Number(stock?.week52High || stock?.yearHigh || 0),
                  2,
                )}
                C={C}
              />
              <InfoRow
                label='52-Week Low'
                value={priceFormatter(
                  Number(stock?.week52Low || stock?.yearLow || 0),
                  2,
                )}
                C={C}
              />
              <InfoRow
                label='Volume'
                value={String(stock?.volume || "-")}
                C={C}
              />
              <InfoRow
                label='Avg Volume'
                value={String(stock?.avgVolume || "-")}
                C={C}
              />
            </View>
          )}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <BraneButton
          text='Buy Stock'
          onPress={() =>
            router.push({
              pathname: "/portfolio/checkout",
              params: { ticker },
            })
          }
          backgroundColor={C.primary}
          textColor={C.background}
          height={52}
          radius={12}
          width='100%'
        />
      </View>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  C,
}: {
  label: string;
  value: string;
  C: (typeof Colors)["light"];
}) {
  return (
    <View style={styles.infoRow}>
      <ThemedText style={[styles.infoLabel, { color: C.muted }]}>
        {label}
      </ThemedText>
      <ThemedText style={[styles.infoValue, { color: C.text }]}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  loaderWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { paddingHorizontal: 16, paddingBottom: 100, gap: 16 },
  priceCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    alignItems: "flex-start",
  },
  ticker: { fontSize: 12, fontWeight: "600" },
  price: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 36,
    paddingLeft: 1,
  },
  changePill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  changeText: { fontSize: 12, fontWeight: "600" },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: 12 },
  tabLabel: { fontSize: 14 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  infoLabel: { fontSize: 13, flex: 1 },
  infoValue: { fontSize: 13, fontWeight: "600", textAlign: "right", flex: 1 },
  descriptionBlock: { gap: 6, marginTop: 4 },
  descLabel: { fontSize: 12, fontWeight: "600" },
  descText: { fontSize: 13, lineHeight: 20 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "transparent",
  },
});
