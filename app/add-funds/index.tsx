import Back from "@/components/Back";
import { BraneRadioButton } from "@/components/brane-radio-button";
import { BankIcon, CardIcon, USSD } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { Text, View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Bank, Coin, Coin1, Copy, ExportCurve } from "iconsax-react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FundScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState("bank");

  return (
    <SafeAreaView style={styles.container}>
      <View w={"100%"} spaced row aligned>
        <Back />
        <ThemedText type="subtitle">Add Funds</ThemedText>
        <View />
      </View>

      <ThemedText style={{ fontSize: 12 }}>
        Fund your wallet by selecting your preferred method from the available
        options.
      </ThemedText>

      <View gap={20}>
        {/* Bank Transfer */}
        <BraneRadioButton
          selected={selected === "bank"}
          onPress={() => setSelected("bank")}
          size={16}
          bg="#F8F5E8"
          color="#013D25"
        >
          <View w="100%" gap={16}>
            <View row gap={8} aligned>
              <BankIcon />
              <ThemedText style={{ color: "#0B0014" }}>
                Bank Transfer
              </ThemedText>
            </View>
            <View
              bg="#013D25"
              h={100}
              w="100%"
              radius={12}
              spaced
              aligned
              p={16}
              row
            >
              <View gap={4}>
                <Text color="#fff">Wema bank</Text>
                <Text color="#fff" fs={20} fw="bold">
                  0124356780
                </Text>
                <Text color="#fff">Brane - Oluayo Bankole</Text>
              </View>
              <View row gap={16}>
                <View center w={32} h={32} bg="#2B5D49" radius={8}>
                  <ExportCurve size={16} color="#fff" />
                </View>
                <View center w={32} h={32} bg="#2B5D49" radius={8}>
                  <Copy size={16} color="#fff" />
                </View>
              </View>
            </View>
          </View>
        </BraneRadioButton>

        {/* Card */}
        <BraneRadioButton
          selected={selected === "card"}
          onPress={() => {
            setSelected("card");
            router.push("/add-funds/card");
          }}
          size={16}
          color="#013D25"
        >
          <View row gap={8} aligned>
            <CardIcon />
            <ThemedText style={{ color: "#0B0014" }}>Card</ThemedText>
          </View>
        </BraneRadioButton>

        {/* Bank Account */}
        <BraneRadioButton
          selected={selected === "account"}
          onPress={() => {
            setSelected("account");
            router.push("/add-funds/bank");
          }}
          size={16}
          color="#013D25"
        >
          <View row gap={8} aligned>
            <Bank size="20" color="#013D25" />
            <ThemedText style={{ color: "#0B0014" }}>Bank Account</ThemedText>
          </View>
        </BraneRadioButton>

        {/* USSD */}
        <BraneRadioButton
          selected={selected === "ussd"}
          onPress={() => setSelected("ussd")}
          size={16}
          color="#013D25"
        >
          <View row gap={8} aligned>
            <USSD />
            <ThemedText style={{ color: "#0B0014" }}>USSD</ThemedText>
          </View>
        </BraneRadioButton>

        {/* Stable Coin */}
        <BraneRadioButton
          selected={selected === "coin"}
          onPress={() => setSelected("coin")}
          size={16}
          color="#013D25"
        >
          <View row aligned gap={80}>
            <View row gap={8} aligned>
              <Coin1 size="20" color="#013D25" />
              <ThemedText style={{ color: "#0B0014" }}>Stable Coin</ThemedText>
            </View>
            <ThemedText>Coming soon</ThemedText>
          </View>
        </BraneRadioButton>

        {/* USDC */}
        <BraneRadioButton
          selected={selected === "usdc"}
          onPress={() => setSelected("usdc")}
          size={16}
          color="#013D25"
        >
          <View row aligned gap={80}>
            <View row gap={8} aligned>
              <Coin size="20" color="#013D25" />
              <ThemedText style={{ color: "#0B0014" }}>USDC</ThemedText>
            </View>
            <ThemedText>Coming soon</ThemedText>
          </View>
        </BraneRadioButton>

        {/* USDT */}
        <BraneRadioButton
          selected={selected === "usdt"}
          onPress={() => setSelected("usdt")}
          size={16}
          color="#013D25"
        >
          <View row aligned gap={80}>
            <View row gap={8} aligned>
              <Coin size="20" color="#013D25" />
              <ThemedText style={{ color: "#0B0014" }}>USDT</ThemedText>
            </View>
            <ThemedText>Coming soon</ThemedText>
          </View>
        </BraneRadioButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    position: "relative",
    paddingHorizontal: 16,
  },
});
