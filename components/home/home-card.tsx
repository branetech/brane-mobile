import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { usePreference } from "@/services/data";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
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
import { ActivityIndicator } from "react-native";
import { BraneButton } from "../brane-button";
import { EmptyState } from "../empty-state";
import { ThemedText } from "../themed-text";
import { TransactionCard } from "../transaction-card";
import { CardStyle, LearnCard, ServicesCard } from "./cards";

export const HomeCard = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];
  const { onToggleBalance, showBalance } = usePreference(false);

  const { data, isLoading } = useRequest(TRANSACTION_SERVICE.BALANCE, {
    initialValue: 0,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    noCache: true,
  });

  return (
    <View w='100%' mt={8}>
      <CardStyle>
        <View spaced flex={1} h='100%'>
          <View gap={8} w='100%' aligned>
            <View justified w='100%' row aligned gap={6}>
              <ThemedText style={{ color: "#fff" }}>Total Balance</ThemedText>
              <TouchableOpacity onPress={onToggleBalance}>
                {showBalance ? (
                  <Eye color={"#fff"} size={16} />
                ) : (
                  <EyeSlash color={"#fff"} size={16} />
                )}
              </TouchableOpacity>
            </View>
           
          </View>
           <View center mt={8}>
              {isLoading ? (
                <ActivityIndicator size='small' color={"#fff"} />
              ) : (
                <ThemedText type='title' style={{ color: "#fff", textAlign: "center" }}>
                  {showBalance ? priceFormatter(data) : "••••••"}
                </ThemedText>
              )}
            </View>
          <View gap={8} w='100%' aligned spaced row>

            <View flex>
              <BraneButton
                text='Add Funds'
                onPress={() => {
                  router.push("/add-funds");
                }}
                backgroundColor={'#D3EBE1'}
                textColor={'#013D25'}
                radius={32}
              />

            </View>
            <View flex>
              <BraneButton
                text='My Wallet'
                onPress={() => router.push("/wallet")}
                backgroundColor={"#D2F1E41A"}
                textColor={"#fff"}
                radius={32}
              />
            </View>

          </View>
        </View>
      </CardStyle>
    </View>
  );
};

export const Quick = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];

  // Define service colors for light and dark modes
  const getServiceColors = (
    service: "airtime" | "send" | "bills" | "wealth",
  ) => {
    const colors = {
      light: {
        airtime: { bg: "#D3EBE1", iconBg: "#E1F4EC", icon: "#013D25" },
        send: { bg: "#FFF4EB", iconBg: "#FFDFC2", icon: "#013D25" },
        bills: { bg: "#F5F1E0", iconBg: "#E7DCB1", icon: "#013D25" },
        wealth: { bg: "#E1FFF3", iconBg: "#AFFEDE", icon: "#013D25" },
      },
      dark: {
        airtime: {
          bg: `${C.primary}15`,
          iconBg: `${C.primary}25`,
          icon: C.primary,
        },
        send: { bg: "#FF6B351A", iconBg: "#FF6B3530", icon: "#FF6B35" },
        bills: { bg: "#FDB92230", iconBg: "#FDB92245", icon: "#FDB922" },
        wealth: {
          bg: `${C.primary}15`,
          iconBg: `${C.primary}25`,
          icon: C.primary,
        },
      },
    };
    return isDark ? colors.dark[service] : colors.light[service];
  };

  const airtimeColors = getServiceColors("airtime");
  const sendColors = getServiceColors("send");
  const billsColors = getServiceColors("bills");
  const wealthColors = getServiceColors("wealth");

  return (
    <View w='100%' mt={24} gap={20}>
      <ThemedText type='defaultSemiBold'>Quick Actions</ThemedText>
      <View row gap={8}>
        <ServicesCard
          variant='full'
          title='Airtime & Data'
          icon={<Mobile size={16} color={airtimeColors.icon} />}
          bg={airtimeColors.bg}
          height={88}
          onPress={() =>
            router.push({
              pathname: "/bills-utilities/select",
              params: { service: "airtime" },
            })
          }
          iconBg={airtimeColors.iconBg}
        />
        <ServicesCard
          variant='full'
          title='Send Money'
          icon={<Money size={16} color={sendColors.icon} />}
          bg={sendColors.bg}
          height={88}
          onPress={() => router.push("/send-money")}
          iconBg={sendColors.iconBg}
        />
        <ServicesCard
          variant='full'
          title='Bills & Services'
          icon={<WifiSquare size={16} color={billsColors.icon} />}
          bg={billsColors.bg}
          height={88}
          onPress={() => router.push("/home-bills-services")}
          iconBg={billsColors.iconBg}
        />
        <ServicesCard
          variant='full'
          title='Wealth Investment'
          icon={<ChartSquare size={16} color={wealthColors.icon} />}
          bg={wealthColors.bg}
          height={88}
          onPress={() => router.push("/(tabs)/(portfolio)")}
          iconBg={wealthColors.iconBg}
        />
      </View>
    </View>
  );
};

export const Transactions = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];

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
              textDecorationColor: C.primary,
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
          <ActivityIndicator size='small' color={C.primary} />
        </View>
      ) : transactions.length > 0 ? (
        <View gap={12}>
          {transactions.map((transaction: any) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
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

export const Learning = () => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];
  const router = useRouter();
  const forumRoute = "/(tabs)/(portfolio)/forum" as any;

  const learningTopics = [
    {
      id: 1,
      title: "Learn about Brane",
      description:
        "For you to have a seamless experience we require some details.",
      image: require("@/assets/images/learn.png"),
      action: () => router.push("/(tabs)/(portfolio)/forum/1" as any),
    },
    {
      id: 2,
      title: "Investment Tips",
      description: "Strategies to grow your investment portfolio effectively.",
      image: require("@/assets/images/learn.png"),
      action: () => router.push("/(tabs)/(portfolio)/forum/2" as any),
    },
    {
      id: 3,
      title: "Money Management",
      description: "Smart ways to manage and save your money wisely.",
      image: require("@/assets/images/learn.png"),
      action: () => router.push("/(tabs)/(portfolio)/forum/1" as any),
    },
  ];

  return (
    <View w='100%' gap={16}>
      <View row spaced>
        <ThemedText type='defaultSemiBold'>Learning Forum</ThemedText>
        <TouchableOpacity onPress={() => router.push(forumRoute)}>
          <ThemedText
            type='link'
            style={{
              fontWeight: "800",
              fontSize: 14,
              textDecorationStyle: "dashed",
              textDecorationColor: C.primary,
            }}
          >
            See All
          </ThemedText>
        </TouchableOpacity>
      </View>
      <View justified gap={16} mb={60}>
        {learningTopics.map((topic) => (
          <LearnCard
            key={topic.id}
            title={topic.title}
            description={topic.description}
            // imageSource={topic.image}
            onPress={topic.action}
          />
        ))}
      </View>
    </View>
  );
};
