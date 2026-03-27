import { ArrowRight2 } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// ─────────────────────────────────────────────
// Broker Data
// ─────────────────────────────────────────────
const brokerList = [
  {
    name: "Sankore Investments",
    logo: "https://res.cloudinary.com/dnw2oazrn/image/upload/v1760287569/sankore_investments_logo_tlak60.jpg",
    assetClasses: [
      "stocks",
      "bonds",
      "mutual funds",
      "etfs",
      "indexes",
      "fixed-income",
    ],
  },
  {
    name: "Dukia Gold & Precious Metals Refining Co. Ltd",
    logo: "https://res.cloudinary.com/dnw2oazrn/image/upload/v1759904167/download_7_b2tmps.jpg",
    assetClasses: ["gold"],
  },
];

// ─────────────────────────────────────────────
// Tenure Data
// ─────────────────────────────────────────────
export interface PAItem {
  tenureDuration: string;
  assetClasses?: string[];
}

const PA: PAItem[] = [
  { tenureDuration: "30", assetClasses: ["fixed-income"] },
  { tenureDuration: "60", assetClasses: ["fixed-income"] },
  { tenureDuration: "90", assetClasses: ["fixed-income"] },
  { tenureDuration: "120", assetClasses: ["fixed-income"] },
  { tenureDuration: "180", assetClasses: ["fixed-income"] },
];

// ─────────────────────────────────────────────
// SelectBroker
// ─────────────────────────────────────────────
interface SelectBrokerProps {
  assetClass: string;
  selectedBrokerName: string;
  setSelectedBrokerName: (name: string) => void;
}

const SelectBroker: React.FC<SelectBrokerProps> = ({
  assetClass,
  selectedBrokerName,
  setSelectedBrokerName,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const filteredBrokers = brokerList.filter((b) =>
    b.assetClasses.includes(assetClass),
  );

  useEffect(() => {
    if (!selectedBrokerName && filteredBrokers.length > 0) {
      setSelectedBrokerName(filteredBrokers[0].name);
    }
  }, [selectedBrokerName, filteredBrokers, setSelectedBrokerName]);

  return (
    <>
      <TouchableOpacity
        style={styles.selectorRow}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectorLabel}>Select broker</Text>
        <View style={styles.selectorRight}>
          {!!selectedBrokerName && (
            <View style={styles.selectedPill}>
              <Text style={styles.selectedPillText}>{selectedBrokerName}</Text>
            </View>
          )}
          <ArrowRight2 size={14} color='#0B0014' />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Select Broker</Text>
            {filteredBrokers.map((item) => {
              const isSelected = selectedBrokerName === item.name;
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.radioRow, isSelected && styles.radioRowActive]}
                  onPress={() => {
                    setSelectedBrokerName(item.name);
                    setModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.radioLabel,
                      isSelected && styles.radioLabelActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default SelectBroker;

// ─────────────────────────────────────────────
// SelectTenure
// ─────────────────────────────────────────────
interface SelectTenureProps {
  assetClass: string;
  selectedTenure: PAItem | null;
  setSelectedTenure: (item: PAItem) => void;
}

export const SelectTenure: React.FC<SelectTenureProps> = ({
  assetClass,
  selectedTenure,
  setSelectedTenure,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const filteredTenures = PA.filter((p) =>
    p.assetClasses?.includes(assetClass),
  );

  return (
    <>
      <TouchableOpacity
        style={styles.selectorRow}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectorLabel}>Select Tenure</Text>
        <View style={styles.selectorRight}>
          {selectedTenure?.tenureDuration ? (
            <View style={styles.tenurePill}>
              <Text style={styles.tenurePillText}>
                {selectedTenure.tenureDuration} days.{" "}
                {Number(selectedTenure.tenureDuration) / 100}% p.a
              </Text>
            </View>
          ) : null}
          <ArrowRight2 size={14} color='#0B0014' />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Select Tenure</Text>
            {filteredTenures.map((item) => {
              const isSelected =
                selectedTenure?.tenureDuration === item.tenureDuration;
              return (
                <TouchableOpacity
                  key={item.tenureDuration}
                  style={[styles.radioRow, isSelected && styles.radioRowActive]}
                  onPress={() => {
                    setSelectedTenure(item);
                    setModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.radioLabel,
                      isSelected && styles.radioLabelActive,
                    ]}
                  >
                    {item.tenureDuration} days.{" "}
                    {Number(item.tenureDuration) / 100}% p.a
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  selectorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  selectorLabel: {
    color: "#0B0014",
    fontSize: 12,
    fontWeight: "400",
  },
  selectorRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  selectedPill: {
    backgroundColor: "#D2F1E4",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  selectedPillText: {
    fontSize: 12,
    color: "#013D25",
  },
  tenurePill: {
    backgroundColor: "#F8FCFA",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tenurePillText: {
    fontSize: 12,
    color: "#013D25",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#342A3B",
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  radioRowActive: {
    backgroundColor: "#F8FCFA",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E6E4E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioCircleActive: {
    borderColor: "#013D25",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#013D25",
  },
  radioLabel: {
    fontSize: 14,
    color: "#0B0014",
    flex: 1,
  },
  radioLabelActive: {
    color: "#013D25",
    fontWeight: "500",
  },
});
