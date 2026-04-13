import BaseRequest from "@/services";
import { palette } from "@/constants";
import { STOCKS_SERVICE } from "@/services/routes";
import { details } from "@/utils/constants";
import { priceFormatter } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { ArrowLeft } from "iconsax-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { G, Path } from "react-native-svg";

// ── Pie Chart ────────────────────────────────────────────────────────────────

const PIE_COLORS: Record<string, string> = {
  "Nigerian Equities": "#03A161",
  "FGN Bonds": "#E54B4B",
  Gold: "#C5A022",
};

const PieChart = ({
  items,
}: {
  items: { asset: string; percentage: number }[];
}) => {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;

  let startAngle = -Math.PI / 2;

  const paths = items.map((item, i) => {
    const angle = (item.percentage / 100) * 2 * Math.PI;
    const endAngle = startAngle + angle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    const color = PIE_COLORS[item.asset] || "#ccc";

    startAngle = endAngle;
    return { d, color };
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G>
        {paths.map((p, i) => (
          <Path key={i} d={p.d} fill={p.color} />
        ))}
      </G>
    </Svg>
  );
};

// ── Investment Card ──────────────────────────────────────────────────────────

const CARD_COLORS: Record<string, string> = {
  airtel: "#FDF2F2",
  mtnn: "#FFF9E0",
  mtn: "#FFF9E0",
  glo: "#F4FBF8",
  "9mobile": "#c6def2",
};

const getBgColor = (ticker: string) =>
  CARD_COLORS[ticker.toLowerCase()] ?? "#FDF2F2";

const InvestmentCard = ({
  tickerSymbol,
  bracName,
  units,
  value,
  ytdReturnDisplay,
  bgColor,
}: {
  tickerSymbol: string;
  bracName: string;
  units: number;
  value: number;
  ytdReturnDisplay: string;
  bgColor: string;
}) => {
  const isPositive =
    !ytdReturnDisplay ||
    ytdReturnDisplay.startsWith("▲") ||
    ytdReturnDisplay === "";
  return (
    <View style={[cardStyles.card, { backgroundColor: bgColor }]}>
      <View style={cardStyles.top}>
        <View style={cardStyles.tickerIcon}>
          <Text style={cardStyles.tickerText}>
            {tickerSymbol.toUpperCase().slice(0, 2)}
          </Text>
        </View>
        <View>
          <Text style={cardStyles.ticker}>{tickerSymbol.toUpperCase()}</Text>
          <Text style={cardStyles.name}>{bracName}</Text>
        </View>
      </View>

      <View style={cardStyles.mid}>
        <View>
          <Text style={cardStyles.valueBold}>{units || 0} units</Text>
          <Text style={cardStyles.muted}>Bracs: 0</Text>
        </View>
        <Text style={cardStyles.valueBold}>{priceFormatter(value, 2)}</Text>
      </View>

      <Text
        style={[cardStyles.ytd, { color: isPositive ? "#03A161" : "#E54B4B" }]}
      >
        {isPositive ? "▲" : "▼"}{" "}
        {ytdReturnDisplay.replace("▲", "").replace("▼", "").trim() || "0%"}
      </Text>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    width: 320,
    height: 200,
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
  },
  top: { flexDirection: "row", alignItems: "center", gap: 8 },
  tickerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E7F7EF",
    alignItems: "center",
    justifyContent: "center",
  },
  tickerText: { fontSize: 12, fontWeight: "700", color: palette.brandDeep },
  ticker: { fontSize: 12, fontWeight: "600", color: "#1a1a1a" },
  name: { fontSize: 14, color: palette.gray350 },
  mid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  valueBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  muted: { fontSize: 13, color: palette.gray350 },
  ytd: { fontSize: 12, marginTop: 14 },
});

// ── Stacked Cards Carousel ────────────────────────────────────────────────────

const HORIZONTAL_OFFSET = 57;
const BASE_SCALE = 1;
const SCALE_DECREMENT = 0.05;
const CARD_HEIGHT = 200;

