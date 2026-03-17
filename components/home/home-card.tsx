import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { usePreference } from "@/services/data";
import { priceFormatter } from "@/utils/helpers";
import { TouchableOpacity, View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import {
  ChartSquare,
  Eye,
  EyeSlash,
  Mobile,
  Money,
  WifiSquare,
} from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { BraneButton } from "../brane-button";
import { EmptyState } from "../empty-state";
import { ThemedText } from "../themed-text";
import { CardStyle, LearnCard, ServicesCard } from "./cards";

export const HomeCard = () => {
  const router = useRouter();
  const { onToggleBalance, showBalance } = usePreference();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setIsLoading(true);
      const response: any = await BaseRequest.get(
        "/transactions-service/wallet/balance",
      );
      const balanceAmount = response?.data?.balance || response?.balance || 0;
      setBalance(balanceAmount);
    } catch (error) {
      catchError(error);
      setBalance(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View w='100%' mt={8}>
      <CardStyle>
        <View spaced flex={1} h='100%'>
          <View gap={8} w='100%' aligned>
            <View justified w='100%' row aligned gap={6}>
              <ThemedText style={{ color: "#D3EBE1" }}>
                Total Balance
              </ThemedText>
              <TouchableOpacity onPress={onToggleBalance}>
                {showBalance ? (
                  <Eye color='#D3EBE1' size={16} />
                ) : (
                  <EyeSlash color='#D3EBE1' size={16} />
                )}
              </TouchableOpacity>
            </View>
            <View row aligned>
              {isLoading ? (
                <ActivityIndicator size='small' color='#D3EBE1' />
              ) : (
                <ThemedText type='title' style={{ color: "#fff" }}>
                  {showBalance ? priceFormatter(balance) : "••••••"}
                </ThemedText>
              )}
            </View>
          </View>
          <View gap={8} w='100%' aligned spaced row>
            <BraneButton
              text='Add Funds'
              onPress={() => {
                router.push("/add-funds");
              }}
              backgroundColor='#D2F1E4'
              textColor='#013D25'
              width={160}
              radius={32}
            />
            <BraneButton
              text='My Wallet'
              onPress={() => router.push("/wallet")}
              backgroundColor='#D2F1E41A'
              textColor='#D3EBE1'
              width={160}
              radius={32}
            />
          </View>
        </View>
      </CardStyle>
    </View>
  );
};

export const Quick = () => {
  const router = useRouter();

  return (
    <View w='100%' mt={24} gap={20}>
      <ThemedText type='defaultSemiBold'>Quick Actions</ThemedText>
      <View row gap={8}>
        <ServicesCard
          variant='full'
          title='Airtime & Data'
          icon={<Mobile size={16} color='#013D25' />}
          bg='#D3EBE1'
          height={88}
          onPress={() =>
            router.push({
              pathname: "/bills-utilities/select",
              params: { service: "airtime" },
            })
          }
          iconBg='#E1F4EC'
        />
        <ServicesCard
          variant='full'
          title='Send Money'
          icon={<Money size={16} color='#013D25' />}
          bg='#FFF4EB'
          height={88}
          onPress={() => router.push("/send-money")}
          iconBg='#FFDFC2'
        />
        <ServicesCard
          variant='full'
          title='Bills & Services'
          icon={<WifiSquare size={16} color='#013D25' />}
          bg='#F5F1E0'
          height={88}
          onPress={() => router.push("/utilities")}
          iconBg='#E7DCB1'
        />
        <ServicesCard
          variant='full'
          title='Wealth Investment'
          icon={<ChartSquare size={16} color='#013D25' />}
          bg='#E1FFF3'
          height={88}
          onPress={() => router.push("/stock")}
          iconBg='#AFFEDE'
        />
      </View>
    </View>
  );
};

export const Transactions = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response: any = await BaseRequest.get(
        "/transactions-service/transactions/user?perPage=5",
      );
      const transactionList = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response)
            ? response
            : [];
      setTransactions(transactionList);
    } catch (error) {
      catchError(error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View w='100%' mt={24} gap={20} minH={260}>
      <View row spaced>
        <ThemedText type='defaultSemiBold'>Recent Transaction</ThemedText>
        <TouchableOpacity onPress={() => router.push("/(tabs)/transactions")}>
          <ThemedText
            type='link'
            style={{
              fontWeight: "800",
              fontSize: 14,
              textDecorationStyle: "dashed",
              textDecorationColor: "#013D25",
            }}
          >
            See All
          </ThemedText>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            minHeight: 150,
          }}
        >
          <ActivityIndicator size='small' color='#013D25' />
        </View>
      ) : transactions.length > 0 ? (
        <View gap={12}>
          {transactions.map((transaction: any) => (
            <TransactionCardDisplay
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </View>
      ) : (
        <View justified mt={24}>
          <EmptyState>
            <ThemedText
              numberOfLines={2}
              style={{ textAlign: "center", paddingHorizontal: 20 }}
            >
              After initiating transactions, you can access the history of your
              transactions here.
            </ThemedText>
          </EmptyState>
        </View>
      )}
    </View>
  );
};

const TransactionCardDisplay = ({ transaction }: any) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme === "dark" ? "dark" : "light"];
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

  const amount = Math.abs(transaction.amount || 0);
  const isDebit = transaction.type === "debit" || transaction.amount < 0;

  return (
    <TouchableOpacity
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
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", flex: 1, gap: 12 }}
      >
        <Text style={{ fontSize: 24 }}>
          {getTransactionIcon(transaction.servicetype || transaction.type)}
        </Text>
        <View style={{ flex: 1 }}>
          <ThemedText
            type='defaultSemiBold'
            numberOfLines={1}
            style={{ fontSize: 13 }}
          >
            {transaction.description ||
              transaction.servicetype ||
              "Transaction"}
          </ThemedText>
          <ThemedText
            style={{ fontSize: 11, color: "#85808A", marginTop: 2 }}
            numberOfLines={1}
          >
            {transaction.createdAt
              ? new Date(transaction.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </ThemedText>
        </View>
      </View>
      <ThemedText
        type='defaultSemiBold'
        style={{
          color: isDebit ? "#CB010B" : "#013D25",
          fontSize: 13,
        }}
      >
        {isDebit ? "-" : "+"} {priceFormatter(amount)}
      </ThemedText>
    </TouchableOpacity>
  );
};

export const Learning = () => {
  return (
    <View w='100%' gap={16}>
      <View row spaced>
        <ThemedText type='defaultSemiBold'>Learning Forum</ThemedText>
        <ThemedText
          type='link'
          style={{
            fontWeight: "800",
            fontSize: 14,
            textDecorationStyle: "dashed",
            textDecorationColor: "#013D25",
          }}
        >
          See All
        </ThemedText>
      </View>
      <View justified gap={16} mb={60}>
        <LearnCard />
        <LearnCard />
        <LearnCard />
      </View>
    </View>
  );
};
