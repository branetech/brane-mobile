import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePostBvn } from "@/services/data";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BvnVerificationScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [bvn, setBvn] = useState("");
  const [loading, setLoading] = useState(false);

  const { fetchData } = usePostBvn(setLoading, () => {}, "bvn");

  const onSubmit = async () => {
    const ok = await fetchData({ bvn }, bvn);
    if (ok) router.replace("/kyc");
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
      </View>

      <View style={styles.content}>
        <ThemedText type="subtitle">Add Bvn Information</ThemedText>
        <View style={{ marginTop: 16 }}>
          <FormInput
            labelText="BVN"
            placeholder="Enter bvn"
            keyboardType="number-pad"
            value={bvn}
            onChangeText={(value) =>
              setBvn(value.replace(/[^\d]/g, "").slice(0, 11))
            }
          />
        </View>
      </View>

      <View style={styles.footer}>
        <BraneButton
          text="Proceed to Verify"
          onPress={onSubmit}
          loading={loading}
          disabled={!bvn || bvn.length < 11}
          height={50}
          radius={10}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  footer: {
    marginTop: "auto",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
