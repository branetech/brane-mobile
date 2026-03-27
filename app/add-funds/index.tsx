import { BraneRadioButton } from "@/components/brane-radio-button";
import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FundWithBankScren } from "./bank";

export default function FundScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [selected, setSelected] = useState("bank");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <Header title='Add Funds' />

      <ThemedText style={{ fontSize: 12, color: C.muted }}>
        Fund your wallet by selecting your preferred method from the available
        options.
      </ThemedText>

      <View gap={20}>
        {/* Bank Transfer */}
        <BraneRadioButton
          selected={selected === "bank"}
          onPress={() => setSelected("bank")}
          size={16}
          bg={selected === "bank" ? "#FAF6E6" : C.background}
          color={C.primary}
        >
          <FundWithBankScren />
        </BraneRadioButton>

        {/* Card */}
        {/* <BraneRadioButton
          selected={selected === "card"}
          onPress={() => {
            setSelected("card");
            router.push("/add-funds/card");
          }}
          size={16}
          color={C.primary}
        >
          <View row gap={8} aligned>
            <CardIcon />
            <ThemedText style={{ color: C.text }}>Card</ThemedText>
          </View>
        </BraneRadioButton> */}

        {/* Bank Account */}
        {/* <BraneRadioButton
          selected={selected === "account"}
          onPress={() => {
            setSelected("account");
            router.push("/add-funds/bank");
          }}
          size={16}
          color={C.primary}
        >
          <View row gap={8} aligned>
            <Bank size='20' color={C.primary} />
            <ThemedText style={{ color: C.text }}>Bank Account</ThemedText>
          </View>
        </BraneRadioButton> */}

        {/* USSD */}
        {/* <BraneRadioButton
          selected={selected === "ussd"}
          onPress={() => setSelected("ussd")}
          size={16}
          color={C.primary}
        >
          <View row gap={8} aligned>
            <USSD />
            <ThemedText style={{ color: C.text }}>USSD</ThemedText>
          </View>
        </BraneRadioButton> */}

        {/* Stable Coin */}
        {/* <BraneRadioButton
          selected={selected === "coin"}
          onPress={() => setSelected("coin")}
          size={16}
          color={C.primary}
        >
          <View row aligned gap={80}>
            <View row gap={8} aligned>
              <Coin1 size='20' color={C.primary} />
              <ThemedText style={{ color: C.text }}>Stable Coin</ThemedText>
            </View>
            <ThemedText style={{ color: C.muted }}>Coming soon</ThemedText>
          </View>
        </BraneRadioButton> */}

        {/* USDC */}
        {/* <BraneRadioButton
          selected={selected === "usdc"}
          onPress={() => setSelected("usdc")}
          size={16}
          color={C.primary}
        >
          <View row aligned gap={80}>
            <View row gap={8} aligned>
              <Coin size='20' color={C.primary} />
              <ThemedText style={{ color: C.text }}>USDC</ThemedText>
            </View>
            <ThemedText style={{ color: C.muted }}>Coming soon</ThemedText>
          </View>
        </BraneRadioButton> */}

        {/* USDT */}
        {/* <BraneRadioButton
          selected={selected === "usdt"}
          onPress={() => setSelected("usdt")}
          size={16}
          color={C.primary}
        >
          <View row aligned gap={80}>
            <View row gap={8} aligned>
              <Coin size='20' color={C.primary} />
              <ThemedText style={{ color: C.text }}>USDT</ThemedText>
            </View>
            <ThemedText style={{ color: C.muted }}>Coming soon</ThemedText>
          </View>
        </BraneRadioButton> */}
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
