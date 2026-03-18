import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Colors } from "@/constants/colors";
import { ThemedText } from "../themed-text";
import BaseRequest, { catchError } from "@/services";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "@idimma/rn-widget";
import { priceFormatter } from "@/utils/helpers";
import { EmptyState } from "../empty-state";

interface Transaction {
  id: string;
  description: string;
  servicetype?: string;
  type?: string;
  amount: number;
  createdAt: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  earned: number;
  position: number;
}

interface SpendingData {
  category: string;
  amount: number;
  percentage: number;
  icon: string;
}

export const HomeTransactionHistory = () => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState<
    "transactions" | "leaderboard" | "spending"
  >("transactions");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    [],
  );
  const [spendingData, setSpendingData] = useState<SpendingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "transactions") {
        await fetchTransactions();
      } else if (activeTab === "leaderboard") {
        await fetchLeaderboard();
      } else if (activeTab === "spending") {
        await fetchSpendingPattern();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response: any = await BaseRequest.get(
        "/transactions-service/transactions/user?perPage=10",
      );
      const transactionList = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
      setTransactions(transactionList);
    } catch (error) {
      catchError(error);
      setTransactions([]);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      // Mock data for leaderboard - replace with actual API endpoint
      const mockLeaderboard: LeaderboardEntry[] = [
        { id: "1", name: "You", earned: 125000, position: 1 },
        { id: "2", name: "Chukwu Okafor", earned: 98500, position: 2 },
        { id: "3", name: "Amara Johnson", earned: 87200, position: 3 },
        { id: "4", name: "David Obi", earned: 76800, position: 4 },
        { id: "5", name: "Zainab Hassan", earned: 65400, position: 5 },
      ];
      setLeaderboardData(mockLeaderboard);
    } catch (error) {
      catchError(error);
      setLeaderboardData([]);
    }
  };

  const fetchSpendingPattern = async () => {
    try {
      // Mock data for spending pattern - replace with actual API endpoint
      const mockSpending: SpendingData[] = [
        {
          category: "Airtime & Data",
          amount: 45000,
          percentage: 35,
          icon: "📱",
        },
        {
          category: "Bills & Services",
          amount: 38000,
          percentage: 30,
          icon: "💡",
        },
        { category: "Transfer", amount: 32000, percentage: 25, icon: "💸" },
        { category: "Investment", amount: 15000, percentage: 10, icon: "📈" },
      ];
      setSpendingData(mockSpending);
    } catch (error) {
      catchError(error);
      setSpendingData([]);
    }
  };

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, string> = {
      airtime: "📱",
      data: "📡",
      electricity: "⚡",
      cable: "📺",
      transfer: "💸",
      deposit: "💰",
      withdrawal: "🏦",
      default: "📊",
    };
    return icons[type?.toLowerCase()] || icons.default;
  };

  const getMedalIcon = (position: number) => {
    const medals = ["🥇", "🥈", "🥉"];
    return medals[position - 1] || `#${position}`;
  };

  const TabButton = ({
    label,
    value,
  }: {
    label: string;
    value: typeof activeTab;
  }) => (
    <Pressable
      onPress={() => setActiveTab(value)}
      style={[
        styles.tabButton,
        {
          borderBottomWidth: activeTab === value ? 2 : 0,
          borderBottomColor: activeTab === value ? C.primary : "transparent",
        },
      ]}
    >
      <ThemedText
        style={[
          styles.tabLabel,
          {
            color: activeTab === value ? C.primary : C.muted,
            fontWeight: activeTab === value ? "600" : "400",
          },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
    const amount = Math.abs(transaction.amount || 0);
    const isDebit = transaction.type === "debit" || transaction.amount < 0;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 12,
          paddingHorizontal: 12,
          backgroundColor: C.inputBg,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: C.border,
          marginBottom: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            gap: 12,
          }}
        >
          <ThemedText style={{ fontSize: 24 }}>
            {getTransactionIcon(transaction.servicetype || transaction.type)}
          </ThemedText>
          <View style={{ flex: 1 }}>
            <ThemedText
              style={{
                fontSize: 13,
                fontWeight: "500",
              }}
              numberOfLines={1}
            >
              {transaction.description ||
                transaction.servicetype ||
                "Transaction"}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 11,
                color: C.muted,
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {transaction.createdAt
                ? new Date(transaction.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : ""}
            </ThemedText>
          </View>
        </View>
        <ThemedText
          style={{
            color: isDebit ? C.error : C.primary,
            fontSize: 13,
            fontWeight: "500",
          }}
        >
          {isDebit ? "-" : "+"} {priceFormatter(amount)}
        </ThemedText>
      </View>
    );
  };

  const LeaderboardItem = ({ entry }: { entry: LeaderboardEntry }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 12,
        backgroundColor: C.inputBg,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: C.border,
        marginBottom: 8,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: `${C.primary}20`,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText style={{ fontSize: 16 }}>
            {getMedalIcon(entry.position)}
          </ThemedText>
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText
            style={{
              fontSize: 13,
              fontWeight: "500",
            }}
          >
            {entry.name}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 11,
              color: C.muted,
              marginTop: 2,
            }}
          >
            Position #{entry.position}
          </ThemedText>
        </View>
      </View>
      <ThemedText
        style={{
          color: C.primary,
          fontSize: 13,
          fontWeight: "600",
        }}
      >
        ₦{priceFormatter(entry.earned)}
      </ThemedText>
    </View>
  );

  const SpendingItem = ({ item }: { item: SpendingData }) => (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <ThemedText style={{ fontSize: 18 }}>{item.icon}</ThemedText>
          <View>
            <ThemedText style={{ fontSize: 13, fontWeight: "500" }}>
              {item.category}
            </ThemedText>
            <ThemedText style={{ fontSize: 11, color: C.muted }}>
              ₦{priceFormatter(item.amount)}
            </ThemedText>
          </View>
        </View>
        <ThemedText
          style={{ fontSize: 13, fontWeight: "600", color: C.primary }}
        >
          {item.percentage}%
        </ThemedText>
      </View>
      <View
        style={{
          height: 6,
          backgroundColor: C.border,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${item.percentage}%`,
            backgroundColor: C.primary,
            borderRadius: 3,
          }}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Headers */}
      <View style={[styles.tabsContainer, { borderBottomColor: C.border }]}>
        <TabButton label='Recent Transactions' value='transactions' />
        <TabButton label='LeaderBoard' value='leaderboard' />
        <TabButton label='Spending Pattern' value='spending' />
      </View>

      {/* Tab Content */}
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size='large' color={C.primary} />
        </View>
      ) : activeTab === "transactions" ? (
        transactions.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.content}
          >
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <EmptyState>
              <ThemedText
                style={{ textAlign: "center", paddingHorizontal: 20 }}
              >
                No transactions yet. Start by buying airtime or sending money!
              </ThemedText>
            </EmptyState>
          </View>
        )
      ) : activeTab === "leaderboard" ? (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {leaderboardData.map((entry) => (
            <LeaderboardItem key={entry.id} entry={entry} />
          ))}
          <ThemedText
            style={{
              fontSize: 11,
              color: C.muted,
              textAlign: "center",
              marginTop: 16,
              marginBottom: 20,
            }}
          >
            Leaderboard updates daily based on spending activity
          </ThemedText>
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {spendingData.length > 0 ? (
            <>
              {spendingData.map((item, index) => (
                <SpendingItem key={index} item={item} />
              ))}
              <View
                style={{
                  backgroundColor: `${C.primary}10`,
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 8,
                }}
              >
                <ThemedText
                  style={{
                    fontSize: 12,
                    color: C.text,
                    lineHeight: 18,
                  }}
                >
                  Total Spending: ₦
                  {priceFormatter(
                    spendingData.reduce((sum, item) => sum + item.amount, 0),
                  )}
                </ThemedText>
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <EmptyState>
                <ThemedText
                  style={{ textAlign: "center", paddingHorizontal: 20 }}
                >
                  Your spending pattern will appear here after transactions
                </ThemedText>
              </EmptyState>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 80,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 12,
  },
  content: {
    maxHeight: 400,
  },
  loader: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});
