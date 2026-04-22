import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { textToImage } from "@/services/useRequest";
import { FORUM_POSTS, ITransactionDetail } from "@/utils";
import { formatNumberToDecimal, priceFormatter } from "@/utils/helpers";
import { Image, View } from "@idimma/rn-widget";
import {
  ArrowDown3,
  ArrowRight2,
  ArrowUp3,
  ShoppingCart,
} from "iconsax-react-native";
import React from "react";
import {
  ImageBackground,
  View as RNV,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { IconRender } from "../icon-render";

export const CardStyle = ({ children, bg }: any) => {
  return (
    <View w="100%" h={"auto"} radius={16} bg={bg || "#013D25"}>
      <ImageBackground
        source={require("@/assets/images/bg.png")}
        style={{ flex: 1, width: "100%", height: 170, overflow: "hidden" }}
        resizeMode="cover"
      >
        <View p={18} flex={1}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
};

type ForumPost = (typeof FORUM_POSTS)[number];

type LearnCardProps = {
  title?: string;
  description?: string;
  post?: ForumPost;
  cta?: string;
  onPress?: () => void;
};

export const LearnCard = ({
  title,
  description,
  post,
  cta,
  onPress,
}: LearnCardProps) => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];

  const resolvedTitle = post?.title ?? title ?? "";
  const resolvedDescription = post?.desc ?? description ?? "";
  const resolvedCta = post?.cta ?? cta ?? "Start Learning";

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={!onPress}>
      <View
        w="100%"
        h={120}
        p={16}
        radius={12}
        bg={C.inputBackground}
        flex={1}
        style={{
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
          elevation: 3,
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <View w="72%">
          <ThemedText
            type="defaultSemiBold"
            style={{ fontSize: 13, lineHeight: 20, marginBottom: 8 }}
          >
            {resolvedTitle}
          </ThemedText>
          <ThemedText
            numberOfLines={2}
            style={{ fontSize: 12, lineHeight: 16, color: C.muted }}
          >
            {resolvedDescription}
          </ThemedText>

          <View row style={{ alignItems: "center", gap: 6, marginTop: 14 }}>
            <ThemedText
              type="defaultSemiBold"
              style={{ fontSize: 10, color: "#A28C34" }}
            >
              {resolvedCta.replace("→", "").trim()}
            </ThemedText>
            <ArrowRight2 size={16} color={C.primary} />
          </View>
        </View>
        <Image
          source={require("@/assets/images/learn.png")}
          style={{
            position: "absolute",
            right: -8,
            bottom: -40,
            width: 132,
            // height: 176,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

interface UnifiedCardProps {
  variant?: "full" | "compact";
  onPress?: () => void;
  icon: React.ReactNode;
  title: string;
  iconBg?: string;
  bg?: string;
  hide?: boolean;
  height?: number;
  border?: string;
  style?: object;
}

export const ServicesCard = ({
  variant = "full",
  onPress,
  icon,
  title,
  iconBg = "",
  bg = "",
  hide = false,
  height,
  border,
  style = {},
}: UnifiedCardProps) => {
  if (hide) return null;

  if (variant === "compact") {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.compactContainer, style]}
      >
        <RNV
          style={[
            styles.compactIconWrapper,
            {
              backgroundColor: bg || "transparent",
              height: height ?? 56,
              borderColor: border,
              borderWidth: border ? 1 : 0,
            },
          ]}
        >
          {icon}
        </RNV>
        <ThemedText style={styles.title}>{title}</ThemedText>
      </TouchableOpacity>
    );
  }

  // Full variant (default)
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.fullContainer,
        {
          backgroundColor: bg || "transparent",
          height,
          borderColor: border,
          borderWidth: border ? 1 : 0,
        },
        style,
      ]}
    >
      <RNV
        style={[
          styles.iconWrapper,
          { backgroundColor: iconBg || "transparent" },
        ]}
      >
        {icon}
      </RNV>
      <ThemedText style={styles.title}>{title}</ThemedText>
    </TouchableOpacity>
  );
};
// adjust path as needed

