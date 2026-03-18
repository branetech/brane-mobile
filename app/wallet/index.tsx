import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { EmptyState } from "@/components/empty-state";
import { CardStyle } from "@/components/home/cards";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { formatDate, priceFormatter } from "@/utils/helpers";
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
  View,
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
      <CardStyle>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <ThemedText
            style={[
              styles.balanceLabel,
              { color: scheme === "dark" ? C.text : "#D2F1E4" },
            ]}
          >
            Wallet Balance
          </ThemedText>
          <TouchableOpacity
            onPress={() => setBalanceVisible((v) => !v)}
            hitSlop={8}
          >
            {balanceVisible ? (
              <Eye size={20} color={scheme === "dark" ? C.text : "#fff"} />
            ) : (
              <EyeSlash size={20} color={scheme === "dark" ? C.text : "#fff"} />
            )}
          </TouchableOpacity>
        </View>

        <ThemedText
          style={[
            styles.balanceAmount,
            { color: scheme === "dark" ? C.text : "#fff" },
          ]}
        >
          {balanceVisible ? priceFormatter(balance, 2) : "₦ ******"}
        </ThemedText>

        <View style={{ flexDirection: "row", gap: 12, width: "100%", marginTop: 20 }}>
          <BraneButton
            text='Withdraw'
            onPress={() => router.push("/wallet/withdraw")}
            style={styles.cardBtn}
            backgroundColor={C.primary + "80"}
            textColor={scheme === "dark" ? C.text : "#fff"}
            height={38}
          />
          <BraneButton
            text='Fund Wallet'
            onPress={() => router.push("/add-funds")}
            style={styles.cardBtn}
            backgroundColor={C.inputBg}
            textColor={C.primary}
            height={38}
          />
        </View>
      </CardStyle>

      {/* Quick actions */}
      <View style={styles.quickActions}>
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
                { backgroundColor: C.inputBg },
              ])}
            >
              <Icon size={22} color={C.primary} variant='Bold' />
            </View>
            <ThemedText style={[styles.qaLabel, { color: C.text }]}>
              {label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent transactions header */}
      <View style={[styles.sectionHeader, { justifyContent: "space-between" }]}>
        <ThemedText type='defaultSemiBold' style={{ fontSize: 15 }}>
          Recent Transactions
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/transaction")}
          activeOpacity={0.7}
        >
          <ThemedText style={{ color: C.primary, fontSize: 13 }}>
            See All
          </ThemedText>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
        <Back />
        <ThemedText type='subtitle' style={styles.headerTitle}>
          My Wallet
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator
          style={styles.loader}
          size='large'
          color={C.primary}
        />
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
              tintColor={C.primary}
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
            >
              <View style={styles.txInfo}>
                <ThemedText type='defaultSemiBold' style={{ fontSize: 14 }}>
                  {item.description}
                </ThemedText>
                <ThemedText style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
                  {item.date}
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.txAmount,
                  { color: item.type === "credit" ? C.primary : "#D50000" },
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: { fontSize: 16 },
  loader: { marginTop: 40 },
  listContent: { paddingBottom: 40 },
  balanceLabel: { fontSize: 13 },
  balanceAmount: { fontSize: 28, fontWeight: "700" },
  cardBtn: { flex: 1 },
  quickActions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickAction: { alignItems: "center", gap: 6 },
  qaIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  qaLabel: { fontSize: 11, fontWeight: "500", textAlign: "center" },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, flexDirection: "row", alignItems: "center" },
  txRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  txInfo: { flex: 1 },
  txAmount: { fontSize: 14, fontWeight: "700" },
});
