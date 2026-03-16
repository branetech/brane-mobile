import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { MOBILE_SERVICE } from "@/services/routes";
import { hideAppLoader, priceFormatter, showAppLoader } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { TickCircle } from "iconsax-react-native";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Stage = "form" | "preview" | "pin" | "success";

type Network = "mtn" | "airtel" | "glo" | "9mobile";

const NETWORKS: { id: Network; label: string; color: string }[] = [
  { id: "mtn", label: "MTN", color: "#FFC300" },
  { id: "airtel", label: "Airtel", color: "#FF0000" },
  { id: "glo", label: "Glo", color: "#00A651" },
  { id: "9mobile", label: "9Mobile", color: "#006E51" },
];

const AMOUNT_PRESETS = ["200", "500", "1000", "2000"];

const networkImages: Record<Network, any> = {
  mtn: require("@/assets/images/network/mtn.png"),
  airtel: require("@/assets/images/network/airtel.png"),
  glo: require("@/assets/images/network/glo.png"),
  "9mobile": require("@/assets/images/network/9mobile.png"),
};

export default function BuyAirtimeScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [stage, setStage] = useState<Stage>("form");
  const [selectedNetwork, setSelectedNetwork] = useState<Network>("mtn");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [pinVisible, setPinVisible] = useState(false);

  const canContinue = !!phone && !!amount && phone.length >= 10;

  const handleSubmit = async () => {
    setPinVisible(false);
    showAppLoader({ message: "Processing airtime…" });
    try {
      await BaseRequest.post(MOBILE_SERVICE.AIRTIME_TOPUP, {
        network: selectedNetwork,
        phone,
        amount: Number(amount),
      });
      setStage("success");
    } catch (error) {
      catchError(error);
    } finally {
      hideAppLoader();
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {stage === "pin" ? (
        <TransactionPinValidator
          visible={pinVisible}
          onClose={() => {
            setPinVisible(false);
            setStage("form");
          }}
          onTransactionPinValidated={handleSubmit}
        />
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.screen}
        >
          {/* Header */}
          <View style={styles.header}>
            <Back
              onPress={() =>
                stage === "preview" ? setStage("form") : router.back()
              }
            />
            <ThemedText type='subtitle' style={styles.headerTitle}>
              Buy Airtime
            </ThemedText>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            {/* ── FORM ── */}
            {stage === "form" && (
              <>
                <ThemedText type='defaultSemiBold'>Select Network</ThemedText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.networkRow}
                >
                  {NETWORKS.map((n) => {
                    const active = selectedNetwork === n.id;
                    return (
                      <TouchableOpacity
                        key={n.id}
                        onPress={() => setSelectedNetwork(n.id)}
                        style={[
                          styles.networkPill,
                          {
                            borderColor: active ? n.color : C.border,
                            backgroundColor: active
                              ? n.color + "22"
                              : C.inputBg,
                          },
                        ]}
                        activeOpacity={0.75}
                      >
                        <Image
                          source={networkImages[n.id]}
                          style={styles.networkLogo}
                          resizeMode='contain'
                        />
                        <ThemedText
                          style={[
                            styles.networkLabel,
                            { color: active ? n.color : C.text },
                          ]}
                        >
                          {n.label}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <View style={{ marginTop: 4, gap: 14 }}>
                  <FormInput
                    labelText='Phone Number'
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType='phone-pad'
                    placeholder='08012345678'
                  />

                  <FormInput
                    labelText='Amount (₦)'
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType='number-pad'
                    placeholder='Enter amount'
                  />
                </View>

                {/* Quick-amount chips */}
                <View style={styles.chipRow}>
                  {AMOUNT_PRESETS.map((preset) => (
                    <TouchableOpacity
                      key={preset}
                      onPress={() => setAmount(preset)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor:
                            amount === preset ? C.primary : C.inputBg,
                          borderColor: amount === preset ? C.primary : C.border,
                        },
                      ]}
                      activeOpacity={0.75}
                    >
                      <ThemedText
                        style={[
                          styles.chipText,
                          { color: amount === preset ? "#fff" : C.text },
                        ]}
                      >
                        ₦{preset}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>

                <BraneButton
                  text='Continue'
                  onPress={() => setStage("preview")}
                  disabled={!canContinue}
                  style={styles.button}
                />
              </>
            )}

            {/* ── PREVIEW ── */}
            {stage === "preview" && (
              <>
                <ThemedText type='defaultSemiBold' style={{ marginBottom: 8 }}>
                  Confirm Purchase
                </ThemedText>

                <View
                  style={{
                    ...styles.summaryCard,
                    backgroundColor: C.inputBackground,
                    borderColor: C.border,
                  }}
                >
                  <SummaryRow
                    label='Network'
                    value={selectedNetwork.toUpperCase()}
                    C={C}
                  />
                  <View
                    style={{ ...styles.divider, backgroundColor: C.border }}
                  />
                  <SummaryRow label='Phone' value={phone} C={C} />
                  <View
                    style={{ ...styles.divider, backgroundColor: C.border }}
                  />
                  <SummaryRow
                    label='Amount'
                    value={priceFormatter(Number(amount))}
                    C={C}
                  />
                </View>

                <BraneButton
                  text='Confirm & Pay'
                  onPress={() => {
                    setStage("pin");
                    setPinVisible(true);
                  }}
                  style={styles.button}
                />
                <BraneButton
                  text='Go Back'
                  onPress={() => setStage("form")}
                  backgroundColor={C.inputBackground}
                  textColor='#013D25'
                  style={styles.secondaryButton}
                />
              </>
            )}

            {/* ── SUCCESS ── */}
            {stage === "success" && (
              <View style={{ ...styles.successWrap, gap: 12 }}>
                <TickCircle size={72} color='#013D25' variant='Bold' />
                <ThemedText type='subtitle' style={{ textAlign: "center" }}>
                  Airtime Purchase Successful!
                </ThemedText>
                <ThemedText style={[styles.successSub, { color: C.muted }]}>
                  {priceFormatter(Number(amount))} airtime sent to {phone}
                </ThemedText>
                <BraneButton
                  text='Done'
                  onPress={() => router.replace("/(tabs)")}
                  style={styles.successButton}
                />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

function SummaryRow({
  label,
  value,
  C,
}: {
  label: string;
  value: string;
  C: (typeof Colors)["light"];
}) {
  return (
    <View style={styles.summaryRow}>
      <ThemedText style={{ color: C.muted, fontSize: 13 }}>{label}</ThemedText>
      <ThemedText type='defaultSemiBold' style={{ fontSize: 14 }}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: { fontSize: 16 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 16,
  },
  networkRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 4,
  },
  networkPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  networkLogo: { width: 22, height: 22, borderRadius: 11 },
  networkLabel: { fontSize: 13, fontWeight: "600" },
  chipRow: {
    gap: 10,
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontWeight: "500" },
  button: { marginTop: 8 },
  secondaryButton: { marginTop: 10 },
  successButton: { marginTop: 32 },
  summaryCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  divider: { height: 1 },
  successWrap: {
    marginTop: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  successSub: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
});
