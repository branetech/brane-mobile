import { Airtime, Credited, Data, StockIcn, Withdraw } from "@/components/svg";
import { Receipt1 } from "iconsax-react-native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

// ─── Types ───────────────────────────────────────────────────
interface IconRenderProps {
  id?: string;
  type?: string;
  icon?: React.ReactNode;
}

const STOCK_TYPES = ["sell stocks", "buy stocks", "stock swap"];

// ─── Component ───────────────────────────────────────────────
export function IconRender({ id = "", type = "", icon }: IconRenderProps) {
  const t = type.toLowerCase();
  const i = id.toLowerCase();

  if (i.includes("stock") || t.includes("stock")) {
    return (
      <StockIcn
        type={STOCK_TYPES.includes(t) ? t : ""}
        id={STOCK_TYPES.includes(i) ? i : ""}
      />
    );
  }

  if (i.includes("swap") || t.includes("swap")) {
    return (
      <></>
      // <Image
      //   source={require("@/assets/icons/swap.png")}
      //   style={styles.swapImg}
      //   resizeMode="contain"
      // />
    );
  }

  if (i.includes("wallet deduction") || t.includes("wallet deduction")) {
    return <Withdraw />;
  }

  if (i.includes("airtime") || t.includes("airtime")) {
    return <Airtime />;
  }

  if (i.includes("data") || t.includes("data")) {
    return <Data />;
  }

  if (i.includes("wallet top up") || t.includes("wallet top up")) {
    return <Credited />;
  }

  if (icon) {
    return <>{icon}</>;
  }

  // Default fallback
  return (
    <View style={styles.fallback}>
      <Receipt1 size={24} color="#013D25" />
    </View>
  );
}

const styles = StyleSheet.create({
  swapImg: {
    width: 34,
    height: 34,
  },
  fallback: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#D2F1E4",
    alignItems: "center",
    justifyContent: "center",
  },
});