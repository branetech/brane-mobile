/**
 * bills-utilities/Modals.tsx
 *
 * All overlay modals for the bills/utilities flow, extracted from select.tsx.
 * Each modal is a named export receiving the exact state slices it needs.
 */

import { BraneButton } from "@/components/brane-button";
import type { PaymentOption } from "@/components/payment-method-selector";
import { ThemedText } from "@/components/themed-text";
import {
  TransactionSummaryModal,
  type TransactionRow,
} from "@/components/transaction-summary-modal";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEarnedBracs } from "@/utils/brac";
import { CloseCircle, SearchNormal1 } from "iconsax-react-native";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getBettingImageKey, getElectricityImageKey, getTransportImageKey } from "./helpers";
import {
  BETTING_IMAGES,
  BOOST_PRESETS,
  ELECTRICITY_IMAGES,
  NETWORK_IMAGES,
  TRANSPORT_IMAGES,
  type CablePlan,
  type DataPlan,
  type SelectOption,
  type TransportRoute,
} from "./types";

// ─── ContactPickerModal ────────────────────────────────────────────────────────

type ContactPickerProps = {
  visible: boolean;
  position?: ModalPosition;
  contactSearch: string;
  setContactSearch: (v: string) => void;
  filteredContacts: { name: string; phone: string }[];
  onClose: () => void;
  onSelect: (phone: string) => void;
};

type ModalPosition = "top" | "center" | "bottom";

type ModalShellProps = {
  visible: boolean;
  onClose: () => void;
  animationType?: "none" | "slide" | "fade";
  position?: ModalPosition;
  cardStyle?: any;
  overlayStyle?: any;
  children: React.ReactNode;
};

function ModalShell({
  visible,
  onClose,
  animationType = "slide",
  position = "bottom",
  cardStyle,
  overlayStyle,
  children,
}: ModalShellProps) {
  const positionStyle =
    position === "top"
      ? styles.modalOverlayTop
      : position === "center"
        ? styles.modalOverlayCenter
        : styles.modalOverlayBottom;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={[styles.modalOverlay, positionStyle, overlayStyle]}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.modalCard, cardStyle]}
          onPress={() => {}}
        >
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

