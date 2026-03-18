import { RiskDisclosureModal } from "@/components/account/bracs-investment";
import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ImageBackground, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ManagedPortfolioScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const onAcceptTerms = async () => {
    setLoading(true);
    try {
      await BaseRequest.put(TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION, {
        allocationType: "managed",
      });
      showSuccess("Bracs Allocation Settings Saved Successfully");
      setShowTerms(false);
      router.push(
        "/(tabs)/(account)/bracs-investment-trigger",
      );
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <ImageBackground
        source={require("@/assets/images/network/CoverInvestment.png")}
        resizeMode='cover'
        style={styles.bg}
      >
        <View style={styles.header} row aligned>
          <Back onPress={() => router.back()} />
          <ThemedText type='subtitle' style={styles.title}>
            Bracs Investment Trigger
          </ThemedText>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Image
            source={require("@/assets/images/network/invest-brane.png")}
            style={styles.heroImage}
            resizeMode='cover'
          />

          <ThemedText type='subtitle' style={styles.headline}>
            Let Expert Manage and Grow Your Wealth From Every Spending
          </ThemedText>
          <ThemedText style={styles.copy}>
            The managed portfolio is handled by expert investment partners with
            a long-term growth strategy.
          </ThemedText>

          <View style={styles.card}>
            <ThemedText style={styles.bulletTitle}>
              Earn More While You Spend
            </ThemedText>
            <ThemedText style={styles.bullet}>
              Expert investors grow your wealth using Brac balance automatically
              at market rates.
            </ThemedText>

            <ThemedText style={styles.bulletTitle}>
              Access Expert-Level Investment
            </ThemedText>
            <ThemedText style={styles.bullet}>
              Get proven portfolio strategies and SEC-regulated investment
              access.
            </ThemedText>
          </View>

          <ThemedText style={styles.footerText}>
            By proceeding you agree to our Terms and Conditions.
          </ThemedText>

          <BraneButton
            text='Proceed'
            onPress={() => setShowTerms(true)}
            loading={loading}
            style={styles.button}
          />
        </ScrollView>
      </ImageBackground>

      <RiskDisclosureModal
        visible={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={onAcceptTerms}
        isLoading={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  bg: { flex: 1 },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: { fontSize: 16, color: "#FFFFFF" },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  heroImage: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginBottom: 18,
  },
  headline: {
    fontSize: 24,
    lineHeight: 34,
    color: "#FFFFFF",
  },
  copy: {
    marginTop: 8,
    fontSize: 13,
    color: "#E4F3EA",
  },
  card: {
    marginTop: 18,
    borderRadius: 12,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
    gap: 10,
  },
  bulletTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B0014",
  },
  bullet: {
    fontSize: 13,
    color: "#342A3B",
  },
  footerText: {
    marginTop: 14,
    fontSize: 12,
    color: "#E4F3EA",
    textAlign: "center",
  },
  button: {
    marginTop: 24,
  },
});
