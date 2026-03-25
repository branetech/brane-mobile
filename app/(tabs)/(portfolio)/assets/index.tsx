import Back from "@/components/back";
import { StockItemCard } from "@/components/home/cards";
import { SearchInput } from "@/components/search-input";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import { STOCKS_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { StockInterface } from "@/utils/constants";
import { collection } from "@/utils/helpers";
import { View as WidgetView } from "@idimma/rn-widget";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ShoppingCart } from "iconsax-react-native";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STOCK_TABS = [
  { key: "", label: "Stocks" },
  { key: "gold", label: "Gold" },
  { key: "index", label: "Indexes" },
  { key: "etfs", label: "ETFs" },
  { key: "income", label: "Fixed Income" },
];

export default function AssetsScreen() {
  const router = useRouter();
  const { tab: initialTab } = useLocalSearchParams<{ tab?: string }>();
  const rawScheme = useColorScheme();
  const scheme: "light" | "dark" = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [activeTab, setActiveTab] = useState<string>(initialTab || "");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isLoading } = useRequest(STOCKS_SERVICE.STOCKS, {
    initialValue: [],
    params: { currentPage: 1, perPage: 400 },
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    showError: true,
  });
  const { checkouts } = useAppState();

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const topPicks = useMemo(
    () =>
      collection(data)?.filter((item: StockInterface) => item.isTopPick) || [],
    [data],
  );

  const assets = useMemo(() => {
    const _collection = collection(data);
    if (activeTab === "gold") {
      return _collection.filter(
        (item: StockInterface) => item.braneStockCategory === "gold",
      );
    }
    if (activeTab === "index") {
      return _collection.filter(
        (item: StockInterface) => item.braneStockCategory === "indexes",
      );
    }
    if (activeTab === "etfs") {
      return _collection.filter(
        (item: StockInterface) => item.braneStockCategory === "etfs",
      );
    }
    if (activeTab === "income") {
      return _collection.filter(
        (item: StockInterface) => item.braneStockCategory === "fixed-income",
      );
    }
    return _collection.filter(
      (item: StockInterface) => item.braneStockCategory === "stocks",
    );
  }, [activeTab, data]);

  const filteredTopPicks = useMemo(
    () =>
      topPicks.filter((item: StockInterface) => {
        if (!normalizedSearchQuery) return true;

        return [item.tickerSymbol, item.companyName]
          .concat(item.ticker ? [item.ticker] : [])
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearchQuery),
          );
      }),
    [topPicks, normalizedSearchQuery],
  );

  const filteredAssets = useMemo(
    () =>
      assets.filter((item: StockInterface) => {
        if (!normalizedSearchQuery) return true;

        return [item.tickerSymbol, item.companyName]
          .concat(item.ticker ? [item.ticker] : [])
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearchQuery),
          );
      }),
    [assets, normalizedSearchQuery],
  );

  const activeTabLabel =
    STOCK_TABS.find((tab) => tab.key === activeTab)?.label || "Stocks";

  const handleStockClick = (tickerSymbol: string) => {
    // if (!isKycCompleted) {
    //   setShowKycModal(true);
    //   return;
    // }
    router.push(`/(tabs)/(portfolio)/company/${tickerSymbol}` as any);
  };

  const handleAddToCart = (_asset: StockInterface) => {
    router.push("/(tabs)/(portfolio)/checkout" as any);
  };

  const handleCartClick = () => {
    router.push("/(tabs)/(portfolio)/checkout" as any);
  };

  if (isLoading) {
    return <AssetSkeleton scheme={scheme} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <WidgetView style={styles.header}>
          <Back onPress={() => router.back()} />
          <ThemedText style={styles.headerTitle}>Invest</ThemedText>
          <TouchableOpacity
            style={styles.cartIcon}
            onPress={handleCartClick}
            disabled={checkouts?.length === 0}
          >
            <ShoppingCart size={24} color={C.text} />
            {checkouts && checkouts.length > 0 && (
              <WidgetView
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: C.primary,
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ThemedText style={styles.badgeText}>
                  {checkouts.length}
                </ThemedText>
              </WidgetView>
            )}
          </TouchableOpacity>
        </WidgetView>

        {/* Top Picks Section */}
        <WidgetView style={styles.section}>
          {/* Search Input */}
          <SearchInput
            placeholder='Search assets...'
            keyboardType='default'
            value={searchQuery}
            onChangeText={setSearchQuery}
            inputContainerStyle={{
              height: 48,
              borderRadius: 8,
              marginBottom: 16,
            }}
          />

          <FlatList
            data={STOCK_TABS}
            keyExtractor={(item) => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    borderBottomColor:
                      activeTab === item.key ? C.primary : "transparent",
                    borderBottomWidth: activeTab === item.key ? 1.5 : 0,
                  },
                ]}
                onPress={() => setActiveTab(item.key)}
              >
                <ThemedText
                  style={[
                    styles.tabLabel,
                    {
                      color: activeTab === item.key ? C.primary : C.muted,
                      fontWeight: activeTab === item.key ? "600" : "500",
                      fontSize: 12,
                    },
                  ]}
                >
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            )}
          />

          <ThemedText type='subtitle' style={{ color: C.muted, fontSize: 14 }}>
            Top Picks
          </ThemedText>

          {filteredTopPicks.length === 0 ? (
            <ThemedText
              style={{
                color: C.muted,
                fontSize: 14,
                textAlign: "center",
                marginVertical: 20,
              }}
            >
              {normalizedSearchQuery
                ? "No top picks match your search"
                : "Curated stock picks will appear here"}
            </ThemedText>
          ) : (
            <FlatList
              data={filteredTopPicks}
              keyExtractor={(item) => item.tickerSymbol}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.topPicksList}
              renderItem={({ item }) => (
                <StockItemCard
                  stockName={item.tickerSymbol}
                  tickerSymbol={item.tickerSymbol}
                  companyName={item.companyName}
                  currentPrice={item.currentPrice}
                  logo={item.logo}
                  minWidth='200px'
                  variant='stacked'
                  onClick={() => handleStockClick(item.tickerSymbol)}
                  ticker={item?.ticker}
                />
              )}
            />
          )}
        </WidgetView>

        <ThemedText
          type='subtitle'
          style={{ color: C.muted, fontSize: 16, marginTop: 8 }}
        >
          {activeTabLabel}
        </ThemedText>

        {/* Assets List */}
        <WidgetView style={styles.section}>
          {filteredAssets.length === 0 ? (
            <ThemedText
              style={{
                color: C.muted,
                fontSize: 14,
                textAlign: "center",
                marginVertical: 20,
              }}
            >
              {normalizedSearchQuery
                ? "No assets match your search"
                : "No assets found"}
            </ThemedText>
          ) : (
            <FlatList
              data={filteredAssets}
              keyExtractor={(item) => item.tickerSymbol}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <StockItemCard
                  stockName={item.tickerSymbol}
                  tickerSymbol={item.tickerSymbol}
                  companyName={item.companyName}
                  currentPrice={item.currentPrice}
                  logo={item.logo}
                  priceChange={item.priceChange as any}
                  percentage={item.percentage as any}
                  variant='list'
                  onClick={() => handleStockClick(item.tickerSymbol)}
                  onAddToCart={() => handleAddToCart(item)}
                  ticker={item?.ticker}
                />
              )}
            />
          )}
        </WidgetView>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Asset Skeleton Loader */
