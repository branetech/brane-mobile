import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

  const chartWidth = SCREEN_WIDTH - 32;
  const labelAreaH = 20;
  const chartH = height - labelAreaH;

  if (!values || values.length < 2) return null;

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  // Map values to SVG coordinates with 5% top/bottom padding
  const pad = chartH * 0.08;
  const points = values.map((v, i) => ({
    x: (i / (values.length - 1)) * chartWidth,
    y: chartH - pad - ((v - minVal) / range) * (chartH - 2 * pad),
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  const fillPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)},${chartH} L 0,${chartH} Z`;

  // ~5 evenly-spaced x-axis date labels
  const labelCount = Math.min(5, dates.length);
  const labelIndices =
    labelCount > 1
      ? Array.from({ length: labelCount }, (_, i) =>
          Math.round((i / (labelCount - 1)) * (dates.length - 1)),
        )
      : [0];

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={chartH}>
        <Defs>
          <LinearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={from} stopOpacity="0.55" />
            <Stop offset="1" stopColor={from} stopOpacity="0.03" />
          </LinearGradient>
        </Defs>
        <Path d={fillPath} fill="url(#cg)" />
        <Path d={linePath} stroke={from} strokeWidth={1.8} fill="none" />
      </Svg>

      {/* X-axis labels */}
      <View style={styles.xAxis}>
        {labelIndices.map((idx) => (
          <Text key={idx} style={[styles.xLabel, { color: C.muted }]}>
            {dates[idx]}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  xLabel: { fontSize: 10 },
});
