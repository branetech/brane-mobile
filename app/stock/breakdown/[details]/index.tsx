import { BraneButton } from "@/components/brane-button";
import { Header } from "@/components/header";
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

export default function BracsBreakdownScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const { details } = useLocalSearchParams();
  const network = String(details || "");

  const [bracsData, setBracsData] = useState<any>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBracs = useCallback(
    async (refresh = false) => {
      if (!network) return;
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      try {
        const res: any = await BaseRequest.get(STOCKS_SERVICE.BRAC(network));
        const data = res?.data || res;
        setBracsData(data);
        setAllocations(
          toArray(data?.allocations || data?.breakdown || data?.stocks || data),
        );
      } catch (error) {
        catchError(error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [network],
  );

  useEffect(() => {
    fetchBracs();
  }, [fetchBracs]);

  const totalBracs = Number(
    bracsData?.totalBracs || bracsData?.balance || bracsData?.bracsBalance || 0,
  );
  const totalValue = Number(bracsData?.totalValue || bracsData?.value || 0);

  return (
    <SafeAreaView
      style={{
        ...StyleSheet.flatten(styles.screen),
        backgroundColor: C.background,
      }}
    >
      <Header title={`${String(network).toUpperCase()} BRACS`} />

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
              onRefresh={() => fetchBracs(true)}
            />
          }
        >
          {/* Summary card */}
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
              BRACS Points Earned
            </ThemedText>
            <ThemedText
              style={{
                ...StyleSheet.flatten(styles.summaryValue),
                color: C.text,
              }}
            >
              {totalBracs.toFixed(4)}
            </ThemedText>
            <ThemedText
              style={{
                ...StyleSheet.flatten(styles.summaryLabel),
                color: C.muted,
                marginTop: 8,
              }}
            >
              Estimated Value
            </ThemedText>
            <ThemedText
              style={{
                ...StyleSheet.flatten(styles.summaryValue),
                color: C.primary,
              }}
            >
              {priceFormatter(totalValue, 2)}
            </ThemedText>
          </View>

          {/* Allocation list */}
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
                Allocation Details
              </ThemedText>
              {allocations.map((item, idx) => (
                <AllocationRow
                  key={idx}
                  item={item}
                  C={C}
                  isLast={idx === allocations.length - 1}
                />
              ))}
            </View>
          )}

          <BraneButton
            text='Convert BRACS'
            onPress={() => router.push("/stock/swap")}
            backgroundColor={C.primary}
            textColor='#D2F1E4'
            height={52}
            radius={12}
            width='100%'
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function AllocationRow({
  item,
  C,
  isLast,
}: {
  item: any;
  C: (typeof Colors)["light"];
  isLast: boolean;
}) {
  const name = String(
    item?.name || item?.stockName || item?.ticker || item?.assetName || "-",
  );
  const percentage = Number(item?.percentage || item?.allocation || 0);
  const value = Number(item?.value || item?.amount || 0);
  const points = Number(item?.bracs || item?.bracsPoints || item?.points || 0);

  return (
    <View
      style={{
        ...StyleSheet.flatten(styles.allocationRow),
        ...(!isLast
          ? { borderBottomWidth: 1, borderBottomColor: "#EFEFF1" }
          : {}),
      }}
    >
      <View style={styles.allocationLeft}>
        <ThemedText
          style={{
            ...StyleSheet.flatten(styles.allocationName),
            color: C.text,
          }}
        >
          {name}
        </ThemedText>
        {points > 0 && (
          <ThemedText
            style={{
              ...StyleSheet.flatten(styles.allocationSub),
              color: C.muted,
            }}
          >
            {points.toFixed(4)} pts
          </ThemedText>
        )}
      </View>
      <View style={styles.allocationRight}>
        <ThemedText
          style={{
            ...StyleSheet.flatten(styles.allocationPct),
            color: C.primary,
          }}
        >
          {percentage.toFixed(1)}%
        </ThemedText>
        {value > 0 && (
          <ThemedText
            style={{
              ...StyleSheet.flatten(styles.allocationVal),
              color: C.muted,
            }}
          >
            {priceFormatter(value, 2)}
          </ThemedText>
        )}
      </View>
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
  content: { paddingHorizontal: 16, paddingBottom: 40, gap: 16 },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  summaryLabel: { fontSize: 12 },
  summaryValue: { fontSize: 24, fontWeight: "800" },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 14 },
  sectionTitle: { fontSize: 14, fontWeight: "700" },
  allocationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    gap: 8,
  },
  allocationLeft: { flex: 1, gap: 2 },
  allocationName: { fontSize: 13, fontWeight: "600" },
  allocationSub: { fontSize: 11 },
  allocationRight: { alignItems: "flex-end", gap: 2 },
  allocationPct: { fontSize: 13, fontWeight: "700" },
  allocationVal: { fontSize: 11 },
});
