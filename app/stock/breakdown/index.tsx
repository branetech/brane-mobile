import { BraneButton } from "@/components/brane-button";
import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { palette } from "@/constants";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE } from "@/services/routes";
import { priceFormatter } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Eye, EyeSlash } from "iconsax-react-native";
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

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

const NETWORKS = [
  { name: "MTN", ticker: "mtn", color: "#FFC107" },
  { name: "Airtel", ticker: "airtel", color: "#E53935" },
  { name: "Glo", ticker: "glo", color: "#43A047" },
  { name: "9Mobile", ticker: "9mobile", color: "#006400" },
];

export default function BracsBreakdownIndexScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [bracsData, setBracsData] = useState<any>(null);
  const [networkBreakdown, setNetworkBreakdown] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);

  const fetchBracs = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const res: any = await BaseRequest.get(STOCKS_SERVICE.BRACS);
      const data = res?.data || res;
      setBracsData(data);

      const breakdown = toArray(
        data?.networks ||
          data?.breakdown ||
          data?.networkBreakdown ||
          data?.allocations ||
          [],
      );
      setNetworkBreakdown(breakdown);
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBracs();
  }, [fetchBracs]);

  const bracsBalance = Number(
    bracsData?.balance || bracsData?.bracsBalance || bracsData?.totalBracs || 0,
  );

  const getNetworkBracs = (ticker: string): number => {
    const found = networkBreakdown.find((n: any) =>
      String(n?.ticker || n?.network || n?.name || "")
        .toLowerCase()
        .includes(ticker.toLowerCase()),
    );
    return Number(found?.bracs || found?.earned || found?.balance || 0);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <Header title='BRACS Breakdown' />

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size='small' color={C.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchBracs(true)}
            />
          }
        >
          {/* BRACS Balance Card */}
          <View style={{ ...styles.balanceCard, backgroundColor: C.primary }}>
            <View style={styles.balanceRow}>
              <View style={styles.balanceInfo}>
                <ThemedText
                  style={[styles.balanceLabelText, { color: C.googleBg }]}
                >
                  Total BRACS Balance
                </ThemedText>
                <ThemedText style={[styles.balanceAmount, { color: palette.white }]}>
                  {hideBalance ? "••••••" : `${bracsBalance.toFixed(4)} BRACS`}
                </ThemedText>
                {bracsData?.estimatedValue != null && (
                  <ThemedText
                    style={[styles.balanceSubText, { color: C.googleBg }]}
                  >
                    ≈{" "}
                    {hideBalance
                      ? "••••••"
                      : priceFormatter(Number(bracsData.estimatedValue), 2)}
                  </ThemedText>
                )}
              </View>
              <TouchableOpacity
                onPress={() => setHideBalance((v) => !v)}
                style={styles.eyeBtn}
              >
                {hideBalance ? (
                  <EyeSlash size={22} color={C.googleBg} />
                ) : (
                  <Eye size={22} color={C.googleBg} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Network Breakdown */}
          <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
            Network Breakdown
          </ThemedText>
          <View style={{ ...styles.networkCard, borderColor: C.border }}>
            {NETWORKS.map((network, i) => {
              const earned = getNetworkBracs(network.ticker);
              return (
                <TouchableOpacity
                  key={network.ticker}
                  style={[
                    styles.networkRow,
                    i < NETWORKS.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: C.border,
                    },
                  ]}
                  onPress={() =>
                    router.push(`/stock/breakdown/${network.ticker}` as any)
                  }
                >
                  <View
                    style={{
                      ...styles.networkBadge,
                      backgroundColor: network.color + "22",
                    }}
                  >
                    <ThemedText
                      style={[
                        styles.networkBadgeText,
                        { color: network.color },
                      ]}
                    >
                      {network.name.charAt(0)}
                    </ThemedText>
                  </View>
                  <View style={styles.networkMeta}>
                    <ThemedText style={[styles.networkName, { color: C.text }]}>
                      {network.name}
                    </ThemedText>
                    <ThemedText style={[styles.networkSub, { color: C.muted }]}>
                      BRACS Earned
                    </ThemedText>
                  </View>
                  <ThemedText
                    style={[styles.networkBracs, { color: C.primary }]}
                  >
                    {earned.toFixed(4)}
                  </ThemedText>
                  <ThemedText style={[styles.chevron, { color: C.muted }]}>
                    ›
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Convert BRACS */}
          <BraneButton
            text='Convert BRACS'
            onPress={() => router.push("/stock/swap")}
            backgroundColor={C.primary}
            textColor='#D2F1E4'
            height={52}
            radius={12}
          />
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
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40, gap: 16 },
  balanceCard: {
    borderRadius: 16,
    padding: 20,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  balanceInfo: { gap: 4 },
  balanceLabelText: { fontSize: 12, fontWeight: "600" },
  balanceAmount: { fontSize: 26, fontWeight: "800" },
  balanceSubText: { fontSize: 12, opacity: 0.8 },
  eyeBtn: { padding: 4, marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: "700" },
  networkCard: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  networkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  networkBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  networkBadgeText: { fontSize: 16, fontWeight: "800" },
  networkMeta: { flex: 1, gap: 2 },
  networkName: { fontSize: 14, fontWeight: "600" },
  networkSub: { fontSize: 11 },
  networkBracs: { fontSize: 14, fontWeight: "700" },
  chevron: { fontSize: 20 },
});
