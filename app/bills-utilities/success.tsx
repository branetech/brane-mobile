import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { palette } from "@/constants";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ExportCurve } from "iconsax-react-native";
import React, { useEffect } from "react";
import { Share, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

type Scheme = "light" | "dark";

export default function BillsSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    title: string;
    message: string;
    service: string;
    amount: string;
  }>();

  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const title = params.title || "Transaction Successful";
  const message =
    params.message || "Your transaction was completed successfully.";

  const shareReceipt = async () => {
    try {
      await Share.share({ message: `${title}\n\n${message}` });
    } catch {}
  };

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.screen, { backgroundColor: C.background }]}
    >
      <View style={styles.content}>
        <Svg width={80} height={80} viewBox="0 0 96 96" fill="none">
          <Path
            d="M86.2395 42.9583L80.7995 36.6383C79.7595 35.4383 78.9195 33.1983 78.9195 31.5983V24.7983C78.9195 20.5583 75.4395 17.0783 71.1995 17.0783H64.3995C62.8395 17.0783 60.5595 16.2383 59.3595 15.1983L53.0395 9.75828C50.2795 7.39828 45.7595 7.39828 42.9595 9.75828L36.6795 15.2383C35.4795 16.2383 33.1995 17.0783 31.6395 17.0783H24.7195C20.4795 17.0783 16.9995 20.5583 16.9995 24.7983V31.6383C16.9995 33.1983 16.1595 35.4383 15.1595 36.6383L9.75953 42.9983C7.43953 45.7583 7.43953 50.2383 9.75953 52.9983L15.1595 59.3583C16.1595 60.5583 16.9995 62.7983 16.9995 64.3583V71.1983C16.9995 75.4383 20.4795 78.9183 24.7195 78.9183H31.6395C33.1995 78.9183 35.4795 79.7583 36.6795 80.7983L42.9995 86.2383C45.7595 88.5983 50.2795 88.5983 53.0795 86.2383L59.3995 80.7983C60.5995 79.7583 62.8395 78.9183 64.4395 78.9183H71.2395C75.4795 78.9183 78.9595 75.4383 78.9595 71.1983V64.3983C78.9595 62.8383 79.7995 60.5583 80.8395 59.3583L86.2795 53.0383C88.5995 50.2783 88.5995 45.7183 86.2395 42.9583ZM64.6395 40.4383L45.3195 59.7583C44.7595 60.3183 43.9995 60.6383 43.1995 60.6383C42.3995 60.6383 41.6395 60.3183 41.0795 59.7583L31.3995 50.0783C30.2395 48.9183 30.2395 46.9983 31.3995 45.8383C32.5595 44.6783 34.4795 44.6783 35.6395 45.8383L43.1995 53.3983L60.3995 36.1983C61.5595 35.0383 63.4795 35.0383 64.6395 36.1983C65.7995 37.3583 65.7995 39.2783 64.6395 40.4383Z"
            fill="#CBFD90"
          />
          <Path
            d="M64.6393 40.4384L45.3193 59.7584C44.7593 60.3184 43.9993 60.6384 43.1993 60.6384C42.3993 60.6384 41.6393 60.3184 41.0793 59.7584L31.3993 50.0784C30.2393 48.9184 30.2393 46.9984 31.3993 45.8384C32.5593 44.6784 34.4793 44.6784 35.6393 45.8384L43.1993 53.3984L60.3993 36.1984C61.5593 35.0384 63.4793 35.0384 64.6393 36.1984C65.7993 37.3584 65.7993 39.2784 64.6393 40.4384Z"
            fill={palette.brandDeep}
          />
        </Svg>

        <ThemedText style={[styles.title, { color: C.text }]}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: C.muted }]}>
          {message}
        </ThemedText>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.shareBtn, { backgroundColor: C.inputBg }]}
          onPress={shareReceipt}
        >
          <ThemedText style={[styles.shareBtnText, { color: C.primary }]}>
            Share Receipt
          </ThemedText>
          <ExportCurve size={18} color={C.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
        <View style={styles.btnFlex}>
          <BraneButton
            text="Buy Again"
            onPress={() => router.back()}
            backgroundColor={C.primary}
            textColor={palette.brandMint}
            height={52}
            radius={32}
          />
        </View>
        <View style={styles.btnFlex}>
          <BraneButton
            text="Dismiss"
            onPress={() => {
              router.navigate("/(tabs)/utilities" as any);
            }}
            backgroundColor={palette.brandMint}
            textColor={C.primary}
            height={52}
            radius={32}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 20,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  shareBtn: {
    minHeight: 46,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 22,
    marginTop: 6,
  },
  shareBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  btnFlex: {
    flex: 1,
  },
});

