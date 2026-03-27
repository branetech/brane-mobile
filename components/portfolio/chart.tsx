import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart, LineChartProvider } from "react-native-wagmi-charts";

const { width } = Dimensions.get("window");

const colorGradients = {
  green: { from: "#2f855a", to: "#D2F1E4" },
  gold: { from: "#E7B34B", to: "#E7B34B00" },
  red: { from: "#e63434", to: "#E7B34B00" },
  purple: { from: "#A66CD2", to: "#A66CD200" },
  blue: { from: "#5CB3FF", to: "#0088FF00" },
};

type ChartComponentProps = {
  dates: string[];
  values: number[];
  colorType?: keyof typeof colorGradients;
  height?: number;
};

export default function ChartComponent({
  dates,
  values,
  colorType = "green",
  height = 160,
}: ChartComponentProps) {
  const rawScheme = useColorScheme();
  const scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const { from } = colorGradients[colorType];

  // Match wagmi-charts data shape
  const data = values.map((value, i) => ({
    timestamp: i,
    value,
  }));

  return (
    <View style={[styles.container]}>
      <LineChartProvider data={data}>
        <LineChart height={height} width={width - 32}>
          {/* Gradient fill — mirrors your backgroundColor gradient */}
          <LineChart.Path color={from} width={1.5}>
            <LineChart.Gradient
              color={from}
              // from = top color, to = bottom (transparent)
            />
          </LineChart.Path>

          {/* Cursor line on touch */}
          <LineChart.CursorLine color={from} />

          {/* Dot + tooltip on touch — mirrors pointHoverRadius */}
          <LineChart.CursorCrosshair color={from} size={12} outerSize={24}>
            <LineChart.Tooltip
              textStyle={{
                color: "#fff",
                fontSize: 12,
                backgroundColor: from,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                overflow: "hidden",
              }}
            />
          </LineChart.CursorCrosshair>
        </LineChart>
      </LineChartProvider>

      {/* X-axis labels — mirrors your dates labels */}
      <View style={styles.xAxis}>
        {dates
          .filter((_, i) => i % Math.ceil(dates.length / 6) === 0) // show ~6 labels
          .map((d, i) => (
            <Text key={i} style={[styles.xLabel, { color: C.muted }]}>
              {d}
            </Text>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  xAxis: {
    flexDirection: "row",
    // justifyContent: "space-between",
    // marginTop: 4,
    // paddingHorizontal: 4,
  },
  xLabel: {
    fontSize: 11,
    overflow: "hidden",
    flex: 1,
    textAlign: "center",
  },
});
