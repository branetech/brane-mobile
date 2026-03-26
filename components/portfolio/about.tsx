import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { STOCKS_SERVICE } from "@/services/routes";
import { textToImage, useRequest } from "@/services/useRequest";
import { StockInterface } from "@/utils/constants";
import { collection, priceFormatter } from "@/utils/helpers";
import moment from "moment";
import { useMemo } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ChartComponent from "./chart";
import {
  EtfView,
  GoldView,
  IncomeView,
  IndexView,
  StockView,
} from "./stock-view";

const colorGradients = {
  green: { from: "#2f855a", to: "#D2F1E4" },
  gold: { from: "#E7B34B", to: "#E7B34B00" },
  red: { from: "#e63434", to: "#E7B34B00" },
  purple: { from: "#A66CD2", to: "#A66CD200" },
  blue: { from: "#5CB3FF", to: "#0088FF00" },
};

type Props = { stock: StockInterface };

const About = ({ stock }: Props) => {
  const { assetClass, logo, tickerSymbol } = stock || {};
  const rawScheme = useColorScheme();
  const scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const isStock = assetClass === "stocks";
  const isEtf = assetClass === "etfs";
  const isGold = assetClass === "gold";
  const isIndex = assetClass === "indexes";
  const isFixedIncome = assetClass === "fixed-income";

  const { data } = useRequest(STOCKS_SERVICE.HISTORY(tickerSymbol || ""));

  const getLogo = () => {
    if (!logo || logo === "" || logo.startsWith("/stock"))
      return textToImage(tickerSymbol as string); // make sure this returns a URI string
    return logo;
  };

  const trends = collection(data);

  const [dates, values] = useMemo(() => {
    return [
      trends.map(([d]: any) => moment(d).format("Do MMM")),
      trends.map(([_, d]: any) => Number(d)),
    ];
  }, [trends]);

  const { currentPrice, ticker, percentage } = stock || {};

  const assetColor = useMemo(() => {
    if (assetClass === "stocks") return "green";
    if (assetClass === "etfs") return "purple";
    if (assetClass === "gold") return "gold";
    if (assetClass === "indexes") return "blue";
    if (assetClass === "fixed-income") return "red";
    return "blue";
  }, [assetClass]) as keyof typeof colorGradients;

  const price = priceFormatter((currentPrice || 0) as number, 2);
  const lineColor = colorGradients[assetColor]?.from || "#2f855a";
  const showChart = !isFixedIncome && !isEtf;
  const pct = Number(percentage ?? 0);
  const tickerNum = Number(ticker);
  const tickerIsDown = tickerNum < 0 || String(ticker) === "down";
  const hasNumericChange = !Number.isNaN(tickerNum);
  const fallbackChange = (Number(currentPrice || 0) * Math.abs(pct)) / 100 || 0;
  const changeValue = hasNumericChange ? Math.abs(tickerNum) : fallbackChange;

  return (
    <ScrollView
      style={{ backgroundColor: C.background }}
      contentContainerStyle={styles.container}
    >
      {/* Header row — previous design */}
      <View style={styles.headerRow}>
        <Image
          source={{ uri: getLogo() }}
          style={[styles.logo, { backgroundColor: C.inputBg }]}
          resizeMode='contain'
        />
        <View style={styles.headerInfo}>
          <Text style={[styles.priceText, { color: C.text }]}>{price}</Text>

          <View style={styles.changeRow}>
            <Text
              style={[
                styles.changeText,
                { color: tickerIsDown ? "#D50000" : lineColor },
              ]}
            >
              {tickerIsDown ? "-" : "+"}
              {priceFormatter(changeValue, 2)}
            </Text>
            <Text
              style={[
                styles.arrowText,
                { color: tickerIsDown ? "#D50000" : lineColor },
              ]}
            >
              {tickerIsDown ? "▼" : "▲"}
            </Text>
            <Text
              style={[
                styles.pctText,
                { color: tickerIsDown ? "#D50000" : lineColor },
              ]}
            >
              {Math.abs(pct).toFixed(2)}%
            </Text>
            <Text style={[styles.dotText, { color: C.muted }]}>•</Text>
            <Text style={[styles.todayText, { color: C.muted }]}>Today</Text>
          </View>
        </View>
      </View>

      {/* Chart */}
      {showChart && (
        <View style={styles.chartContainer}>
          <ChartComponent
            colorType={assetColor}
            dates={dates}
            values={values}
          />
        </View>
      )}

      {/* Asset-specific views */}
      {isStock && <StockView stock={stock} price={price} />}
      {isIndex && <IndexView stock={stock} price={price} />}
      {isGold && <GoldView stock={stock} price={price} />}
      {isFixedIncome && <IncomeView stock={stock} price={price} />}
      {isEtf && <EtfView stock={stock} price={price} />}
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 32,
    gap: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    // paddingHorizontal: 16,
    paddingTop: 16,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerInfo: {
    flex: 1,
    gap: 6,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  arrowText: {
    fontSize: 12,
    fontWeight: "600",
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
    fontWeight: "600",
  },
  chartContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
