import {
  getBettingImageKey,
  getCableImageKey,
  getElectricityImageKey,
  getNetworkImageKey,
  normalizeElectricityProviders,
  normalizeKey,
  normalizeOption,
  toArray,
} from "@/app/bills-utilities/helpers";
import {
  BETTING_IMAGES,
  BETTING_ORDER,
  CABLE_IMAGES,
  ELECTRICITY_IMAGES,
  NETWORK_IMAGES,
  type SelectOption,
  type UtilityService,
} from "@/app/bills-utilities/types";
import Back from "@/components/back";
import {
  AirtimeDataIcon,
  ElectricityIcon,
  GamingSportIcon,
  InternetIcon,
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

type ServiceCardItem = {
  id: string;
  label: string;
  service: UtilityService;
  providerId?: string;
  imageSource?: any;
  showBorder?: boolean;
};

type ServiceSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: ServiceCardItem[];
};

type SearchResult = {
  id: string;
  label: string;
  subtitle?: string;
  service: UtilityService;
  providerId?: string;
  imageSource?: any;
  fallbackSection: string;
  showBorder?: boolean;
};

const FALLBACK_SECTION_ICONS: Record<string, React.ReactNode> = {
  airtime: <AirtimeDataIcon />,
  cable: <TvBillsIcon />,
  data: <InternetIcon />,
  electricity: <ElectricityIcon />,
  betting: <GamingSportIcon />,
};

const formatProviderLabel = (label: string) => {
  const cleaned = String(label || "").replace(/-data$/i, "");
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
};

const getProviderKey = (item: SelectOption) =>
  normalizeKey(`${item.id} ${item.label} ${item.description || ""}`);

const getBettingImage = (item: SelectOption) => {
  const imageKey = getBettingImageKey(
    `${item.id} ${item.label} ${item.description || ""}`,
  );
  return imageKey ? BETTING_IMAGES[imageKey] : undefined;
};

const shouldShowBorder = (service: UtilityService, item: SelectOption) => {
  const key = getProviderKey(item);

  if (service === "electricity" || service === "betting") return true;

  return ["9mobile", "etisalat", "smile", "spectranet", "startimes"].some(
    (provider) => key.includes(normalizeKey(provider)),
  );
};