const StackedCards = ({
  cards,
}: {
  cards: {
    tickerSymbol: string;
    bracName: string;
    units: number;
    value: number;
    ytdReturnDisplay: string;
    bgColor: string;
  }[];
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={{ height: 220, width: "100%" }}>
      {cards.map((card, index) => {
        const visualIndex =
          index < activeIndex
            ? index + (cards.length - activeIndex)
            : index - activeIndex;

        const scale = BASE_SCALE - visualIndex * SCALE_DECREMENT;
        const scaleDiff = CARD_HEIGHT * (1 - scale);
        const translateY = visualIndex * 5 - scaleDiff;
        const zIndex = cards.length - visualIndex;

        return (
          <TouchableOpacity
            key={index}
            style={[
              stackStyles.card,
              {
                zIndex,
                transform: [
                  { translateX: visualIndex * HORIZONTAL_OFFSET },
                  { translateY },
                  { scale },
                ],
              },
            ]}
            onPress={() => setActiveIndex(index)}
            activeOpacity={0.9}
          >
            <InvestmentCard {...card} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const stackStyles = StyleSheet.create({
  card: { position: "absolute", top: 0, left: 0 },
});

// ── ShowMore ─────────────────────────────────────────────────────────────────

const ShowMore = ({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) => (
  <TouchableOpacity onPress={onToggle} style={{ marginTop: 6 }}>
    <Text style={{ color: palette.brandDeep, fontSize: 13, fontWeight: "500" }}>
      {show ? "Show less ▲" : "Show more ▼"}
    </Text>
  </TouchableOpacity>
);

// ── Static allocation data ────────────────────────────────────────────────────

const staticAllocationData = [
  { asset: "Nigerian Equities", percentage: 50 },
  { asset: "FGN Bonds", percentage: 30 },
  { asset: "Gold", percentage: 20 },
];

// ── About Managed Portfolio Screen ───────────────────────────────────────────

export default function AboutManagedPortfolioScreen() {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const [investmentData, setInvestmentData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res: any = await BaseRequest.get(STOCKS_SERVICE.ASSET_PICKER);
      const arr = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];
      setInvestmentData(arr);
    } catch {
      // silent — use empty array
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const cards = investmentData.map((d: any) => ({
    tickerSymbol: d.tickerSymbol,
    bracName: d.tickerSymbol,
    units: 0,
    value: 0,
    ytdReturnDisplay: "",
    bgColor: getBgColor(d.tickerSymbol),
  }));

  const renderDetails = () => {
    if (!showMore) {
      const preview = details?.split("\n")[2]?.substring(0, 150) ?? "";
      return <Text style={aboutStyles.bodyText}>{preview}...</Text>;
    }

    return details?.split("\n").map((line, i) => {
      const t = line.trim();
      if (!t) return <View key={i} style={{ height: 8 }} />;

      const isHeader =
        t === "Your Bracs, professionally managed for growth." ||
        t === "What You Get";

      if (isHeader) {
        return (
          <Text key={i} style={aboutStyles.detailHeader}>
            {t}
          </Text>
        );
      }

      if (t.startsWith("•")) {
        const without = t.replace(/^•\s*/, "");
        const parts = without.split(":");
        if (parts.length > 1) {
          return (
            <Text key={i} style={aboutStyles.bulletText}>
              {"• "}
              <Text style={{ fontWeight: "700", color: palette.ink }}>
                {parts[0]}:
              </Text>
              <Text style={{ color: palette.gray350 }}>
                {parts.slice(1).join(":")}
              </Text>
            </Text>
          );
        }
      }

      return (
        <Text key={i} style={aboutStyles.bodyText}>
          {t}
        </Text>
      );
    });
  };

  return (
    <SafeAreaView style={aboutStyles.container}>
      {/* Header */}
      <View style={aboutStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={22} color='#342A3B' />
        </TouchableOpacity>
        <Text style={aboutStyles.headerTitle}>MANAGED WEALTH</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Tabs */}
      <View style={aboutStyles.tabRow}>
        <View style={aboutStyles.activeTab}>
          <Text style={aboutStyles.activeTabText}>About</Text>
        </View>
        <View style={aboutStyles.inactiveTab}>
          <Text style={aboutStyles.inactiveTabText}> </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={aboutStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={aboutStyles.pageTitle}>
          Managed Bracs & Wealth Investment
        </Text>

        {/* Details Section */}
        <View style={aboutStyles.section}>
          {renderDetails()}
          <ShowMore show={showMore} onToggle={() => setShowMore((v) => !v)} />
        </View>

        {/* Top Picks */}
        <View style={aboutStyles.section}>
          <Text style={aboutStyles.sectionLabel}>Top Picks</Text>

          {isLoading ? (
            <ActivityIndicator color='#013D25' size='small' />
          ) : cards.length > 0 ? (
            <StackedCards cards={cards} />
          ) : (
            <View style={aboutStyles.emptyBox}>
              <Text style={aboutStyles.emptyText}>
                No top picks at the moment
              </Text>
            </View>
          )}
        </View>

        {/* Wealth Allocation — matches web: sectionTitle with border-b + chartTitle sub-label */}
        <View style={aboutStyles.section}>
          <Text style={aboutStyles.allocationTitle}>
            Why you should allow pro
          </Text>
          <Text style={aboutStyles.allocationSubTitle}>Wealth Allocation</Text>

          <View style={{ alignItems: "center", marginBottom: 48 }}>
            <PieChart items={staticAllocationData} />
          </View>

          {staticAllocationData.map((item) => (
            <View key={item.asset} style={aboutStyles.legendRow}>
              <View
                style={[
                  aboutStyles.legendDot,
                  { backgroundColor: PIE_COLORS[item.asset] ?? "#ccc" },
                ]}
              />
              <Text style={aboutStyles.legendLabel}>{item.asset}</Text>
              <Text style={aboutStyles.legendPct}>{item.percentage}%</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const aboutStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#342A3B" },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#F0FAF6",
    paddingHorizontal: 20,
  },
  activeTab: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: palette.brandDeep,
    paddingBottom: 8,
    paddingTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveTab: {
    flex: 1,
    paddingBottom: 8,
    paddingTop: 8,
    alignItems: "center",
  },
  activeTabText: { fontSize: 14, fontWeight: "600", color: palette.brandDeep },
  inactiveTabText: { fontSize: 14, color: palette.gray350 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48 },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.ink,
    marginBottom: 20,
  },
  section: { marginBottom: 32 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.gray350,
    marginBottom: 12,
  },
  bodyText: { fontSize: 12, color: palette.gray350, lineHeight: 18, marginBottom: 8 },
  detailHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.ink,
    marginTop: 16,
    marginBottom: 6,
  },
  bulletText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
    paddingLeft: 4,
  },
  emptyBox: {
    paddingVertical: 32,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#F0FAF6",
    borderRadius: 12,
    alignItems: "center",
  },
  emptyText: { fontSize: 13, color: palette.gray350, fontStyle: "italic" },
  allocationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.surface100,
    marginBottom: 16,
  },
  allocationSubTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.gray350,
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  legendLabel: { flex: 1, fontSize: 13, color: "#1a1a1a" },
  legendPct: { fontSize: 13, color: "#1a1a1a", fontWeight: "500" },
});