// ─── Types ───────────────────────────────────────────────────
export type ETransactionDetails = {
  id: string;
  amount: number;
  rebateAmount?: number;
  time: string;
  date: string;
  transactionDescription: string;
  transactionType: string;
  icon?: string;
  // RN-style border props (replaces web `border` string)
  borderColor?: string;
  borderRadius?: number;
};

// ─── Helpers ─────────────────────────────────────────────────
function pluralize(value: number, unit: string) {
  const fixed = Number(value ?? 0).toFixed(2);
  return `${fixed} ${unit}${Number(fixed) !== 1 ? "s" : ""}`;
}

function isSwap(type: string) {
  return (type ?? "").toLowerCase().includes("swap");
}

// ─── Component ───────────────────────────────────────────────
export const TransactionLineItem2 = ({
  id,
  amount,
  rebateAmount,
  time,
  date,
  transactionDescription,
  transactionType,
  icon,
  borderColor = "#f7f7f8",
  borderRadius = 8,
}: ETransactionDetails) => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const isDark = scheme === "dark";

  const amountLabel = isSwap(transactionType)
    ? pluralize(rebateAmount ?? 0, "Brac")
    : priceFormatter(amount);

  // Enhanced shadow and theme-aware border
  const enhancedBorderColor = isDark ? "#2A2B2D" : borderColor;
  const shadowColor = isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(12, 12, 13, 0.15)";

  return (
    <RNV
      style={{
        shadowColor,
        backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
        borderRadius,
        marginBottom: 5,
      }}
    >
      <RNV
        style={[
          styles.row,
          {
            borderWidth: 2,
            borderColor: enhancedBorderColor,
            borderRadius,
          },
        ]}
      >
        {/* Left: icon + description */}
        <RNV style={styles.left}>
          <IconRender id={id} icon={icon} type={transactionType} />
          <RNV style={styles.textCol}>
            <ThemedText
              style={[styles.description, { color: C.text }]}
              numberOfLines={1}
            >
              {transactionDescription}
            </ThemedText>
            <ThemedText style={[styles.datetime, { color: C.muted }]}>
              {date} at {time}
            </ThemedText>
          </RNV>
        </RNV>

        {/* Right: amount */}
        <ThemedText style={[styles.amount, { color: C.text }]}>
          {amountLabel}
        </ThemedText>
      </RNV>
    </RNV>
  );
};

export const Ticker = ({ ticker }: any) => {
  if ([-1, "down"].includes(ticker)) {
    return (
      <RNV style={[styles.tickerPill, { backgroundColor: "#FCEDED" }]}>
        <ArrowDown3 size={12} color="#CB010B" variant="Bold" />
      </RNV>
    );
  }

  if ([1, "up"].includes(ticker)) {
    return (
      <RNV style={[styles.tickerPill, { backgroundColor: "#E9F7F0" }]}>
        <ArrowUp3 size={12} color="#008753" variant="Bold" />
      </RNV>
    );
  }

  return (
    <RNV style={[styles.tickerPill, { backgroundColor: "#F0EFF2" }]}>
      <ThemedText style={styles.tickerFlat}>-</ThemedText>
    </RNV>
  );
};

interface CardProps {
  bgColor?: string;
  stockName?: string;
  logo?: string;
  tickerSymbol?: string;
  companyName?: string;
  units?: number;
  bracs?: number;
  amount?: any;
  ticker?: any;
  currentPrice?: number;
  priceChange?: number;
  priceChangeColor?: string;
  percentage?: number;
  icon?: React.ReactNode;
  onClick?: () => void;
  onAddToCart?: () => void;
  isInCart?: boolean;
  width?: string;
  minWidth?: string;
  hidePriceInfo?: boolean;
  variant?: "stacked" | "list";
  showCartIcon?: boolean;
  breakdown?: any; // pass breakdown data from parent
}

