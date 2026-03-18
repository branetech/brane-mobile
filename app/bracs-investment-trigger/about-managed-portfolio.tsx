import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import BaseRequest, { catchError } from "@/services";
import { STOCKS_SERVICE } from "@/services/routes";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

interface AllocationData {
  tickerSymbol: string;
  units: number;
  value: number;
  ytdReturn: number;
}

const AboutManagedPortfolio = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];

  const [allocationData, setAllocationData] = useState<AllocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetchAllocationData();
  }, []);

  const fetchAllocationData = async () => {
    try {
      setIsLoading(true);
      const response = await BaseRequest.get(STOCKS_SERVICE.MANAGED_BRACS);
      if (response.data) {
        setAllocationData(response.data);
      }
    } catch (err) {
      catchError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const details =
    "The Managed Wealth Portfolio is a professionally curated investment solution designed to grow your wealth through diversified asset allocation. Our expert fund managers employ strategic investment techniques to maximize returns while minimizing risk exposure. With a focus on long-term wealth creation, this portfolio automatically reinvests earnings and adjusts allocations based on market conditions.";

  const PortfolioCard = ({ item }: { item: AllocationData }) => (
    <View
      style={[
        styles.portfolioCard,
        { backgroundColor: C.inputBg, borderColor: C.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>{item.tickerSymbol}</ThemedText>
        <ThemedText
          style={[
            styles.cardReturn,
            {
              color: item.ytdReturn >= 0 ? "#13C965" : "#DC2626",
            },
          ]}
        >
          {item.ytdReturn >= 0 ? "+" : ""}
          {item.ytdReturn}%
        </ThemedText>
      </View>
      <View style={styles.cardRow}>
        <View>
          <ThemedText style={[styles.cardLabel, { color: C.muted }]}>
            Units
          </ThemedText>
          <ThemedText style={styles.cardValue}>{item.units}</ThemedText>
        </View>
        <View style={{ borderLeftWidth: 1, borderLeftColor: C.border, paddingLeft: 16 }}>
          <ThemedText style={[styles.cardLabel, { color: C.muted }]}>
            Value
          </ThemedText>
          <ThemedText style={styles.cardValue}>₦{item.value.toLocaleString()}</ThemedText>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backText}>←</ThemedText>
          </Pressable>
          <ThemedText style={styles.title}>Managed Wealth</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        {/* Tabs */}
        <View
          style={[
            styles.tabs,
            { borderBottomColor: C.border },
          ]}
        >
          <ThemedText
            style={[
              styles.activeTab,
              { borderBottomColor: C.primary, color: C.primary },
            ]}
          >
            About
          </ThemedText>
          <ThemedText style={[styles.inactiveTab, { color: C.muted }]}>
            Holdings
          </ThemedText>
        </View>

        {isLoading ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size="large" color={C.primary} />
          </View>
        ) : (
          <>
            {/* Description Section */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                Managed Bracs & Wealth Investment
              </ThemedText>
              <ThemedText
                style={[
                  styles.description,
                  { color: C.text },
                ]}
              >
                {showMore ? details : `${details.substring(0, 200)}...`}
              </ThemedText>
              <Pressable onPress={() => setShowMore(!showMore)}>
                <ThemedText
                  style={[
                    styles.showMoreButton,
                    { color: C.primary },
                  ]}
                >
                  {showMore ? "Show Less" : "Show More"}
                </ThemedText>
              </Pressable>
            </View>

            {/* Top Picks Section */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Top Picks</ThemedText>
              <View style={styles.portfolioList}>
                {allocationData.length > 0 ? (
                  allocationData.map((item, index) => (
                    <PortfolioCard key={index} item={item} />
                  ))
                ) : (
                  <ThemedText
                    style={[
                      styles.emptyState,
                      { color: C.muted },
                    ]}
                  >
                    No portfolio data available
                  </ThemedText>
                )}
              </View>
            </View>

            {/* Allocation Summary Section */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Why You Should Allow Pro</ThemedText>
              <View
                style={[
                  styles.allocationBox,
                  {
                    backgroundColor: `${C.primary}10`,
                    borderColor: C.primary,
                  },
                ]}
              >
                <View style={styles.allocationItem}>
                  <View
                    style={[
                      styles.allocationDot,
                      { backgroundColor: "#13C965" },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.allocationLabel}>
                      Stock Assets
                    </ThemedText>
                    <ThemedText style={[styles.allocationPercent, { color: C.muted }]}>
                      35% allocation
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.allocationItem}>
                  <View
                    style={[
                      styles.allocationDot,
                      { backgroundColor: "#F59E0B" },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.allocationLabel}>
                      Gold Assets
                    </ThemedText>
                    <ThemedText style={[styles.allocationPercent, { color: C.muted }]}>
                      25% allocation
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.allocationItem}>
                  <View
                    style={[
                      styles.allocationDot,
                      { backgroundColor: "#8B5CF6" },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.allocationLabel}>
                      Fixed Income
                    </ThemedText>
                    <ThemedText style={[styles.allocationPercent, { color: C.muted }]}>
                      20% allocation
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.allocationItem}>
                  <View
                    style={[
                      styles.allocationDot,
                      { backgroundColor: "#06B6D4" },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.allocationLabel}>
                      Index Funds
                    </ThemedText>
                    <ThemedText style={[styles.allocationPercent, { color: C.muted }]}>
                      20% allocation
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Button */}
            <View style={styles.buttonSection}>
              <BraneButton
                onPress={() => router.back()}
                style={[
                  styles.backActionButton,
                  { backgroundColor: C.primary },
                ]}
              >
                <ThemedText style={styles.backActionButtonText}>
                  Back to Bracs
                </ThemedText>
              </BraneButton>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
  },
  backText: {
    fontSize: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  activeTab: {
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    marginHorizontal: -16,
    marginLeft: 16,
  },
  inactiveTab: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  showMoreButton: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
  },
  centerLoader: {
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  portfolioList: {
    gap: 12,
  },
  portfolioCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardReturn: {
    fontSize: 13,
    fontWeight: "600",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  emptyState: {
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 20,
  },
  allocationBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  allocationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  allocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  allocationLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 2,
  },
  allocationPercent: {
    fontSize: 12,
  },
  buttonSection: {
    gap: 12,
  },
  backActionButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  backActionButtonText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#FFFFFF",
  },
});

export default AboutManagedPortfolio;
