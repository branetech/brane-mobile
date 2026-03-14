import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { EmptyState } from "@/components/empty-state";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { formatDate, priceFormatter } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import {
    Bank,
    Card,
    Devices,
    Eye,
    EyeSlash,
    Mobile,
} from "iconsax-react-native";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

interface Transaction {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
}

const QUICK_ACTIONS = [
  { label: "Buy Airtime", route: "/buy-airtime", Icon: Mobile },
  { label: "Buy Data", route: "/buy-data", Icon: Devices },
  { label: "Add Card", route: "/add-funds/add-card", Icon: Card },
  { label: "Add Bank", route: "/add-funds/bank", Icon: Bank },
] as const;

export default function WalletScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const [balanceRes, txRes]: any[] = await Promise.all([
        BaseRequest.get(TRANSACTION_SERVICE.BALANCE),
        BaseRequest.get(TRANSACTION_SERVICE.TRANSACTION_LIST),
      ]);

      const bal =
        balanceRes?.data?.balance ??
        balanceRes?.balance ??
        balanceRes?.data ??
        0;
      setBalance(Number(bal));

      const records = toArray(txRes)
        .slice(0, 5)
        .map((item: any, index: number) => ({
          id: String(
            item?.id ??
              item?.transactionId ??
              `${item?.createdAt ?? "tx"}-${index}`,
          ),
          description: String(
            item?.description ??
              item?.narration ??
              item?.transactionType ??
              "Transaction",
          ),
          date: formatDate(item?.createdAt, "MMM dd, yyyy"),
          amount: Number(item?.amount ?? 0),
          type: String(item?.transactionType ?? "")
            .toLowerCase()
            .includes("credit")
            ? ("credit" as const)
            : ("debit" as const),
        }));
      setTransactions(records);
    } catch (error) {
      catchError(error, false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const ListHeader = (
    <>
      {/* Balance card */}
      <View style={styles.balanceCard} gap={16}>
        <View row aligned style={{ justifyContent: "space-between" }}>
          <ThemedText style={styles.balanceLabel}>Wallet Balance</ThemedText>
          <TouchableOpacity
            onPress={() => setBalanceVisible((v) => !v)}
            hitSlop={8}
          >
            {balanceVisible ? (
              <Eye size={20} color="#fff" />
            ) : (
              <EyeSlash size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.balanceAmount}>
          {balanceVisible ? priceFormatter(balance, 2) : "₦ ******"}
        </ThemedText>

        <View row gap={12}>
          <BraneButton
            text="Withdraw"
            onPress={() => router.push("/wallet/withdraw")}
            style={styles.cardBtn}
            backgroundColor="#2B5D49"
            height={38}
          />
          <BraneButton
            text="Fund Wallet"
            onPress={() => router.push("/add-funds")}
            style={styles.cardBtn}
            backgroundColor="#fff"
            textColor="#013D25"
            height={38}
          />
        </View>
      </View>

      {/* Quick actions */}
      <View style={styles.quickActions} row>
        {QUICK_ACTIONS.map(({ label, route, Icon }) => (
          <TouchableOpacity
            key={label}
            style={styles.quickAction}
            onPress={() => router.push(route as any)}
            activeOpacity={0.75}
          >
            <View
              style={StyleSheet.flatten([
                styles.qaIconCircle,
                { backgroundColor: C.inputBackground },
              ])}
              center
            >
              <Icon size={22} color="#013D25" variant="Bold" />
            </View>
            <ThemedText style={[styles.qaLabel, { color: C.text }]}>
              {label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent transactions header */}
      <View
        row
        aligned
        style={StyleSheet.flatten([
          styles.sectionHeader,
          { justifyContent: "space-between" as const },
        ])}
      >
        <ThemedText type="defaultSemiBold" style={{ fontSize: 15 }}>
          Recent Transactions
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/transactions")}
          activeOpacity={0.7}
        >
          <ThemedText style={{ color: "#013D25", fontSize: 13 }}>
            See All
          </ThemedText>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={styles.header} row aligned>
        <Back />
        <ThemedText type="subtitle" style={styles.headerTitle}>
          My Wallet
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#013D25" />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) =>
            item.id || `${item.description}-${item.date}-${index}`
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchData(true)}
              tintColor="#013D25"
            />
          }
          ListEmptyComponent={
            <EmptyState>
              <ThemedText style={{ color: C.muted, textAlign: "center" }}>
                No recent transactions.
              </ThemedText>
            </EmptyState>
          }
          renderItem={({ item }) => (
            <View
              style={StyleSheet.flatten([
                styles.txRow,
                { borderColor: C.border },
              ])}
              row
              aligned
            >
              <View style={styles.txInfo} gap={3}>
                <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }}>
                  {item.description}
                </ThemedText>
                <ThemedText style={{ fontSize: 12, color: C.muted }}>
                  {item.date}
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.txAmount,
                  { color: item.type === "credit" ? "#013D25" : "#CB010B" },
                ]}
              >
                {item.type === "credit" ? "+" : "-"}
                {priceFormatter(item.amount, 2)}
              </ThemedText>
            </View>
          )}
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
  loader: { marginTop: 40 },
  listContent: { paddingBottom: 40 },
  balanceCard: {
    margin: 16,
    backgroundColor: "#013D25",
    borderRadius: 16,
    padding: 20,
  },
  balanceLabel: { color: "#D2F1E4", fontSize: 13 },
  balanceAmount: { color: "#fff", fontSize: 28, fontWeight: "700" },
  cardBtn: { flex: 1 },
  quickActions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  quickAction: { alignItems: "center", gap: 6 },
  qaIconCircle: { width: 54, height: 54, borderRadius: 27 },
  qaLabel: { fontSize: 11, fontWeight: "500", textAlign: "center" },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  txRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  txInfo: { flex: 1 },
  txAmount: { fontSize: 14, fontWeight: "700" },
});
