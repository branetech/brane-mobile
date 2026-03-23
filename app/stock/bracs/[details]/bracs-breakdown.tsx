import Back from "@/components/back";
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

export default function BracsSubBreakdownScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const { details } = useLocalSearchParams();
  const assetId = String(details || "");

  const [bracsData, setBracsData] = useState<any>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBreakdown = useCallback(
    async (refresh = false) => {
      if (!assetId) return;
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      try {
        const res: any = await BaseRequest.get(
          STOCKS_SERVICE.BREAKDOWN(assetId),
        );

        const data = res?.data || res;
        setBracsData(data);
        setAllocations(
          toArray(data?.allocations || data?.breakdown || data?.items || data),
        );
      } catch (error) {
        catchError(error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [assetId],
  );

  useEffect(() => {
    fetchBreakdown();
  }, [fetchBreakdown]);

  const totalBracs = Number(
    bracsData?.totalBracs || bracsData?.bracsPoints || bracsData?.balance || 0,
  );

  return (
    <SafeAreaView
      style={{
        ...StyleSheet.flatten(styles.screen),
        backgroundColor: C.background,
      }}
    >
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText
          style={{ ...StyleSheet.flatten(styles.headerTitle), color: C.text }}
        >
          BRACS Breakdown
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={C.primary} size='small' />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchBreakdown(true)}
            />
          }
        >
          {/* Summary */}
          <View
            style={{
              ...StyleSheet.flatten(styles.summaryCard),
              borderColor: C.border,
            }}
          >
            <ThemedText
              style={{
                ...StyleSheet.flatten(styles.summaryLabel),
                color: C.muted,
              }}
            >
              Asset
            </ThemedText>
            <ThemedText
              style={{
                ...StyleSheet.flatten(styles.summaryName),
                color: C.text,
              }}
            >
              {bracsData?.name ||
                bracsData?.assetName ||
                bracsData?.tickerSymbol ||
                assetId.toUpperCase()}
            </ThemedText>
            <ThemedText
              style={{
                ...StyleSheet.flatten(styles.summaryLabel),
                color: C.muted,
                marginTop: 8,
              }}
            >
              Total BRACS Points
            </ThemedText>
            <ThemedText
              style={{
                ...StyleSheet.flatten(styles.summaryPoints),
                color: C.primary,
              }}
            >
              {totalBracs.toFixed(4)}
            </ThemedText>
          </View>

          {/* Allocations */}
          {allocations.length > 0 && (
            <View
              style={{
                ...StyleSheet.flatten(styles.card),
                borderColor: C.border,
              }}
            >
              <ThemedText
                style={{
                  ...StyleSheet.flatten(styles.sectionTitle),
                  color: C.text,
                }}
              >
                Allocations
              </ThemedText>
              {allocations.map((item, idx) => {
                const name = String(
                  item?.name ||
                    item?.label ||
                    item?.category ||
                    item?.type ||
                    `Item ${idx + 1}`,
                );
                const percentage = Number(
                  item?.percentage || item?.allocation || item?.weight || 0,
                );
                const value = Number(item?.value || item?.amount || 0);

                return (
                  <View
                    key={idx}
                    style={{
                      ...StyleSheet.flatten(styles.allocationRow),
                      ...(idx < allocations.length - 1
                        ? StyleSheet.flatten(styles.rowDivider)
                        : {}),
                    }}
                  >
                    {/* Progress bar */}
                    <View style={styles.rowTop}>
                      <ThemedText
                        style={{
                          ...StyleSheet.flatten(styles.allocationName),
                          color: C.text,
                        }}
                      >
                        {name}
                      </ThemedText>
                      <ThemedText
                        style={{
                          ...StyleSheet.flatten(styles.allocationPct),
                          color: C.primary,
                        }}
                      >
                        {percentage.toFixed(1)}%
                      </ThemedText>
                    </View>
                    <View
                      style={{
                        ...StyleSheet.flatten(styles.progressTrack),
                        backgroundColor: C.border,
                      }}
                    >
                      <View
                        style={{
                          ...StyleSheet.flatten(styles.progressFill),
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: C.primary,
                        }}
                      />
                    </View>
                    {value > 0 && (
                      <ThemedText
                        style={{
                          ...StyleSheet.flatten(styles.allocationValue),
                          color: C.muted,
                        }}
                      >
                        {priceFormatter(value, 2)}
                      </ThemedText>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {allocations.length === 0 && !isLoading && (
            <View style={styles.emptyWrap}>
              <ThemedText
                style={{
                  ...StyleSheet.flatten(styles.emptyText),
                  color: C.muted,
                }}
              >
                No breakdown data available
              </ThemedText>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
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
  content: { paddingHorizontal: 16, paddingBottom: 40, gap: 16 },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  summaryLabel: { fontSize: 12 },
  summaryName: { fontSize: 18, fontWeight: "700" },
  summaryPoints: { fontSize: 24, fontWeight: "800" },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 14 },
  sectionTitle: { fontSize: 14, fontWeight: "700" },
  allocationRow: { gap: 6, paddingVertical: 10 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: "#EFEFF1" },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  allocationName: { fontSize: 13, fontWeight: "600" },
  allocationPct: { fontSize: 13, fontWeight: "700" },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  allocationValue: { fontSize: 11 },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: { fontSize: 14 },
});
