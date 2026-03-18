import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { useRouter } from "expo-router";
import { TickCircle, Warning2 } from "iconsax-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

const ManagedPortfolioScreen = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];

  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleProceed = async () => {
    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }

    try {
      setIsLoading(true);
      await BaseRequest.put(TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION, {
        allocationType: "managed",
      });
      setShowSuccessModal(true);
    } catch (err) {
      catchError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTerms = async () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
    await handleProceed();
  };

  const FeatureItem = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => (
    <View
      style={[
        styles.featureCard,
        { backgroundColor: C.inputBg, borderColor: C.border },
      ]}
    >
      <View style={[styles.featureIcon, { backgroundColor: `${C.primary}15` }]}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: C.primary,
          }}
        />
      </View>
      <View style={styles.featureContent}>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={[styles.featureDescription, { color: C.muted }]}>
          {description}
        </ThemedText>
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
          <ThemedText style={styles.title}>Managed Portfolio</ThemedText>
        </View>

        {/* Hero Section */}
        <View
          style={[
            styles.heroSection,
            { backgroundColor: `${C.primary}15`, borderColor: C.primary },
          ]}
        >
          <View style={[styles.heroIcon, { backgroundColor: C.primary }]}>
            <ThemedText style={styles.heroIconText}>💰</ThemedText>
          </View>
          <ThemedText style={styles.heroTitle}>
            Let Experts Manage Your Wealth
          </ThemedText>
          <ThemedText style={[styles.heroSubtitle, { color: C.muted }]}>
            Our expert investors grow your wealth using Brac balance
            automatically at 12-18% historical market returns
          </ThemedText>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <FeatureItem
            title='Earn More While You Spend'
            description='Expert investors grow your wealth using Brac balance automatically at 12-18% historical market returns VS 0% sitting idle in your wallet.'
          />
          <FeatureItem
            title='Access Expert-Level Investment'
            description='Get the same proven strategies and SEC-regulated protection that wealthy investors pay millions for at no extra cost to you.'
          />
          <FeatureItem
            title='Fully Managed & Monitored'
            description='Your portfolio is continuously monitored and rebalanced by professional fund managers to ensure optimal performance.'
          />
        </View>

        {/* Info Box */}
        <View
          style={[
            styles.infoBox,
            { backgroundColor: `${C.primary}10`, borderColor: C.primary },
          ]}
        >
          <Warning2 size={20} color={C.primary} />
          <ThemedText style={[styles.infoText, { color: C.text }]}>
            The Managed Portfolio is managed by Sankore Securities, a Registered
            Investment Broker licensed by SEC
          </ThemedText>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <BraneButton
            onPress={handleProceed}
            disabled={isLoading}
            style={[
              styles.proceedButton,
              { backgroundColor: C.primary, opacity: isLoading ? 0.7 : 1 },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator size='small' color='#FFFFFF' />
            ) : (
              <ThemedText style={styles.proceedButtonText}>Proceed</ThemedText>
            )}
          </BraneButton>

          <Pressable onPress={() => setShowTermsModal(true)}>
            <ThemedText style={[styles.termsLink, { color: C.primary }]}>
              View Terms & Conditions
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>

      {/* Terms Modal */}
      <Modal
        visible={showTermsModal}
        transparent
        animationType='slide'
        onRequestClose={() => setShowTermsModal(false)}
      >
        <SafeAreaView
          style={[styles.modalContainer, { backgroundColor: C.background }]}
        >
          <ScrollView
            style={styles.termsScroll}
            contentContainerStyle={styles.termsContent}
          >
            <ThemedText style={styles.termsTitle}>
              Terms & Conditions
            </ThemedText>
            <ThemedText style={[styles.termsBody, { color: C.text }]}>
              {`1. MANAGED PORTFOLIO AGREEMENT\n\nBy proceeding with the Managed Portfolio option, you agree that your Brac balance will be invested according to professional management strategies.\n\n2. RISK DISCLOSURE\n\nAll investments carry risk. Past performance does not guarantee future results. Your investment may increase or decrease in value based on market conditions.\n\n3. FUND MANAGER AUTHORIZATION\n\nYou authorize Sankore Securities to manage your funds in accordance with their investment policies and procedures.\n\n4. FEES\n\nManaged portfolio fees will be clearly communicated before proceeding. Performance-based fees may apply.\n\n5. REGULATORY COMPLIANCE\n\nThis managed portfolio is regulated by the Securities and Exchange Commission (SEC) and complies with all applicable investment regulations.\n\n6. DISPUTE RESOLUTION\n\nAny disputes arising from this agreement shall be resolved through arbitration in accordance with applicable laws.\n\nPlease review these terms carefully before proceeding.`}
            </ThemedText>
          </ScrollView>

          <View style={styles.termsButtonContainer}>
            <BraneButton
              onPress={() => setShowTermsModal(false)}
              style={[
                styles.termsButton,
                {
                  backgroundColor: C.border,
                  borderColor: C.border,
                  borderWidth: 1,
                },
              ]}
            >
              <ThemedText style={[styles.termsButtonText, { color: C.text }]}>
                Decline
              </ThemedText>
            </BraneButton>
            <BraneButton
              onPress={handleAcceptTerms}
              style={[styles.termsButton, { backgroundColor: C.primary }]}
            >
              <ThemedText style={styles.termsButtonTextAccept}>
                I Accept Terms
              </ThemedText>
            </BraneButton>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType='fade'
        onRequestClose={() => {
          setShowSuccessModal(false);
          router.back();
        }}
      >
        <Pressable
          style={[styles.modalBackdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          onPress={() => {
            setShowSuccessModal(false);
            router.back();
          }}
        >
          <View style={[styles.successCard, { backgroundColor: C.background }]}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${C.primary}15` },
              ]}
            >
              <TickCircle size={48} color={C.primary} variant='Bold' />
            </View>
            <ThemedText style={styles.successTitle}>Success!</ThemedText>
            <ThemedText style={[styles.successMessage, { color: C.muted }]}>
              Your managed portfolio has been activated successfully
            </ThemedText>
            <BraneButton
              onPress={() => {
                setShowSuccessModal(false);
                router.back();
              }}
              style={[styles.continueButton, { backgroundColor: C.primary }]}
            >
              <ThemedText style={styles.continueButtonText}>
                Continue
              </ThemedText>
            </BraneButton>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  header: {
    marginTop: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  heroSection: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 24,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroIconText: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  featuresSection: {
    gap: 12,
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  infoBox: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  proceedButton: {
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 48,
  },
  proceedButtonText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#FFFFFF",
  },
  termsLink: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    paddingVertical: 12,
    textDecorationLine: "underline",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  termsScroll: {
    flex: 1,
  },
  termsContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  termsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  termsBody: {
    fontSize: 13,
    lineHeight: 20,
  },
  termsButtonContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  termsButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  termsButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
  termsButtonTextAccept: {
    fontWeight: "600",
    fontSize: 14,
    color: "#FFFFFF",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    maxWidth: 280,
    paddingVertical: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 18,
  },
  continueButton: {
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ManagedPortfolioScreen;
