import React, { useCallback, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "iconsax-react-native";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";
import { BraneButton } from "@/components/brane-button";
import { palette } from "@/constants";
import Svg, { Path } from "react-native-svg";
import { ManagedEarnIcon, ManagedExpertIcon } from "@/components/bracs-investment-trigger/managed-icons";

// ── Risk Disclosure Modal ────────────────────────────────────────────────────

const loremText = `Brane Technologies Ltd ("Brane") provides investment access and portfolio visualization services in partnership with Sankore Securities Ltd, a licensed Broker-Dealer and portfolio manager regulated by the Securities and Exchange Commission (SEC) of Nigeria. All investments executed through the Brane platform are managed and held by Sankore Securities in accordance with applicable regulatory standards.

FCMB provides wallet infrastructure for users on the Brane platform. All funds are held and processed through FCMB's banking systems prior to investment execution by Sankore. Brane does not directly hold client funds or securities.

Investments made through Brane, including in stocks, fixed income instruments, ETFs, mutual funds, and gold, are subject to market risks, including the possible loss of principal. The value of investments may fluctuate due to market volatility, economic conditions, or issuer performance, and investors may experience gains or losses.

Past performance does not guarantee future results. Brane does not guarantee any fixed returns, principal protection, or the performance of any investment product. All returns are fully market-driven and may vary over time.

Users may withdraw or sell their investments at any time; however, transaction values are subject to prevailing market prices and applicable charges.

Before investing, users are advised to carefully consider their risk tolerance, financial goals, and investment horizon. Certain investment options may not be suitable for all investors. Brane recommends consulting an independent financial or investment advisor before making any investment decisions.

Brane and its partners shall not be liable for any direct or indirect loss arising from reliance on information, projections, or performance data displayed on the platform.

For full disclosures and regulatory information, please visit www.getbrane.co/legal.`;

const RiskDisclosureModal = ({
  visible,
  onClose,
  onAccept,
  isLoading,
}: {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  isLoading: boolean;
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleAccept = () => {
    if (isChecked) onAccept();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={rStyles.overlay} onPress={onClose}>
        <Pressable style={rStyles.sheet} onPress={() => {}}>
          <Text style={rStyles.title}>Risk Disclosure</Text>

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <Text style={rStyles.sectionHeader}>Why you should allow pro</Text>
            <Text style={rStyles.body}>{loremText}</Text>
          </ScrollView>

          <View style={rStyles.footer}>
            {/* Checkbox row */}
            <TouchableOpacity
              style={rStyles.checkRow}
              onPress={() => setIsChecked(!isChecked)}
              activeOpacity={0.7}
            >
              <View style={rStyles.checkBox}>
                {isChecked && (
                  <View style={rStyles.checkFilled}>
                    <Svg width={12} height={12} viewBox="0 0 24 24">
                      <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white" />
                    </Svg>
                  </View>
                )}
              </View>
              <Text style={rStyles.checkLabel}>I understand and agree to this terms</Text>
            </TouchableOpacity>

            <BraneButton
              text="Accept and Continue"
              onPress={handleAccept}
              backgroundColor={isChecked ? palette.brandDeep : "#AABEB6"}
              textColor={palette.brandMint}
              height={50}
              radius={12}
              loading={isLoading}
              disabled={!isChecked}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const rStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: palette.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    height: "88%",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#1a1a1a", marginBottom: 40, paddingHorizontal: 4 },
  sectionHeader: { fontSize: 14, fontWeight: "600", color: "#1a1a1a", marginBottom: 8 },
  body: { fontSize: 14, color: palette.gray350, lineHeight: 20 },
  footer: { paddingTop: 16, borderTopWidth: 1, borderTopColor: palette.surface100, marginTop: 8 },
  checkRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  checkBox: {
    width: 24, height: 24,
    borderWidth: 1, borderColor: "#ccc",
    borderRadius: 6,
    marginRight: 10,
    overflow: "hidden",
  },
  checkFilled: {
    backgroundColor: palette.brandDeep,
    width: 24, height: 24,
    alignItems: "center", justifyContent: "center",
  },
  checkLabel: { fontSize: 14, color: palette.ink, flex: 1 },
});

// ── Feature Item ─────────────────────────────────────────────────────────────

const FeatureItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <View style={fStyles.row}>
    <View style={fStyles.iconWrap}>{icon}</View>
    <View style={{ flex: 1 }}>
      <Text style={fStyles.title}>{title}</Text>
      <Text style={fStyles.desc}>{description}</Text>
    </View>
  </View>
);

const fStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 24 },
  iconWrap: { marginTop: 2 },
  title: { fontSize: 15, fontWeight: "600", color: palette.white, marginBottom: 4 },
  desc: { fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 18 },
});

