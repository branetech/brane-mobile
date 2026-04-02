import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Eye, EyeSlash } from "iconsax-react-native";
import ChartComponent from "@/components/portfolio/chart";
import { priceFormatter } from "@/utils/helpers";
import Svg, { Path } from "react-native-svg";
import styles from "./holdingStyles";

interface OverviewTabProps {
  C: any;
  logoUri: string;
  tickerSymbol: string;
  currentPrice: number;
  changeValue: number;
  pct: number;
  tickerIsDown: boolean;
  chartDates: string[];
  chartValues: number[];
  chartColor: any;
  timeFilter: string;
  setTimeFilter: (v: string) => void;
  currentValue: number;
  investedValue: number;
  avgPrice: number;
  unitsHeld: number;
  totalGain: number;
  startDate: string;
  txCount: number;
  growthTrend: any;
  onBuy: () => void;
}

const TIME_FILTERS = [
  "Today",
  "1W",
  "1M",
  "3M",
  "6M",
  "1Y",
  "5Y",
];

const OverviewTab: React.FC<OverviewTabProps> = ({
  C,
  logoUri,
  tickerSymbol,
  currentPrice,
  changeValue,
  pct,
  tickerIsDown,
  chartDates,
  chartValues,
  chartColor,
  timeFilter,
  setTimeFilter,
  currentValue,
  investedValue,
  avgPrice,
  unitsHeld,
  totalGain,
  startDate,
  txCount,
  growthTrend,
  onBuy,
}) => {
  const [hideBalance, setHideBalance] = useState(false);
  const priceColor = tickerIsDown ? "#D50000" : "#0C8F5C";
  const gainColor = totalGain >= 0 ? "#0C8F5C" : "#D50000";
  const returnPct = investedValue > 0 ? (totalGain / investedValue) * 100 : 0;
  const mask = (v: string) => (hideBalance ? "****" : v);

  return (
    <>
      {/* Price row */}
      <View style={styles.priceRow}>
        <Image
          source={{ uri: logoUri }}
          style={[styles.logo, { backgroundColor: C.inputBg }]}
          resizeMode="contain"
        />
        <View style={{ flex: 1 }}>
          <ThemedText
            style={[styles.priceText, { color: C.text, paddingTop: 10 }]}
          >
            {priceFormatter(currentPrice, 2)}
          </ThemedText>
          <View style={styles.changeRow}>
            <ThemedText style={[styles.changeAmt, { color: priceColor }]}> 
              {tickerIsDown ? "-" : "+"}
              {priceFormatter(changeValue, 2)}
            </ThemedText>
            <ThemedText style={[styles.changePct, { color: priceColor }]}> 
              {tickerIsDown ? "▼" : "▲"} {Math.abs(pct).toFixed(2)}%
            </ThemedText>
            <ThemedText style={[styles.dot, { color: C.muted }]}>• Today</ThemedText>
          </View>
        </View>
      </View>

      {/* Chart (full bleed) */}
      <View style={styles.chartWrap}>
        {chartValues.length > 1 ? (
          <ChartComponent
            dates={chartDates}
            values={chartValues}
            colorType={chartColor}
          />
        ) : (
          <View style={[styles.chartSkeleton, { backgroundColor: C.inputBg }]} />
        )}
      </View>

      {/* Time filters — plain text */}
      <View style={[styles.timeRow, { borderBottomColor: C.border }]}> 
        {TIME_FILTERS.map((tf) => (
          <TouchableOpacity
            key={tf}
            onPress={() => setTimeFilter(tf)}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.timeTxt,
                { color: timeFilter === tf ? C.text : C.muted },
                timeFilter === tf && styles.timeTxtActive,
              ]}
            >
              {tf}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats — no card background */}
      <View style={styles.statsSection}>
        {/* Row 1: Current Value | Invested Value */}
        <View style={styles.statsTopRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 }}>
              <ThemedText style={[styles.statLabel, { color: C.muted }]}>Current Value</ThemedText>
              <TouchableOpacity onPress={() => setHideBalance((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                {hideBalance ? (
                  <EyeSlash size={14} color={C.muted} variant="Outline" />
                ) : (
                  <Eye size={14} color={C.muted} variant="Outline" />
                )}
              </TouchableOpacity>
            </View>
            <ThemedText style={[styles.statBigVal, { color: C.text, paddingTop: 5 }]}>
              {mask(priceFormatter(currentValue, 2))}
            </ThemedText>
            <ThemedText style={[styles.statChange, { color: gainColor }]}> 
              {totalGain >= 0 ? "▲" : "▼"} ({returnPct >= 0 ? "+" : ""}{returnPct.toFixed(2)}%)
            </ThemedText>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <ThemedText style={[styles.statLabel, { color: C.muted, marginBottom: 4 }]}>Invested Value</ThemedText>
            <ThemedText style={[styles.statBigVal, { color: C.text, paddingTop: 5 }]}>
              {mask(priceFormatter(investedValue, 2))}
            </ThemedText>
            <ThemedText style={[styles.statMuted, { color: C.muted }]}>Avr Price: {priceFormatter(avgPrice, 2)}/unit</ThemedText>
          </View>
        </View>

        <View style={[styles.horizDivider, { backgroundColor: C.border }]} />

        {/* Row 2: 4 mini stats */}
        <View style={styles.statsBottomRow}>
          {[
            { label: "Units held", value: String(unitsHeld) },
            { label: "Total Gain", value: priceFormatter(totalGain, 2) },
            { label: "Start Date", value: startDate },
            { label: "Transactions", value: String(txCount) },
          ].map(({ label, value }, i, arr) => (
            <React.Fragment key={label}>
              <View style={{ flex: 1, alignItems: i === 0 ? "flex-start" : i === arr.length - 1 ? "flex-end" : "center" }}>
                <ThemedText style={[styles.statLabel, { color: C.muted, marginBottom: 3 }]}>{label}</ThemedText>
                <ThemedText style={[styles.statMiniVal, { color: C.text }]}>{value}</ThemedText>
              </View>
              {i < arr.length - 1 && (
                <View style={[styles.vertDivider, { backgroundColor: C.border }]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Growth Trend — label lives inside the card */}
      <View style={styles.growthCard}>
        <ThemedText style={styles.growthCardTitle}>Growth Trend</ThemedText>
        <View style={{ flexDirection: "row" }}>
          {[
            { label: "Today", value: priceFormatter(growthTrend.today, 2) },
            { label: "This Month", value: priceFormatter(growthTrend.month, 2) },
            { label: "Dividends", value: priceFormatter(growthTrend.dividends, 2) },
            { label: "Withdrawal", value: priceFormatter(growthTrend.withdrawals, 2) },
          ].map(({ label, value }, i, arr) => (
            <React.Fragment key={label}>
              <View style={styles.growthItem}>
                <ThemedText style={styles.growthVal}>{value}</ThemedText>
                <ThemedText style={styles.growthLabel}>{label}</ThemedText>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Sally Recommendations */}
      <View style={styles.sallyCard}>
        <View style={styles.sallyHeaderRow}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M8.69629 21.1113C10.865 20.4972 13.1484 20.4965 15.3174 21.1094C15.4361 21.1447 15.4839 21.2532 15.4609 21.3418C15.4244 21.4475 15.3354 21.5 15.2598 21.5C15.2564 21.5 15.2495 21.5003 15.2412 21.499C15.234 21.4979 15.2296 21.4964 15.2285 21.4961L15.2178 21.4922L15.207 21.4893L14.8115 21.3848C12.834 20.897 10.7757 20.9309 8.80957 21.4873C8.69063 21.5194 8.58645 21.4482 8.5625 21.3604L8.55957 21.3477L8.55273 21.3105C8.54588 21.223 8.6029 21.1371 8.69043 21.1133L8.69629 21.1113Z" fill="#008753" stroke="#008753" />
            <Path d="M12.5049 6.75879C11.9338 6.50578 11.2435 6.71954 10.918 7.27734L10.916 7.28027L9.84668 9.14062L9.84473 9.14258C9.52454 9.70621 9.47163 10.358 9.79688 10.9199L9.7998 10.9248C10.1185 11.4608 10.6951 11.7508 11.3359 11.7578L10.916 12.4902V12.4912C10.5821 13.0756 10.7791 13.829 11.3613 14.1807V14.1816C11.3638 14.1832 11.3667 14.184 11.3691 14.1855C11.3721 14.1873 11.3749 14.1897 11.3779 14.1914V14.1904C11.58 14.3141 11.8013 14.3594 12 14.3594C12.4397 14.3593 12.8535 14.1233 13.082 13.7314L13.083 13.7285L14.1523 11.8711C14.4769 11.3129 14.5266 10.6493 14.2021 10.0889L14.1992 10.084C13.8802 9.54763 13.3034 9.2576 12.6621 9.25098L13.083 8.51855L13.084 8.51758C13.421 7.92764 13.2172 7.16465 12.6221 6.81738L12.5049 6.75879ZM8.35938 16.6533L8.13867 16.5039C5.9201 15.0154 4.46984 12.4535 4.46973 10.0498C4.46973 7.75048 5.49162 5.60497 7.29102 4.1709L7.29395 4.16895C9.08371 2.72596 11.4277 2.17983 13.7217 2.6875H13.7227C15.9082 3.16588 17.7908 4.62076 18.7617 6.58105V6.58203C20.6459 10.3691 18.8404 14.5226 15.9004 16.5049L15.6797 16.6533V17.6377C15.6896 17.9062 15.6805 18.2015 15.4658 18.4258C15.3048 18.5868 15.0376 18.7099 14.5898 18.71H9.45996C9.04783 18.71 8.72882 18.6571 8.53809 18.4609C8.35942 18.2768 8.34927 18.0507 8.35938 17.7676V16.6533Z" fill="#008753" stroke="#008753" />
          </Svg>
          <ThemedText style={styles.sallyHeaderTxt}>Sally Recommendations</ThemedText>
        </View>
        <ThemedText style={styles.sallyTitle}>{tickerSymbol} is rising</ThemedText>
        <ThemedText style={styles.sallyBody}>
          Nibh turpis ut sem dignissim tincidunt augue pellentesque urna velit. Ipsum dis a dolor enim arcu in at massa habise.
        </ThemedText>
        <TouchableOpacity style={styles.sallyBtn} onPress={onBuy} activeOpacity={0.8}>
          <ThemedText style={styles.sallyBtnTxt}>+ Buy More</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={{ height: 24 }} />
    </>
  );
};

export default OverviewTab;
