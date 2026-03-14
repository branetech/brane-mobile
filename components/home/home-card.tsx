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
import React from "react";
import { BraneButton } from "../brane-button";
import { EmptyState } from "../empty-state";
import { ThemedText } from "../themed-text";
import { CardStyle, LearnCard, ServicesCard } from "./cards";

export const HomeCard = () => {
  const router = useRouter();
  const { onToggleBalance, showBalance } = usePreference();

  return (
    <View w="100%" mt={8}>
      <CardStyle>
        <View spaced flex={1} h="100%">
          <View gap={8} w="100%" aligned>
            <View justified w="100%" row aligned gap={6}>
              <ThemedText style={{ color: "#D3EBE1" }}>
                Total Balance
              </ThemedText>
              <TouchableOpacity onPress={onToggleBalance}>
                {showBalance ? (
                  <Eye color="#D3EBE1" size={16} />
                ) : (
                  <EyeSlash color="#D3EBE1" size={16} />
                )}
              </TouchableOpacity>
            </View>
            <ThemedText type="title" style={{ color: "#fff" }}>
              {priceFormatter(10000)}
            </ThemedText>
          </View>
          <View gap={8} w="100%" aligned spaced row>
            <BraneButton
              text="Add Funds"
              onPress={() => {
                router.push("/add-funds");
              }}
              backgroundColor="#D2F1E4"
              textColor="#013D25"
              width={160}
              radius={32}
            />
            <BraneButton
              text="My Wallet"
              onPress={() => {}}
              backgroundColor="#D2F1E41A"
              textColor="#D3EBE1"
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
    <View w="100%" mt={24} gap={20}>
      <ThemedText type="defaultSemiBold">Quick Actions</ThemedText>
      <View row gap={8}>
        <ServicesCard
          variant="full"
          title="Airtime & Data"
          icon={<Mobile size={16} color="#013D25" />}
          bg="#D3EBE1"
          height={88}
          onPress={() =>
            router.push({
              pathname: "/bills-utilities/select",
              params: { service: "airtime" },
            })
          }
          iconBg="#E1F4EC"
        />
        <ServicesCard
          variant="full"
          title="Send Money"
          icon={<Money size={16} color="#013D25" />}
          bg="#FFF4EB"
          height={88}
          onPress={() => router.push("/send-money")}
          iconBg="#FFDFC2"
        />
        <ServicesCard
          variant="full"
          title="Bills & Services"
          icon={<WifiSquare size={16} color="#013D25" />}
          bg="#F5F1E0"
          height={88}
          onPress={() => router.push("/utilities")}
          iconBg="#E7DCB1"
        />
        <ServicesCard
          variant="full"
          title="Wealth Investment"
          icon={<ChartSquare size={16} color="#013D25" />}
          bg="#E1FFF3"
          height={88}
          onPress={() => console.log("Airtime pressed")}
          iconBg="#AFFEDE"
        />
      </View>
    </View>
  );
};

export const Transactions = () => {
  return (
    <View w="100%" mt={24} gap={20} minH={260}>
      <View row spaced>
        <ThemedText type="defaultSemiBold">Recent Transaction</ThemedText>
        <ThemedText
          type="link"
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
    </View>
  );
};

export const Learning = () => {
  return (
    <View w="100%" gap={16}>
      <View row spaced>
        <ThemedText type="defaultSemiBold">Learning Forum</ThemedText>
        <ThemedText
          type="link"
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
