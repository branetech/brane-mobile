import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ManagedPortfolio = {
  id: string;
  name: string;
  description: string;
  allocation?: Record<string, number>;
};

export default function ManagedPortfolioScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [loading, setLoading] = useState(false);
  const [portfolios, setPortfolios] = useState<ManagedPortfolio[]>([]);

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await BaseRequest.get(
        TRANSACTION_SERVICE.ACCOUNT_MANAGED_PORTFOLIO,
      );
      setPortfolios(response?.data || []);
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={styles.title}>
          Managed Portfolio
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size='large' color={C.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText style={[styles.description, { color: C.muted }]}>
            Explore our managed investment portfolios
          </ThemedText>

          {portfolios.length === 0 ? (
            <ThemedText style={[styles.emptyText, { color: C.muted }]}>
              No portfolios available
            </ThemedText>
          ) : (
            portfolios.map((portfolio) => (
              <BraneButton
                key={portfolio.id}
                text={portfolio.name}
                onPress={() =>
                  router.push(
                    `/(tabs)/(account)/bracs-investment-trigger/managed-portfolio/about-managed-portfolio?id=${portfolio.id}`,
                  )
                }
                style={styles.portfolioButton}
              />
            ))
          )}
        </ScrollView>
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 40,
  },
  portfolioButton: {
    marginBottom: 12,
  },
});
