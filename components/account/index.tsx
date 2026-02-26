import { useBooleans } from "@/utils/hooks";
import { useRouter } from "expo-router";
import { LogoutCurve, ArrowRight2 } from "iconsax-react-native";
import { VERSION } from "lodash";
import { View, FlatList, Pressable, Text, StyleSheet } from "react-native";
import LogOutModal from "../log-out";
import { AccountItem } from "./transaction";
import { accnt } from "@/utils";

export const Account = () => {
  const router = useRouter();
  const [isOpen, openModal, closeModal] = useBooleans();
  const acc = accnt();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={acc}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item: itm }) => (
          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>{itm.title}</Text>
            {itm.content.map((item) => (
              <Pressable
                key={item.text}
                onPress={() => {
                  if (item.routes === "chat") {
                    console.log("open chat");
                  } else if (item.routes) {
                    // router.push(`/(tabs)/(account)/${item.routes}`);
                  }
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