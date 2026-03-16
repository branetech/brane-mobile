import Back from "@/components/back";
import { BraneRadioButton } from "@/components/brane-radio-button";
import { BankIcon, CardIcon, USSD } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Text, View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Bank, Coin, Coin1, Copy, ExportCurve } from "iconsax-react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FundScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [selected, setSelected] = useState("bank");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <View w={"100%"} spaced row aligned>
        <Back />
        <ThemedText type='subtitle'>Add Funds</ThemedText>
        <View />
      </View>

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
          bg={C.inputBg}
          color={C.primary}
        >
          <View w='100%' gap={16}>
            <View row gap={8} aligned>
              <BankIcon />
              <ThemedText style={{ color: C.text }}>
                Bank Transfer
              </ThemedText>
            </View>
            <View
              bg={C.primary}
              h={100}
              w='100%'
              radius={12}
              spaced
              aligned
              p={16}
              row
            >
              <View gap={4}>
                <Text color={C.background}>Wema bank</Text>
                <Text color={C.background} fs={20} fw='bold'>
                  0124356780
                </Text>
                <Text color={C.background}>Brane - Oluayo Bankole</Text>
              </View>
              <View row gap={16}>
                <View
                  center
                  w={32}
                  h={32}
                  bg={C.primary + "CC"}
                  radius={8}
                >
                  <ExportCurve size={16} color={C.background} />
                </View>
                <View
                  center
                  w={32}
                  h={32}
                  bg={C.primary + "CC"}
                  radius={8}
                >
                  <Copy size={16} color={C.background} />
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
          color={C.primary}
        >
          <View row gap={8} aligned>
            <CardIcon />
            <ThemedText style={{ color: C.text }}>Card</ThemedText>
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
          color={C.primary}
        >
          <View row gap={8} aligned>
            <Bank size='20' color={C.primary} />
            <ThemedText style={{ color: C.text }}>Bank Account</ThemedText>
          </View>
        </BraneRadioButton>

        {/* USSD */}
        <BraneRadioButton
          selected={selected === "ussd"}
          onPress={() => setSelected("ussd")}
          size={16}
          color={C.primary}
        >
          <View row gap={8} aligned>
            <USSD />
            <ThemedText style={{ color: C.text }}>USSD</ThemedText>
          </View>
        </BraneRadioButton>

        {/* Stable Coin */}
        <BraneRadioButton
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
        </BraneRadioButton>

        {/* USDC */}
        <BraneRadioButton
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
        </BraneRadioButton>

        {/* USDT */}
        <BraneRadioButton
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
