import { NoBeneficiary } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    ArrowDown2,
    Mobile,
    SearchNormal1,
    WifiSquare,
} from "iconsax-react-native";
import React from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { cleanNetworkLabel, getNetworkImageKey } from "./helpers";
import {
    AMOUNT_PRESETS,
    type Beneficiary,
    type DataPlan,
    NETWORK_IMAGES,
    type SelectOption,
    type UtilityService,
} from "./types";

type Props = {
  service: UtilityService;
  orderedNetworks: SelectOption[];
  network: string;
  setNetwork: (id: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  phoneError?: string;
  setPhoneError: (v: string | undefined) => void;
  addToBeneficiaries: boolean;
  setAddToBeneficiaries: (v: boolean) => void;
  beneficiaryName: string;
  setBeneficiaryName: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  amountError?: string;
  setAmountError: (v: string | undefined) => void;
  selectedDataPlan?: DataPlan;
  beneficiaries: Beneficiary[];
  beneficiarySearch: string;
  setBeneficiarySearch: (v: string) => void;
  filteredBeneficiaries: Beneficiary[];
  onSwitchService: (s: UtilityService) => void;
  onOpenContactPicker: () => void;
  onOpenDataPlanModal: () => void;
};

export default function AirtimeDataForm({
  service,
  orderedNetworks,
  network,
  setNetwork,
  phone,
  setPhone,
  phoneError,
  setPhoneError,
  addToBeneficiaries,
  setAddToBeneficiaries,
  beneficiaryName,
  setBeneficiaryName,
  amount,
  setAmount,
  amountError,
  setAmountError,
  selectedDataPlan,
  beneficiaries,
  beneficiarySearch,
  setBeneficiarySearch,
  filteredBeneficiaries,
  onSwitchService,
  onOpenContactPicker,
  onOpenDataPlanModal,
}: Props) {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const displayList =
    beneficiarySearch.trim().length > 0 ? filteredBeneficiaries : beneficiaries;
  return (
    <>
      {/* Airtime / Data tab switcher */}
      <View style={styles.segmentTabs}>
        <TouchableOpacity
          style={styles.segmentTab}
          onPress={() => onSwitchService("airtime")}
        >
          <Mobile
            size={16}
            color={service === "airtime" ? "#013D25" : "#7F7F86"}
            variant="Outline"
          />
          <ThemedText
            style={[
              styles.segmentTabText,
              service === "airtime" && styles.segmentTabTextActive,
            ]}
          >
            Airtime
          </ThemedText>
          {service === "airtime" && <View style={styles.segmentTabUnderline} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.segmentTab}
          onPress={() => onSwitchService("data")}
        >
          <WifiSquare
            size={16}
            color={service === "data" ? "#013D25" : "#7F7F86"}
            variant="Outline"
          />
          <ThemedText
            style={[
              styles.segmentTabText,
              service === "data" && styles.segmentTabTextActive,
            ]}
          >
            Data
          </ThemedText>
          {service === "data" && <View style={styles.segmentTabUnderline} />}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {/* Network provider grid */}
        <ThemedText style={styles.fieldLabel}>Provider</ThemedText>
        <View style={styles.networkGrid}>
          {orderedNetworks.map((item) => {
            const selected = network === item.id;
            const imgKey = getNetworkImageKey(
              `${item.id} ${item.label} ${item.description || ""}`,
            );
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.networkTile,
                  selected && styles.networkTileActive,
                ]}
                onPress={() => setNetwork(item.id)}
              >
                <Image
                  source={NETWORK_IMAGES[imgKey] || NETWORK_IMAGES.mtn}
                  style={styles.networkLogo}
                  resizeMode="contain"
                />
                <ThemedText
                  style={[
                    styles.networkText,
                    selected && styles.networkTextActive,
                  ]}
                >
                  {cleanNetworkLabel(item.label)}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
          {orderedNetworks.length === 0 && (
            <ThemedText style={styles.emptyText}>
              No network provider available.
            </ThemedText>
          )}
        </View>

        {/* Phone number input */}
        <ThemedText style={styles.fieldLabel}>Phone Number</ThemedText>
        <View
          style={[
            styles.inlineInput,
            phoneError ? styles.inputError : undefined,
          ]}
        >
          <ThemedText style={styles.phonePrefix}>+234</ThemedText>
          <View style={styles.phoneDivider} />
          <TextInput
            style={styles.inlineInputText}
            placeholder="Enter phone number"
            placeholderTextColor="#A9A9AE"
            keyboardType="number-pad"
            value={phone}
            onChangeText={(v) => {
              setPhone(v.replace(/[^0-9+]/g, ""));
              setPhoneError(undefined);
            }}
          />
          <TouchableOpacity
            onPress={onOpenContactPicker}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <Path
                d="M7.5 1.54102C9.54134 1.54112 11.2167 3.15336 11.3193 5.16992L11.3252 5.36621C11.3168 7.44094 9.69378 9.11642 7.6416 9.18262H7.59375C7.53669 9.17648 7.47927 9.17781 7.4248 9.18164C5.27873 9.11139 3.67491 7.43231 3.6748 5.36621C3.6748 3.25902 5.39281 1.54102 7.5 1.54102ZM7.5 1.79102C5.53219 1.79102 3.9248 3.3984 3.9248 5.36621C3.92491 7.30224 5.43824 8.86467 7.36523 8.93262L7.41602 8.93457L7.45996 8.92676C7.46762 8.92638 7.47907 8.92676 7.49414 8.92676C7.52728 8.92676 7.56901 8.92839 7.61133 8.93164L7.6416 8.93359L7.67285 8.93262C9.57467 8.84524 11.0655 7.28181 11.0752 5.36816V5.36621C11.0752 3.39847 9.46772 1.79112 7.5 1.79102Z"
                fill="#013D25"
                stroke="#C3A93F"
              />
              <Path
                d="M13.6748 3.20898C15.3486 3.20907 16.7168 4.57717 16.7168 6.25098C16.7166 7.89065 15.4405 9.21492 13.8096 9.29004L13.7656 9.27637L13.6592 9.28613C13.6183 9.29005 13.5672 9.27715 13.5264 9.24707C13.4873 9.21831 13.4813 9.19329 13.4805 9.18555C13.4749 9.12861 13.4913 9.08945 13.5059 9.06934C13.5169 9.0541 13.5301 9.04415 13.5547 9.04004C13.6272 9.03475 13.7099 9.03418 13.7998 9.03418H13.8135L13.8271 9.0332C15.3088 8.95194 16.4668 7.73271 16.4668 6.24219C16.4667 4.69949 15.2175 3.45028 13.6748 3.4502L13.6621 3.45117C13.6363 3.45171 13.6093 3.44108 13.5859 3.41797C13.5623 3.39442 13.5498 3.36441 13.5498 3.33398C13.5498 3.30384 13.5622 3.27271 13.5879 3.24707C13.6135 3.22148 13.6447 3.20898 13.6748 3.20898Z"
                fill="#013D25"
                stroke="#013D25"
              />
              <Path
                d="M7.64746 10.8652C9.20631 10.8652 10.7374 11.2616 11.8799 12.0244L11.8809 12.0254C12.9274 12.7232 13.4492 13.6319 13.4492 14.5674C13.4492 15.5053 12.9332 16.4215 11.8809 17.126C10.7292 17.8937 9.19757 18.2919 7.6416 18.292C6.08462 18.292 4.54544 17.8935 3.40332 17.127L3.40039 17.125C2.34847 16.4286 1.83301 15.521 1.83301 14.584C1.83301 13.6461 2.34923 12.7298 3.40137 12.0254C4.55289 11.2617 6.08872 10.8653 7.64746 10.8652ZM7.6416 11.1211C6.17484 11.1211 4.67775 11.484 3.53906 12.2432C2.65097 12.8352 2.08301 13.6558 2.08301 14.5928C2.0832 15.5243 2.66276 16.344 3.54004 16.9258V16.9248C4.67867 17.6878 6.17505 18.0527 7.6416 18.0527C9.10842 18.0527 10.6045 17.6871 11.7432 16.9238L11.7441 16.9248C12.632 16.3327 13.1992 15.5121 13.1992 14.5752C13.199 13.6437 12.6195 12.824 11.7422 12.2422C10.6037 11.4837 9.10768 11.1211 7.6416 11.1211Z"
                fill="#013D25"
                stroke="#013D25"
              />
              <Path
                d="M15.1968 11.6318C15.213 11.5674 15.2799 11.5231 15.3501 11.5381C16.0039 11.6825 16.5592 11.9379 17.0024 12.2793L17.0073 12.2832C17.674 12.7851 18.0249 13.4693 18.0249 14.1582C18.0249 14.8438 17.6688 15.5306 16.9966 16.0439L16.9937 16.0459C16.5433 16.3946 15.9663 16.6563 15.3198 16.7842L15.2886 16.791L15.2827 16.792L15.2407 16.7852C15.2146 16.7762 15.1938 16.7585 15.1802 16.7354L15.1655 16.6963V16.6426C15.1754 16.5915 15.2136 16.5493 15.2671 16.5371C15.8476 16.4162 16.3987 16.1823 16.8413 15.8398L16.8423 15.8408C17.4064 15.4152 17.7749 14.8304 17.7749 14.1582C17.7748 13.4877 17.4082 12.9021 16.8501 12.4834H16.8491C16.4136 12.1486 15.8868 11.9246 15.2954 11.7881L15.2925 11.7871C15.2429 11.7758 15.2052 11.7346 15.1958 11.6846L15.1968 11.6318Z"
                fill="#013D25"
                stroke="#013D25"
              />
            </Svg>
          </TouchableOpacity>
        </View>
        {phoneError ? (
          <ThemedText style={styles.errorText}>{phoneError}</ThemedText>
        ) : null}

        {/* Add to beneficiaries toggle */}
        <View
          style={[
            styles.beneficiaryCon,
            { borderColor: C.border, backgroundColor: C.background },
          ]}
        >
          <View style={[styles.beneficiaryRow]}>
            <ThemedText style={[styles.beneficiaryText, { color: C.text }]}>
              Add to beneficiaries
            </ThemedText>
            <Switch
              value={addToBeneficiaries}
              onValueChange={setAddToBeneficiaries}
              trackColor={{ false: "#E6E6E8", true: "#D2F1E4" }}
              thumbColor={addToBeneficiaries ? "#013D25" : "#FFFFFF"}
              ios_backgroundColor="#E6E6E8"
              style={{
                transform: [
                  { scaleX: Platform.OS === "ios" ? 0.85 : 1.1 },
                  { scaleY: Platform.OS === "ios" ? 0.85 : 1.1 },
                ],
              }}
            />
          </View>

          {addToBeneficiaries && (
            <View
              style={[
                styles.inlineInput,
                {
                  borderColor: C.border,
                  backgroundColor: C.inputBg,
                  marginTop: 4,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.inlineInputText,
                  { color: C.text, fontSize: 14 },
                ]}
                placeholder="Enter beneficiary name"
                placeholderTextColor={C.muted}
                value={beneficiaryName}
                onChangeText={setBeneficiaryName}
                autoCapitalize="words"
              />
            </View>
          )}
        </View>

        {/* Data plan selector */}
        {service === "data" && (
          <>
            <ThemedText style={styles.fieldLabel}>Plan</ThemedText>
            <TouchableOpacity
              style={styles.planSelector}
              onPress={onOpenDataPlanModal}
              activeOpacity={0.8}
            >
              <ThemedText
                style={[
                  styles.planSelectorTitle,
                  !selectedDataPlan && { color: "#A9A9AE" },
                ]}
              >
                {selectedDataPlan ? selectedDataPlan.label : "Select Plan"}
              </ThemedText>
              <ArrowDown2 size={18} color="#6E6E75" />
            </TouchableOpacity>
            {amountError ? (
              <ThemedText style={styles.errorText}>{amountError}</ThemedText>
            ) : null}

            <ThemedText style={styles.fieldLabel}>Amount</ThemedText>
            <View style={[styles.inlineInput, { backgroundColor: "#F8F8FA" }]}>
              <ThemedText style={styles.currencyPrefix}>₦</ThemedText>
              <ThemedText style={styles.inlineInputText}>
                {selectedDataPlan
                  ? Number(selectedDataPlan.amount).toLocaleString("en-NG")
                  : "Select Plan"}
              </ThemedText>
            </View>
          </>
        )}

        {/* Airtime amount presets */}
        {service === "airtime" && (
          <>
            <ThemedText style={styles.fieldLabel}>Amount</ThemedText>
            <View style={styles.amountGrid}>
              {AMOUNT_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.amountChip,
                    amount === preset && styles.amountChipActive,
                  ]}
                  onPress={() => {
                    setAmount(preset);
                    setAmountError(undefined);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.amountChipText,
                      amount === preset && styles.amountChipTextActive,
                    ]}
                  >
                    ₦ {Number(preset).toLocaleString()}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={[
                styles.customAmountInput,
                amountError ? styles.inputError : undefined,
              ]}
            >
              <TextInput
                style={styles.customAmountText}
                placeholder="Enter custom amount"
                placeholderTextColor="#A9A9AE"
                keyboardType="number-pad"
                value={amount}
                onChangeText={(v) => {
                  setAmount(v.replace(/\D/g, ""));
                  setAmountError(undefined);
                }}
              />
            </View>
            {amountError ? (
              <ThemedText style={styles.errorText}>{amountError}</ThemedText>
            ) : null}
          </>
        )}

        {/* Beneficiary search */}
        <View style={styles.beneficiariesWrap}>
          <ThemedText style={styles.fieldLabel}>Select Beneficiary</ThemedText>
          <View
            style={[
              styles.beneficiaryContainer,
              { borderColor: C.border, marginTop: 4 },
            ]}
          >
            <View
              style={[
                styles.searchBar,
                { backgroundColor: C.inputBg, borderColor: C.border },
              ]}
            >
              <SearchNormal1 size={16} color={C.muted} variant="Outline" />
              <TextInput
                style={[styles.searchInput, { color: C.text }]}
                placeholder="Search by name or number"
                placeholderTextColor={C.muted}
                value={beneficiarySearch}
                onChangeText={setBeneficiarySearch}
              />
            </View>

            {beneficiaries.length === 0 ? (
              <View style={styles.emptyBeneficiaryState}>
                <NoBeneficiary />
                <ThemedText style={styles.emptyText}>
                  No saved beneficiary
                </ThemedText>
              </View>
            ) : displayList.length === 0 ? (
              <ThemedText style={[styles.emptyText, { paddingVertical: 12 }]}>
                No results found
              </ThemedText>
            ) : (
              <ScrollView
                style={{ maxHeight: 4 * 58 }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                {displayList.map((b, i) => (
                  <TouchableOpacity
                    key={b.id}
                    style={[
                      styles.bListItem,
                      i < displayList.length - 1 && styles.bListItemBorder,
                      { borderBottomColor: C.border },
                    ]}
                    onPress={() => {
                      const stripped = b.phone
                        .replace(/^\+234/, "")
                        .replace(/^234/, "")
                        .trim();
                      setPhone(stripped);
                      setBeneficiarySearch("");
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.bAvatar}>
                      <ThemedText style={styles.bAvatarText}>
                        {b.name.charAt(0).toUpperCase()}
                      </ThemedText>
                    </View>
                    <View style={styles.bInfo}>
                      <ThemedText style={styles.bName}>{b.name}</ThemedText>
                      <ThemedText style={styles.bPhone}>{b.phone}</ThemedText>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  segmentTabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEE",
    marginBottom: 4,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    position: "relative",
  },
  segmentTabUnderline: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#013D25",
    borderRadius: 2,
  },
  segmentTabText: {
    fontSize: 13,
    color: "#7F7F86",
    fontWeight: "600",
  },
  segmentTabTextActive: { color: "#013D25" },
  card: { gap: 14, backgroundColor: "#FFFFFF" },
  fieldLabel: {
    fontSize: 12,
    color: "#8A8A90",
    fontWeight: "500",
    marginBottom: -6,
  },
  networkGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  networkTile: {
    width: "22%",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#F8FCFA",
    backgroundColor: "#F8FCFA",
    paddingVertical: 12,
    alignItems: "center",
    gap: 6,
  },
  networkTileActive: { borderColor: "#013D25", borderWidth: 2 },
  networkLogo: { width: 34, height: 34 },
  networkText: { fontSize: 10, color: "#5A5660", fontWeight: "500" },
  networkTextActive: { color: "#013D25", fontWeight: "700" },
  inlineInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E9E9EC",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
  },
  phoneDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#D0D0D5",
    marginHorizontal: 8,
  },
  phonePrefix: { fontSize: 14, fontWeight: "600", color: "#1D1D22" },
  inputError: { borderColor: "#D73C3C" },
  inlineInputText: { flex: 1, color: "#0B0014", fontSize: 12 },
  currencyPrefix: { fontSize: 14, fontWeight: "700", color: "#4A4A50" },
  errorText: { color: "#D73C3C", fontSize: 10, marginTop: -4 },
  beneficiaryCon: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  beneficiaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  beneficiaryText: { fontSize: 14, fontWeight: "500" },
  planSelector: {
    borderWidth: 1,
    borderColor: "#E7E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  planSelectorTitle: { fontSize: 12, color: "#1D1D22", fontWeight: "600" },
  amountGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  amountChip: {
    width: "23%",
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#E8E8EA",
    borderRadius: 8,
    paddingVertical: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  amountChipActive: { borderColor: "#013D25", borderWidth: 2 },
  amountChipText: { fontSize: 12, color: "#4F4F56", fontWeight: "500" },
  amountChipTextActive: { color: "#013D25" },
  customAmountInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E9E9EC",
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  customAmountText: { fontSize: 14, color: "#0B0014" },
  beneficiariesWrap: { gap: 6 },
  beneficiaryContainer: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 4,
    marginTop: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  bListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 10,
  },
  bListItemBorder: {
    borderBottomWidth: 1,
  },
  bAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D2F1E4",
    alignItems: "center",
    justifyContent: "center",
  },
  bAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#013D25",
  },
  bInfo: { flex: 1, gap: 2 },
  bName: { fontSize: 13, fontWeight: "600", color: "#1D1D22" },
  bPhone: { fontSize: 11, color: "#7F7F86" },
  emptyBeneficiaryState: { alignItems: "center", paddingVertical: 16, gap: 6 },
  emptyText: { fontSize: 12, color: "#8E8E93", textAlign: "center" },
});
