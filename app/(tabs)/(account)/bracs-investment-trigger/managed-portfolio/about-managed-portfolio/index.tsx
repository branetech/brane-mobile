import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PortfolioDetails = {
  id: string;
  name: string;
  description: string;
  allocation?: Record<string, number>;
  performanceMetrics?: {
    ytdReturn?: string;
    riskLevel?: string;
  };
};

export default function AboutManagedPortfolioScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioDetails | null>(null);

  const portfolioId = params.id as string;

  const fetchPortfolioDetails = useCallback(async () => {
    if (!portfolioId) return;
    setLoading(true);
    try {
      const response: any = await BaseRequest.get(
        `${TRANSACTION_SERVICE.ACCOUNT_MANAGED_PORTFOLIO}/${portfolioId}`,
      );
      setPortfolio(response?.data || response);
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);

  useEffect(() => {
    fetchPortfolioDetails();
  }, [fetchPortfolioDetails]);

  const handleSubscribe = async () => {
    if (!portfolioId) return;
    setSubscribing(true);
    try {
      await BaseRequest.post(
        `${TRANSACTION_SERVICE.ACCOUNT_MANAGED_PORTFOLIO}/${portfolioId}/subscribe`,
        {},
      );
      showSuccess("Portfolio subscribed successfully");
      router.back();
    } catch (error) {
      catchError(error);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={styles.title}>
          Portfolio Details
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size='large' color={C.primary} />
        </View>
      ) : portfolio ? (
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText
            type='subtitle'
            style={[styles.portfolioName, { color: C.text }]}
          >
            {portfolio.name}
          </ThemedText>

          <ThemedText style={[styles.description, { color: C.muted }]}>
            {portfolio.description}
          </ThemedText>

          {portfolio.performanceMetrics && (
            <View
              style={[
                styles.metricsCard,
                { backgroundColor: C.inputBg, borderColor: C.border },
              ]}
            >
              <ThemedText style={[styles.metricLabel, { color: C.muted }]}>
                YTD Return: {portfolio.performanceMetrics.ytdReturn || "N/A"}
              </ThemedText>
              <ThemedText style={[styles.metricLabel, { color: C.muted }]}>
                Risk Level: {portfolio.performanceMetrics.riskLevel || "N/A"}
              </ThemedText>
            </View>
          )}

          {portfolio.allocation && (
            <View style={styles.allocationContainer}>
              <ThemedText
                type='defaultSemiBold'
                style={[styles.allocationTitle, { color: C.text }]}
              >
                Allocation
              </ThemedText>
              {Object.entries(portfolio.allocation).map(
                ([asset, percentage]) => (
                  <View key={asset} style={styles.allocationRow}>
                    <ThemedText style={[styles.assetName, { color: C.text }]}>
                      {asset}
                    </ThemedText>
                    <ThemedText
                      style={[styles.percentage, { color: C.primary }]}
                    >
                      {percentage}%
                    </ThemedText>
                  </View>
                ),
              )}
            </View>
          )}

          <BraneButton
            text='Subscribe to Portfolio'
            onPress={handleSubscribe}
            loading={subscribing}
            style={styles.button}
          />
        </ScrollView>
      ) : (
        <View style={styles.emptyWrap}>
          <ThemedText style={[styles.emptyText, { color: C.muted }]}>
            Portfolio not found
          </ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: { fontSize: 16, fontWeight: "600" },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  portfolioName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  metricsCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  metricLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  allocationContainer: {
    marginBottom: 20,
  },
  allocationTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  allocationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  assetName: {
    fontSize: 13,
  },
  percentage: {
    fontSize: 13,
    fontWeight: "600",
  },
  button: {
    marginTop: 24,
  },
  emptyText: {
    fontSize: 14,
  },
});
