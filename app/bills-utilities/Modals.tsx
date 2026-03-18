/**
 * bills-utilities/Modals.tsx
 *
 * All overlay modals for the bills/utilities flow, extracted from select.tsx.
 * Each modal is a named export receiving the exact state slices it needs.
 */

import { BraneButton } from "@/components/brane-button";
import {
  PaymentMethodSelector,
  type PaymentOption,
} from "@/components/payment-method-selector";
import { BracsInfoIcon } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { CloseCircle, SearchNormal1 } from "iconsax-react-native";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getElectricityImageKey } from "./helpers";
import {
  BOOST_PRESETS,
  ELECTRICITY_IMAGES,
  NETWORK_IMAGES,
  type CablePlan,
  type DataPlan,
  type SelectOption,
} from "./types";

// ─── ContactPickerModal ────────────────────────────────────────────────────────

type ContactPickerProps = {
  visible: boolean;
  contactSearch: string;
  setContactSearch: (v: string) => void;
  filteredContacts: { name: string; phone: string }[];
  onClose: () => void;
  onSelect: (phone: string) => void;
};

export function ContactPickerModal({
  visible,
  contactSearch,
  setContactSearch,
  filteredContacts,
  onClose,
  onSelect,
}: ContactPickerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.modalCard, { maxHeight: "80%" }]}
          onPress={() => {}}
        >
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Select Contact</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <CloseCircle size={18} color="#6E6E75" variant="Outline" />
            </TouchableOpacity>
          </View>

          <View style={styles.contactSearchRow}>
            <SearchNormal1 size={16} color="#88888F" variant="Outline" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts"
              placeholderTextColor="#A9A9AE"
              value={contactSearch}
              onChangeText={setContactSearch}
            />
          </View>

          <ScrollView
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {filteredContacts.map((c, idx) => (
              <TouchableOpacity
                key={`${c.phone}-${idx}`}
                style={styles.contactRow}
                onPress={() => {
                  const digits = c.phone.replace(/\D/g, "");
                  const normalized = digits.startsWith("0")
                    ? digits.slice(1)
                    : digits.startsWith("234")
                      ? digits.slice(3)
                      : digits;
                  onSelect(normalized);
                }}
              >
                <View style={styles.contactAvatar}>
                  <ThemedText style={styles.contactAvatarText}>
                    {(c.name[0] || "?").toUpperCase()}
                  </ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.contactName}>{c.name}</ThemedText>
                  <ThemedText style={styles.contactPhone}>{c.phone}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
            {filteredContacts.length === 0 ? (
              <ThemedText style={[styles.emptyText, { padding: 16 }]}>
                No contacts found
              </ThemedText>
            ) : null}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── BoostModal ────────────────────────────────────────────────────────────────

type BoostModalProps = {
  visible: boolean;
  boostAmount: string;
  setBoostAmount: (v: string) => void;
  onSkip: () => void;
  onAdd: () => void;
};

export function BoostModal({
  visible,
  boostAmount,
  setBoostAmount,
  onSkip,
  onAdd,
}: BoostModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onSkip}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onSkip}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.boostModalCard}
          onPress={() => {}}
        >
          <ThemedText style={styles.boostModalTitle}>
            Boost Bracs Balance
          </ThemedText>
          <ThemedText style={styles.boostModalDesc}>
            You can boost your investment wallet by adding a tip to this
            transaction, which would be added to your bracs balance.
          </ThemedText>
          <ThemedText style={styles.boostSelectLabel}>
            Select amount to add
          </ThemedText>
          <View style={styles.boostPresetsRow}>
            {BOOST_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.boostPresetChip,
                  boostAmount === preset && styles.boostPresetChipActive,
                ]}
                onPress={() => setBoostAmount(preset)}
              >
                <ThemedText
                  style={[
                    styles.boostPresetChipText,
                    boostAmount === preset && styles.boostPresetChipTextActive,
                  ]}
                >
                  ₦{Number(preset).toLocaleString()}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.boostActions}>
            <BraneButton
              text="Dont Add"
              onPress={onSkip}
              backgroundColor="#D2F1E4"
              textColor="#013D25"
              height={50}
              radius={32}
              style={{ flex: 1 }}
            />
            <BraneButton
              text="Add Fee"
              onPress={onAdd}
              backgroundColor="#013D25"
              textColor="#D2F1E4"
              height={50}
              radius={32}
              style={{ flex: 1 }}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── SummaryModal ──────────────────────────────────────────────────────────────

