import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartComponentProps {
  data: ChartDataPoint[];
  title?: string;
  type?: "bar" | "pie";
  height?: number;
  style?: ViewStyle;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  title,
  type = "bar",
  height = 180,
  style,
}) => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 64;

  const defaultColors = ["#013D25", "#2B5D49", "#D2F1E4", "#0066FF", "#F5880E"];

  return (
    <View style={[styles.container, style]}>
      {title && (
        <ThemedText
          type='defaultSemiBold'
          style={[styles.title, { color: C.text }]}
        >
          {title}
        </ThemedText>
      )}

      {type === "bar" && (
        <View style={[styles.barChart, { height }]}>
          <View style={styles.barsContainer}>
            {data.map((item, index) => {
              const heightPercent = (item.value / maxValue) * 100;
              const color =
                item.color || defaultColors[index % defaultColors.length];

              return (
                <View key={index} style={styles.barItem}>
                  <View
                    style={[
                      styles.barLabel,
                      { height: height - 24 },
                      styles.barLabelContainer,
                    ]}
                  >
                    <View
                      style={[
                        styles.bar,
                        {
                          backgroundColor: color,
                          height: `${heightPercent}%`,
                        },
                      ]}
                    />
                  </View>
                  <ThemedText
                    style={[styles.barName, { color: C.muted }]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </ThemedText>
                  <ThemedText
                    type='defaultSemiBold'
                    style={[styles.barValue, { color: C.text }]}
                  >
                    ₦{item.value.toLocaleString()}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {type === "pie" && (
        <View style={[{ height }, styles.pieChart]}>
          <View style={styles.pieLegend}>
            {data.map((item, index) => {
              const color =
                item.color || defaultColors[index % defaultColors.length];
              const percentage =
                data.length > 0
                  ? (
                      (item.value / data.reduce((sum, d) => sum + d.value, 0)) *
                      100
                    ).toFixed(1)
                  : "0";

              return (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.colorDot, { backgroundColor: color }]} />
                  <View style={{ flex: 1 }}>
                    <ThemedText
                      type='defaultSemiBold'
                      style={[styles.legendLabel, { color: C.text }]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </ThemedText>
                    <ThemedText
                      style={[styles.legendValue, { color: C.muted }]}
                    >
                      {percentage}% • ₦{item.value.toLocaleString()}
                    </ThemedText>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 15,
  },
  barChart: {
    justifyContent: "flex-end",
    paddingHorizontal: 8,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    gap: 8,
    flex: 1,
  },
  barItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  barLabelContainer: {
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
  bar: {
    width: "100%",
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    justifyContent: "flex-end",
  },
  barName: {
    fontSize: 11,
    textAlign: "center",
  },
  barValue: {
    fontSize: 11,
    textAlign: "center",
  },
  pieChart: {
    justifyContent: "center",
    paddingVertical: 12,
  },
  pieLegend: {
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  legendValue: {
    fontSize: 11,
  },
});
