import { Account } from "@/components/account";
import { Avatar } from "@/components/avatar";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { ArrowRight2 } from "iconsax-react-native";
import { View as RNView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const { user } = useAppState();

  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const displayName = fullName || user?.name || user?.username || "User";
  const username = user?.username
    ? `@${user.username}`
    : user?.email
      ? `@${String(user.email).split("@")[0]}`
      : "@user";

  const header = (
    <RNView style={styles.headerWrapper}>
      <ThemedText type="subtitle" style={styles.pageTitle}>
        Account
      </ThemedText>

      <View w="100%" style={styles.profileCard} bg="#FFFDFA">
        <View row spaced aligned w="100%">
          <View gap={2}>
            <ThemedText type="subtitle" style={styles.userName}>
              {displayName}
            </ThemedText>
            <ThemedText style={{ fontSize: 13, color: C.muted }}>
              {username}
            </ThemedText>
          </View>
          <Avatar name={displayName} src={user?.image} size="lg" shape="circle" />
        </View>

        <View w="100%" style={styles.kycCard} bg="#FFFFFF">
          <View row spaced aligned w="100%">
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 13 }}>
                Complete Your KYC
              </ThemedText>
              <ThemedText
                style={{ fontSize: 12, color: C.muted, marginTop: 2 }}
              >
                Complete verification for more seamless experience
              </ThemedText>
            </View>
            <ThemedText
              type="defaultSemiBold"
              style={{ fontSize: 13, color: "#013D25", marginLeft: 8 }}
            >
              50%
            </ThemedText>
          </View>

          <TouchableOpacity onPress={() => router.push("/kyc")} style={styles.kycLink}>
            <ThemedText
              style={{ fontSize: 13, color: "#A28C34", fontWeight: "500" }}
            >
              Complete Verification
            </ThemedText>
            <ArrowRight2 size={16} color="#013D25" />
          </TouchableOpacity>
        </View>
      </View>
    </RNView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <Account header={header} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    paddingTop: 8,
    gap: 16,
  },
  pageTitle: {
    marginTop: 8,
  },
  profileCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFFAF0",
    padding: 16,
    gap: 12,
    marginTop: 16,
  },
  userName: {
    fontSize: 18,
  },
  kycCard: {
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  kycLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    alignSelf: "flex-start",
  },
});
