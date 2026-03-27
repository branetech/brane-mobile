import { EmptyState } from "@/components/empty-state";
import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { View } from "@idimma/rn-widget";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PERIODS = ["Today", "This Week", "This Month"] as const;
type Period = (typeof PERIODS)[number];

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

const MEDAL_COLORS: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

interface LeaderboardEntry {
  id: string;
  name: string;
  school: string;
  points: number;
  rank: number;
}

export default function LeaderboardScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [period, setPeriod] = useState<Period>("This Week");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLeaderboard = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      try {
        const response: any = await BaseRequest.get(
          "/gamification-service/leaderboard",
          { params: { period } },
        );
        const records = toArray(response).map((item: any, index: number) => ({
          id: String(item?.id ?? index),
          name: String(item?.name ?? item?.username ?? ""),
          school: String(item?.school ?? item?.schoolName ?? ""),
          points: Number(item?.points ?? item?.bracs ?? 0),
          rank: Number(item?.rank ?? index + 1),
        }));
        setEntries(records);
      } catch (error) {
        catchError(error, false);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [period],
  );

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const filtered = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.school.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Header */}
      <Header title='Leaderboard' />

      {/* Period pills */}
      <View style={styles.pillsRow} row>
        {PERIODS.map((p) => {
          const active = period === p;
          return (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
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
                  { color: active ? C.background : C.muted },
                ]}
              >
                {p}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search */}
      <View
        style={StyleSheet.flatten([
          styles.searchWrapper,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ])}
      >
        <TextInput
          style={[styles.searchInput, { color: C.text }]}
          placeholder='Search by name or school…'
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator
          style={styles.loader}
          size='small'
          color={C.primary}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchLeaderboard(true)}
              tintColor={C.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState>
              <ThemedText style={{ color: C.muted, textAlign: "center" }}>
                No leaderboard data yet.
              </ThemedText>
            </EmptyState>
          }
          renderItem={({ item }) => {
            const medalColor = MEDAL_COLORS[item.rank];
            return (
              <View
                style={StyleSheet.flatten([
                  styles.entryRow,
                  {
                    backgroundColor: C.inputBg,
                    borderColor: C.border,
                  },
                ])}
                row
                aligned
              >
                <View
                  style={StyleSheet.flatten([
                    styles.rankCircle,
                    { backgroundColor: medalColor ?? C.inputBg },
                  ])}
                  center
                >
                  <ThemedText
                    style={[
                      styles.rankText,
                      { color: medalColor ? C.background : C.muted },
                    ]}
                  >
                    {item.rank}
                  </ThemedText>
                </View>

                <View style={styles.entryInfo} gap={2}>
                  <ThemedText type='defaultSemiBold' style={{ fontSize: 14 }}>
                    {item.name}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 12, color: C.muted }}>
                    {item.school}
                  </ThemedText>
                </View>

                <View
                  style={[styles.pointsBadge, { backgroundColor: C.googleBg }]}
                  center
                >
                  <ThemedText style={[styles.pointsText, { color: C.primary }]}>
                    {item.points.toLocaleString()} BRACS
                  </ThemedText>
                </View>
              </View>
            );
          }}
        />
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
    paddingBottom: 4,
  },
  headerTitle: { fontSize: 16 },
  pillsRow: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexWrap: "wrap",
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: { fontSize: 13, fontWeight: "500" },
  searchWrapper: {
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  searchInput: { height: 42, fontSize: 14 },
  loader: { marginTop: 40 },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 10,
    paddingTop: 8,
  },
  entryRow: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  rankCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  rankText: { fontSize: 14, fontWeight: "700" },
  entryInfo: { flex: 1 },
  pointsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pointsText: { fontSize: 12, fontWeight: "600" },
});
