import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import {
    ArrowRight2,
    Devices,
    Electricity,
    I3Dcube,
} from "iconsax-react-native";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type BillCategory = {
  label: string;
  route: string;
  Icon: React.ComponentType<any>;
  iconBg: (C: any) => string;
  iconColor: string;
};

const BILL_CATEGORIES = (C: any): BillCategory[] => [
  {
    label: "Electricity",
    route: "/pay-bills/electricity",
    Icon: Electricity,
    iconBg: () => C.primary + "15",
    iconColor: C.primary,
  },
  {
    label: "Cable TV",
    route: "/pay-bills/cable",
    Icon: Devices,
    iconBg: () => C.primary + "15",
    iconColor: C.primary,
  },
  {
    label: "Betting",
    route: "/pay-bills/betting",
    Icon: I3Dcube,
    iconBg: () => C.primary + "15",
    iconColor: C.primary,
  },
];

export default function PayBillsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Header */}
      <Header title='Pay Bills' />

      <FlatList
        data={BILL_CATEGORIES(C)}
        keyExtractor={(item) => item.label}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const { Icon, iconBg, iconColor, label, route } = item;
          return (
            <TouchableOpacity
              style={[
                styles.row,
                { backgroundColor: C.inputBg, borderColor: C.border },
              ]}
              onPress={() => router.push(route as any)}
              activeOpacity={0.7}
            >
              <View
                style={StyleSheet.flatten([
                  styles.iconCircle,
                  {
                    backgroundColor:
                      typeof iconBg === "function" ? iconBg() : iconBg,
                  },
                ])}
                center
              >
                <Icon size={22} color={iconColor} variant='Bold' />
              </View>

              <ThemedText type='defaultSemiBold' style={styles.label}>
                {label}
              </ThemedText>

              <ArrowRight2 size={18} color={C.muted} />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: { fontSize: 16 },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  label: { flex: 1, fontSize: 15 },
});
