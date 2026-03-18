import {
  AirtimeDataIcon,
  ElectricityIcon,
  GamingSportIcon,
  GovernmentIcon,
  InternetIcon,
  TransportationIcon,
  TvBillsIcon,
} from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { SearchNormal1 } from "iconsax-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Category = {
  id: string;
  title: string;
  service: string;
  bg: string;
  iconColor: string;
  fullWidth: boolean;
};

const CATEGORIES: Category[] = [
  {
    id: "airtime-data",
    title: "Airtime & Data",
    service: "airtime",
    bg: "#EAF5F1",
    iconColor: "#013D25",
    fullWidth: true,
  },
  {
    id: "internet",
    title: "Internet",
    service: "data",
    bg: "#E0FFFC",
    iconColor: "#0D7490",
    fullWidth: false,
  },
  {
    id: "electricity",
    title: "Electricity",
    service: "electricity",
    bg: "#99FFF4",
    iconColor: "#1A5A8A",
    fullWidth: false,
  },
  {
    id: "transportation",
    title: "Transportation",
    service: "transportation",
    bg: "#E7DCB1",
    iconColor: "#6B4A22",
    fullWidth: true,
  },
  {
    id: "tv-bills",
    title: "TV Bills",
    service: "cable",
    bg: "#F0C8A0",
    iconColor: "#9E3A0E",
    fullWidth: false,
  },
  {
    id: "gaming-sport",
    title: "Gaming & Sport",
    service: "betting",
    bg: "#99CFFF",
    iconColor: "#1A3A6A",
    fullWidth: false,
  },
  {
    id: "government",
    title: "Government Task & Levy",
    service: "government",
    bg: "#E0F1FF",
    iconColor: "#1A2A78",
    fullWidth: true,
  },
];

const renderIcon = (id: string) => {
  switch (id) {
    case "airtime-data":
      return <AirtimeDataIcon />;
    case "internet":
      return <InternetIcon />;
    case "electricity":
      return <ElectricityIcon />;
    case "transportation":
      return <TransportationIcon />;
    case "tv-bills":
      return <TvBillsIcon />;
    case "gaming-sport":
      return <GamingSportIcon />;
    case "government":
      return <GovernmentIcon />;
    default:
      return null;
  }
};

export default function UtiliScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? CATEGORIES.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()),
      )
    : CATEGORIES;

  const handlePress = (cat: Category) => {
    if (cat.service === "government") return;
    router.push({
      pathname: "/bills-utilities/select",
      params: { service: cat.service },
    });
  };

  // Group into rows: full-width cards are alone; consecutive halves pair up
  const rows: (Category | [Category, Category])[] = [];
  let i = 0;
  while (i < filtered.length) {
    const cur = filtered[i];
    if (cur.fullWidth) {
      rows.push(cur);
      i++;
    } else {
      const next = filtered[i + 1];
      if (next && !next.fullWidth) {
        rows.push([cur, next]);
        i += 2;
      } else {
        rows.push(cur);
        i++;
      }
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <ThemedText style={[styles.title, { color: C.text }]}>
        Utilities
      </ThemedText>

      <View
        style={[
          styles.searchBar,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
      >
        <SearchNormal1 size={16} color={C.muted} variant="Outline" />
        <TextInput
          style={[styles.searchInput, { color: C.text }]}
          placeholder="Search services"
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {rows.map((row, idx) => {
          if (Array.isArray(row)) {
            const [left, right] = row;
            return (
              <View key={`row-${idx}`} style={styles.halfRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.cardHalf, { backgroundColor: left.bg }]}
                  onPress={() => handlePress(left)}
                >
                  <View style={styles.cardIconWrap}>{renderIcon(left.id)}</View>
                  <ThemedText style={styles.cardLabel}>{left.title}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.cardHalf, { backgroundColor: right.bg }]}
                  onPress={() => handlePress(right)}
                >
                  <View style={styles.cardIconWrap}>
                    {renderIcon(right.id)}
                  </View>
                  <ThemedText style={styles.cardLabel}>
                    {right.title}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            );
          }
          return (
            <TouchableOpacity
              key={row.id}
              activeOpacity={0.85}
              style={[styles.cardFull, { backgroundColor: row.bg }]}
              onPress={() => handlePress(row)}
            >
              <View style={styles.cardIconWrap}>{renderIcon(row.id)}</View>
              <ThemedText style={styles.cardLabel}>{row.title}</ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 24,
  },
  cardFull: {
    width: "100%",
    borderRadius: 16,
    padding: 18,
    minHeight: 116,
    justifyContent: "space-between",
  },
  halfRow: {
    flexDirection: "row",
    gap: 16,
  },
  cardHalf: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 116,
    justifyContent: "space-between",
  },
  cardIconWrap: {
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
  },
});
