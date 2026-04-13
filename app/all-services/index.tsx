import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { palette } from "@/constants";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { ArrowRight2 } from "iconsax-react-native";
import React, { useMemo, useState } from "react";
import {
    SectionList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ServiceItem = {
  id: string;
  name: string;
  route: string;
  params?: Record<string, string>;
  color: string;
  initials: string;
};

type Section = {
  title: string;
  data: ServiceItem[];
};

const SECTIONS: Section[] = [
  {
    title: "Payments",
    data: [
      {
        id: "airtime",
        name: "Buy Airtime",
        route: "/buy-airtime",
        color: palette.brandMint,
        initials: "AT",
      },
      {
        id: "data",
        name: "Buy Data",
        route: "/buy-data",
        color: palette.spendDataBg,
        initials: "BD",
      },
      {
        id: "electricity",
        name: "Electricity",
        route: "/bills-utilities/select",
        params: { service: "electricity" },
        color: palette.spendElectricBg,
        initials: "EL",
      },
      {
        id: "cable",
        name: "Cable TV",
        route: "/bills-utilities/select",
        params: { service: "cable" },
        color: palette.spendCableBg,
        initials: "TV",
      },
      {
        id: "betting",
        name: "Betting",
        route: "/bills-utilities/select",
        params: { service: "betting" },
        color: palette.spendBettingBg,
        initials: "BT",
      },
    ],
  },
  {
    title: "Finance",
    data: [
      {
        id: "send-money",
        name: "Send Money",
        route: "/send-money",
        color: "#FFF0E0",
        initials: "SM",
      },
      {
        id: "add-funds",
        name: "Add Funds",
        route: "/add-funds",
        color: "#E0F5FF",
        initials: "AF",
      },
      {
        id: "add-bank",
        name: "Add Bank",
        route: "/add-funds/bank",
        color: "#E0FFE8",
        initials: "AB",
      },
      {
        id: "add-card",
        name: "Add Card",
        route: "/add-funds/add-card",
        color: "#F5E0FF",
        initials: "AC",
      },
    ],
  },
  {
    title: "Investment",
    data: [
      {
        id: "stocks",
        name: "Stocks",
        route: "/stock",
        color: "#E8F5E9",
        initials: "ST",
      },
      {
        id: "portfolio",
        name: "My Portfolio",
        route: "/(tabs)/(portfolio)",
        color: "#FFF8E1",
        initials: "PF",
      },
      {
        id: "bracs",
        name: "BRACS",
        route: "/stock/breakdown",
        color: "#E3F2FD",
        initials: "BR",
      },
      {
        id: "swap",
        name: "Swap BRACS",
        route: "/stock/swap",
        color: "#FCE4EC",
        initials: "SW",
      },
    ],
  },
  {
    title: "Account",
    data: [
      {
        id: "bank-accounts",
        name: "Bank Accounts",
        route: "/bank-account",
        color: "#E8EAF6",
        initials: "BA",
      },
      {
        id: "saved-cards",
        name: "Saved Cards",
        route: "/saved-cards",
        color: "#F3E5F5",
        initials: "SC",
      },
      {
        id: "transactions",
        name: "Transactions",
        route: "/(tabs)/transactions",
        color: "#E0F2F1",
        initials: "TX",
      },
    ],
  },
];

export default function AllServicesScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [query, setQuery] = useState("");

  const filteredSections = useMemo<Section[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.reduce<Section[]>((acc, section) => {
      const filtered = section.data.filter((item) =>
        item.name.toLowerCase().includes(q),
      );
      if (filtered.length > 0) {
        acc.push({ ...section, data: filtered });
      }
      return acc;
    }, []);
  }, [query]);

  const handleNavigate = (item: ServiceItem) => {
    if (item.params) {
      router.push({ pathname: item.route as any, params: item.params });
    } else {
      router.push(item.route as any);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Header */}
      <Header title='All Services' />

      {/* Search */}
      <View
        style={{
          ...styles.searchWrap,
          backgroundColor: C.inputBg,
          borderColor: C.border,
        }}
        row
        aligned
      >
        <TextInput
          style={[styles.searchInput, { color: C.text }]}
          placeholder='Search services…'
          placeholderTextColor={C.muted}
          value={query}
          onChangeText={setQuery}
          returnKeyType='search'
          clearButtonMode='while-editing'
        />
      </View>

      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <ThemedText
            type='defaultSemiBold'
            style={[styles.sectionTitle, { color: C.muted }]}
          >
            {section.title}
          </ThemedText>
        )}
        renderItem={({ item, index, section }) => {
          const isLast = index === section.data.length - 1;
          return (
            <TouchableOpacity
              onPress={() => handleNavigate(item)}
              activeOpacity={0.7}
              style={[
                styles.itemRow,
                {
                  backgroundColor: C.background,
                  borderBottomColor: C.border,
                  borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                },
              ]}
            >
              <View
                style={{
                  ...styles.initialsCircle,
                  backgroundColor: item.color,
                }}
              >
                <ThemedText style={[styles.initialsText, { color: C.primary }]}>
                  {item.initials}
                </ThemedText>
              </View>
              <ThemedText style={[styles.itemName, { color: C.text, flex: 1 }]}>
                {item.name}
              </ThemedText>
              <ArrowRight2 size={16} color={C.muted} />
            </TouchableOpacity>
          );
        }}
        renderSectionFooter={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <ThemedText style={{ color: C.muted, textAlign: "center" }}>
              {`No services found for "${query}"`}
            </ThemedText>
          </View>
        }
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
  searchWrap: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  initialsCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    fontSize: 13,
    fontWeight: "700",
  },
  itemName: { fontSize: 14 },
  emptyWrap: {
    paddingTop: 48,
    alignItems: "center",
  },
});
