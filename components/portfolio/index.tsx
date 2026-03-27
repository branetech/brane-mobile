import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePreference } from "@/services/data";
import {
    ASSET_CATEGORIES,
    CURRENCIES,
    Currency,
    FORUM_POSTS,
    ITransactionDetail,
} from "@/utils";
import { pluralize, pluralizeString } from "@/utils/helpers";
import { tickerToNetwork } from "@/utils/hooks";
import { useRouter } from "expo-router";
import { ArrowDown, Eye, EyeSlash, SearchNormal } from "iconsax-react-native";
import { useMemo } from "react";
import {
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { CardStyle } from "../home/cards";
import { IconRender } from "../icon-render";
import { ThemedText } from "../themed-text";

type Scheme = "light" | "dark";

function usePortfolioStyles() {
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const styles = useMemo(() => createStyles(C, scheme), [C, scheme]);
  return { styles, C, scheme };
}

// ── Header ────────────────────────────────────────────────────
export function Header({
  onCurrencyPress,
  currency,
  onSearchPress,
}: {
  onCurrencyPress: () => void;
  currency: Currency;
  onSearchPress?: () => void;
}) {
  const { styles, C } = usePortfolioStyles();
  const selectedCurrency = CURRENCIES.find((cur) => cur.value === currency);

  return (
    <View style={styles.header}>
      <ThemedText style={styles.headerTitle}>Portfolio</ThemedText>
      <View style={styles.headerIcons}>
        {/* <TouchableOpacity
          onPress={onCurrencyPress}
          style={styles.currencyButton}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.currencyFlag}>
            {selectedCurrency?.flag || "🪙"}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSearchPress} activeOpacity={0.7}>
          <SearchNormal color={C.text} size={16} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

// ── PortfolioCard ─────────────────────────────────────────────
export function PortfolioCard({
  netValue,
  dividend,
  onPressWithdraw,
}: {
  netValue: string;
  dividend: string;
  onPressWithdraw: () => void;
}) {
  const { onToggleBalance, showBalance } = usePreference(false);
  const { styles, C, scheme } = usePortfolioStyles();

  return (
    <CardStyle bg={scheme === "dark" ? "#1A2A22" : "#E6FFF5"}>
      <View style={styles.netValueRow}>
        <ThemedText style={styles.netValueLabel}>
          Portfolio Net Value
        </ThemedText>
        <TouchableOpacity onPress={onToggleBalance}>
          {showBalance ? (
            <Eye color={C.text} size={16} />
          ) : (
            <EyeSlash color={C.text} size={16} />
          )}
        </TouchableOpacity>
      </View>
      <ThemedText style={styles.netValueAmount}>
        {showBalance ? netValue : "••••••"}
      </ThemedText>

      <View style={styles.dividendRow}>
        <View>
          <ThemedText style={styles.dividendLabel}>
            Profit Return (Dividend)
          </ThemedText>
          <ThemedText style={styles.dividendAmount}>
            {showBalance ? dividend : "••••••"}
          </ThemedText>
        </View>
        <TouchableOpacity style={styles.withdrawBtn} onPress={onPressWithdraw}>
          <ArrowDown color={C.text} size={12} />
          <ThemedText style={styles.withdrawText}>Withdraw</ThemedText>
        </TouchableOpacity>
      </View>
    </CardStyle>
  );
}

// ── AssetHoldingsCard ─────────────────────────────────────────
export function AssetHoldingsCard({
  title,
  amount,
  returnLabel,
  isPositive,
}: {
  title: string;
  amount: string;
  returnLabel: string;
  isPositive: boolean;
}) {
  const { styles } = usePortfolioStyles();

  return (
    <View style={styles.holdingCard}>
      <ThemedText style={styles.holdingTitle}>{title}</ThemedText>
      <View style={styles.holdingBottom}>
        <View>
          <ThemedText style={styles.holdingAmount}>{amount}</ThemedText>
          <ThemedText
            style={[
              styles.holdingReturn,
              { color: isPositive ? "#2ECC71" : "#E74C3C" },
            ]}
          >
            {isPositive ? "▲" : "▼"} {returnLabel}
          </ThemedText>
        </View>
        <View style={styles.logoStack}>
          <View
            style={[styles.logoCircle, { backgroundColor: "#E74C3C", left: 0 }]}
          />
          <View
            style={[
              styles.logoCircle,
              { backgroundColor: "#F39C12", left: 14 },
            ]}
          />
          <View
            style={[
              styles.logoCircle,
              { backgroundColor: "#3498DB", left: 28 },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

// ── SectionHeader ─────────────────────────────────────────────
export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { styles } = usePortfolioStyles();

  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {actionLabel && (
        <TouchableOpacity onPress={onAction}>
          <ThemedText style={styles.sectionAction}>{actionLabel}</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── AssetGrid ─────────────────────────────────────────────────
export function AssetGrid() {
  const { styles } = usePortfolioStyles();
  const router = useRouter();

  const tabKeyMap: Record<string, string> = {
    stocks: "",
    etf: "etfs",
    gold: "gold",
    reits: "income",
    index: "index",
  };

  const handleCategoryPress = (categoryId: string) => {
    const tabKey = tabKeyMap[categoryId] || "";
    router.push({
      pathname: "/(tabs)/(portfolio)/assets",
      params: { tab: tabKey },
    } as any);
  };

  return (
    <View style={styles.assetGrid}>
      {ASSET_CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.assetCard, { backgroundColor: cat.bg }]}
          onPress={() => handleCategoryPress(cat.id)}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.assetCardTitle}>{cat.label}</ThemedText>
          <ThemedText style={styles.assetCardDesc}>{cat.desc}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── ForumPost ─────────────────────────────────────────────────
export function ForumPost({ post }: { post: (typeof FORUM_POSTS)[number] }) {
  const { styles } = usePortfolioStyles();

  return (
    <View style={styles.forumPost}>
      <View style={styles.forumPostContent}>
        <ThemedText style={styles.forumPostTitle}>{post.title}</ThemedText>
        <ThemedText style={styles.forumPostDesc}>{post.desc}</ThemedText>
        <TouchableOpacity>
          <ThemedText style={styles.forumPostCta}>{post.cta}</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.forumPostImage}>
        <View style={styles.forumImagePlaceholder} />
      </View>
    </View>
  );
}

// ── BottomNav ─────────────────────────────────────────────────
export function BottomNav({ active }: { active: string }) {
  const { styles } = usePortfolioStyles();

  const tabs = [
    { id: "home", label: "Home" },
    { id: "bills", label: "Bills & Utilities" },
    { id: "portfolio", label: "Portfolio" },
    { id: "transactions", label: "Transactions" },
    { id: "account", label: "Account" },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.id} style={styles.navTab}>
          <View
            style={[styles.navIcon, tab.id === active && styles.navIconActive]}
          />
          <ThemedText
            style={[
              styles.navLabel,
              tab.id === active && styles.navLabelActive,
            ]}
          >
            {tab.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── CurrencyDropdown ──────────────────────────────────────────
export function CurrencyDropdown({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: Currency;
  onSelect: (c: Currency) => void;
  onClose: () => void;
}) {
  const { styles } = usePortfolioStyles();

  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.dropdown}>
          {CURRENCIES.map((cur, i) => (
            <TouchableOpacity
              key={cur.value}
              style={[
                styles.dropdownItem,
                cur.value === selected && styles.dropdownItemSelected,
                i < CURRENCIES.length - 1 && styles.dropdownItemBorder,
              ]}
              onPress={() => {
                onSelect(cur.value);
                onClose();
              }}
            >
              <ThemedText
                style={[
                  styles.dropdownItemText,
                  cur.value === selected && styles.dropdownItemTextSelected,
                ]}
              >
                {cur.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

interface FinancialTransactionItemProps extends ITransactionDetail {
  border?: string;
  icon?: string;
}

export const FinancialsTransactionsLineItem = ({
  border,
  id,
  amount,
  tickerSymbol,
  rebateAmount,
  time,
  toTickerSymbol,
  date,
  numOfStocks,
  transactionDescription,
  transactionType,
  icon,
}: FinancialTransactionItemProps) => {
  const descriptions = {
    Airtime: `${pluralize(rebateAmount as number, "unit")} of ${pluralizeString(rebateAmount as number, "brac")}
               earned on ₦${amount} ${tickerToNetwork(tickerSymbol as string)} ${transactionType?.toLowerCase()}`,
    Data: `${pluralize(rebateAmount as number, "unit")} of ${pluralizeString(rebateAmount as number, "brac")} 
            earned on ₦${amount} ${tickerToNetwork(tickerSymbol as string)} ${transactionType?.toLowerCase()}`,
    "Buy Stocks": `${pluralize(numOfStocks as number, "unit")} of ${pluralizeString(numOfStocks as number, "stock")} purchased`,
    "Sell Stocks": `${pluralize(numOfStocks as number, "unit")} of ${pluralizeString(numOfStocks as number, "stock")} sold`,
    "Stock Swap": `${pluralize(rebateAmount as number, "unit")} of ${pluralizeString(rebateAmount as number, "brac")} 
                    earned from ${tickerToNetwork(tickerSymbol as string)} to ${tickerToNetwork(toTickerSymbol as string)} swap`,
  };
  const descriptionText =
    descriptions[transactionType as keyof typeof descriptions];
  const { C, styles } = usePortfolioStyles();

  return (
    !!transactionType && (
      <View
        style={[
          styles.transactionItem,
          border ? { borderWidth: 1, borderColor: border } : null,
        ]}
      >
        <View style={styles.transactionIconWrap}>
          <IconRender id={id} icon={icon} type={transactionType} />
        </View>
        <View style={styles.transactionContent}>
          <ThemedText
            numberOfLines={2}
            style={[styles.transactionTitle, { color: C.text }]}
          >
            {descriptionText || transactionDescription}
          </ThemedText>
          <ThemedText style={[styles.transactionMeta, { color: C.muted }]}>
            {date} at {time}
          </ThemedText>
        </View>
      </View>
    )
  );
};

// ── Styles ────────────────────────────────────────────────────
const { width } = Dimensions.get("window");

const createStyles = (C: (typeof Colors)["light"], scheme: Scheme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: C.text,
      letterSpacing: -0.3,
    },
    headerIcons: { flexDirection: "row", gap: 12, alignItems: "center" },
    currencyButton: {
      flexDirection: "row",
      alignItems: "baseline",
      padding: 4,
      borderWidth: 1,
      borderRadius: 16,
    },
    currencyFlag: { fontSize: 14 },

    portfolioCard: {
      backgroundColor: "#E8F5EF",
      borderRadius: 16,
      padding: 12,
      marginBottom: 20,
      overflow: "hidden",
      position: "relative",
    },
    netValueRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      flex: 1,
    },
    netValueLabel: { fontSize: 12, color: C.muted, fontWeight: "500" },
    netValueAmount: {
      fontSize: 31,
      lineHeight: 30,
      fontWeight: "700",
      color: C.text,
      marginTop: 4,
      marginBottom: 12,
    },
    dividendRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: scheme === "dark" ? "rgba(255,255,255,0.08)" : "#AFFEDE",
      borderRadius: 12,
      padding: 12,
    },
    dividendLabel: { fontSize: 12, color: C.muted },
    dividendAmount: {
      fontSize: 18,
      fontWeight: "700",
      color: C.text,
      marginTop: 2,
    },
    withdrawBtn: {
      flexDirection: "row",
      backgroundColor: C.primary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 30,
      alignItems: "center",
    },
    withdrawArrow: { color: "#fff", fontSize: 13 },
    withdrawText: { color: "#fff", fontWeight: "600", fontSize: 13 },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 12,
    },
    sectionTitle: { fontSize: 17, fontWeight: "700", color: C.text },
    sectionAction: { fontSize: 13, fontWeight: "600", color: C.primary },

    holdingCard: {
      backgroundColor: C.inputBackground,
      borderRadius: 14,
      padding: 14,
      marginRight: 12,
      width: width * 0.45,
      minWidth: 160,
    },
    holdingTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: C.muted,
      marginBottom: 8,
    },
    holdingBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    holdingAmount: { fontSize: 16, fontWeight: "700", color: C.text },
    holdingReturn: { fontSize: 12, fontWeight: "500", marginTop: 2 },
    logoStack: {
      flexDirection: "row",
      position: "relative",
      width: 50,
      height: 24,
    },
    logoCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      position: "absolute",
      borderWidth: 1.5,
      borderColor: C.background,
    },

    assetGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 20,
    },
    assetCard: {
      width: (width - 32 - 10) / 2,
      borderRadius: 14,
      padding: 14,
      minHeight: 90,
      justifyContent: "space-between",
    },
    assetCardTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: C.text,
      marginBottom: 6,
    },
    assetCardDesc: { fontSize: 11, color: C.muted, lineHeight: 15 },

    forumPost: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: C.inputBackground,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
    },
    forumPostContent: { flex: 1, marginRight: 10 },
    forumPostTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: C.text,
      marginBottom: 4,
    },
    forumPostDesc: {
      fontSize: 12,
      color: C.muted,
      lineHeight: 17,
      marginBottom: 8,
    },
    forumPostCta: { fontSize: 12, fontWeight: "700", color: "#C9A84C" },
    forumPostImage: {
      width: 72,
      height: 72,
      borderRadius: 10,
      overflow: "hidden",
    },
    forumImagePlaceholder: {
      flex: 1,
      backgroundColor: "#C9A84C",
      opacity: 0.4,
    },

    bottomNav: {
      flexDirection: "row",
      borderTopWidth: 1,
      borderTopColor: C.border,
      paddingTop: 8,
      paddingBottom: 8,
      backgroundColor: C.background,
    },
    navTab: { flex: 1, alignItems: "center", gap: 3 },
    navIcon: {
      width: 22,
      height: 22,
      borderRadius: 4,
      backgroundColor: C.muted,
    },
    navIconActive: { backgroundColor: C.primary },
    navLabel: { fontSize: 9, color: C.muted, textAlign: "center" },
    navLabelActive: { color: C.primary, fontWeight: "600" },

    modalOverlay: {
      flex: 1,
      backgroundColor:
        scheme === "dark" ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.08)",
      justifyContent: "flex-start",
      alignItems: "flex-end",
      paddingTop: 80,
      paddingRight: 16,
    },
    dropdown: {
      backgroundColor: C.background,
      borderRadius: 14,
      minWidth: 170,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
      overflow: "hidden",
    },
    dropdownItem: { paddingVertical: 14, paddingHorizontal: 18 },
    dropdownItemSelected: {
      backgroundColor: scheme === "dark" ? "#1E2E27" : "#E8F5EF",
    },
    dropdownItemBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
    dropdownItemText: { fontSize: 14, color: C.text, fontWeight: "500" },
    dropdownItemTextSelected: { color: C.primary, fontWeight: "700" },
    transactionItem: {
      flexDirection: "row",
      gap: 12,
      paddingVertical: 18,
      width: "100%",
      alignItems: "flex-start",
    },
    transactionIconWrap: {
      paddingTop: 2,
    },
    transactionContent: {
      flex: 1,
      gap: 4,
    },
    transactionTitle: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "500",
    },
    transactionMeta: {
      fontSize: 10,
    },
  });
