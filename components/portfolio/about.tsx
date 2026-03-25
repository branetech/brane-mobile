import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { STOCKS_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { StockInterface } from "@/utils/constants";
import {
    collection,
    formatTimestampToHumanReadable,
    priceFormatter,
} from "@/utils/helpers";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Path, Polyline } from "react-native-svg";

// ── Sparkline chart ───────────────────────────────────────────────────────────
const CHART_H = 120;
const CHART_W = Dimensions.get("window").width - 32;

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = CHART_W / (values.length - 1);

  const pts = values
    .map((v, i) => {
      const x = i * step;
      const y = CHART_H - ((v - min) / range) * (CHART_H - 16) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  // filled area path
  const first = `0,${CHART_H}`;
  const last = `${CHART_W},${CHART_H}`;
  const areaPath = `M ${first} L ${pts
    .split(" ")
    .map((p) => `L ${p}`)
    .join(" ")} L ${last} Z`;

  return (
    <Svg width={CHART_W} height={CHART_H}>
      <Path d={areaPath} fill={color + "20"} />
      <Polyline points={pts} fill='none' stroke={color} strokeWidth={2} />
    </Svg>
  );
}

// ── Stat row ─────────────────────────────────────────────────────────────────
function StatRow({
  label,
  value,
  C,
}: {
  label: string;
  value?: string | number | null;
  C: any;
}) {
  return (
    <View style={styles.statRow}>
      <ThemedText style={[styles.statLabel, { color: C.muted }]}>
        {label}
      </ThemedText>
      <ThemedText style={[styles.statValue, { color: C.text }]}>
        {value ?? "—"}
      </ThemedText>
    </View>
  );
}

// ── Asset class badge ─────────────────────────────────────────────────────────
const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  stocks: { bg: "#E6FFF5", text: "#013D25" },
  etfs: { bg: "#EDE9FE", text: "#5B21B6" },
  gold: { bg: "#FFF9E0", text: "#92400E" },
  indexes: { bg: "#EFF6FF", text: "#1D4ED8" },
  "fixed-income": { bg: "#FEE2E2", text: "#B91C1C" },
};

