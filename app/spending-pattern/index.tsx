import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { palette } from "@/constants";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { priceFormatter } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Period = "daily" | "weekly" | "monthly" | "yearly";
type ServiceFilter =
  | "all"
  | "airtime"
  | "data"
  | "electricity"
  | "cable"
  | "betting";

type SpendingEntry = {
  id?: string;
  category?: string;
  service?: string;
  amount: number;
  date?: string;
  description?: string;
  count?: number;
};

type SpendingPattern = {
  totalSpent?: number;
  total_spent?: number;
  transactionCount?: number;
  transaction_count?: number;
  breakdown?: SpendingEntry[];
  data?: SpendingEntry[];
  entries?: SpendingEntry[];
};

const PERIODS: { id: Period; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

const SERVICE_FILTERS: { id: ServiceFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "airtime", label: "Airtime" },
  { id: "data", label: "Data" },
  { id: "electricity", label: "Electricity" },
  { id: "cable", label: "Cable" },
  { id: "betting", label: "Betting" },
];

const getServiceColors = (
  scheme: "dark" | "light",
): Record<ServiceFilter, string> => {
  const isDark = scheme === "dark";
  return {
    all: palette.brandDeep,
    airtime: isDark ? palette.brandDeep + "30" : palette.brandMint,
    data: isDark ? palette.chartOrange + "30" : palette.spendDataBg,
    electricity: isDark ? palette.chartBlue + "30" : palette.spendElectricBg,
    cable: isDark ? palette.chartRed + "30" : palette.spendCableBg,
    betting: isDark ? palette.chartPurple + "30" : palette.spendBettingBg,
  };
};

const SERVICE_BAR_COLORS: Record<string, string> = {
  airtime: palette.brandDeep,
  data: palette.chartOrange,
  electricity: palette.chartBlue,
  cable: palette.chartRed,
  betting: palette.chartPurple,
};

const getServiceColor = (
  service: ServiceFilter,
  C: any,
  scheme: "dark" | "light",
): string => {
  const isDark = scheme === "dark";
  if (service === "airtime") return C.primary + "25";
  if (service === "data") return isDark ? C.primary + "15" : palette.spendDataBg;
  if (service === "electricity") return isDark ? C.primary + "15" : palette.spendElectricBg;
  if (service === "cable") return isDark ? C.primary + "15" : palette.spendCableBg;
  if (service === "betting") return isDark ? C.primary + "15" : palette.spendBettingBg;
  return C.primary + "15";
};

const toArray = (value: unknown): SpendingEntry[] => {
  if (Array.isArray(value)) return value as SpendingEntry[];
  const v = value as any;
  if (Array.isArray(v?.data?.breakdown)) return v.data.breakdown;
  if (Array.isArray(v?.data?.entries)) return v.data.entries;
  if (Array.isArray(v?.data?.data)) return v.data.data;
  if (Array.isArray(v?.breakdown)) return v.breakdown;
  if (Array.isArray(v?.entries)) return v.entries;
  return [];
};

const resolveField = (obj: any, ...keys: string[]): any => {
  for (const key of keys) {
    if (obj?.[key] !== undefined) return obj[key];
  }
  return undefined;
};

