import Back from "@/components/Back";
import KycItem from "@/components/kyc/kyc-item";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import { useRouter } from "expo-router";
import { DocumentText1, Location, ProfileCircle } from "iconsax-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IdentityVerificationScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const { user } = useAppState();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.push("/kyc")} />
      </View>

      <View style={styles.content}>
        <ThemedText type="subtitle">Verify your Identity</ThemedText>
        <ThemedText style={[styles.help, { color: C.muted }]}>
          Identity verification is a crucial step in ensuring the security and
          legitimacy of your account.
        </ThemedText>

        <View style={{ marginTop: 12 }}>
          <KycItem
            title="ID Verification"
            icon={<DocumentText1 size={20} color="#013D25" />}
            isVerified={!!user?.hasIdentity && !!user?.hasBvn}
            onPress={() =>
              router.push("/kyc/identity-verification/id-verification")
            }
          />
          <KycItem
            title="Passport Photograph"
            icon={<ProfileCircle size={20} color="#013D25" />}
            isVerified={!!user?.hasPhoto}
            onPress={() =>
              router.push("/kyc/identity-verification/photograph-verification")
            }
          />
          <KycItem
            title="Address Verification"
            icon={<Location size={20} color="#013D25" />}
            isVerified={!!user?.hasLocation}
            onPress={() =>
              router.push("/kyc/identity-verification/address-verification")
            }
          />
        </View>
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
    marginTop: 8,
  },
  help: {
    marginTop: 4,
    fontSize: 12,
  },
});
