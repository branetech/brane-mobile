import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { priceFormatter } from "@/utils/helpers";
import Slider from "@react-native-community/slider";
import { Cardano, CloseCircle, InfoCircle } from "iconsax-react-native";
import React, { useMemo, useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    View,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";

type OptionRowProps = {
  title: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
  badgeText?: string;
};

export const OptionRow = ({
  title,
  description,
  isSelected,
  onPress,
  badgeText,
}: OptionRowProps) => {
  return (
    <Pressable style={styles.optionRow} onPress={onPress}>
      <View style={styles.optionTextWrap}>
        <View style={styles.optionTitleRow}>
          <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
            {title}
          </ThemedText>
          {!!badgeText && (
            <ThemedText style={styles.badge}>{badgeText}</ThemedText>
          )}
        </View>
        <ThemedText style={styles.optionDescription}>{description}</ThemedText>
      </View>
      <Switch
        value={isSelected}
        onValueChange={onPress}
        trackColor={{ false: "#E7E6E8", true: "#D2F1E4" }}
        thumbColor={isSelected ? "#013D25" : "#ACAAAD"}
      />
    </Pressable>
  );
};

type SallyIntroModalProps = {
  visible: boolean;
  onClose: () => void;
  onGetStarted: () => void;
};

const benefits = [
  "Sally automatically invests your Bracs into diversified assets.",
  "You can update your settings and thresholds anytime.",
];

export const SallyIntroModal = ({
  visible,
  onClose,
  onGetStarted,
}: SallyIntroModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalCard, styles.gradientCard]}>
          <Pressable style={styles.closeIconWrap} onPress={onClose}>
            <CloseCircle size={22} color="#342A3B" />
          </Pressable>

          <View style={styles.centeredImageWrap}>
            <Image
              source={require("@/assets/images/network/Rectangle.png")}
              style={styles.sallyImage}
              resizeMode="contain"
            />
          </View>

          <ThemedText type="subtitle" style={styles.modalTitle}>
            Let Sally Invest for You
          </ThemedText>
          <ThemedText style={styles.modalBody}>
            Sally automatically invests your Bracs into diversified assets once
            you reach your set goal.
          </ThemedText>

          <View style={styles.benefitList}>
            {benefits.map((benefit) => (
              <View key={benefit} style={styles.benefitItem}>
                <Cardano size={12} color="#404040" />
                <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
              </View>
            ))}
          </View>

          <BraneButton
            text="Get Started"
            onPress={onGetStarted}
            style={styles.modalButton}
          />
        </View>
      </View>
    </Modal>
  );
};

type SallyConfigModalProps = {
  visible: boolean;
  isSaving: boolean;
  onClose: () => void;
  onBack: () => void;
  onSaveAndActivate: () => Promise<void> | void;
};

export const SallyConfigModal = ({
  visible,
  isSaving,
  onClose,
  onBack,
  onSaveAndActivate,
}: SallyConfigModalProps) => {
  const [threshold, setThreshold] = useState(50);
  const bracsValue = useMemo(
    () => Math.round((threshold / 100) * 1000),
    [threshold],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalTopRow}>
            <Pressable onPress={onBack}>
              <ThemedText style={styles.backText}>Back</ThemedText>
            </Pressable>
            <Pressable onPress={onClose}>
              <CloseCircle size={22} color="#342A3B" />
            </Pressable>
          </View>

          <ThemedText type="defaultSemiBold" style={styles.configTitle}>
            Sally For You and With You
          </ThemedText>
          <ThemedText style={styles.configBody}>
            Set a threshold for how Sally auto-invests your Bracs into
            diversified assets.
          </ThemedText>

          <View style={styles.sliderHeaderRow}>
            <ThemedText style={styles.sliderTitle}>
              Drag to set threshold
            </ThemedText>
            <InfoCircle size={16} color="#342A3B" />
          </View>

          <View style={styles.thresholdPill}>
            <ThemedText style={styles.thresholdText}>
              {bracsValue} Bracs
            </ThemedText>
          </View>

          <Slider
            minimumValue={10}
            maximumValue={100}
            step={5}
            value={threshold}
            onValueChange={setThreshold}
            minimumTrackTintColor="#013D25"
            maximumTrackTintColor="#E7E6E8"
            thumbTintColor="#013D25"
          />

          <BraneButton
            text="Save and Activate"
            onPress={onSaveAndActivate}
            loading={isSaving}
            style={styles.modalButton}
          />
        </View>
      </View>
    </Modal>
  );
};