// ── StockView ─────────────────────────────────────────────────────────────────
function StockView({ s, C }: { s: StockInterface; C: any }) {
  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
        Stock Details
      </ThemedText>
      <View
        style={[
          styles.card,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
      >
        <StatRow label='CEO' value={s.companyCeo} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Sector' value={s.sector || s.marketSector} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Sub-sector' value={s.subSector} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Risk Level' value={s.riskLevel} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Day Range' value={s.dayRange} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='52-Wk Range' value={s.yearRange} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Opening Price' value={s.openingPrice} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Market Cap' value={s.marketCap} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='P/E Ratio' value={s.PERatio} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='EPS' value={s.EPS} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Dividend Yield' value={s.dividendYield} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Volume' value={s.vol} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Avg Volume' value={s.avgVol} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Shares Outstanding' value={s.sharesOutstanding} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Date Listed' value={s.dateListed} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow
          label='Date of Incorporation'
          value={s.dateOfIncorporation}
          C={C}
        />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='ISIN' value={s.isin} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Custodian' value={s.custodian} C={C} />
      </View>
    </View>
  );
}

// ── GoldView ──────────────────────────────────────────────────────────────────
function GoldView({ s, C }: { s: StockInterface; C: any }) {
  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
        Gold Details
      </ThemedText>
      <View
        style={[
          styles.card,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
      >
        <StatRow label='Asset Manager' value={s.assetManager} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Custodian' value={s.custodian} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Fund Sponsor' value={s.fundSponsor} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Trustee' value={s.trustee} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Day Range' value={s.dayRange} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='52-Wk Range' value={s.yearRange} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Market Cap' value={s.marketCap} C={C} />
      </View>
    </View>
  );
}

// ── IndexView ─────────────────────────────────────────────────────────────────
function IndexView({ s, C }: { s: StockInterface; C: any }) {
  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
        Index Details
      </ThemedText>
      <View
        style={[
          styles.card,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
      >
        <StatRow label='Index Tracked' value={s.indexTracked} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Asset Manager' value={s.assetManager} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Custodian' value={s.custodian} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow
          label='Market Classification'
          value={s.marketClassification}
          C={C}
        />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Day Range' value={s.dayRange} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='52-Wk Range' value={s.yearRange} C={C} />
      </View>
    </View>
  );
}

// ── EtfView ───────────────────────────────────────────────────────────────────
function EtfView({ s, C }: { s: StockInterface; C: any }) {
  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
        ETF Details
      </ThemedText>
      <View
        style={[
          styles.card,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
      >
        <StatRow label='Asset Manager' value={s.assetManager} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Trustee' value={s.trustee} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Custodian' value={s.custodian} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Liquidity' value={s.liquidityPower} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Day Range' value={s.dayRange} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Market Cap' value={s.marketCap} C={C} />
      </View>
    </View>
  );
}

// ── IncomeView ────────────────────────────────────────────────────────────────
function IncomeView({ s, C }: { s: StockInterface; C: any }) {
  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
        Fixed Income Details
      </ThemedText>
      <View
        style={[
          styles.card,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
      >
        <StatRow label='Annual Return' value={s.annualReturn} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Tenures' value={s.tenures} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Asset Manager' value={s.assetManager} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Trustee' value={s.trustee} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Custodian' value={s.custodian} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Fund Sponsor' value={s.fundSponsor} C={C} />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        <StatRow label='Liquidity Power' value={s.liquidityPower} C={C} />
      </View>
    </View>
  );
}

// ── Main About component ──────────────────────────────────────────────────────
const About = ({ stock }: { stock: StockInterface }) => {
  const { assetClass, tickerSymbol } = stock || {};
  const rawScheme = useColorScheme();
  const scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const type = assetClass || "";
  const isStock = type === "stocks";
  const isEtf = type === "etfs";
  const isGold = type === "gold";
  const isIndex = type === "indexes";
  const isFixedIncome = type === "fixed-income";
  const showChart = !isFixedIncome && !isEtf;

  const { data: historyData } = useRequest(
    STOCKS_SERVICE.HISTORY(tickerSymbol || ""),
    { revalidateOnFocus: false },
  );

  const values = useMemo(() => {
    const trends = collection(historyData);
    return trends
      .map(([_, v]: any) => Number(v))
      .filter((n: number) => !isNaN(n));
  }, [historyData]);

  const { currentPrice, ticker, percentage, timeOfCurrentPrice } = stock || {};

  const price = priceFormatter((currentPrice || 0) as number, 2);
  const pct = Number(percentage ?? 0);
  const isPositive = pct >= 0;

  const chartColor = useMemo(() => {
    if (type === "gold") return "#D97706";
    if (type === "indexes") return "#1D4ED8";
    if (type === "etfs") return "#5B21B6";
    return isPositive ? C.primary : "#D50000";
  }, [type, isPositive, C.primary]);

  const badge = BADGE_COLORS[type] || BADGE_COLORS["stocks"];
  const timeLabel = timeOfCurrentPrice
    ? formatTimestampToHumanReadable(timeOfCurrentPrice as any)
    : null;

  const tickerNum = Number(ticker);
  const tickerIsDown = tickerNum < 0 || String(ticker) === "down";

  return (
    <View style={styles.wrapper}>
      {/* ── Price & meta row ── */}
      <View style={styles.metaRow}>
        <View style={styles.priceBlock}>
          <ThemedText style={[styles.priceText, { color: C.text }]}>
            {price}
          </ThemedText>
          <ThemedText
            style={[
              styles.pctText,
              { color: tickerIsDown ? "#D50000" : C.primary },
            ]}
          >
            {isPositive ? "+" : ""}
            {pct.toFixed(2)}%
          </ThemedText>
        </View>

        <View style={styles.rightMeta}>
          {!!type && (
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <ThemedText style={[styles.badgeText, { color: badge.text }]}>
                {type.toUpperCase()}
              </ThemedText>
            </View>
          )}
          {!!timeLabel && (
            <ThemedText style={[styles.timeLabel, { color: C.muted }]}>
              {timeLabel}
            </ThemedText>
          )}
        </View>
      </View>

      {/* ── Sparkline chart ── */}
      {/* {showChart && values.length > 1 && (
        <View style={[styles.chartWrap, { borderColor: C.border }]}>
          <Sparkline values={values} color={chartColor} />
        </View>
      )} */}

      {/* ── Description ── */}
      {!!stock?.description && (
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
            About
          </ThemedText>
          <ThemedText style={[styles.description, { color: C.muted }]}>
            {stock.description}
          </ThemedText>
        </View>
      )}

      {/* ── Asset-specific details ── */}
      {isStock && <StockView s={stock} C={C} />}
      {isIndex && <IndexView s={stock} C={C} />}
      {isGold && <GoldView s={stock} C={C} />}
      {isFixedIncome && <IncomeView s={stock} C={C} />}
      {isEtf && <EtfView s={stock} C={C} />}
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  wrapper: {
    gap: 20,
    paddingBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  priceBlock: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  priceText: {
    fontSize: 26,
    fontWeight: "700",
  },
  pctText: {
    fontSize: 14,
    fontWeight: "600",
  },
  rightMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  timeLabel: {
    fontSize: 11,
  },
  chartWrap: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    paddingVertical: 8,
    alignItems: "center",
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  description: {
    fontSize: 13,
    lineHeight: 21,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  statLabel: {
    fontSize: 13,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "500",
    maxWidth: "55%",
    textAlign: "right",
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
  },
});