function AssetSkeleton({ scheme }: { scheme: "light" | "dark" }) {
  const C = Colors[scheme];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Skeleton */}
        <WidgetView style={styles.header}>
          <WidgetView
            style={{
              width: 32,
              height: 32,
              backgroundColor: C.inputBg,
              borderRadius: 8,
            }}
          />
          <WidgetView
            style={{
              flex: 1,
              height: 24,
              backgroundColor: C.inputBg,
              borderRadius: 4,
              marginHorizontal: 12,
            }}
          />
          <WidgetView
            style={{
              width: 32,
              height: 32,
              backgroundColor: C.inputBg,
              borderRadius: 8,
            }}
          />
        </WidgetView>

        {/* Section Skeleton */}
        {[1, 2, 3].map((index) => (
          <WidgetView key={index} style={styles.section}>
            <WidgetView
              style={{
                height: 16,
                backgroundColor: C.inputBg,
                borderRadius: 4,
                marginBottom: 12,
                width: "40%",
              }}
            />
            <WidgetView
              style={{
                height: 120,
                backgroundColor: C.inputBg,
                borderRadius: 12,
                marginBottom: 12,
              }}
            />
          </WidgetView>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  cartIcon: {
    position: "relative",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  section: {
    marginBottom: 20,
  },
  topPicksList: {
    marginTop: 12,
    paddingRight: 8,
  },
  tabsList: {
    paddingVertical: 0,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E4E8",
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 4,
    paddingVertical: 10,
    marginRight: 28,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});
