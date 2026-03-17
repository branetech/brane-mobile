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
  icon: (color: string) => React.ReactNode;
  bg: (C: any) => string;
  iconBg: (C: any) => string;
};

const getUtilityColors = (C: any, service: string) => {
  const isDark = C.background === "#151718"; // Check if dark theme
  const colors: Record<string, { bg: string; iconBg: string }> = {
    airtime: isDark
      ? { bg: "#1F4035", iconBg: "#2A5F54" }
      : { bg: "#E9F8F1", iconBg: "#D2F1E4" },
    data: isDark
      ? { bg: "#3D3520", iconBg: "#5F5535" }
      : { bg: "#F5F1E0", iconBg: "#E7DCB1" },
    betting: isDark
      ? { bg: "#1F3A52", iconBg: "#2A5270" }
      : { bg: "#EAF4FF", iconBg: "#D8E9FF" },
    cable: isDark
      ? { bg: "#52381F", iconBg: "#704D2C" }
      : { bg: "#FFF4EB", iconBg: "#FFDFC2" },
    electricity: isDark
      ? { bg: "#1F3A52", iconBg: "#2A5270" }
      : { bg: "#EEF7FF", iconBg: "#DDEEFF" },
    transportation: isDark
      ? { bg: "#253D20", iconBg: "#3A5A30" }
      : { bg: "#F1F8EE", iconBg: "#DFF0D7" },
  };
  return colors[service] || colors.airtime;
};

const utilities: UtilityOption[] = [
  {
    title: "Airtime",
    subtitle: "Top up your line instantly",
    routeService: "airtime",
    icon: <CardSend size={18} color='#013D25' variant='Bold' />,
    bg: (C) => getUtilityColors(C, "airtime").bg,
    iconBg: (C) => getUtilityColors(C, "airtime").iconBg,
  },
  {
    title: "Data",
    subtitle: "Buy internet bundles",
    routeService: "data",
    icon: <Devices size={18} color='#013D25' variant='Bold' />,
    bg: (C) => getUtilityColors(C, "data").bg,
    iconBg: (C) => getUtilityColors(C, "data").iconBg,
  },
  {
    title: "Betting",
    subtitle: "Fund betting wallets",
    routeService: "betting",
    icon: <I3Dcube size={18} color='#013D25' variant='Bold' />,
    bg: (C) => getUtilityColors(C, "betting").bg,
    iconBg: (C) => getUtilityColors(C, "betting").iconBg,
  },
  {
    title: "Cable TV",
    subtitle: "Pay for DSTV, GOTV and more",
    routeService: "cable",
    icon: <CardReceive size={18} color='#013D25' variant='Bold' />,
    bg: (C) => getUtilityColors(C, "cable").bg,
    iconBg: (C) => getUtilityColors(C, "cable").iconBg,
  },
  {
    title: "Electricity",
    subtitle: "Pay meter bills instantly",
    routeService: "electricity",
    icon: <Electricity size={18} color='#013D25' variant='Bold' />,
    bg: (C) => getUtilityColors(C, "electricity").bg,
    iconBg: (C) => getUtilityColors(C, "electricity").iconBg,
  },
  {
    title: "Transportation",
    subtitle: "Pay for transit services",
    routeService: "transportation",
    icon: <TruckFast size={18} color='#013D25' variant='Bold' />,
    bg: (C) => getUtilityColors(C, "transportation").bg,
    iconBg: (C) => getUtilityColors(C, "transportation").iconBg,
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
        <View style={[styles.badge, { backgroundColor: C.googleBg }]}>
          <KeyboardOpen size={14} color={C.primary} />
          <ThemedText style={[styles.badgeText, { color: C.primary }]}>
            Pay fast
          </ThemedText>
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
            style={[styles.card, { backgroundColor: item.bg(C) }]}
            onPress={() =>
              router.push({
                pathname: "/bills-utilities/select",
                params: { service: item.routeService },
              })
            }
          >
            <View style={[styles.iconWrap, { backgroundColor: item.iconBg(C) }]}>
              {item.icon}
            </View>
            <ThemedText style={[styles.cardTitle, { color: C.text }]}>
              {item.title}
            </ThemedText>
            <ThemedText style={[styles.cardSubtitle, { color: C.muted }]}>
              {item.subtitle}
            </ThemedText>
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
  },
  cardSubtitle: {
    marginTop: 5,
    fontSize: 10,
    lineHeight: 14,
  },
});
