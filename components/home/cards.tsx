import { ThemedText } from "@/components/themed-text"; // adjust import as needed
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { priceFormatter } from "@/utils/helpers";
import { Image, View } from "@idimma/rn-widget";
import {
    ImageBackground,
    View as RNV,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { IconRender } from "../icon-render";

export const CardStyle = ({ children }: any) => {
  return (
    <View w='100%' h={196} radius={16} bg={"#013D25"}>
      <ImageBackground
        source={require("@/assets/images/bg.png")}
        style={{ flex: 1, width: "100%", height: "auto", overflow: "hidden" }}
        resizeMode='cover'
      >
        <View p={22} flex={1}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
};

export const LearnCard = () => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];
  return (
    <View
      w='100%'
      h={80}
      p={16}
      radius={12}
      bg={C.inputBackground}
      flex={1}
      style={{
        shadowColor: C.inputBackground,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        overflow: "hidden",
      }}
    >
      <View w='70%'>
        <ThemedText type='defaultSemiBold' style={{ fontSize: 12 }}>
          Learn about Brane
        </ThemedText>
        <ThemedText numberOfLines={2} style={{ fontSize: 10, lineHeight: 13 }}>
          For you to have a seamless experience we require some details.
        </ThemedText>
      </View>
      <Image
        source={require("@/assets/images/learn.png")}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 80,
          height: 110,
        }}
      />
    </View>
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

  const amountLabel = isSwap(transactionType)
    ? pluralize(rebateAmount ?? 0, "Brac")
    : priceFormatter(amount);

  return (
    <RNV
      style={[
        styles.row,
        {
          borderWidth: 1,
          borderColor,
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
});
