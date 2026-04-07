import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import About from "@/components/portfolio/about";
import { useTabNavigator } from "@/components/tabs";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { onAddToCheckouts } from "@/redux/slice/auth-slice";
import { useAppState } from "@/redux/store";
import { STOCKS_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { StockInterface } from "@/utils/constants";
import { View as RView } from "@idimma/rn-widget";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ShoppingCart } from "iconsax-react-native";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

type Scheme = "light" | "dark";

const TAB_CONFIG = [
  { label: "About", key: "about" },
  { label: "Financials", key: "financials" },
];

export default function CompanyDetailScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const { details } = useLocalSearchParams<{ details: string }>();
  const tickerSymbol = String(details || "");
  const { activeTab, onTabChange } = useTabNavigator("about");
  const { checkouts } = useAppState();

  const { data: stock, isLoading } = useRequest(
    STOCKS_SERVICE.DETAILS(tickerSymbol),
    {
      initialValue: { tickerSymbol } as StockInterface,
      showError: true,
    },
  );

  const s: StockInterface = stock || ({ tickerSymbol } as StockInterface);
  const inCart = Array.isArray(checkouts)
    ? checkouts.some((item: any) => item?.tickerSymbol === tickerSymbol)
    : false;

  const handleCheckout = () => {
    dispatch(onAddToCheckouts(s));
    router.push("/(tabs)/(portfolio)/checkout" as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <Back
          onPress={() => {
            if (router.canGoBack?.()) {
              router.back();
            } else {
              router.replace("/(tabs)");
            }
          }}
        />
        <RView>
          <ThemedText style={[styles.headerTitle, { color: C.text }]}>
            {s.tickerSymbol || tickerSymbol}
          </ThemedText>
          <View style={{ flex: 1, alignItems: "center" }}>
            <ThemedText
              style={[
                {
                  color: C.muted,
                  fontSize: 11,
                  textAlign: "center",
                  width: "70%",
                },
              ]}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {s.companyName || tickerSymbol}
            </ThemedText>
          </View>
        </RView>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/(portfolio)/checkout" as any)}
          style={styles.cartButton}
          activeOpacity={0.7}
        >
          <ShoppingCart size={22} color={C.text} />
          {inCart && (
            <View style={[styles.cartDot, { backgroundColor: C.primary }]} />
          )}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size='small' color={C.primary} />
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <About stock={s} />

            {/* <ThemedTabNavigator
              tabs={TAB_CONFIG}
              activeTabKey={activeTab}
              onTabChange={onTabChange}
              tabRowStyle={{
                marginHorizontal: 16,
                justifyContent: "center",
                gap: 80,
              }}
            >
              <View style={styles.contentWrap}>
                {activeTab === "about" && <About stock={s} />}
                {activeTab === "financials" && <Financials data={s} />}
              </View>
            </ThemedTabNavigator> */}

            <View style={styles.bottomSpacer} />
          </ScrollView>

          <View
            style={[
              styles.actionBar,
              { backgroundColor: C.background, borderTopColor: C.border },
            ]}
          >
            <BraneButton
              text={inCart ? "Go to Checkout" : "Add to Cart"}
              onPress={handleCheckout}
              backgroundColor={C.primary}
              textColor='#D2F1E4'
              height={52}
              radius={12}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
  cartButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  cartDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  logoFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  logoFallbackText: {
    fontSize: 18,
    fontWeight: "700",
  },
  heroTextWrap: {
    flex: 1,
    gap: 3,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "600",
  },
  companyMeta: {
    fontSize: 13,
  },
  contentWrap: {
    gap: 20,
    paddingHorizontal: 16,
    width: "100%",
    flex: 1,
    justifyContent: "center",
  },
  bottomSpacer: {
    height: 100,
  },
  actionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
});
