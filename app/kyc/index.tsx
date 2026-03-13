import Back from "@/components/Back";
import KycItem from "@/components/kyc/kyc-item";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import { useRouter } from "expo-router";
import { Card, Profile2User, User, UserTag } from "iconsax-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KycScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const { user } = useAppState();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.push("/(tabs)/(account)")} />
        <ThemedText type="subtitle">KYC Requirements</ThemedText>
        <Pressable style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <KycItem
          title="Person Information"
          icon={<Profile2User size={20} color="#013D25" />}
          isVerified={!!user?.hasName}
          onPress={() => router.push("/kyc/verification")}
        />

        <KycItem
          title="Banking Information"
          icon={<Card size={20} color="#013D25" />}
          isVerified={!!user?.hasBanking}
          onPress={() => router.push("/kyc/information")}
        />

        <KycItem
          title="Verify your identity"
          icon={<User size={20} color="#013D25" />}
          isVerified={!!user?.identityKyc}
          onPress={() => router.push("/kyc/identity-verification")}
        />

        <KycItem
          title="Next of kin details"
          icon={<UserTag size={20} color="#013D25" />}
          isVerified={!!user?.hasNextOfKin}
          onPress={() => router.push("/kyc/kin-details")}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
});