export default function HomeBillsServicesScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const themeKey: "light" | "dark" = scheme === "dark" ? "dark" : "light";
  const C = Colors[themeKey];
  const styles = createStyles(C);

  const [query, setQuery] = useState("");
  const [sections, setSections] = useState<ServiceSection[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    let isMounted = true;

    const buildItem = (
      item: SelectOption,
      service: UtilityService,
      imageSource?: any,
    ): ServiceCardItem => ({
      id: `${service}-${item.id}`,
      label: formatProviderLabel(item.label),
      service,
      providerId: item.id,
      imageSource,
      showBorder: shouldShowBorder(service, item),
    });

    const buildSearchItem = (
      item: SelectOption,
      service: UtilityService,
      fallbackSection: string,
      imageSource?: any,
    ): SearchResult => ({
      id: `${service}-${item.id}`,
      label: formatProviderLabel(item.label),
      subtitle: item.description,
      service,
      providerId: item.id,
      imageSource,
      fallbackSection,
      showBorder: shouldShowBorder(service, item),
    });

    const fetchServiceCollections = async () => {
      try {
        const [dataRes, bettingRes, cableRes, electricityRes] =
          await Promise.all([
            BaseRequest.get(
              "/mobile-connectivity-service/mobile-data/providers",
            ).catch(() => null),
            BaseRequest.get(MOBILE_SERVICE.BETTING_SERVICE).catch(() => null),
            BaseRequest.get(MOBILE_SERVICE.CABLE_SERVICE).catch(() => null),
            BaseRequest.get(MOBILE_SERVICE.ELECTRICITY_GET_BILLER).catch(
              () => null,
            ),
          ]);

        const dataProviders = toArray(dataRes).map(normalizeOption);
        const bettingProviders = toArray(bettingRes)
          .map(normalizeOption)
          .sort((a, b) => {
            const aKey = getBettingImageKey(
              `${a.id} ${a.label} ${a.description || ""}`,
            );
            const bKey = getBettingImageKey(
              `${b.id} ${b.label} ${b.description || ""}`,
            );
            const ai = BETTING_ORDER.findIndex((item) => item === aKey);
            const bi = BETTING_ORDER.findIndex((item) => item === bKey);
            return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
          });
        const cableProviders = toArray(cableRes).map(normalizeOption);
        const electricityProviders = normalizeElectricityProviders(
          electricityRes?.data || electricityRes,
        );

        const airtimeProviders = dataProviders.filter((item) => {
          const networkKey = getNetworkImageKey(
            `${item.id} ${item.label} ${item.description || ""}`,
          );
          return ["mtn", "airtel", "glo", "smile-direct", "9mobile"].includes(
            networkKey,
          );
        });

        const internetProviders = dataProviders.filter((item) => {
          const haystack = normalizeKey(
            `${item.id} ${item.label} ${item.description || ""}`,
          );
          return (
            haystack.includes("smile") ||
            haystack.includes("spectranet") ||
            haystack.includes("starlink")
          );
        });

        const toNetworkImage = (item: SelectOption) =>
          NETWORK_IMAGES[
            getNetworkImageKey(
              `${item.id} ${item.label} ${item.description || ""}`,
            )
          ];
        const toCableImage = (item: SelectOption) =>
          CABLE_IMAGES[
            getCableImageKey(
              `${item.id} ${item.label} ${item.description || ""}`,
            )
          ];
        const toElectricityImage = (item: SelectOption) =>
          ELECTRICITY_IMAGES[
            getElectricityImageKey(
              `${item.id} ${item.label} ${item.description || ""}`,
            )
          ];
        const toBettingImage = (item: SelectOption) => getBettingImage(item);

        const nextSections: ServiceSection[] = [
          {
            id: "airtime-data",
            title: "Airtime and Data",
            icon: <AirtimeDataIcon />,
            items: airtimeProviders
              .slice(0, 4)
              .map((item) => buildItem(item, "airtime", toNetworkImage(item))),
          },
          {
            id: "tv",
            title: "TV",
            icon: <TvBillsIcon />,
            items: cableProviders
              .slice(0, 4)
              .map((item) => buildItem(item, "cable", toCableImage(item))),
          },
          {
            id: "internet",
            title: "Internet",
            icon: <InternetIcon />,
            items: internetProviders
              .slice(0, 4)
              .map((item) => buildItem(item, "data", toNetworkImage(item))),
          },
          {
            id: "electricity",
            title: "Electricity",
            icon: <ElectricityIcon />,
            items: electricityProviders
              .slice(0, 4)
              .map((item) =>
                buildItem(item, "electricity", toElectricityImage(item)),
              ),
          },
          {
            id: "gaming-sport",
            title: "Gaming and Sport",
            icon: <GamingSportIcon />,
            items: bettingProviders
              .slice(0, 4)
              .map((item) => buildItem(item, "betting", toBettingImage(item))),
          },
        ].filter((section) => section.items.length > 0);

        const nextSearchResults: SearchResult[] = [
          ...airtimeProviders.map((item) =>
            buildSearchItem(item, "airtime", "airtime", toNetworkImage(item)),
          ),
          ...internetProviders.map((item) =>
            buildSearchItem(item, "data", "data", toNetworkImage(item)),
          ),
          ...cableProviders.map((item) =>
            buildSearchItem(item, "cable", "cable", toCableImage(item)),
          ),
          ...electricityProviders.map((item) =>
            buildSearchItem(
              item,
              "electricity",
              "electricity",
              toElectricityImage(item),
            ),
          ),
          ...bettingProviders.map((item) =>
            buildSearchItem(item, "betting", "betting", toBettingImage(item)),
          ),
        ];

        if (!isMounted) return;
        setSections(nextSections);
        setSearchResults(nextSearchResults);
      } catch {
        if (isMounted) {
          showError("Failed to load services. Please try again.");
        }
      }
    };

    fetchServiceCollections();

    return () => {
      isMounted = false;
    };
  }, []);

  const searchKey = normalizeKey(query);
  const filteredResults = useMemo(() => {
    if (!searchKey) return [];

    return searchResults.filter((item) =>
      normalizeKey(
        `${item.label} ${item.subtitle || ""} ${item.providerId || ""}`,
      ).includes(searchKey),
    );
  }, [searchKey, searchResults]);

  const goToService = (service: UtilityService, providerId?: string) => {
    const routeParams: Record<string, string> = { service };
    if (providerId) routeParams.providerId = providerId;
    router.push({ pathname: "/bills-utilities/select", params: routeParams });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={styles.headerTitle}>Bills & Services</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchWrap}>
        <SearchNormal1 size={16} color={C.muted} variant='Outline' />
        <TextInput
          style={styles.searchInput}
          placeholder='Search services'
          placeholderTextColor={C.muted}
          value={query}
          onChangeText={setQuery}
        />
        {query.trim() ? (
          <TouchableOpacity hitSlop={8} onPress={() => setQuery("")}>
            <CloseCircle size={16} color={C.muted} variant='Outline' />
          </TouchableOpacity>
        ) : null}
      </View>

      {searchKey ? (
        <View style={styles.searchResultList}>
          {filteredResults.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.searchResultRow}
              activeOpacity={0.8}
              onPress={() => goToService(item.service, item.providerId)}
            >
              <View
                style={[
                  styles.searchResultIconWrap,
                  item.showBorder ? styles.imageBorderWrap : null,
                ]}
              >
                {item.imageSource ? (
                  <Image
                    source={item.imageSource}
                    style={styles.searchResultImage}
                    resizeMode='contain'
                  />
                ) : (
                  FALLBACK_SECTION_ICONS[item.fallbackSection]
                )}
              </View>
              <View style={styles.searchResultTextWrap}>
                <ThemedText style={styles.searchResultTitle}>
                  {item.label}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}

          {filteredResults.length === 0 ? (
            <ThemedText style={styles.emptyText}>No service found.</ThemedText>
          ) : null}
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {sections.map((section) => (
            <View key={section.id} style={styles.sectionWrap}>
              <ThemedText style={styles.sectionTitle}>
                {section.title}
              </ThemedText>
              <View style={styles.cardRow}>
                {section.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.providerCard}
                    activeOpacity={0.85}
                    onPress={() => goToService(item.service, item.providerId)}
                  >
                    <View
                      style={[
                        styles.providerIconWrap,
                        item.showBorder ? styles.imageBorderWrap : null,
                      ]}
                    >
                      {item.imageSource ? (
                        <Image
                          source={item.imageSource}
                          style={styles.providerImage}
                          resizeMode='contain'
                        />
                      ) : (
                        section.icon
                      )}
                    </View>
                    <ThemedText style={styles.providerLabel} numberOfLines={1}>
                      {item.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const createStyles = (C: (typeof Colors)["light"]) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: C.background,
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 10,
    },
    headerTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: C.muted,
    },
    headerSpacer: {
      width: 44,
    },
    searchWrap: {
      height: 44,
      borderRadius: 10,
      backgroundColor: C.inputBg,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      gap: 8,
      marginBottom: 14,
    },
    searchInput: {
      flex: 1,
      fontSize: 12,
      color: C.text,
      padding: 0,
    },
    content: {
      gap: 14,
      paddingBottom: 24,
    },
    sectionWrap: {
      gap: 10,
    },
    sectionTitle: {
      fontSize: 11,
      color: C.muted,
      fontWeight: "500",
    },
    cardRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    providerCard: {
      width: 72,
      gap: 6,
      alignItems: "center",
    },
    providerIconWrap: {
      width: 56,
      height: 56,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    imageBorderWrap: {
      borderWidth: 1,
      borderColor: "#E6E8EC",
      backgroundColor: "#FFFFFF",
    },
    providerImage: {
      width: 42,
      height: 42,
    },
    providerLabel: {
      fontSize: 10,
      color: C.text,
      textAlign: "center",
    },
    searchResultList: {
      gap: 14,
      paddingTop: 4,
    },
    searchResultRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    searchResultIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 8,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
    },
    searchResultImage: {
      width: 28,
      height: 28,
    },
    searchResultTextWrap: {
      flex: 1,
    },
    searchResultTitle: {
      fontSize: 12,
      color: C.text,
      fontWeight: "500",
    },
    emptyText: {
      fontSize: 12,
      color: C.muted,
      paddingTop: 8,
    },
  });
