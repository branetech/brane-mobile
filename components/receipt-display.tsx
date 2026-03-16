import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Copy, Download } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface ReceiptItem {
  label: string;
  value: string;
  isBold?: boolean;
  isHighlight?: boolean;
}

interface ReceiptDisplayProps {
  title: string;
  items: ReceiptItem[];
  status?: "success" | "pending" | "failed";
  onCopy?: () => void;
  onDownload?: () => void;
  refNumber?: string;
}

export const ReceiptDisplay: React.FC<ReceiptDisplayProps> = ({
  title,
  items,
  status = "success",
  onCopy,
  onDownload,
  refNumber,
}) => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const statusColors = {
    success: "#013D25",
    pending: "#F5880E",
    failed: "#CB010B",
  };

  const statusBgColor = {
    success: "#D2F1E4",
    pending: "#FFF4E5",
    failed: "#FFE5E5",
  };

  return (
    <View
      style={[
        styles.receipt,
        {
          backgroundColor: C.inputBackground,
          borderColor: C.border,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText
            type='defaultSemiBold'
            style={[styles.title, { color: C.text }]}
          >
            {title}
          </ThemedText>
          {refNumber && (
            <ThemedText style={[styles.refNumber, { color: C.muted }]}>
              Reference: {refNumber}
            </ThemedText>
          )}
        </View>

        {status && (
          <View
            style={[styles.status, { backgroundColor: statusBgColor[status] }]}
          >
            <ThemedText
              type='defaultSemiBold'
              style={[styles.statusText, { color: statusColors[status] }]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Items */}
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index}>
            {index > 0 && (
              <View style={[styles.divider, { borderColor: C.border }]} />
            )}
            <View
              style={[
                styles.row,
                item.isHighlight && {
                  backgroundColor: item.isHighlight
                    ? scheme === "dark"
                      ? "#1a3d33"
                      : "#F0F9F7"
                    : "transparent",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginHorizontal: -12,
                  marginVertical: 4,
                  borderRadius: 8,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.label,
                  {
                    color: item.isHighlight ? "#013D25" : C.muted,
                    fontWeight: item.isBold ? "600" : "400",
                  },
                ]}
              >
                {item.label}
              </ThemedText>
              <ThemedText
                type={item.isBold ? "defaultSemiBold" : "default"}
                style={[
                  styles.value,
                  {
                    color: item.isHighlight ? "#013D25" : C.text,
                  },
                ]}
              >
                {item.value}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>

      {/* Actions */}
      {(onCopy || onDownload) && (
        <View style={styles.actions}>
          {onCopy && (
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: C.border }]}
              onPress={onCopy}
            >
              <Copy size={18} color='#013D25' />
              <ThemedText style={{ color: "#013D25", fontSize: 12 }}>
                Copy
              </ThemedText>
            </TouchableOpacity>
          )}
          {onDownload && (
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: C.border }]}
              onPress={onDownload}
            >
              <Download size={18} color='#013D25' />
              <ThemedText style={{ color: "#013D25", fontSize: 12 }}>
                Download
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  receipt: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  refNumber: {
    fontSize: 11,
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
  },
  itemsContainer: {
    gap: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  label: {
    fontSize: 13,
    flex: 1,
  },
  value: {
    fontSize: 13,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    borderBottomWidth: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
  },
});