export const StockItemCard: React.FC<CardProps> = (asset) => {
  const {
    stockName,
    companyName,
    currentPrice,
    ticker,
    minWidth,
    tickerSymbol,
    onClick,
    onAddToCart,
    isInCart,
    logo,
    percentage,
    variant = "stacked",
    showCartIcon = true,
    // breakdown, // now passed as prop
  } = asset;
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const getCardBgColor = () => {
    const key =
      `${tickerSymbol || ""} ${stockName || ""} ${logo || ""}`.toLowerCase();

    if (key.includes("mtn")) return "#FFF9E090";
    if (key.includes("airtel")) return "#FDF2F290";
    if (key.includes("glo")) return "#F4FBF890";
    if (key.includes("9mobile") || key.includes("etisalat")) return "#EAF3FB90";
    if (key.includes("gold")) return "#FFF6DE90";
    return C.inputBackground;
  };

  const bgColor = getCardBgColor();
  const chart = [-1, "down"].includes(ticker)
    ? "red"
    : [1, "up"].includes(ticker)
      ? "green"
      : "gray";
  const chartSource =
    chart === "red"
      ? require("@/assets/icons/charts/red.png")
      : chart === "green"
        ? require("@/assets/icons/charts/green.png")
        : require("@/assets/icons/charts/gray.png");
  const priceChangeColor = [-1, "down"].includes(ticker)
    ? "#CB010B"
    : [1, "up"].includes(ticker)
      ? "#008753"
      : "#008753";

  // const bracs = breakdown?.bracsBalance; // not used
  const cardWidth =
    typeof minWidth === "string" && minWidth.endsWith("px")
      ? Number(minWidth.replace("px", ""))
      : undefined;
  const getLogo = () => {
    if (!logo || logo === "" || logo.startsWith("/stock"))
      return textToImage(tickerSymbol as string);
    return logo;
  };

  if (variant === "list") {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClick}
        style={[
          styles.stockListCard,
          {
            backgroundColor: C.background,
            borderColor: C.border,
            shadowColor: "#000000",
          },
        ]}
      >
        <RNV style={styles.stockListContent}>
          <RNV style={styles.stockListLeft}>
            <RNV style={styles.stockListLogoWrap}>
              <Image source={{ uri: getLogo() }} style={styles.stockListLogo} />
            </RNV>
            <RNV style={styles.stockListTextWrap}>
              <ThemedText style={[styles.stockListTitle, { color: C.text }]}>
                {stockName || tickerSymbol}
              </ThemedText>
              <ThemedText
                numberOfLines={1}
                style={[
                  styles.stockListSubtitle,
                  { color: C.muted, width: "70%" },
                ]}
                ellipsizeMode="tail"
              >
                {companyName}
              </ThemedText>
            </RNV>
          </RNV>

          <RNV style={styles.stockListRight}>
            <ThemedText style={[styles.stockListPrice, { color: C.text }]}>
              {`${priceFormatter(currentPrice, 0)}`}
            </ThemedText>
            <View row align="center" gap={4}>
              <Ticker ticker={ticker} />
              <ThemedText style={{ color: priceChangeColor, fontSize: 10 }}>
                {`${formatNumberToDecimal(percentage ?? 0)}%`}
              </ThemedText>
            </View>
          </RNV>

          {showCartIcon && (
            <RNV
              style={[styles.stockListDivider, { backgroundColor: C.border }]}
            />
          )}

          {showCartIcon && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onAddToCart}
              style={styles.stockCartButton}
            >
              <ShoppingCart
                size={22}
                color={C.primary}
                variant={isInCart ? "Bold" : "Linear"}
              />
            </TouchableOpacity>
          )}
        </RNV>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onClick}
      style={[
        styles.stockCard,
        {
          backgroundColor: bgColor,
          width: cardWidth ?? 200,
          borderColor: C.border,
        },
      ]}
    >
      <RNV style={styles.stockCardHeader}>
        <RNV style={styles.stockLogoWrap}>
          <Image source={{ uri: getLogo() }} style={styles.stockLogo} />
        </RNV>
        <RNV style={styles.stockHeaderText}>
          <ThemedText style={[styles.stockName, { color: C.text }]}>
            {stockName || tickerSymbol}
          </ThemedText>
          <ThemedText
            numberOfLines={1}
            style={[styles.stockCompany, { color: C.muted }]}
          >
            {companyName}
          </ThemedText>
        </RNV>
      </RNV>

      <View row align="center" spaced mt={24}>
        <View gap={4}>
          <ThemedText style={[styles.stockPrice, { color: priceChangeColor }]}>
            {priceFormatter(currentPrice, 2)}
          </ThemedText>
          <Ticker ticker={ticker} />
        </View>
        <View>
          <Image
            source={chartSource}
            style={styles.stockChartImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface PointEarnedCardProps extends ITransactionDetail {
  border?: string;
  borderRadius?: string;
  data?: any;
  icon?: any;
  logo?: any;
  width?: string;
  onClick?: any;
  title?: any;
  price?: any;
  date?: string;
}
export const PointEarnedCard = ({
  title,
  date,
  price,
  id,
  border,
  data,
  icon,
  transactionType,
  logo,
}: PointEarnedCardProps) => {
  return (
    <div
      className="py-[16px] px-[10px] rounded-xl flex flex-col relative items-start gap-5 h-[130px] w-full"
      style={{ border: border }}
    >
      <div className="flex flex-row gap-[14px]">
        <IconRender icon={icon} id={id} />
      </div>
      <div className={"text-start"}>
        <p className="text-xs w-full overflow-hidden ...">{title}</p>
        <h1 className="text-xl ">{price}</h1>
      </div>

      <div className="absolute top-0 right-0 bottom-0 centered p-[10px]" />
    </div>
  );
};

const styles = StyleSheet.create({
  compactContainer: {
    flex: 1,
    gap: 8,
    alignItems: "center",
    width: 80,
    justifyContent: "center",
    paddingVertical: 12,
    maxWidth: "100%",
    borderColor: "#E1FFF3",
    borderWidth: 1,
  },
  compactIconWrapper: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    borderRadius: 8,
  },
  fullContainer: {
    flex: 1,
    gap: 8,
    alignItems: "center",
    width: 93.5,
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: "100%",
    borderColor: "#E1FFF3",
    borderWidth: 1,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 12,
    gap: 16,
    width: "100%",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  textCol: {
    flex: 1,
    gap: 3,
  },
  description: {
    fontSize: 13,
    fontWeight: "500",
    maxWidth: 150,
  },
  datetime: {
    fontSize: 10,
  },
  amount: {
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 0,
  },
  stockCard: {
    height: 150,
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    justifyContent: "space-between",
    borderWidth: 1,
  },
  stockCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stockLogoWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  stockLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  stockHeaderText: {
    flex: 1,
    gap: 2,
  },
  stockName: {
    fontSize: 12,
    fontWeight: "600",
  },
  stockCompany: {
    fontSize: 12,
  },
  stockChartPlaceholder: {
    height: 72,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  stockChartImage: {
    width: 80,
    height: 60,
  },
  stockMeta: {
    gap: 4,
  },
  stockMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stockPrice: {
    fontSize: 12,
    fontWeight: "500",
  },
  stockTrendText: {
    fontSize: 12,
    fontWeight: "500",
  },
  tickerPill: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  tickerFlat: {
    fontSize: 12,
    lineHeight: 12,
    color: "#85808A",
    marginTop: -1,
  },
  stockUnits: {
    fontSize: 14,
    fontWeight: "600",
  },
  stockBracs: {
    fontSize: 11,
  },
  stockListCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    height: 70,
  },
  stockListContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockListLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  stockListLogoWrap: {
    width: 32,
    height: 32,
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#FFCB05",
    marginRight: 14,
  },
  stockListLogo: {
    width: 32,
    height: 32,
    borderRadius: 28,
  },
  stockListTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  stockListTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 14,
    marginBottom: 4,
  },
  stockListSubtitle: {
    fontSize: 10,
  },
  stockListRight: {
    alignItems: "flex-end",
    // marginLeft: 12,
  },
  stockListPrice: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 14,
    marginBottom: 4,
  },
  stockListBracs: {
    fontSize: 10,
    color: "#404040",
  },
  stockListDivider: {
    width: 1,
    height: 44,
    marginHorizontal: 16,
  },
  stockCartButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
