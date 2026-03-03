import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { View, Text } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function CardScreen() {
    const router = useRouter()
    const [selected, setSelected] = useState("bank");

  return (
    <SafeAreaView style={styles.container}>
        <View w={'100%'} spaced row aligned>
            <Back/>
            <ThemedText type='subtitle'>Fund Wallet With Card</ThemedText>
            <View></View>
        </View>
        <View w='100%'>

        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        position: 'relative',
        paddingHorizontal: 16,
      },
});