// ── Managed Portfolio Screen ─────────────────────────────────────────────────

export default function ManagedPortfolioScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  // Hide the bottom tab bar on this screen
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
      return () => {
        navigation.getParent()?.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation])
  );

  // Always open the terms modal on Proceed — exactly matching web behavior
  const handleProceed = () => {
    setIsModalOpen(true);
  };

  const handleTermsAccept = useCallback(async () => {
    setLoading(true);
    try {
      await BaseRequest.put(TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION, {
        allocationType: "managed",
      });
      showSuccess("Bracs Allocation Settings Saved Successfully");
      setIsTermsAccepted(true);
      setIsModalOpen(false);
      router.push(
        "/(account)/bracs-investment-trigger/managed-portfolio/about-managed-portfolio" as any
      );
    } catch (err) {
      catchError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/network/CoverInvestment.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.inner}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backBtn}
              >
                <ArrowLeft size={22} color={palette.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Bracs Investment Trigger</Text>
              <View style={{ width: 44 }} />
            </View>

            {/* Content */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* Invest brane image */}
              <View style={styles.logoWrap}>
                <Image
                  source={require("@/assets/images/network/invest-brane.png")}
                  style={styles.logo}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.mainTitle}>
                Let Expert Manage & Grow Your{"\n"}Wealth From Every Spending
              </Text>

              <FeatureItem
                icon={<ManagedEarnIcon />}
                title="Earn More While You Spend"
                description="Expert investors grow your wealth using Brac balance automatically at 12-18% historical market returns VS 0% sitting idle in your wallet."
              />
              <FeatureItem
                icon={<ManagedExpertIcon />}
                title="Access Expert-Level Investment"
                description="Get the same proven strategies and SEC-regulated protection that wealthy investors pay millions for at no-extra-cost to you."
              />

              <View style={{ flex: 1, minHeight: 40 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.disclaimer}>
                The Managed Portfolio is managed by Banknote Investment Limited,
                a Registered Investment Broker with the SEC.
              </Text>

              <BraneButton
                text="Proceed"
                onPress={handleProceed}
                backgroundColor={palette.brandDeep}
                textColor={palette.brandMint}
                height={50}
                radius={12}
                loading={isLoading}
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(210,241,228,0.35)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.35,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              />

              <Text style={styles.termsText}>
                By proceeding you agree to our{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() => setIsModalOpen(true)}
                >
                  Terms and Conditions
                </Text>
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>

      <RiskDisclosureModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleTermsAccept}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 20, paddingBottom: 0 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: "600", color: palette.white },
  backBtn: { padding: 4 },
  content: { paddingTop: 20, paddingBottom: 24 },
  logoWrap: {
    width: 150,
    height: 150,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#2d9868",
    marginBottom: 24,
  },
  logo: { width: 150, height: 150 },
  mainTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: palette.white,
    lineHeight: 33,
    marginBottom: 40,
  },
  footer: {
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
    paddingTop: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 16,
  },
  termsText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 12,
  },
  termsLink: { textDecorationLine: "underline", fontWeight: "500" },
});