type SummaryModalProps = {
  visible: boolean;
  onClose: () => void;
  amountToPay: number;
  bracsRewardAmount: number;
  networkImageKey: string;
  networkLabel: string;
  phone: string;
  boostAmount: string;
  paymentOptions: PaymentOption[];
  paymentId: string;
  setPaymentId: (v: string) => void;
  ctaLabel: string;
  isSubmitting: boolean;
  onSeeAll?: () => void;
  onConfirm: () => void;
};

function formatMoney(value: number) {
  return Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function SummaryModal({
  visible,
  onClose,
  amountToPay,
  bracsRewardAmount,
  networkImageKey,
  networkLabel,
  phone,
  boostAmount,
  paymentOptions,
  paymentId,
  setPaymentId,
  ctaLabel,
  isSubmitting,
  onSeeAll,
  onConfirm,
}: SummaryModalProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.summaryModalCard}
          onPress={() => {}}
        >
          <View style={styles.summaryModalHandle} />

          <View style={styles.summaryAmountWrap}>
            <View style={styles.summaryNetworkCircle}>
              {NETWORK_IMAGES[networkImageKey] ? (
                <Image
                  source={NETWORK_IMAGES[networkImageKey]}
                  style={styles.summaryNetworkImg}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.summaryCoinEmoji}>🪙</Text>
              )}
            </View>
            <ThemedText style={styles.summaryAmountText}>
              ₦{formatMoney(amountToPay)}
            </ThemedText>
          </View>

          <View style={styles.summaryCard}>
            <ThemedText style={styles.summaryTitle}>
              Transaction Summary
            </ThemedText>
            {[
              { label: "Provider", value: networkLabel },
              { label: "Sending to", value: phone },
              {
                label: "Transaction Amount",
                value: `₦ ${formatMoney(amountToPay)}`,
              },
              {
                label: "Cash Boost",
                value: `₦ ${formatMoney(Number(boostAmount || 0))}`,
              },
              { label: "Service Fee", value: "₦ 0.00" },
              {
                label: "Total Debit",
                value: `₦ ${formatMoney(amountToPay + Number(boostAmount || 0))}`,
                bold: true,
              },
            ].map((row, idx) => (
              <View key={idx}>
                {idx === 5 && <View style={styles.summaryDivider} />}
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryRowLabel}>
                    {row.label}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.summaryRowValue,
                      row.bold && { color: "#013D25", fontWeight: "700" },
                    ]}
                  >
                    {row.value}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.bracsRewardBanner}
            onPress={() => setShowTooltip(true)}
            activeOpacity={0.8}
          >
            <View style={styles.bracsRewardLeft}>
              <BracsInfoIcon size={16} />
              <ThemedText style={styles.bracsRewardText}>
                Bracs reward + cash boost
              </ThemedText>
            </View>
            <ThemedText style={styles.bracsRewardValue}>
              {bracsRewardAmount}+{boostAmount || "0"}
            </ThemedText>
          </TouchableOpacity>

          {paymentOptions.length > 0 ? (
            <PaymentMethodSelector
              options={paymentOptions}
              selectedId={paymentId}
              onSelect={setPaymentId}
              onSeeAll={onSeeAll}
            />
          ) : null}

          <BraneButton
            text={ctaLabel}
            onPress={onConfirm}
            backgroundColor="#013D25"
            textColor="#D2F1E4"
            height={52}
            radius={12}
            loading={isSubmitting}
          />

          {/* Bracs tooltip — full-screen modal on top of summary sheet */}
          <Modal
            visible={showTooltip}
            transparent
            animationType="fade"
            onRequestClose={() => setShowTooltip(false)}
          >
            <View style={styles.inlineTooltipOverlay}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.inlineTooltipCard}
                onPress={() => {}}
              >
                <ThemedText style={styles.bracsTooltipTitle}>
                  Rebate+ Added Funds
                </ThemedText>
                <Text style={styles.bracsTooltipBody}>
                  {
                    "Bracs reward is the bonus you get from every transaction and "
                  }
                  <Text style={styles.bracsTooltipGold}>
                    can be use for investment
                  </Text>
                  {"."}
                </Text>
                <Text style={styles.bracsTooltipBody}>
                  {
                    "Cash boost are additional tip added to boost your portfolio balance (200 on 15 transactions a month = extra 3000 in your investment portfolio)"
                  }
                </Text>
                <TouchableOpacity
                  style={styles.tooltipOkayBtn}
                  onPress={() => setShowTooltip(false)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.tooltipOkayText}>Okay</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </Modal>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── BracsTooltipModal ─────────────────────────────────────────────────────────

