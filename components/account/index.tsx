import { accnt, VERSION } from "@/utils";
import { useBooleans } from "@/utils/hooks";
import { useRouter } from "expo-router";
import { LogoutCurve } from "iconsax-react-native";
import { ReactNode } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import LogOutModal from "../log-out";
import { AccountItem} from "./transaction";

export const Account = ({ header }: { header?: ReactNode }) => {
  const [isOpen, openModal, closeModal] = useBooleans();
  const router = useRouter();
  const acc = accnt();
  const resolveRoute = (label: string, routeKey?: string) => {
    const byLabel: Record<string, string> = {
      Preferences: "/(account)/preferences",
      "Help desk": "/(account)/help-desk",
      "Terms & conditions": "/(account)/terms-condition",
      "Privacy policy": "/(account)/privacy-policy",
    };

    if (byLabel[label]) return byLabel[label];

    const byKey: Record<string, string> = {
      "account-details": "/account-details",
      beneficiary: "/(account)/beneficiary",
      "update-kin-details": "/(account)/update-kin-details",
      "account-verification": "/(account)/account-verification",
      "bracs-investment-trigger": "/(account)/bracs-investment-trigger",
      "change-password": "/(account)/change-password",
      "reset-transaction-pin": "/(account)/reset-transaction-pin",
      "change-username": "/(account)/change-username",
      preferences: "/(account)/preference",
      "help-desk": "/(account)/help-desk",
      "terms-conditions": "/(account)/terms-conditions",
      "privacy-policy": "/(account)/privacy-policy",
      chat: "/support",
    };

    return routeKey ? byKey[routeKey] : undefined;
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={acc}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={header ? <>{header}</> : null}
        renderItem={({ item: itm }) => (
          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>{itm.title}</Text>
            {itm.content.map((item) => (
              <Pressable
                key={item.text}
                onPress={() => {
                  const target = resolveRoute(item.text, item.routes);
                  if (!target) return;
                  router.push(target as any);
                }}
              >
                <AccountItem icon={item.icon} text={item.text} />
              </Pressable>
            ))}
          </View>
        )}
        ListEmptyComponent={
          // 👇 helps confirm if data is empty
          <Text style={{ padding: 20, color: "red" }}>No items found</Text>
        }
        ListFooterComponent={
          <>
            <Pressable style={styles.logoutRow} onPress={openModal}>
              <View style={styles.logoutLeft}>
                <LogoutCurve color="#CB010B" size={20} />
                <Text style={styles.logoutText}>Log out</Text>
              </View>
              {/* <ArrowRight2 color="#6B7280" size={20} /> */}
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.version}>Version {VERSION}</Text>
            </View>
          </>
        }
      />

      <LogOutModal closeModal={closeModal} isOpen={isOpen} />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  sectionWrapper: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 24,
    marginBottom: 4,
    color: "#111",
  },
  logoutRow: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#F7F7F8",
    marginTop: 8,
  },
  logoutLeft: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#CB010B",
    fontSize: 14,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  version: {
    fontSize: 13,
    color: "#6B7280",
  },
});
