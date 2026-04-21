import { LearnCard } from "@/components/home/cards";
import {
  AssetGrid,
  AssetHoldingsCard,
  BottomNav,
  CurrencyDropdown,
  Header,
  PortfolioCard,
  SectionHeader,
} from "@/components/portfolio";
import { EmptyState } from "@/components/empty-state";
import { WithdrawIcn } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { STOCKS_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { Currency, FORUM_POSTS } from "@/utils";
import { priceFormatter } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { ArrowRight2 } from "iconsax-react-native";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

export default function PortfolioScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const { data: userStocks } = useRequest(STOCKS_SERVICE.USER_STOCKS, {
    initialValue: [],
    params: { currentPage: 1, perPage: 400 },
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    showError: true,
  });
  const { data: amount } = useRequest(STOCKS_SERVICE.STOCK_UNIT_BALANCE, {
    initialValue: { totalStockBalance: 0, dividend: 0 },
  });

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [currency, setCurrency] = useState<Currency>("NGN");
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const holdings = useMemo(() => {
    const records = Array.isArray(userStocks)
      ? userStocks
      : Array.isArray((userStocks as any)?.data)
        ? (userStocks as any).data
        : [];

    const grouped = new Map<
      string,
      { title: string; amount: number; returnLabel: string; isPositive: boolean }
    >();

    records.forEach((item: any) => {
      const assetClass = String(item?.assetClass || item?.asset_class || "Stocks");
      const title =
        assetClass === "fixed-income"
          ? "Fixed Income"
          : assetClass.charAt(0).toUpperCase() + assetClass.slice(1);
      const currentValue = Number(
        item?.currentValue ||
          item?.portfolioValue ||
          item?.totalValue ||
          Number(item?.currentPrice || 0) * Number(item?.quantity || item?.units || 0),
      );
      const gainPct = Number(item?.percentage || item?.changePercent || 0);
      const current = grouped.get(title) || {
        title,
        amount: 0,
        returnLabel: "0.00%",
        isPositive: true,
      };

      current.amount += currentValue;
      current.returnLabel = `${Math.abs(gainPct).toFixed(2)}%`;
      current.isPositive = gainPct >= 0;
      grouped.set(title, current);
    });

    return Array.from(grouped.values()).filter((item) => item.amount > 0);
  }, [userStocks]);

  const netValue = priceFormatter(amount?.totalStockBalance || 0, 2);
  const dividend = priceFormatter(amount?.dividend || 0, 2);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: C.background }}
      edges={["top"]}
    >
      <Header
        onCurrencyPress={() => setShowCurrencyModal(true)}
        currency={currency}
        onSearchPress={() => router.push("/(tabs)/(portfolio)/search" as any)}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Portfolio Card ── */}
        <PortfolioCard
          netValue={netValue}
          dividend={dividend}
          onPressWithdraw={() => setShowWithdrawModal(true)}
        />

        {/* ── My Holdings button — always visible ── */}
        {/* <TouchableOpacity
          style={[styles.myHoldingsBtn, { backgroundColor: C.inputBg, borderColor: C.border }]}
          onPress={() => router.push("/stock/portfolio/my-holdings" as any)}
          activeOpacity={0.8}
        >
          <ThemedText style={[styles.myHoldingsLabel, { color: C.text }]}>
            My Holdings
          </ThemedText>
          <ArrowRight2 size={18} color={C.primary} />
        </TouchableOpacity> */}

        {/* ── Asset Holdings (only when invested) ── */}
        {/* {data.length > 0 && ( */}
        <>
          <SectionHeader
            title='Asset Holdings'
            actionLabel={holdings.length > 0 ? "All Holdings" : undefined}
            onAction={() =>
              router.push("/(tabs)/(portfolio)/my-holdings" as any)
            }
          />
          {holdings.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.holdingsScroll}
            >
              {holdings.map((holding) => (
                <AssetHoldingsCard
                  key={holding.title}
                  title={holding.title}
                  amount={priceFormatter(holding.amount, 2)}
                  returnLabel={holding.returnLabel}
                  isPositive={holding.isPositive}
                />
              ))}
            </ScrollView>
          ) : (
            <EmptyState style={styles.emptyHoldings}>
              <ThemedText style={{ color: C.muted, textAlign: "center" }}>
                No asset holdings yet.
              </ThemedText>
            </EmptyState>
          )}
        </>
        {/* )} */}

        {/* ── Explore Assets ── */}
        <SectionHeader title='Explore Assets' />
        <AssetGrid />

        {/* ── Brane Forum (only when not invested) ── */}

        <>
          <SectionHeader
            title='Brane Forum'
            actionLabel='See All'
            onAction={() => router.push("/(tabs)/(portfolio)/forum" as any)}
          />
          {FORUM_POSTS.map((post) => (
            <LearnCard
              key={post.id}
              post={post}
              onPress={() =>
                router.push(`/(tabs)/(portfolio)/forum/${post.id}` as any)
              }
            />
          ))}
        </>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* <BottomNav active='portfolio' /> */}

      <Modal
        visible={showWithdrawModal}
        transparent
        animationType='slide'
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <TouchableOpacity
          style={[
            styles.modalOverlay,
            { backgroundColor: "rgba(1, 61, 37, 0.3)" },
          ]}
          activeOpacity={1}
          onPress={() => setShowWithdrawModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.modalContent, { backgroundColor: C.background }]}
            onPress={() => {}}
          >
            <ThemedText style={[styles.modalTitle, { color: C.text }]}>
              Withdraw
            </ThemedText>

            <View
              style={[styles.modalDivider, { borderBottomColor: C.border }]}
            >
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setShowWithdrawModal(false);
                  router.push("/(tabs)/(portfolio)/withdraw" as any);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <WithdrawIcn />
                  <ThemedText style={[styles.optionTitle, { color: C.text }]}>
                    Withdraw to cash wallet
                  </ThemedText>
                </View>
                <ArrowRight2 size={20} color={C.muted} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <CurrencyDropdown
        visible={showCurrencyModal}
        selected={currency}
        onSelect={setCurrency}
        onClose={() => setShowCurrencyModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
  holdingsScroll: { marginBottom: 20 },
  emptyHoldings: { marginBottom: 20, paddingVertical: 16 },
  myHoldingsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  myHoldingsLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 70,
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  modalDivider: {
    borderBottomWidth: 1,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
});