export default function SpendingPatternScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const themeScheme = scheme === "dark" ? "dark" : "light";
  const C = Colors[themeScheme];
  const SERVICE_COLORS = getServiceColors(themeScheme);

  const [selectedPeriod, setSelectedPeriod] = useState<Period>("daily");
  const [selectedFilter, setSelectedFilter] = useState<ServiceFilter>("all");
  const [patternData, setPatternData] = useState<SpendingPattern | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSpendingPattern = useCallback(async () => {
    setLoading(true);
    try {
      const res = await BaseRequest.get(TRANSACTION_SERVICE.SPENDING_PATTERN, {
        params: { period: selectedPeriod },
      });
      setPatternData((res.data?.data ?? res.data) as SpendingPattern);
    } catch (error) {
      catchError(error);
      setPatternData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchSpendingPattern();
  }, [selectedPeriod, fetchSpendingPattern]);

  const entries = toArray(patternData);
  const totalSpent =
    resolveField(patternData, "totalSpent", "total_spent") ??
    entries.reduce((s, e) => s + (e.amount ?? 0), 0);
  const transactionCount =
    resolveField(patternData, "transactionCount", "transaction_count") ??
    entries.length;

  const filteredEntries =
    selectedFilter === "all"
      ? entries
      : entries.filter((e) =>
          (e.category ?? e.service ?? "")
            .toLowerCase()
            .includes(selectedFilter),
        );

  // Build bar chart data from entries (grouped by service/category)
  const barGroups = entries.reduce<Record<string, number>>((acc, entry) => {
    const key = (entry.category ?? entry.service ?? "other").toLowerCase();
    acc[key] = (acc[key] ?? 0) + (entry.amount ?? 0);
    return acc;
  }, {});
  const maxBarValue = Math.max(...Object.values(barGroups), 1);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Header */}
      <Header title='Spending Pattern' />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Period pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {PERIODS.map((p) => {
            const active = selectedPeriod === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => setSelectedPeriod(p.id)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: active ? C.primary : C.inputBg,
                    borderColor: active ? C.primary : C.border,
                  },
                ]}
                activeOpacity={0.75}
              >
                <ThemedText
                  style={[
                    styles.pillText,
                    { color: active ? C.text : C.muted },
                  ]}
                >
                  {p.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator color={C.primary} size='small' />
            <ThemedText style={{ color: C.muted, marginTop: 10 }}>
              Loading spending data…
            </ThemedText>
          </View>
        ) : (
          <>
            {/* Summary cards */}
            <View style={styles.summaryRow} row gap={12}>
              <View
                style={{
                  ...styles.summaryCard,
                  backgroundColor: C.primary + "15",
                  flex: 1,
                }}
                gap={4}
              >
                <ThemedText style={[styles.summaryLabel, { color: C.muted }]}>
                  Total Spent
                </ThemedText>
                <ThemedText
                  type='subtitle'
                  style={[styles.summaryValue, { color: C.text }]}
                >
                  {priceFormatter(totalSpent)}
                </ThemedText>
              </View>

              <View
                style={{
                  ...styles.summaryCard,
                  backgroundColor:
                    themeScheme === "dark" ? C.primary + "15" : palette.spendDataBg,
                  flex: 1,
                }}
                gap={4}
              >
                <ThemedText style={[styles.summaryLabel, { color: C.muted }]}>
                  Transactions
                </ThemedText>
                <ThemedText
                  type='subtitle'
                  style={[styles.summaryValue, { color: C.text }]}
                >
                  {transactionCount ?? 0}
                </ThemedText>
              </View>
            </View>

            {/* Bar visualisation */}
            {Object.keys(barGroups).length > 0 && (
              <View
                style={{
                  ...styles.barCard,
                  backgroundColor: C.inputBg,
                  borderColor: C.border,
                }}
                gap={12}
              >
                <ThemedText type='defaultSemiBold'>
                  Breakdown by Service
                </ThemedText>
                {Object.entries(barGroups).map(([key, value]) => {
                  const pct = (value / maxBarValue) * 100;
                  const barColor =
                    SERVICE_BAR_COLORS[key as ServiceFilter] ?? C.primary;
                  return (
                    <View key={key} gap={4}>
                      <View style={styles.barLabelRow} row aligned>
                        <ThemedText
                          style={{
                            fontSize: 12,
                            textTransform: "capitalize",
                            color: C.text,
                            flex: 1,
                          }}
                        >
                          {key}
                        </ThemedText>
                        <ThemedText style={{ fontSize: 12, color: C.muted }}>
                          {priceFormatter(value)}
                        </ThemedText>
                      </View>
                      <View
                        style={{
                          ...styles.barTrack,
                          backgroundColor: C.border,
                        }}
                      >
                        <View
                          style={{
                            ...styles.barFill,
                            width: `${pct}%` as any,
                            backgroundColor: barColor,
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Service filter pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillRow}
            >
              {SERVICE_FILTERS.map((f) => {
                const active = selectedFilter === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    onPress={() => setSelectedFilter(f.id)}
                    style={[
                      styles.pill,
                      {
                        backgroundColor: active
                          ? getServiceColor(f.id, C, themeScheme)
                          : C.inputBg,
                        borderColor: active ? C.primary : C.border,
                      },
                    ]}
                    activeOpacity={0.75}
                  >
                    <ThemedText
                      style={[
                        styles.pillText,
                        { color: active ? C.primary : C.muted },
                      ]}
                    >
                      {f.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Spending entries list */}
            <ThemedText type='defaultSemiBold'>Recent Spending</ThemedText>

            {filteredEntries.length === 0 ? (
              <View style={styles.emptyWrap}>
                <ThemedText style={{ color: C.muted, textAlign: "center" }}>
                  No spending data for this period.
                </ThemedText>
              </View>
            ) : (
              <View gap={8}>
                {filteredEntries.map((entry, idx) => {
                  const key = (
                    entry.category ??
                    entry.service ??
                    "other"
                  ).toLowerCase();
                  const dotColor = SERVICE_BAR_COLORS[key] ?? C.primary;
                  return (
                    <View
                      key={entry.id ?? String(idx)}
                      style={{
                        ...styles.entryRow,
                        backgroundColor: C.inputBg,
                        borderColor: C.border,
                      }}
                      row
                      aligned
                    >
                      <View
                        style={{
                          ...styles.entryDot,
                          backgroundColor: dotColor,
                        }}
                      />
                      <View style={{ flex: 1 }} gap={2}>
                        <ThemedText
                          style={{
                            fontSize: 13,
                            fontWeight: "600",
                            textTransform: "capitalize",
                            color: C.text,
                          }}
                        >
                          {entry.description ??
                            entry.category ??
                            entry.service ??
                            "Transaction"}
                        </ThemedText>
                        {!!entry.date && (
                          <ThemedText style={{ fontSize: 11, color: C.muted }}>
                            {entry.date}
                          </ThemedText>
                        )}
                      </View>
                      <ThemedText
                        type='defaultSemiBold'
                        style={{ fontSize: 14, color: C.text }}
                      >
                        {priceFormatter(entry.amount)}
                      </ThemedText>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: { fontSize: 16 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 16,
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "500",
  },
  loaderWrap: {
    paddingVertical: 64,
    alignItems: "center",
  },
  summaryRow: {
    flexDirection: "row",
  },
  summaryCard: {
    borderRadius: 14,
    padding: 16,
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 22,
  },
  barCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  barLabelRow: {
    justifyContent: "space-between",
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: 8,
    borderRadius: 4,
    minWidth: 4,
  },
  entryRow: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  entryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  emptyWrap: {
    paddingVertical: 32,
    alignItems: "center",
  },
});
