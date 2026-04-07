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
import BaseRequest from "@/services";
import { MOBILE_SERVICE } from "@/services/routes";
import { showError } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { CloseCircle, SearchNormal1 } from "iconsax-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getCableImageKey,
  getElectricityImageKey,
  getNetworkImageKey,
  normalizeElectricityProviders,
  normalizeKey,
  normalizeOption,
  toArray,
} from "@/components/bills-utilities/helpers";
import {
  CABLE_IMAGES,
  ELECTRICITY_IMAGES,
  NETWORK_IMAGES,
  TRANSPORT_KEYWORDS,
  type SelectOption,
  type UtilityService,
} from "@/components/bills-utilities/types";

type Category = {
  id: string;
  title: string;
  service: string;
  bg: string;
  iconColor: string;
  fullWidth: boolean;
};

type SearchResult = {
  id: string;
  label: string;
  service: UtilityService;
  providerId?: string;
  subtitle?: string;
  categoryId: string;
  imageSource?: any;
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
  // {
  //   id: "transportation",
  //   title: "Transportation",
  //   service: "transportation",
  //   bg: "#E7DCB1",
  //   iconColor: "#6B4A22",
  //   fullWidth: true,
  // },
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
  const [searchableResults, setSearchableResults] = useState<SearchResult[]>(
    [],
  );
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  const filtered = search.trim()
    ? CATEGORIES.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()),
      )
    : CATEGORIES;

  useEffect(() => {
    let isMounted = true;

    const fetchSearchables = async () => {
      setIsLoadingResults(true);
      try {
        const [dataRes, bettingRes, cableRes, electricityRes, transportRes] =
          await Promise.all([
            BaseRequest.get(
              "/mobile-connectivity-service/mobile-data/providers",
            ).catch(() => null),
            BaseRequest.get(MOBILE_SERVICE.BETTING_SERVICE).catch(() => null),
            BaseRequest.get(MOBILE_SERVICE.CABLE_SERVICE).catch(() => null),
            BaseRequest.get(MOBILE_SERVICE.ELECTRICITY_GET_BILLER).catch(
              () => null,
            ),
            BaseRequest.get(MOBILE_SERVICE.VT_PASS_SERVICE).catch(() => null),
          ]);

        const dataProviders = toArray(dataRes).map(normalizeOption);
        const bettingProviders = toArray(bettingRes).map(normalizeOption);
        const cableProviders = toArray(cableRes).map(normalizeOption);
        const electricityProviders = normalizeElectricityProviders(
          electricityRes?.data || electricityRes,
        );
        const transportProviders = toArray(transportRes)
          .map(normalizeOption)
          .filter((item) =>
            TRANSPORT_KEYWORDS.some((keyword) =>
              normalizeKey(
                `${item.id} ${item.label} ${item.description || ""}`,
              ).includes(keyword),
            ),
          );

        const buildResult = (
          item: SelectOption,
          service: UtilityService,
          categoryId: string,
        ): SearchResult => {
          const text = `${item.id} ${item.label} ${item.description || ""}`;
          const imageSource =
            service === "data"
              ? NETWORK_IMAGES[getNetworkImageKey(text)]
              : service === "cable"
                ? CABLE_IMAGES[getCableImageKey(text)]
                : service === "electricity"
                  ? ELECTRICITY_IMAGES[getElectricityImageKey(text)]
                  : undefined;

          return {
            id: `${service}-${item.id}`,
            label: item.label,
            providerId: item.id,
            subtitle: item.description,
            service,
            categoryId,
            imageSource,
          };
        };

        const categoryResults: SearchResult[] = CATEGORIES.filter(
          (item) => item.service !== "government",
        ).map((item) => ({
          id: `category-${item.id}`,
          label: item.title,
          service: item.service as UtilityService,
          categoryId: item.id,
        }));

        const allResults = [
          ...categoryResults,
          ...dataProviders.map((item) => buildResult(item, "data", "internet")),
          ...bettingProviders.map((item) =>
            buildResult(item, "betting", "gaming-sport"),
          ),
          ...cableProviders.map((item) =>
            buildResult(item, "cable", "tv-bills"),
          ),
          ...electricityProviders.map((item) =>
            buildResult(item, "electricity", "electricity"),
          ),
          ...transportProviders.map((item) =>
            buildResult(item, "transportation", "transportation"),
          ),
        ];

        const deduped = allResults.filter(
          (item, index, array) =>
            array.findIndex(
              (candidate) =>
                candidate.service === item.service &&
                candidate.providerId === item.providerId &&
                candidate.label.toLowerCase() === item.label.toLowerCase(),
            ) === index,
        );

        if (isMounted) {
          setSearchableResults(deduped);
        }
      } catch (error) {
        if (isMounted) showError("Failed to load services. Please try again.");
      } finally {
        if (isMounted) {
          setIsLoadingResults(false);
        }
      }
    };

    fetchSearchables();

    return () => {
      isMounted = false;
    };
  }, []);

  const query = search.trim().toLowerCase();
  const searchMatches = useMemo(() => {
    if (!query) return [];

    return searchableResults.filter((item) => {
      const haystack = normalizeKey(
        `${item.label} ${item.subtitle || ""} ${item.providerId || ""}`,
      );
      return haystack.includes(normalizeKey(query));
    });
  }, [query, searchableResults]);

  const handlePress = (cat: Category) => {
    if (cat.service === "government") return;
    router.push({
      pathname: "/bills-utilities/select",
      params: { service: cat.service },
    });
  };

  const handleSearchResultPress = (result: SearchResult) => {
    router.push({
      pathname: "/bills-utilities/select",
      params: {
        service: result.service,
        providerId: result.providerId,
      },
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
          {
            backgroundColor: C.inputBg,
            borderColor: query ? C.primary : C.border,
            borderWidth: query ? 1 : 0,
          },
        ]}
      >
        <SearchNormal1 size={16} color={C.muted} variant='Outline' />
        <TextInput
          style={[styles.searchInput, { color: C.text }]}
          placeholder='Search services'
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
        />
        {query ? (
          <TouchableOpacity onPress={() => setSearch("")} hitSlop={8}>
            <CloseCircle size={16} color={C.muted} variant='Outline' />
          </TouchableOpacity>
        ) : null}
      </View>

      {query ? (
        <View style={styles.searchResultsWrap}>
          {searchMatches.map((item) => {
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                style={styles.searchResultRow}
                onPress={() => handleSearchResultPress(item)}
              >
                <View style={styles.searchResultIconWrap}>
                  {item.imageSource ? (
                    <Image
                      source={item.imageSource}
                      style={styles.searchResultImage}
                      resizeMode='contain'
                    />
                  ) : (
                    renderIcon(item.categoryId)
                  )}
                </View>
                <View style={styles.searchResultTextWrap}>
                  <ThemedText style={styles.searchResultTitle}>
                    {item.label}
                  </ThemedText>
                  {item.subtitle ? (
                    <ThemedText
                      style={[styles.searchResultSubtitle, { color: C.muted }]}
                    >
                      {item.subtitle.replace(/-/g, " ")}
                    </ThemedText>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
          {!isLoadingResults && searchMatches.length === 0 ? (
            <ThemedText style={[styles.emptySearchText, { color: C.muted }]}>
              No matching service found.
            </ThemedText>
          ) : null}
        </View>
      ) : (
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
                    <View style={styles.cardIconWrap}>
                      {renderIcon(left.id)}
                    </View>
                    <ThemedText style={styles.cardLabel}>
                      {left.title}
                    </ThemedText>
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
      )}
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
  searchResultsWrap: {
    gap: 14,
    paddingTop: 4,
  },
  searchResultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchResultIconWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    overflow: "hidden",
  },
  searchResultImage: {
    width: 28,
    height: 28,
  },
  searchResultTextWrap: {
    flex: 1,
    gap: 2,
  },
  searchResultTitle: {
    fontSize: 13,
    color: "#1A1A2E",
    fontWeight: "500",
  },
  searchResultSubtitle: {
    fontSize: 11,
  },
  emptySearchText: {
    fontSize: 13,
    paddingTop: 4,
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
