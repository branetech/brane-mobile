import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Close } from "iconsax-react-native";
import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

export interface PreviewData {
  type: "airtime" | "data";
  recipientPhone: string;
  recipientName?: string;
  amount: number;
  networkProvider?: string;
  dataSize?: string;
  validity?: string;
  fee?: number;
  totalAmount?: number;
}

interface AirtimeDataPreviewProps {
  visible: boolean;
  data: PreviewData;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AirtimeDataPreview: React.FC<AirtimeDataPreviewProps> = ({
  visible,
  data,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const total = data.totalAmount || data.amount + (data.fee || 0);

  const previewItems = [
    {
      label: data.type === "airtime" ? "Recipient Phone" : "Network Provider",
      value: data.networkProvider || data.recipientPhone,
    },
    ...(data.type === "data"
      ? [
          { label: "Data Size", value: data.dataSize || "—" },
          { label: "Validity", value: data.validity || "—" },
        ]
      : []),
    { label: "Amount", value: `₦${data.amount.toLocaleString()}` },
    ...(data.fee
      ? [{ label: "Transaction Fee", value: `₦${data.fee.toLocaleString()}` }]
      : []),
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onCancel}
    >
      <View style={[styles.overlay, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: C.background,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type='subtitle' style={styles.title}>
              {data.type === "airtime" ? "Airtime" : "Data"} Preview
            </ThemedText>
            <TouchableOpacity onPress={onCancel} hitSlop={8}>
              <Close size={24} color={C.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Recipient Info */}
            <View
              style={[
                styles.section,
                {
                  backgroundColor: C.inputBackground,
                  borderColor: C.border,
                },
              ]}
            >
              <ThemedText style={[styles.sectionLabel, { color: C.muted }]}>
                {data.type === "airtime" ? "Recipient" : "Recipient"}
              </ThemedText>
              <ThemedText
                type='defaultSemiBold'
                style={[styles.sectionValue, { color: C.text }]}
              >
                {data.recipientName || data.recipientPhone}
              </ThemedText>
            </View>

            {/* Preview Items */}
            <View
              style={[
                styles.previewBox,
                {
                  backgroundColor: C.inputBackground,
                  borderColor: C.border,
                },
              ]}
            >
              {previewItems.map((item, index) => (
                <View key={index}>
                  {index > 0 && (
                    <View style={[styles.divider, { borderColor: C.border }]} />
                  )}
                  <View style={styles.previewItem}>
                    <ThemedText
                      style={[styles.previewLabel, { color: C.muted }]}
                    >
                      {item.label}
                    </ThemedText>
                    <ThemedText
                      type='defaultSemiBold'
                      style={[styles.previewValue, { color: C.text }]}
                    >
                      {item.value}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>

            {/* Total */}
            <View style={styles.totalSection}>
              <ThemedText style={[styles.totalLabel, { color: C.muted }]}>
                Total Amount
              </ThemedText>
              <ThemedText
                type='defaultSemiBold'
                style={[styles.totalAmount, { color: "#013D25" }]}
              >
                ₦{total.toLocaleString()}
              </ThemedText>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <BraneButton
              text='Cancel'
              onPress={onCancel}
              backgroundColor='transparent'
              borderWidth={1}
              borderColor={C.border}
              textColor={C.text}
              disabled={isLoading}
            />
            <BraneButton
              text='Confirm'
              onPress={onConfirm}
              loading={isLoading}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
  },
  content: {
    gap: 16,
    marginBottom: 24,
  },
  section: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  sectionLabel: {
    fontSize: 12,
  },
  sectionValue: {
    fontSize: 15,
  },
  previewBox: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  previewItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  previewLabel: {
    fontSize: 12,
  },
  previewValue: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    borderBottomWidth: 1,
  },
  totalSection: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 12,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
  },
  actions: {
    gap: 12,
    flexDirection: "row",
  },
});
