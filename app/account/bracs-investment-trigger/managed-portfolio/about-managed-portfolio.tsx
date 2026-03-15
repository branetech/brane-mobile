import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE } from "@/services/routes";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TopPick = {
  tickerSymbol: string;
  bracName: string;
};

type AllocationItem = {
  asset: string;
  percentage: number;
};

const details = `Your Bracs, professionally managed for growth.\n\nManaged Portfolio & Wealth Investment gives you peace of mind by putting your portfolio in the hands of expert investment partners. Instead of worrying about how to allocate or grow your assets, you can rely on a seamless system that manages everything for you securely, transparently, and with your financial goals in mind.\n\nWhat You Get\n• Effortless Management: Your portfolio is handled automatically.\n• Expert Oversight: Professional partners optimize your assets for growth.\n• Tailored to You: Strategies designed to match your risk profile.`;

const staticAllocationData: AllocationItem[] = [
  { asset: "Nigerian Equities", percentage: 50 },
  { asset: "FGN Bonds", percentage: 30 },
  { asset: "Gold", percentage: 20 },
];

export default function AboutManagedPortfolioScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [managedData, setManagedData] = useState<any>(null);
  const [topPicks, setTopPicks] = useState<TopPick[]>([]);

  const shortText = useMemo(() => {
    const trimmed = details.replace(/\s+/g, " ").trim();
    return `${trimmed.slice(0, 160)}...`;
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [managedRes, picksRes]: any = await Promise.all([
        BaseRequest.get(STOCKS_SERVICE.MANAGED_BRACS).catch(() => null),
        BaseRequest.get(STOCKS_SERVICE.ASSET_PICKER).catch(() => null),
      ]);

      const managedPayload = managedRes?.data || managedRes || null;
      const picksPayload = picksRes?.data || picksRes || [];

      setManagedData(managedPayload);

      const normalized = Array.isArray(picksPayload)
        ? picksPayload
        : Array.isArray(picksPayload?.records)
          ? picksPayload.records
          : [];

      setTopPicks(
        normalized.map((item: any) => ({
          tickerSymbol: String(item?.tickerSymbol || item?.ticker || "N/A"),
          bracName: String(
            item?.bracName || item?.name || item?.tickerSymbol || "Asset",
          ),
        })),
      );
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back
          onPress={() => router.push("/account/bracs-investment-trigger")}
        />
        <ThemedText type='subtitle' style={styles.title}>
          MANAGED WEALTH
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size='small' color='#013D25' />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.tabWrap}>
            <ThemedText style={styles.tabText}>About</ThemedText>
          </View>

          <ThemedText type='subtitle' style={styles.headline}>
            Managed Bracs & Wealth Investment
          </ThemedText>

          <ThemedText style={[styles.bodyText, { color: C.muted }]}>
            {showMore ? details : shortText}
          </ThemedText>

          <Pressable onPress={() => setShowMore((prev) => !prev)}>
            <ThemedText style={styles.showMoreText}>
              {showMore ? "Show less" : "Show more"}
            </ThemedText>
          </Pressable>

          <ThemedText style={[styles.sectionTitle, { color: C.muted }]}>
            Top Picks
          </ThemedText>

          {topPicks.length ? (
            <View style={styles.pickList}>
              {topPicks.map((pick) => (
                <View key={pick.tickerSymbol} style={styles.pickCard}>
                  <ThemedText type='defaultSemiBold'>
                    {pick.tickerSymbol.toUpperCase()}
                  </ThemedText>
                  <ThemedText style={[styles.pickSubText, { color: C.muted }]}>
                    {pick.bracName}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <ThemedText style={{ color: C.muted }}>
                No top picks at the moment
              </ThemedText>
            </View>
          )}

          <ThemedText style={[styles.sectionTitle, { color: C.muted }]}>
            Wealth Allocation
          </ThemedText>
          <View style={styles.allocWrap}>
            {staticAllocationData.map((item) => (
              <View key={item.asset} style={styles.allocRow} row spaced aligned>
                <ThemedText>{item.asset}</ThemedText>
                <ThemedText type='defaultSemiBold'>
                  {item.percentage}%
                </ThemedText>
              </View>
            ))}
          </View>

          {!!managedData && <View style={{ height: 10 }} />}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 14,
    letterSpacing: 0.4,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  tabWrap: {
    borderBottomWidth: 2,
    borderBottomColor: "#013D25",
    alignSelf: "flex-start",
    paddingBottom: 6,
  },
  tabText: {
    color: "#013D25",
    fontSize: 14,
    fontWeight: "600",
  },
  headline: {
    marginTop: 20,
    fontSize: 24,
    lineHeight: 30,
  },
  bodyText: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 19,
  },
  showMoreText: {
    marginTop: 8,
    fontSize: 13,
    color: "#013D25",
    fontWeight: "600",
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 13,
    fontWeight: "600",
  },
  pickList: {
    marginTop: 10,
    gap: 10,
  },
  pickCard: {
    borderWidth: 1,
    borderColor: "#F0FAF6",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  pickSubText: {
    marginTop: 4,
    fontSize: 12,
  },
  emptyState: {
    marginTop: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#F0FAF6",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  allocWrap: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#F0FAF6",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  allocRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F7F7F8",
  },
});
