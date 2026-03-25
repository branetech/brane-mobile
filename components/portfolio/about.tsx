import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StockInterface } from "@/utils/constants";
import { priceFormatter } from "@/utils/helpers";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const getTextImage = (text: string, C: any) => {
  const bg = String(C.inputBg || "F7F7F8").replace("#", "");
  const fg = String(C.primary || "013D25").replace("#", "");
  return `https://dummyimage.com/80x80/${bg}/${fg}&text=${encodeURIComponent(text || "ST")}`;
};

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

  const { currentPrice, ticker, percentage } = stock || {};

  const price = priceFormatter((currentPrice || 0) as number, 2);
  const pct = Number(percentage ?? 0);
  const changeNum = Number(ticker);
  const hasNumericChange = !Number.isNaN(changeNum);
  const fallbackChange = (Number(currentPrice || 0) * Math.abs(pct)) / 100 || 0;
  const changeValue = hasNumericChange ? Math.abs(changeNum) : fallbackChange;

  const tickerNum = Number(ticker);
  const tickerIsDown = tickerNum < 0 || String(ticker) === "down";
  const rawLogo = (stock as any)?.logo || (stock as any)?.image || "";
  const logoUri =
    rawLogo && !String(rawLogo).startsWith("/stock")
      ? String(rawLogo)
      : getTextImage(String(tickerSymbol || stock?.tickerSymbol || "ST"), C);

  return (
    <View style={styles.wrapper}>
      {/* ── Price & meta row ── */}
      <View style={styles.priceBlock}>
        <Image
          source={{ uri: logoUri }}
          style={[styles.logo, { backgroundColor: C.inputBg }]}
        />
        <View style={styles.priceLeft}>
          <ThemedText style={[styles.priceText, { color: C.text }]}>
            {price}
          </ThemedText>
          <View style={styles.changeRow}>
            <ThemedText
              style={[
                styles.changeText,
                { color: tickerIsDown ? "#D50000" : C.primary },
              ]}
            >
              {tickerIsDown ? "-" : "+"}
              {priceFormatter(changeValue, 2)}
            </ThemedText>
            <ThemedText
              style={[
                styles.arrowText,
                { color: tickerIsDown ? "#D50000" : C.primary },
              ]}
            >
              {tickerIsDown ? "▼" : "▲"}
            </ThemedText>
            <ThemedText
              style={[
                styles.pctText,
                { color: tickerIsDown ? "#D50000" : C.primary },
              ]}
            >
              {Math.abs(pct).toFixed(2)}%
            </ThemedText>
            <ThemedText style={[styles.dotText, { color: C.muted }]}>
              •
            </ThemedText>
            <ThemedText style={[styles.todayText, { color: C.muted }]}>
              Today
            </ThemedText>
          </View>
        </View>
      </View>
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

  priceBlock: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priceLeft: {
    gap: 6,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "700",
    // lineHeight: 24,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  arrowText: {
    fontSize: 12,
    fontWeight: "700",
  },
  pctText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dotText: {
    fontSize: 12,
    fontWeight: "600",
  },
  todayText: {
    fontSize: 12,
    fontWeight: "500",
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