type BracsTooltipProps = {
  visible: boolean;
  onClose: () => void;
};

export function BracsTooltipModal({ visible, onClose }: BracsTooltipProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.tooltipOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.bracsTooltipCard}
          onPress={() => {}}
        >
          <ThemedText style={styles.bracsTooltipTitle}>
            Rebate+ Added Funds
          </ThemedText>
          <ThemedText style={styles.bracsTooltipBody}>
            Bracs reward is the bonus you get from every transaction and can be
            used for investment.
          </ThemedText>
          <ThemedText style={styles.bracsTooltipBody}>
            Cash boost are additional tips added to boost your portfolio balance
            (200 on 15 transactions a month = extra 3000 in your investment
            portfolio).
          </ThemedText>
          <BraneButton
            text="Okay"
            onPress={onClose}
            backgroundColor="#013D25"
            textColor="#D2F1E4"
            height={46}
            radius={10}
            style={{ marginTop: 4 }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── DataPlanModal ─────────────────────────────────────────────────────────────

type DataPlanModalProps = {
  visible: boolean;
  onClose: () => void;
  dataPlans: DataPlan[];
  selectedDataPlanId: string;
  dataPlanCategory: "hot" | "daily" | "weekly" | "monthly" | "yearly";
  setDataPlanCategory: (
    v: "hot" | "daily" | "weekly" | "monthly" | "yearly",
  ) => void;
  onSelect: (planId: string) => void;
};

const DATA_PLAN_TABS = [
  { key: "hot", label: "Hot Deals 🔥" },
  { key: "daily", label: "Daily Plans" },
  { key: "weekly", label: "Weekly Plans" },
  { key: "monthly", label: "Monthly Plans" },
  { key: "yearly", label: "Yearly Plans" },
] as const;

function filterPlans(
  plans: DataPlan[],
  category: DataPlanModalProps["dataPlanCategory"],
) {
  return plans.filter((plan) => {
    const lbl = plan.label.toLowerCase();
    switch (category) {
      case "hot":
        return (
          lbl.includes("hot") ||
          lbl.includes("social") ||
          (!lbl.includes("day") &&
            !lbl.includes("week") &&
            !lbl.includes("month") &&
            !lbl.includes("year"))
        );
      case "daily":
        return lbl.includes("day") || lbl.includes("daily");
      case "weekly":
        return lbl.includes("week");
      case "monthly":
        return lbl.includes("month") || lbl.includes("30");
      case "yearly":
        return (
          lbl.includes("year") || lbl.includes("365") || lbl.includes("annual")
        );
    }
  });
}

function getBadge(label: string): string {
  const lbl = label.toLowerCase();
  if (lbl.includes("day") || lbl.includes("daily")) return "DP";
  if (lbl.includes("week")) return "WP";
  if (lbl.includes("month") || lbl.includes("30")) return "MP";
  if (lbl.includes("year") || lbl.includes("365") || lbl.includes("annual"))
    return "YP";
  return "HD";
}

export function DataPlanModal({
  visible,
  onClose,
  dataPlans,
  selectedDataPlanId,
  dataPlanCategory,
  setDataPlanCategory,
  onSelect,
}: DataPlanModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.modalCard, { maxHeight: "80%" }]}
          onPress={() => {}}
        >
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Select Plan</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <CloseCircle size={18} color="#6E6E75" variant="Outline" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.planCategoryScroll}
            contentContainerStyle={styles.planCategoryRow}
          >
            {DATA_PLAN_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.planCategoryTab,
                  dataPlanCategory === tab.key && styles.planCategoryTabActive,
                ]}
                onPress={() => setDataPlanCategory(tab.key)}
              >
                <ThemedText
                  style={[
                    styles.planCategoryTabText,
                    dataPlanCategory === tab.key &&
                      styles.planCategoryTabTextActive,
                  ]}
                >
                  {tab.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
          >
            {filterPlans(dataPlans, dataPlanCategory).map((plan) => {
              const selected = selectedDataPlanId === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={styles.planRadioRow}
                  onPress={() => onSelect(plan.id)}
                >
                  <View style={styles.planBadge}>
                    <ThemedText style={styles.planBadgeText}>
                      {getBadge(plan.label)}
                    </ThemedText>
                  </View>
                  <View style={styles.planRadioInfo}>
                    <ThemedText style={styles.planRadioLabel}>
                      {plan.label}
                    </ThemedText>
                    <ThemedText style={styles.planRadioAmount}>
                      ₦{plan.amount.toLocaleString("en-NG")}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      selected && styles.radioCircleSelected,
                    ]}
                  >
                    {selected && <View style={styles.radioCircleInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
            {dataPlans.length === 0 ? (
              <ThemedText style={[styles.emptyText, { padding: 16 }]}>
                No data plans available for this provider.
              </ThemedText>
            ) : null}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── ElectricityProviderModal ──────────────────────────────────────────────────

type ElectricityProviderModalProps = {
  visible: boolean;
  onClose: () => void;
  providers: SelectOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function ElectricityProviderModal({
  visible,
  onClose,
  providers,
  selectedId,
  onSelect,
}: ElectricityProviderModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalCard}
          onPress={() => {}}
        >
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Select Provider</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <CloseCircle size={18} color="#6E6E75" variant="Outline" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
          >
            {providers.map((item) => {
              const imageKey = getElectricityImageKey(
                `${item.id} ${item.label} ${item.description || ""}`,
              );
              const logo = imageKey ? ELECTRICITY_IMAGES[imageKey] : undefined;
              const selected = selectedId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.providerModalRow,
                    selected && styles.providerModalRowActive,
                  ]}
                  onPress={() => onSelect(item.id)}
                >
                  {logo ? (
                    <Image
                      source={logo}
                      style={styles.providerModalLogo}
                      resizeMode="contain"
                    />
                  ) : null}
                  <View style={styles.providerModalTextWrap}>
                    <ThemedText style={styles.providerModalTitle}>
                      {item.label.toUpperCase()}
                    </ThemedText>
                    <ThemedText style={styles.providerModalSubtitle}>
                      (
                      {(item.description || "")
                        .replace(/-/g, " ")
                        .toUpperCase()}
                      )
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── TransportPlanModal ────────────────────────────────────────────────────────

type TransportPlanModalProps = {
  visible: boolean;
  onClose: () => void;
  transportPlans: DataPlan[];
  selectedTransportPlanId: string;
  onSelect: (planId: string, amount: number) => void;
};

export function TransportPlanModal({
  visible,
  onClose,
  transportPlans,
  selectedTransportPlanId,
  onSelect,
}: TransportPlanModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalCard}
          onPress={() => {}}
        >
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>
              Select Transport Plan
            </ThemedText>
            <TouchableOpacity onPress={onClose}>
              <CloseCircle size={18} color="#6E6E75" variant="Outline" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
          >
            {transportPlans.map((plan) => {
              const selected = selectedTransportPlanId === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.modalListRow,
                    selected && styles.modalListRowActive,
                  ]}
                  onPress={() => onSelect(plan.id, plan.amount)}
                >
                  <ThemedText
                    style={[
                      styles.modalListTitle,
                      selected && styles.modalListTitleActive,
                    ]}
                  >
                    {plan.label}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.modalListAmount,
                      selected && styles.modalListAmountActive,
                    ]}
                  >
                    ₦{plan.amount.toLocaleString("en-NG")}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── CablePlanModal ────────────────────────────────────────────────────────────

type CablePlanModalProps = {
  visible: boolean;
  onClose: () => void;
  cablePlans: CablePlan[];
  selectedCablePlanId: string;
  onSelect: (planId: string) => void;
};

export function CablePlanModal({
  visible,
  onClose,
  cablePlans,
  selectedCablePlanId,
  onSelect,
}: CablePlanModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalCard}
          onPress={() => {}}
        >
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>
              Select Subscription Plan
            </ThemedText>
            <TouchableOpacity onPress={onClose}>
              <CloseCircle size={18} color="#6E6E75" variant="Outline" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
          >
            {cablePlans.map((plan) => {
              const selected = selectedCablePlanId === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.modalListRow,
                    selected && styles.modalListRowActive,
                  ]}
                  onPress={() => onSelect(plan.id)}
                >
                  <ThemedText
                    style={[
                      styles.modalListTitle,
                      selected && styles.modalListTitleActive,
                    ]}
                  >
                    {plan.label}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.modalListAmount,
                      selected && styles.modalListAmountActive,
                    ]}
                  >
                    ₦{plan.amount.toLocaleString("en-NG")}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Shared styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(11,0,20,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    maxHeight: "72%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalTitle: { fontSize: 14, color: "#0B0014", fontWeight: "700" },
  modalList: { maxHeight: 420 },
  modalListRow: {
    borderWidth: 1,
    borderColor: "#E7E7EB",
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  modalListRowActive: { borderColor: "#013D25", backgroundColor: "#F2FAF6" },
  modalListTitle: { fontSize: 12, color: "#1D1D22", fontWeight: "600" },
  modalListTitleActive: { color: "#013D25" },
  modalListAmount: { marginTop: 2, fontSize: 11, color: "#676770" },
  modalListAmountActive: { color: "#013D25" },
  emptyText: { fontSize: 10, color: "#8E8E93" },
  // Contact picker
  contactSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E9E9EC",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    backgroundColor: "#F8F8FA",
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 12, color: "#101014" },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F4",
  },
  contactAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EAF4EF",
    alignItems: "center",
    justifyContent: "center",
  },
  contactAvatarText: { fontSize: 14, fontWeight: "700", color: "#013D25" },
  contactName: { fontSize: 13, color: "#0B0014", fontWeight: "600" },
  contactPhone: { fontSize: 11, color: "#7A7A80", marginTop: 2 },
  // Boost modal
  boostModalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
    gap: 24,
  },
  boostModalTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#0B0014",
    textAlign: "center",
  },
  boostModalDesc: {
    fontSize: 12,
    color: "#6E6E75",
    lineHeight: 20,
    textAlign: "center",
  },
  boostSelectLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6E6E75",
    marginTop: 2,
  },
  boostPresetsRow: { flexDirection: "row", gap: 10 },
  boostPresetChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#F7F7F8",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  boostPresetChipActive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#013D25",
    borderWidth: 2,
  },
  boostPresetChipText: { fontSize: 13, fontWeight: "600", color: "#3A3A40" },
  boostPresetChipTextActive: { color: "#013D25" },
  boostActions: { flexDirection: "row", gap: 12, marginTop: 4 },
  // Summary modal
  summaryModalCard: {
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#D8D8DB",
    alignSelf: "center",
    marginBottom: 6,
  },
  summaryAmountWrap: { alignItems: "center", paddingVertical: 16, gap: 10 },
  summaryNetworkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryNetworkImg: { width: 42, height: 42, borderRadius: 32 },
  summaryCoinEmoji: { fontSize: 30, lineHeight: 36 },
  summaryAmountText: { fontSize: 21, fontWeight: "600", color: "#0B0014" },
  summaryCard: {
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#F8FCFA",
    gap: 4,
  },
  summaryTitle: {
    fontSize: 12,
    color: "#0B0014",
    fontWeight: "500",
    marginBottom: 16,
  },
  summaryDivider: { height: 1, backgroundColor: "#F0F0F3", marginVertical: 8 },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryRowLabel: { fontSize: 12, color: "#7A7A80", flex: 1 },
  summaryRowValue: {
    fontSize: 12,
    color: "#0B0014",
    fontWeight: "500",
    textAlign: "right",
    flexShrink: 0,
  },
  bracsRewardBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#C3A93F4D",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bracsRewardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  bracsRewardText: { fontSize: 12, color: "#0B0014", fontWeight: "500" },
  bracsRewardValue: { fontSize: 12, color: "#0B0014", fontWeight: "500" },
  // Bracs tooltip modal
  tooltipOverlay: {
    flex: 1,
    backgroundColor: "rgba(11,0,20,0.45)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  bracsTooltipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    textAlign: "center",
  },
  bracsTooltipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B0014",
    textAlign: "center",
  },
  bracsTooltipBody: {
    fontSize: 13,
    color: "#0B0014",
    lineHeight: 20,
    textAlign: "center",
  },
  bracsTooltipGold: {
    fontSize: 13,
    color: "#C2A83E",
    lineHeight: 20,
  },
  // Inline tooltip — full-screen scrim modal
  inlineTooltipOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  inlineTooltipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 12,
    alignSelf: "stretch",
  },
  tooltipOkayBtn: {
    marginTop: 4,
    height: 56,
    borderRadius: 32,
    backgroundColor: "#013D25",
    alignItems: "center",
    justifyContent: "center",
  },
  tooltipOkayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Data plan modal
  planCategoryScroll: { flexGrow: 0, marginBottom: 4 },
  planCategoryRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 10,
  },
  planCategoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E4",
    backgroundColor: "#F5F5F7",
  },
  planCategoryTabActive: { backgroundColor: "#D2F1E4", borderColor: "#013D25" },
  planCategoryTabText: { fontSize: 12, color: "#6E6E75", fontWeight: "500" },
  planCategoryTabTextActive: { color: "#013D25", fontWeight: "700" },
  planRadioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F4",
    paddingHorizontal: 4,
  },
  planBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EAF0F6",
    alignItems: "center",
    justifyContent: "center",
  },
  planBadgeText: { fontSize: 10, fontWeight: "700", color: "#3A5A7A" },
  planRadioInfo: { flex: 1, gap: 2 },
  planRadioLabel: { fontSize: 13, color: "#0B0014", fontWeight: "500" },
  planRadioAmount: { fontSize: 12, color: "#6E6E75" },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#C0C0C6",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: { borderColor: "#013D25" },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#013D25",
  },
  // Electricity provider modal
  providerModalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F3",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  providerModalRowActive: {
    backgroundColor: "#F2FAF6",
    borderRadius: 8,
    borderBottomColor: "#F2FAF6",
    paddingHorizontal: 8,
  },
  providerModalLogo: { width: 37, height: 37, borderRadius: 18 },
  providerModalTextWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
    flex: 1,
  },
  providerModalTitle: { fontSize: 14, color: "#0B0014", fontWeight: "600" },
  providerModalSubtitle: { fontSize: 12, color: "#5B5760" },
});
