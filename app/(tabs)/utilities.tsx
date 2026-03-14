import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import {
    CardReceive,
    CardSend,
    Devices,
    Electricity,
    I3Dcube,
    KeyboardOpen,
    TruckFast,
} from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UtilityOption = {
  title: string;
  subtitle: string;
  routeService:
    | "airtime"
    | "data"
    | "betting"
    | "cable"
    | "electricity"
    | "transportation";
  icon: React.ReactNode;
  bg: string;
  iconBg: string;
};

const utilities: UtilityOption[] = [
  {
    title: "Airtime",
    subtitle: "Top up your line instantly",
    routeService: "airtime",
    icon: <CardSend size={18} color="#013D25" variant="Bold" />,
    bg: "#E9F8F1",
    iconBg: "#D2F1E4",
  },
  {
    title: "Data",
    subtitle: "Buy internet bundles",
    routeService: "data",
    icon: <Devices size={18} color="#013D25" variant="Bold" />,
    bg: "#F5F1E0",
    iconBg: "#E7DCB1",
  },
  {
    title: "Betting",
    subtitle: "Fund betting wallets",
    routeService: "betting",
    icon: <I3Dcube size={18} color="#013D25" variant="Bold" />,
    bg: "#EAF4FF",
    iconBg: "#D8E9FF",
  },
  {
    title: "Cable TV",
    subtitle: "Pay for DSTV, GOTV and more",
    routeService: "cable",
    icon: <CardReceive size={18} color="#013D25" variant="Bold" />,
    bg: "#FFF4EB",
    iconBg: "#FFDFC2",
  },
  {
    title: "Electricity",
    subtitle: "Pay meter bills instantly",
    routeService: "electricity",
    icon: <Electricity size={18} color="#013D25" variant="Bold" />,
    bg: "#EEF7FF",
    iconBg: "#DDEEFF",
  },
  {
    title: "Transportation",
    subtitle: "Pay for transit services",
    routeService: "transportation",
    icon: <TruckFast size={18} color="#013D25" variant="Bold" />,
    bg: "#F1F8EE",
    iconBg: "#DFF0D7",
  },
];

export default function UtiliScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <View style={styles.headerRow}>
        <ThemedText style={[styles.title, { color: C.text }]}>
          Bills & Utilities
        </ThemedText>
        <View style={styles.badge}>
          <KeyboardOpen size={14} color="#013D25" />
          <ThemedText style={styles.badgeText}>Pay fast</ThemedText>
        </View>
      </View>

      <ThemedText style={[styles.subtitle, { color: C.muted }]}>
        Choose a utility service to continue.
      </ThemedText>

      <View style={styles.grid}>
        {utilities.map((item) => (
          <TouchableOpacity
            key={item.routeService}
            activeOpacity={0.8}
            style={[styles.card, { backgroundColor: item.bg }]}
            onPress={() =>
              router.push({
                pathname: "/bills-utilities/select",
                params: { service: item.routeService },
              })
            }
          >
            <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
              {item.icon}
            </View>
            <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
            <ThemedText style={styles.cardSubtitle}>{item.subtitle}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    marginBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#D2F1E4",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#013D25",
    fontSize: 10,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "48.5%",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEF0F3",
    padding: 12,
    minHeight: 140,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0B0014",
  },
  cardSubtitle: {
    marginTop: 5,
    color: "#66606E",
    fontSize: 10,
    lineHeight: 14,
  },
});
