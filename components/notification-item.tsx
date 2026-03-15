import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Clock } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read?: boolean;
  type?: "success" | "error" | "warning" | "info";
  icon?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onPress?: () => void;
  onDelete?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onDelete,
}) => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const typeColors = {
    success: "#013D25",
    error: "#CB010B",
    warning: "#F5880E",
    info: "#0066FF",
  };

  const backgroundColor = notification.read
    ? C.inputBackground
    : scheme === "dark"
      ? "#1a3d33"
      : "#E8F5F2";

  const typeColor = typeColors[notification.type || "info"];
  const iconBgColor =
    notification.type === "success"
      ? "#D2F1E4"
      : notification.type === "error"
        ? "#FFE5E5"
        : "#FFF4E5";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor: C.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.contentRow}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          {notification.icon ? (
            <ThemedText style={styles.icon}>{notification.icon}</ThemedText>
          ) : (
            <View style={[styles.iconDot, { backgroundColor: typeColor }]} />
          )}
        </View>

        <View style={styles.content}>
          <ThemedText
            type='defaultSemiBold'
            numberOfLines={1}
            style={[styles.title, { color: C.text }]}
          >
            {notification.title}
          </ThemedText>
          <ThemedText
            numberOfLines={2}
            style={[styles.message, { color: C.muted }]}
          >
            {notification.message}
          </ThemedText>
          <View style={styles.dateRow}>
            <Clock size={12} color={C.muted} />
            <ThemedText style={[styles.date, { color: C.muted }]}>
              {notification.date}
            </ThemedText>
          </View>
        </View>

        {!notification.read && (
          <View style={[styles.unreadDot, { backgroundColor: typeColor }]} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  contentRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  icon: {
    fontSize: 20,
  },
  iconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 14,
  },
  message: {
    fontSize: 12,
    lineHeight: 16,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: 11,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 2,
  },
});