export function ContactPickerModal({
  visible,
  position,
  contactSearch,
  setContactSearch,
  filteredContacts,
  onClose,
  onSelect,
}: ContactPickerProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <ModalShell
      visible={visible}
      onClose={onClose}
      position={position}
      cardStyle={{ maxHeight: "80%", backgroundColor: C.background }}
    >
      <View style={styles.modalHeader}>
        <ThemedText style={[styles.modalTitle, { color: C.text }]}>
          Select Contact
        </ThemedText>
        <TouchableOpacity onPress={onClose}>
          <CloseCircle size={18} color={C.muted} variant='Outline' />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.contactSearchRow,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
      >
        <SearchNormal1 size={16} color={C.muted} variant='Outline' />
        <TextInput
          style={[styles.searchInput, { color: C.text }]}
          placeholder='Search contacts'
          placeholderTextColor={C.muted}
          value={contactSearch}
          onChangeText={setContactSearch}
        />
      </View>

      <ScrollView
        style={styles.modalList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        {filteredContacts.map((c, idx) => (
          <TouchableOpacity
            key={`${c.phone}-${idx}`}
            style={[styles.contactRow, { borderBottomColor: C.border }]}
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
            <View
              style={[
                styles.contactAvatar,
                { backgroundColor: C.primary + "20" },
              ]}
            >
              <ThemedText
                style={[styles.contactAvatarText, { color: C.primary }]}
              >
                {(c.name[0] || "?").toUpperCase()}
              </ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.contactName, { color: C.text }]}>
                {c.name}
              </ThemedText>
              <ThemedText style={[styles.contactPhone, { color: C.muted }]}>
                {c.phone}
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
        {filteredContacts.length === 0 ? (
          <ThemedText
            style={[styles.emptyText, { padding: 16, color: C.muted }]}
          >
            No contacts found
          </ThemedText>
        ) : null}
      </ScrollView>
    </ModalShell>
  );
}

// ─── BoostModal ────────────────────────────────────────────────────────────────

type BoostModalProps = {
  visible: boolean;
  position?: ModalPosition;
  boostAmount: string;
  setBoostAmount: (v: string) => void;
  onSkip: () => void;
  onAdd: () => void;
};

export function BoostModal({
  visible,
  position,
  boostAmount,
  setBoostAmount,
  onSkip,
  onAdd,
}: BoostModalProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <ModalShell
      visible={visible}
      onClose={onSkip}
      position={position}
      cardStyle={[styles.boostModalCard, { backgroundColor: C.background }]}
    >
      <ThemedText style={[styles.boostModalTitle, { color: C.text }]}>
        Boost Bracs Balance
      </ThemedText>
      <ThemedText style={[styles.boostModalDesc, { color: C.muted }]}>
        You can boost your investment wallet by adding a tip to this
        transaction, which would be added to your bracs balance.
      </ThemedText>
      <ThemedText style={[styles.boostSelectLabel, { color: C.muted }]}>
        Select amount to add
      </ThemedText>
      <View style={styles.boostPresetsRow}>
        {BOOST_PRESETS.map((preset) => (
          <TouchableOpacity
            key={preset}
            style={[
              styles.boostPresetChip,
              { backgroundColor: C.inputBg, borderColor: C.border },
              boostAmount === preset && {
                borderColor: C.primary,
                borderWidth: 2,
                backgroundColor: C.background,
              },
            ]}
            onPress={() => setBoostAmount(preset)}
          >
            <ThemedText
              style={[
                styles.boostPresetChipText,
                { color: C.text },
                boostAmount === preset && { color: C.primary },
              ]}
            >
              ₦{Number(preset).toLocaleString()}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.boostActions}>
        <BraneButton
          text='Ignore'
          onPress={onSkip}
          backgroundColor={C.inputBg}
          textColor={C.primary}
          height={50}
          radius={32}
          style={{ flex: 1 }}
        />
        <BraneButton
          text='Boost It!'
          onPress={onAdd}
          backgroundColor={C.primary}
          textColor={C.googleBg}
          height={50}
          radius={32}
          style={{ flex: 1 }}
        />
      </View>
    </ModalShell>
  );
}

// ─── SummaryModal ──────────────────────────────────────────────────────────────

type SummaryModalProps = {
  visible: boolean;
  onClose: () => void;
  isAirtime: boolean;
  amountToPay: number;
  bracsRewardAmount: number;
  networkImageKey: string;
  networkLabel: string;
  phone: string;
  boostAmount: string;
  paymentOptions: PaymentOption[];
  walletBalance?: number;
  paymentId: string;
  setPaymentId: (v: string) => void;
  ctaLabel: string;
  isSubmitting: boolean;
  onSeeAll?: () => void;
  onFundWallet?: () => void;
  showPaymentMethod?: boolean;
  onConfirm: () => void;
  extraRows?: TransactionRow[];
};

function formatMoney(value: number) {
  return Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatBracs(value: number) {
  return Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function SummaryModal({
  visible,
  onClose,
  isAirtime,
  amountToPay,
  bracsRewardAmount,
  networkImageKey,
  networkLabel,
  phone,
  boostAmount,
  paymentOptions,
  walletBalance,
  paymentId,
  setPaymentId,
  ctaLabel,
  isSubmitting,
  onSeeAll,
  onFundWallet,
  showPaymentMethod = true,
  onConfirm,
  extraRows = [],
}: SummaryModalProps) {
  const boostValue = Number(boostAmount || 0);
  const appliedBoost = isAirtime ? boostValue : 0;

  const rows: TransactionRow[] = [
    { label: "Provider", value: networkLabel },
    { label: "Sending to", value: phone },
    ...extraRows,
    {
      label: "Transaction Amount",
      value: `₦ ${formatMoney(amountToPay)}`,
    },
    ...(isAirtime
      ? [
          {
            label: "Cash Boost",
            value: `₦ ${formatMoney(appliedBoost)}`,
          } as TransactionRow,
        ]
      : []),
    { label: "Service Fee", value: "₦ 0.00" },
    {
      label: "Total Debit",
      value: `₦ ${formatMoney(amountToPay + appliedBoost)}`,
      bold: true,
    },
  ];
  const bracs = useEarnedBracs({
    serviceId: networkLabel,
    amount: amountToPay,
    serviceType: "airtime",
  });

  return (
    <TransactionSummaryModal
      visible={visible}
      onClose={onClose}
      amount={amountToPay}
      rows={rows}
      headerIconSource={NETWORK_IMAGES[networkImageKey] || NETWORK_IMAGES.mtn}
      bracsReward={bracs}
      bracsBoost={appliedBoost}
      rewardBannerLabel={
        isAirtime ? "Bracs reward + cash boost" : "Bracs reward"
      }
      rewardBannerValue={
        isAirtime
          ? `${formatBracs(bracs)}+${formatBracs(appliedBoost)}`
          : `${formatBracs(bracs)}`
      }
      paymentOptions={showPaymentMethod ? paymentOptions : []}
      walletBalance={walletBalance}
      selectedPaymentId={showPaymentMethod ? paymentId : undefined}
      onPaymentSelect={showPaymentMethod ? setPaymentId : undefined}
      onSeeAll={onSeeAll}
      onFundWallet={showPaymentMethod ? onFundWallet : undefined}
      ctaLabel={ctaLabel}
      isSubmitting={isSubmitting}
      onConfirm={onConfirm}
    />
  );
}

// ─── BracsTooltipModal ─────────────────────────────────────────────────────────

type BracsTooltipProps = {
  visible: boolean;
  position?: ModalPosition;
  onClose: () => void;
};

export function BracsTooltipModal({
  visible,
  onClose,
  position = "center",
}: BracsTooltipProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <ModalShell
      visible={visible}
      onClose={onClose}
      animationType='fade'
      position={position}
      overlayStyle={{ backgroundColor: "#013D254D" }}
      cardStyle={[styles.bracsTooltipCard, { backgroundColor: C.background }]}
    >
      <ThemedText style={[styles.bracsTooltipTitle, { color: C.text }]}>
        Rebate+ Added Funds
      </ThemedText>
      <ThemedText style={[styles.bracsTooltipBody, { color: C.text }]}>
        Bracs reward is the bonus you get from every transaction and can be used
        for investment.
      </ThemedText>
      <ThemedText style={[styles.bracsTooltipBody, { color: C.text }]}>
        Cash boost are additional tips added to boost your portfolio balance
        (200 on 15 transactions a month = extra 3000 in your investment
        portfolio).
      </ThemedText>
      <BraneButton
        text='Okay'
        onPress={onClose}
        backgroundColor={C.primary}
        textColor={C.googleBg}
        height={46}
        radius={10}
        style={{ marginTop: 4 }}
      />
    </ModalShell>
  );
}

// ─── DataPlanModal ─────────────────────────────────────────────────────────────

type DataPlanModalProps = {
  visible: boolean;
  position?: ModalPosition;
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
  position,
  onClose,
  dataPlans,
  selectedDataPlanId,
  dataPlanCategory,
  setDataPlanCategory,
  onSelect,
}: DataPlanModalProps) {
  return (
    <ModalShell
      visible={visible}
      onClose={onClose}
      position={position}
      cardStyle={{ maxHeight: "80%" }}
    >
      <View style={styles.modalHeader}>
        <ThemedText style={styles.modalTitle}>Select Plan</ThemedText>
        <TouchableOpacity onPress={onClose}>
          <CloseCircle size={18} color='#6E6E75' variant='Outline' />
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

      <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
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
    </ModalShell>
  );
}

// ─── BettingProviderModal ──────────────────────────────────────────────────────

type BettingProviderModalProps = {
  visible: boolean;
  position?: ModalPosition;
  onClose: () => void;
  providers: SelectOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function BettingProviderModal({
  visible,
  position,
  onClose,
  providers,
  selectedId,
  onSelect,
}: BettingProviderModalProps) {
  return (
    <ModalShell visible={visible} onClose={onClose} position={position}>
      <View style={styles.modalHeader}>
        <ThemedText style={styles.modalTitle}>
          Select Betting Provider
        </ThemedText>
        <TouchableOpacity onPress={onClose}>
          <CloseCircle size={18} color='#6E6E75' variant='Outline' />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
        {providers.map((item) => {
          const selected = selectedId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.providerModalRow,
                selected && styles.providerModalRowActive,
              ]}
              onPress={() => {
                onSelect(item.id);
                onClose();
              }}
            >
              <View style={styles.providerModalTextWrap}>
                <ThemedText style={styles.providerModalTitle}>
                  {item.label}
                </ThemedText>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ModalShell>
  );
}

// ─── ElectricityProviderModal ──────────────────────────────────────────────────

type ElectricityProviderModalProps = {
  visible: boolean;
  position?: ModalPosition;
  onClose: () => void;
  providers: SelectOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function ElectricityProviderModal({
  visible,
  position,
  onClose,
  providers,
  selectedId,
  onSelect,
}: ElectricityProviderModalProps) {
  return (
    <ModalShell visible={visible} onClose={onClose} position={position}>
      <View style={styles.modalHeader}>
        <ThemedText style={styles.modalTitle}>Select Provider</ThemedText>
        <TouchableOpacity onPress={onClose}>
          <CloseCircle size={18} color='#6E6E75' variant='Outline' />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
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
                  resizeMode='contain'
                />
              ) : null}
              <View style={styles.providerModalTextWrap}>
                <ThemedText style={styles.providerModalTitle}>
                  {item.label.toUpperCase()}
                </ThemedText>
                <ThemedText style={styles.providerModalSubtitle}>
                  ({(item.description || "").replace(/-/g, " ").toUpperCase()})
                </ThemedText>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ModalShell>
  );
}

// ─── TransportProviderModal ───────────────────────────────────────────────────

type TransportProviderModalProps = {
  visible: boolean;
  position?: ModalPosition;
  onClose: () => void;
  providers: SelectOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function TransportProviderModal({
  visible,
  position,
  onClose,
  providers,
  selectedId,
  onSelect,
}: TransportProviderModalProps) {
  return (
    <ModalShell visible={visible} onClose={onClose} position={position}>
      <View style={styles.modalHeader}>
        <ThemedText style={styles.modalTitle}>Select Provider</ThemedText>
        <TouchableOpacity onPress={onClose}>
          <CloseCircle size={18} color='#6E6E75' variant='Outline' />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
        {providers.map((item) => {
          const imageKey = getTransportImageKey(item.id);
          const logo = imageKey ? TRANSPORT_IMAGES[imageKey] : undefined;
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
                  resizeMode='contain'
                />
              ) : null}
              <View style={styles.providerModalTextWrap}>
                <ThemedText style={styles.providerModalTitle}>
                  {item.label}
                </ThemedText>
                {item.description ? (
                  <ThemedText style={styles.providerModalSubtitle}>
                    {item.description}
                  </ThemedText>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ModalShell>
  );
}

// ─── TransportRouteModal ──────────────────────────────────────────────────────

type TransportRouteModalProps = {
  visible: boolean;
  position?: ModalPosition;
  onClose: () => void;
  routes: TransportRoute[];
  selectedRouteId: string;
  onSelect: (id: string) => void;
};

export function TransportRouteModal({
  visible,
  position,
  onClose,
  routes,
  selectedRouteId,
  onSelect,
}: TransportRouteModalProps) {
  return (
    <ModalShell visible={visible} onClose={onClose} position={position}>
      <View style={styles.modalHeader}>
        <ThemedText style={styles.modalTitle}>Select Route</ThemedText>
        <TouchableOpacity onPress={onClose}>
          <CloseCircle size={18} color='#6E6E75' variant='Outline' />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
        {routes.map((route) => {
          const selected = selectedRouteId === route.id;
          return (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.modalListRow,
                selected && styles.modalListRowActive,
              ]}
              onPress={() => onSelect(route.id)}
            >
              <View style={{ flex: 1 }}>
                <ThemedText
                  style={[
                    styles.modalListTitle,
                    selected && styles.modalListTitleActive,
                  ]}
                >
                  {route.label || `${route.fromStation} → ${route.toStation}`}
                </ThemedText>
                {route.departureTime ? (
                  <ThemedText style={styles.providerModalSubtitle}>
                    {route.departureTime}
                    {route.duration ? ` · ${route.duration}` : ""}
                  </ThemedText>
                ) : null}
              </View>
              <ThemedText
                style={[
                  styles.modalListAmount,
                  selected && styles.modalListAmountActive,
                ]}
              >
                ₦{route.amount.toLocaleString("en-NG")}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ModalShell>
  );
}

// ─── TransportPlanModal ────────────────────────────────────────────────────────

type TransportPlanModalProps = {
  visible: boolean;
  position?: ModalPosition;
  onClose: () => void;
  transportPlans: DataPlan[];
  selectedTransportPlanId: string;
  onSelect: (planId: string, amount: number) => void;
};

export function TransportPlanModal({
  visible,
  position,
  onClose,
  transportPlans,
  selectedTransportPlanId,
  onSelect,
}: TransportPlanModalProps) {
  return (
    <ModalShell visible={visible} onClose={onClose} position={position}>
      <View style={styles.modalHeader}>
        <ThemedText style={styles.modalTitle}>Select Transport Plan</ThemedText>
        <TouchableOpacity onPress={onClose}>
          <CloseCircle size={18} color='#6E6E75' variant='Outline' />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
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
    </ModalShell>
  );
}

// ─── CablePlanModal ────────────────────────────────────────────────────────────

type CablePlanModalProps = {
  visible: boolean;
  position?: ModalPosition;
  onClose: () => void;
  cablePlans: CablePlan[];
  selectedCablePlanId: string;
  onSelect: (planId: string) => void;
};

export function CablePlanModal({
  visible,
  position,
  onClose,
  cablePlans,
  selectedCablePlanId,
  onSelect,
}: CablePlanModalProps) {
  return (
    <ModalShell visible={visible} onClose={onClose} position={position}>
      <View style={styles.modalHeader}>
        <ThemedText style={styles.modalTitle}>
          Select Subscription Plan
        </ThemedText>
        <TouchableOpacity onPress={onClose}>
          <CloseCircle size={18} color='#6E6E75' variant='Outline' />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
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
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#013D254D",
  },
  modalOverlayTop: {
    justifyContent: "flex-start",
    paddingTop: 24,
  },
  modalOverlayCenter: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalOverlayBottom: {
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
    backgroundColor: "#013D254D",
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
    backgroundColor: "#013D254D",
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