type RiskDisclosureModalProps = {
  visible: boolean;
  onClose: () => void;
  onAccept: () => Promise<void> | void;
  isLoading: boolean;
};

const riskText = `Brane Technologies Ltd provides investment access and portfolio visualization services in partnership with licensed Broker-Dealer partners regulated by the SEC of Nigeria.\n\nInvestments made through Brane, including in stocks, fixed income instruments, ETFs, mutual funds, and gold, are subject to market risks, including the possible loss of principal.\n\nPast performance does not guarantee future results. Brane does not guarantee fixed returns, principal protection, or the performance of any investment product.`;

export const RiskDisclosureModal = ({
  visible,
  onClose,
  onAccept,
  isLoading,
}: RiskDisclosureModalProps) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.bottomOverlay}>
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <ThemedText type="subtitle" style={styles.sheetTitle}>
            Risk Disclosure
          </ThemedText>

          <ScrollView
            style={styles.sheetScroll}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText style={styles.sheetCopy}>{riskText}</ThemedText>
          </ScrollView>

          <Pressable
            style={styles.agreeRow}
            onPress={() => setAgreed((prev) => !prev)}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]} />
            <ThemedText style={styles.agreeText}>
              I understand and agree to this terms
            </ThemedText>
          </Pressable>

          <BraneButton
            text="Accept and Continue"
            onPress={onAccept}
            disabled={!agreed}
            loading={isLoading}
          />
        </View>
      </View>
    </Modal>
  );
};

type AllocationSliderRowProps = {
  label: string;
  value: number;
  onChange: (next: number) => void;
};

export const AllocationSliderRow = ({
  label,
  value,
  onChange,
}: AllocationSliderRowProps) => {
  const [input, setInput] = useState(String(value));

  const onInputChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d]/g, "");
    setInput(cleaned);
    if (cleaned === "") {
      onChange(0);
      return;
    }
    const num = Math.max(0, Math.min(100, Number(cleaned)));
    onChange(num);
  };

  React.useEffect(() => {
    setInput(String(value));
  }, [value]);

  return (
    <View style={styles.sliderCard}>
      <View style={styles.sliderCardTop}>
        <ThemedText style={styles.sliderCardLabel}>{label}</ThemedText>
        <View style={styles.percentBox}>
          <TextInput
            value={input}
            onChangeText={onInputChange}
            keyboardType="number-pad"
            style={styles.percentInput}
            maxLength={3}
          />
          <ThemedText style={styles.percentMark}>%</ThemedText>
        </View>
      </View>

      <Slider
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor="#013D25"
        maximumTrackTintColor="#AABEB6"
        thumbTintColor="#013D25"
      />
    </View>
  );
};

export const ShowMoreRow = ({
  show,
  onPress,
}: {
  show: boolean;
  onPress: () => void;
}) => (
  <Pressable style={styles.showMoreRow} onPress={onPress}>
    <ThemedText style={styles.showMoreLabel}>
      {show ? "Show less" : "Show more"}
    </ThemedText>
    <ThemedText style={[styles.showMoreArrow, show && styles.showMoreArrowUp]}>
      ⌄
    </ThemedText>
  </Pressable>
);

type TopPickCard = {
  tickerSymbol: string;
  bracName: string;
  units?: number;
  value?: number;
  ytdReturnDisplay?: string;
};

const getBgColor = (tickerSymbol: string) => {
  const key = String(tickerSymbol || "").toLowerCase();
  if (key.includes("airtel")) return "#FDF2F2";
  if (key.includes("mtn")) return "#FFF9E0";
  if (key.includes("glo")) return "#F4FBF8";
  if (key.includes("9mobile") || key.includes("etisalat")) return "#C6DEF2";
  return "#FDF2F2";
};

const tickerLogo = (ticker: string) => {
  const key = String(ticker || "").toLowerCase();
  if (key.includes("mtn")) return require("@/assets/images/network/mtn.png");
  if (key.includes("airtel"))
    return require("@/assets/images/network/airtel.png");
  if (key.includes("glo")) return require("@/assets/images/network/glo.png");
  return require("@/assets/images/network/9mobile.png");
};

