import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { palette } from "@/constants";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import {
    ArrowDown2,
    ArrowLeft,
    Cardano,
    CloseCircle,
    InfoCircle,
} from "iconsax-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

const options = [
  {
    title: "AI Investment Assistant (Sally)",
    description:
      "Turn on to automate your bracs. Sit back and let your expert AI buddy do the work",
    isSwitch: true,
    value: "sally",
    comingSoon: true,
  },
  {
    title: "Managed Portfolio",
    description:
      "Skip the indecisive, let the expert handle it all from allocation to wealth building",
    isSwitch: true,
    value: "managed",
    url: "/(account)/bracs-investment-trigger/managed-portfolio",
  },
  {
    title: "Do It Yourself (DIY)",
    description: "Manually set up your bracs allocation and investment.",
    isSwitch: true,
    value: "diy",
    url: "/(account)/bracs-investment-trigger/bracs-allocation",
  },
];

const benefits = [
  "Benefit of sally 1 automatically invests your Bracs into diversified assets anytime.",
  "Benefit of sally 1 automatically invests your Bracs into diversified assets anytime.",
];

// ── Sally Intro Modal (Step 1) ─────────────────────────────────────────────

const SallyIntroModal = ({
  visible,
  onClose,
  onNext,
  C,
}: {
  visible: boolean;
  onClose: () => void;
  onNext: () => void;
  C: (typeof Colors)["light"];
}) => (
  <Modal
    visible={visible}
    transparent
    animationType='fade'
    onRequestClose={onClose}
  >
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <Pressable style={{ width: "100%" }} onPress={() => {}}>
        <LinearGradient
          colors={["#E7DCB1", palette.white]}
          style={[styles.modalSheet, styles.centeredSheet]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <View style={styles.introImageWrap}>
              <Image
                source={require("@/assets/images/network/Rectangle.png")}
                style={styles.introImage}
                resizeMode='contain'
              />
            </View>

            <Text style={[styles.introTitle, { color: palette.ink }]}>
              Let Sally Invest for You
            </Text>

            <Text style={[styles.introDesc, { color: palette.gray700 }]}>
              Sally automatically invests your Bracs into diversified assets
              once you reach your set goal. You can modify this anytime.
            </Text>

            <View style={styles.benefitsList}>
              {benefits.map((benefit, i) => (
                <View key={i} style={styles.benefitRow}>
                  <View style={styles.benefitIconWrap}>
                    <Cardano size={12} color='#404040' />
                  </View>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <BraneButton
            text='Get Started'
            onPress={onNext}
            backgroundColor='#013D25'
            textColor='#D2F1E4'
            height={56}
            radius={12}
            style={{ marginTop: 24 }}
          />
        </LinearGradient>
      </Pressable>
    </Pressable>
  </Modal>
);

// ── Sally Config Modal (Step 2) ────────────────────────────────────────────

const SallyConfigModal = ({
  visible,
  onClose,
  onBack,
  onSallyEnabled,
  C,
}: {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
  onSallyEnabled: () => void;
  C: (typeof Colors)["light"];
}) => {
  const [threshold, setThreshold] = useState(50);
  const [isLoading, setLoading] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);

  const bracsValue = Math.round((threshold / 100) * 1000);
  const pct = (threshold - 10) / 90;
  const thumbOffset = pct * sliderWidth;

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      await BaseRequest.put(TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION, {
        allocationType: "ai-automated",
      });
      showSuccess("Bracs Allocation Settings Saved Successfully");
      onSallyEnabled();
      onClose();
    } catch (err) {
      catchError(err);
    } finally {
      setLoading(false);
    }
  }, [onClose, onSallyEnabled]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={[
            styles.modalSheet,
            styles.centeredSheet,
            { backgroundColor: palette.white },
          ]}
          onPress={() => {}}
        >
          {/* Header */}
          <View style={styles.configHeader}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <ArrowLeft size={20} color='#342A3B' />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <CloseCircle size={24} color='#342A3B' />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={{ marginTop: 16, marginBottom: 8 }}>
            <Text style={[styles.configTitle, { color: palette.ink }]}>
              Sally For You and With You
            </Text>
            <Text style={[styles.configSubtitle, { color: palette.gray350 }]}>
              Set a threshold for how Sally auto invests your Bracs into
              diversified assets.
            </Text>
          </View>

          {/* Slider */}
          <View style={{ marginTop: 32 }}>
            <View style={styles.thresholdRow}>
              <Text style={[styles.thresholdLabel, { color: palette.ink }]}>
                Drag to set threshold
              </Text>
              <InfoCircle size={16} color='#342A3B' />
            </View>

            {/* Tooltip + Slider */}
            <View style={{ marginTop: 32, paddingBottom: 24 }}>
              {/* Floating tooltip */}
              <View
                style={[
                  styles.tooltipWrap,
                  {
                    left: Math.max(0, thumbOffset - 20),
                    opacity: sliderWidth > 0 ? 1 : 0,
                  },
                ]}
              >
                <Text style={styles.tooltipText}>{bracsValue} Bracs</Text>
                <ArrowDown2 size={12} color='#404040' variant='Bold' />
              </View>

              <View
                onLayout={(e) => {
                  setSliderWidth(e.nativeEvent.layout.width);
                }}
              >
                <Slider
                  style={{ width: "100%", height: 40 }}
                  minimumValue={10}
                  maximumValue={100}
                  step={5}
                  value={threshold}
                  onValueChange={setThreshold}
                  minimumTrackTintColor={palette.brandDeep}
                  maximumTrackTintColor='#E7E6E8'
                  thumbTintColor={
                    Platform.OS === "android" ? palette.brandDeep : undefined
                  }
                />
              </View>
            </View>
          </View>

          <BraneButton
            text='Save and Activate'
            onPress={handleSave}
            backgroundColor='#013D25'
            textColor='#D2F1E4'
            height={50}
            radius={12}
            loading={isLoading}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ── Option Row ─────────────────────────────────────────────────────────────

const OptionRow = ({
  title,
  description,
  comingSoon,
  isSelected,
  onToggle,
  onRowPress,
  C,
}: {
  title: string;
  description: string;
  comingSoon?: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onRowPress?: () => void;
  C: (typeof Colors)["light"];
}) => (
  <View style={[styles.optionRow, { borderBottomColor: palette.surface100 }]}>
    <TouchableOpacity
      style={styles.optionLeft}
      onPress={onRowPress}
      activeOpacity={onRowPress ? 0.6 : 1}
      disabled={!onRowPress}
    >
      <View style={styles.optionTitleRow}>
        <Text style={[styles.optionTitle, { color: "#342A3B" }]}>{title}</Text>
        {comingSoon && (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        )}
      </View>
      <Text style={[styles.optionDesc, { color: palette.gray350 }]}>
        {description}
      </Text>
    </TouchableOpacity>

    <Switch
      value={isSelected}
      onValueChange={onToggle}
      trackColor={{ false: "#E7E6E8", true: palette.brandMint }}
      thumbColor={isSelected ? palette.brandDeep : "#ACAAAD"}
      ios_backgroundColor='#E7E6E8'
    />
  </View>
);

// ── Main Screen ────────────────────────────────────────────────────────────

export default function BracsInvestmentTriggerScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSallyIntro, setShowSallyIntro] = useState(false);
  const [showSallyConfig, setShowSallyConfig] = useState(false);

  const fetchAllocation = useCallback(async () => {
    try {
      const res: any = await BaseRequest.get(
        TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION,
      );
      // Handle both flat { allocationType } and nested { data: { allocationType } } shapes
      const type =
        res?.allocationType ??
        res?.data?.allocationType ??
        res?.records?.allocationType;
      if (type === "do-it-yourself") setSelectedOption("diy");
      else if (type === "managed") setSelectedOption("managed");
      else if (type === "ai-automated") setSelectedOption("sally");
      else setSelectedOption(null);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllocation();
  }, [fetchAllocation]);

  // Re-fetch whenever screen comes back into focus so state always reflects server
  useFocusEffect(
    useCallback(() => {
      fetchAllocation();
    }, [fetchAllocation]),
  );

  const canNavigate = (value: string) => {
    if (value === "diy") return selectedOption === "diy";
    if (value === "managed") return selectedOption === "managed";
    return true;
  };

  const handleToggle = (value: string, url?: string) => {
    if (selectedOption === value) {
      // Already active — navigate to the sub-page
      if (value === "managed") {
        router.push(
          "/(account)/bracs-investment-trigger/managed-portfolio/about-managed-portfolio" as any,
        );
        return;
      }
      if (value === "diy") {
        router.push(url as any);
        return;
      }
      // Sally: deselect only (no API deselect flow yet)
      setSelectedOption(null);
      return;
    }

    // Not yet active — for managed/diy just navigate to setup; state updates only after API success
    if (value === "sally") {
      setSelectedOption(value); // Sally optimistic OK since modal controls the API call
      setShowSallyIntro(true);
    } else if (value === "managed" && url) {
      router.push(url as any);
    } else if (value === "diy" && url) {
      router.push(url as any);
    }
  };

  const resetToSaved = useCallback(() => {
    fetchAllocation();
  }, [fetchAllocation]);

  // Navigate when tapping the row body of an already-active option (matches frontend-app handleOptionClick)
  const handleRowPress = (value: string, url?: string) => {
    if (value === "managed" && selectedOption === "managed") {
      router.push(
        "/(account)/bracs-investment-trigger/managed-portfolio/about-managed-portfolio" as any,
      );
    } else if (value === "diy" && selectedOption === "diy" && url) {
      router.push(url as any);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          Bracs Investment Trigger
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={C.primary} size='small' />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {options.map((opt) => (
            <OptionRow
              key={opt.value}
              title={opt.title}
              description={opt.description}
              comingSoon={opt.comingSoon}
              isSelected={selectedOption === opt.value}
              onToggle={() => handleToggle(opt.value, opt.url)}
              onRowPress={
                canNavigate(opt.value)
                  ? () => handleRowPress(opt.value, opt.url)
                  : undefined
              }
              C={C}
            />
          ))}
        </ScrollView>
      )}

      {/* Sally Intro Modal */}
      <SallyIntroModal
        visible={showSallyIntro}
        C={C}
        onClose={() => {
          setShowSallyIntro(false);
          resetToSaved();
        }}
        onNext={() => {
          setShowSallyIntro(false);
          setShowSallyConfig(true);
        }}
      />

      {/* Sally Config Modal */}
      <SallyConfigModal
        visible={showSallyConfig}
        C={C}
        onClose={() => {
          setShowSallyConfig(false);
          resetToSaved();
        }}
        onBack={() => {
          setShowSallyConfig(false);
          setShowSallyIntro(true);
        }}
        onSallyEnabled={() => setSelectedOption("sally")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: "600" },
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },

  // Option row
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionLeft: { flex: 1, marginRight: 12 },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 4,
  },
  optionTitle: { fontSize: 14, fontWeight: "500" },
  optionDesc: { fontSize: 12, lineHeight: 18 },
  comingSoonBadge: {
    backgroundColor: "#FFEFCC",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  comingSoonText: { fontSize: 11, color: palette.gray700, fontWeight: "500" },

  // Modal overlay — centered
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(1, 61, 37, 0.30)",
    padding: 24,
  },
  modalSheet: {
    borderRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 32 : 24,
    maxHeight: "85%",
    width: "100%",
  },
  centeredSheet: {
    borderRadius: 20,
  },
  configSheet: {
    minHeight: 420,
  },

  // Sally intro modal
  introImageWrap: { alignItems: "center", marginBottom: 24 },
  introImage: { width: 180, height: 180 },
  introTitle: {
    fontSize: 20,
    fontWeight: "700",
    paddingTop: 32,
    paddingBottom: 4,
  },
  introDesc: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    paddingBottom: 32,
  },
  benefitsList: { gap: 12, marginBottom: 8 },
  benefitRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  benefitIconWrap: { marginTop: 3, width: 14, alignItems: "center" },
  benefitDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  benefitText: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.gray700,
  },

  // Sally config modal
  configHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  backBtn: { padding: 4 },
  configTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  configSubtitle: { fontSize: 14, fontWeight: "400", lineHeight: 20 },
  thresholdRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingBottom: 20,
  },
  thresholdLabel: { fontSize: 15, fontWeight: "400" },
  tooltipWrap: {
    position: "absolute",
    top: -28,
    alignItems: "center",
    width: 60,
    zIndex: 10,
  },
  tooltipText: { fontSize: 9, color: palette.gray700, fontWeight: "500" },
});
