import { BraneButton } from "@/components/brane-button";
import {
  PaymentMethodSelector,
  type PaymentOption,
} from "@/components/payment-method-selector";
import { BracsInfoIcon } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { MODAL_OVERLAY_COLOR } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatMoney } from "@/utils/helpers";
import React, { useState } from "react";
import {
  Image,
  type ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface TransactionRow {
  label: string;
  value: string;
  bold?: boolean;
}

export interface TransactionSummaryModalProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  rows: TransactionRow[];
  headerIconSource?: ImageSourcePropType;
  bracsReward?: number;
  bracsBoost?: string | number;
  rewardBannerLabel?: string;
  rewardBannerValue?: string;
  paymentOptions?: PaymentOption[];
  selectedPaymentId?: string;
  onPaymentSelect?: (id: string) => void;
  onSeeAll?: () => void;
  onFundWallet?: () => void;
  walletBalance?: number;
  isLoadingBalance?: boolean;
  ctaLabel?: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
}

export function TransactionSummaryModal({
  visible,
  onClose,
  amount,
  rows,
  headerIconSource,
  bracsReward = 0,
  bracsBoost = 0,
  rewardBannerLabel,
  rewardBannerValue,
  paymentOptions = [],
  selectedPaymentId,
  onPaymentSelect,
  onSeeAll,
  onFundWallet,
  walletBalance,
  isLoadingBalance = false,
  ctaLabel = "Confirm",
  isSubmitting = false,
  onConfirm,
}: TransactionSummaryModalProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const numericBoost = Number(bracsBoost || 0);
  const effectivePaymentOptions =
    paymentOptions.length > 0
      ? paymentOptions
      : [
          {
            id: "brane_wallet",
            label: "Brane Wallet - ₦ --",
            icon: "B",
          },
        ];
  const effectiveSelectedPaymentId =
    selectedPaymentId || effectivePaymentOptions[0]?.id || "brane_wallet";
  const effectiveOnPaymentSelect = onPaymentSelect || (() => {});
  const defaultRewardValue =
    numericBoost > 0
      ? `${Number(bracsReward || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}+${numericBoost.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `${Number(bracsReward || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bracs`;

  // Only enforce balance checks when payment methods are shown and a numeric
  // wallet balance is explicitly provided by the caller.
  const shouldCheckBalance =
    effectivePaymentOptions.length > 0 && typeof walletBalance === "number";
  const isInsufficientBalance = shouldCheckBalance && amount > walletBalance;

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.summaryModalCard, { backgroundColor: C.background }]}
          onPress={() => {}}
        >
          {/* Grabber */}
          <View
            style={[styles.summaryModalHandle, { backgroundColor: C.border }]}
          />

          {headerIconSource ? (
            <Image
              source={headerIconSource}
              style={[styles.summaryHeaderIcon, { borderRadius: 50 }]}
              resizeMode='contain'
            />
          ) : null}

          {/* Amount */}
          <ThemedText style={[styles.summaryAmountText, { color: C.text }]}>
            ₦{formatMoney(amount)}
          </ThemedText>

          {/* Transaction Summary rows */}
          <View style={styles.summaryCard}>
            <ThemedText style={[styles.summaryTitle, { color: C.text }]}>
              Transaction Summary
            </ThemedText>
            {rows.map((row, idx) => (
              <View key={`${row.label}-${idx}`}>
                {idx === rows.length - 1 && (
                  <View
                    style={[
                      styles.summaryDivider,
                      { backgroundColor: C.border },
                    ]}
                  />
                )}
                <View style={styles.summaryRow}>
                  <ThemedText
                    style={[styles.summaryRowLabel, { color: C.muted }]}
                  >
                    {row.label}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.summaryRowValue,
                      { color: C.text },
                      row.bold && { color: C.primary, fontWeight: "700" },
                    ]}
                  >
                    {row.value}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>

          
          {bracsReward > 0 && (
            <TouchableOpacity
              style={styles.bracsRewardBanner}
              onPress={() => setShowTooltip(true)}
              activeOpacity={0.8}
            >
              <View style={styles.bracsRewardLeft}>
                <BracsInfoIcon size={18} />
                <ThemedText style={[styles.bracsRewardText, { color: C.text }]}>
                  {rewardBannerLabel || "Bracs + Brac Booster"}
                </ThemedText>
              </View>
              <ThemedText style={[styles.bracsRewardValue, { color: C.text }]}>
                {rewardBannerValue || defaultRewardValue}
              </ThemedText>
            </TouchableOpacity>
          )}

          {/* Payment Method Selector */}
          <PaymentMethodSelector
            options={effectivePaymentOptions}
            selectedId={effectiveSelectedPaymentId}
            onSelect={effectiveOnPaymentSelect}
            onSeeAll={onSeeAll}
            walletBalance={walletBalance}
            amount={amount}
            onFundWallet={onFundWallet}
            isLoadingBalance={isLoadingBalance}
          />

          {/* CTA Button */}
          <BraneButton
            text={ctaLabel}
            backgroundColor={isInsufficientBalance ? C.muted : C.primary}
            textColor={C.googleBg}
            height={52}
            style={{ marginBottom: 20 }}
            loading={isSubmitting}
            onPress={() => !isInsufficientBalance && onConfirm()}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Bracs Tooltip Modal — outside inner card to avoid nesting issue */}
      <Modal
        visible={showTooltip}
        transparent
        animationType='fade'
        onRequestClose={() => setShowTooltip(false)}
      >
        <View
          style={[
            styles.inlineTooltipOverlay,
            {
              backgroundColor: "#013D254D",
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.inlineTooltipCard,
              { backgroundColor: C.background },
            ]}
            onPress={() => {}}
          >
            <ThemedText style={[styles.bracsTooltipTitle, { color: C.text }]}>
              Rebate + Added Funds
            </ThemedText>
            <ThemedText style={[styles.bracsTooltipBody, { color: C.text }]}>
              Bracs are the bonus you get from every transaction and{" "}
              <Text style={styles.bracsTooltipGold}>
                can be used for investment
              </Text>
              .
            </ThemedText>
            <ThemedText style={[styles.bracsTooltipBody, { color: C.text }]}>
              Cash boost are additional tips added to boost your portfolio
              balance (200 on 15 transactions a month = extra 3000 in your
              investment portfolio)
            </ThemedText>
            <TouchableOpacity
              style={[styles.tooltipOkayBtn, { backgroundColor: C.primary }]}
              onPress={() => setShowTooltip(false)}
              activeOpacity={0.85}
            >
              <Text style={[styles.tooltipOkayText, { color: C.googleBg }]}>
                Okay
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: MODAL_OVERLAY_COLOR,
    justifyContent: "flex-end",
  },
  summaryModalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28,
    gap: 14,
    maxHeight: "92%",
    overflow: "hidden",
  },
  summaryModalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 6,
  },
  summaryAmountText: {
    fontSize: 21,
    fontWeight: "700",
    textAlign: "center",
    paddingVertical: 8,
  },
  summaryHeaderIcon: {
    width: 42,
    height: 42,
    alignSelf: "center",
    marginTop: 4,
  },
  summaryCard: {
    gap: 4,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    backgroundColor: "#F8FCFA",
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
  },
  summaryRowLabel: {
    fontSize: 13,
    flex: 1,
  },
  summaryRowValue: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    flexShrink: 0,
  },
  bracsRewardBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F5F0DC",
  },
  bracsRewardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  bracsRewardText: {
    fontSize: 13,
    fontWeight: "500",
  },
  bracsRewardValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  inlineTooltipOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  inlineTooltipCard: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 12,
    alignSelf: "stretch",
  },
  bracsTooltipTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  bracsTooltipBody: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  bracsTooltipGold: {
    fontSize: 13,
    lineHeight: 20,
    color: "#C2A83E",
  },
  tooltipOkayBtn: {
    marginTop: 4,
    height: 56,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  tooltipOkayText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