export const TopPicksStack = ({ picks }: { picks: TopPickCard[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!picks.length) {
    return (
      <View style={styles.emptyTopPicks}>
        <ThemedText style={styles.emptyTopPicksText}>
          No top picks at the moment
        </ThemedText>
      </View>
    );
  }

  const arranged = picks.map((_, index) => {
    if (index < activeIndex) return index + (picks.length - activeIndex);
    return index - activeIndex;
  });

  return (
    <View style={styles.stackWrap}>
      {picks.map((pick, index) => {
        const visualIndex = arranged[index];
        const scale = 1 - visualIndex * 0.05;
        const translateX = visualIndex * 57;
        const translateY = visualIndex * 5 - 180 * (1 - scale);
        const isPositive = String(pick.ytdReturnDisplay || "").startsWith("▲");

        return (
          <Pressable
            key={`${pick.tickerSymbol}-${index}`}
            onPress={() => setActiveIndex(index)}
            style={[
              styles.pickStackCard,
              {
                backgroundColor: getBgColor(pick.tickerSymbol),
                transform: [{ translateX }, { translateY }, { scale }],
                zIndex: picks.length - visualIndex,
              },
            ]}
          >
            <View style={styles.pickHead}>
              <Image
                source={tickerLogo(pick.tickerSymbol)}
                style={styles.pickLogo}
                resizeMode="contain"
              />
              <View>
                <ThemedText style={styles.pickTicker}>
                  {String(pick.tickerSymbol || "").toUpperCase()}
                </ThemedText>
                <ThemedText style={styles.pickName}>{pick.bracName}</ThemedText>
              </View>
            </View>

            <View style={styles.pickMetaRow}>
              <View>
                <ThemedText style={styles.pickValue}>
                  {pick.units || 0} units
                </ThemedText>
                <ThemedText style={styles.pickSubMeta}>Bracs: 0</ThemedText>
              </View>
              <ThemedText style={styles.pickValue}>
                {priceFormatter(pick.value || 0)}
              </ThemedText>
            </View>

            <ThemedText
              style={[
                styles.pickTrend,
                { color: isPositive ? "#019347" : "#CB010B" },
              ]}
            >
              {isPositive ? "▲" : "▼"}{" "}
              {String(pick.ytdReturnDisplay || "0.00%")
                .replace("▲", "")
                .trim()}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
};

type AllocationItem = {
  asset: string;
  percentage: number;
};

const pieColors: Record<string, string> = {
  "Nigerian Equities": "#03A161",
  "FGN Bonds": "#E54B4B",
  Gold: "#C5A022",
};

export const WealthAllocationSection = ({
  sectionTitle,
  chartTitle,
  items,
}: {
  sectionTitle: string;
  chartTitle: string;
  items: AllocationItem[];
}) => {
  let startAngle = 0;
  const slices = items.map((item) => {
    const angle = (item.percentage / 100) * 360;
    const slice = {
      ...item,
      start: startAngle,
      end: startAngle + angle,
      color: pieColors[item.asset] || "#CCC",
    };
    startAngle += angle;
    return slice;
  });

  return (
    <View>
      <ThemedText style={styles.waSectionTitle}>{sectionTitle}</ThemedText>
      <ThemedText style={styles.waChartTitle}>{chartTitle}</ThemedText>

      <View style={styles.pieWrap}>
        <Svg width={210} height={210}>
          <G x={15} y={15}>
            {slices.map((slice) => (
              <Circle
                key={`${slice.asset}-bg`}
                cx={90}
                cy={90}
                r={82}
                fill="transparent"
              />
            ))}
            {slices.map((slice) => (
              <G key={slice.asset}>
                <Circle cx={90} cy={90} r={82} fill="transparent" />
              </G>
            ))}
            {slices.map((slice) => (
              <G key={`${slice.asset}-arc`}>
                {/* Using path-like segments through Circle stroke approach keeps perf smooth on RN */}
                <Circle
                  cx={90}
                  cy={90}
                  r={82}
                  stroke={slice.color}
                  strokeWidth={46}
                  fill="transparent"
                  strokeDasharray={`${(slice.percentage / 100) * 515} 515`}
                  strokeDashoffset={-(slice.start / 360) * 515}
                  strokeLinecap="butt"
                  rotation={-90}
                  originX={90}
                  originY={90}
                />
              </G>
            ))}
            <Circle cx={90} cy={90} r={52} fill="#FFFFFF" />
          </G>
        </Svg>
      </View>

      <View style={styles.legendList}>
        {items.map((item) => (
          <View key={item.asset} style={styles.legendRow}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: pieColors[item.asset] || "#CCC" },
              ]}
            />
            <ThemedText>{item.asset}</ThemedText>
            <ThemedText style={styles.legendValue}>
              {item.percentage}%
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F7F7F8",
    paddingVertical: 14,
    gap: 8,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionTitle: {
    fontSize: 14,
    color: "#342A3B",
  },
  badge: {
    fontSize: 10,
    color: "#404040",
    backgroundColor: "#FFEFCC",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  optionDescription: {
    marginTop: 4,
    fontSize: 12,
    color: "#85808A",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(1,61,37,0.35)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  gradientCard: {
    backgroundColor: "#F8F2DD",
  },
  closeIconWrap: {
    alignSelf: "flex-end",
  },
  centeredImageWrap: {
    alignItems: "center",
    marginTop: 4,
  },
  sallyImage: {
    width: 160,
    height: 160,
  },
  modalTitle: {
    marginTop: 16,
    color: "#0B0014",
  },
  modalBody: {
    marginTop: 6,
    fontSize: 13,
    color: "#404040",
  },
  benefitList: {
    marginTop: 14,
    gap: 10,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  benefitText: {
    flex: 1,
    fontSize: 12,
    color: "#404040",
  },
  modalButton: {
    marginTop: 18,
  },
  modalTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backText: {
    fontSize: 13,
    color: "#013D25",
    fontWeight: "600",
  },
  configTitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#0B0014",
  },
  configBody: {
    marginTop: 6,
    fontSize: 12,
    color: "#85808A",
  },
  sliderHeaderRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sliderTitle: {
    fontSize: 14,
    color: "#0B0014",
  },
  thresholdPill: {
    marginTop: 16,
    alignSelf: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  thresholdText: {
    fontSize: 12,
    color: "#404040",
  },
  bottomOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(1,61,37,0.55)",
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 10,
    maxHeight: "90%",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#DCE5E1",
    marginBottom: 14,
  },
  sheetTitle: {
    color: "#0B0014",
  },
  sheetScroll: {
    marginTop: 14,
    maxHeight: 280,
  },
  sheetCopy: {
    fontSize: 13,
    lineHeight: 20,
    color: "#85808A",
  },
  agreeRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  checkboxChecked: {
    backgroundColor: "#013D25",
    borderColor: "#013D25",
  },
  agreeText: {
    flex: 1,
    fontSize: 13,
    color: "#0B0014",
  },
  sliderCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F7F7F8",
  },
  sliderCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sliderCardLabel: {
    fontSize: 14,
    color: "#111827",
  },
  percentBox: {
    width: 44,
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B6B3B9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    gap: 1,
  },
  percentInput: {
    fontSize: 10,
    color: "#0B0014",
    padding: 0,
    textAlign: "center",
    minWidth: 18,
  },
  percentMark: {
    fontSize: 10,
    color: "#0B0014",
  },
  showMoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  showMoreLabel: {
    color: "#013D25",
    fontSize: 13,
    fontWeight: "600",
  },
  showMoreArrow: {
    color: "#013D25",
    fontSize: 14,
  },
  showMoreArrowUp: {
    transform: [{ rotate: "180deg" }],
  },
  emptyTopPicks: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#F0FAF6",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  emptyTopPicksText: {
    color: "#85808A",
    fontSize: 13,
    fontStyle: "italic",
  },
  stackWrap: {
    height: 210,
    position: "relative",
    overflow: "hidden",
  },
  pickStackCard: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 320,
    height: 200,
    borderRadius: 16,
    padding: 14,
  },
  pickHead: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  pickLogo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  pickTicker: {
    fontSize: 12,
    color: "#000",
    fontWeight: "700",
  },
  pickName: {
    marginTop: 2,
    fontSize: 13,
    color: "#85808A",
  },
  pickMetaRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "700",
  },
  pickSubMeta: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  pickTrend: {
    marginTop: 14,
    fontSize: 12,
  },
  waSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F7F7F8",
    marginBottom: 14,
  },
  waChartTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#85808A",
    marginBottom: 12,
  },
  pieWrap: {
    alignItems: "center",
    marginBottom: 16,
  },
  legendList: {
    gap: 12,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendValue: {
    marginLeft: "auto",
  },
});
