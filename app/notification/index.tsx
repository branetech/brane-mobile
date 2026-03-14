import Back from "@/components/Back";
import { EmptyState } from "@/components/empty-state";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { formatDate } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { Notification as BellIcon } from "iconsax-react-native";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface INotification {
  id: string;
  title: string;
  body: string;
  date: string;
  isRead: boolean;
  description?: string;
  createdAt?: string;
  readAt?: string | null;
}

const toArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.records)) return value.records;
  if (Array.isArray(value?.data?.records)) return value.data.records;
  return [];
};

const mapNotification = (item: any): INotification => ({
  id: String(item?.id || ""),
  title: String(item?.title || "Notification"),
  body: String(item?.description || item?.body || ""),
  description: String(item?.description || ""),
  createdAt: String(item?.createdAt || ""),
  date: formatDate(item?.createdAt, "MMM dd, yyyy"),
  isRead: Boolean(item?.readAt),
  readAt: item?.readAt || null,
});

export default function NotificationScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [selected, setSelected] = useState<INotification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchNotifications = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const response: any = await BaseRequest.get(
        "/notification-service/notifications/user",
      );
      const records = toArray(response).map(mapNotification);
      setNotifications(records);
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const openDetails = useCallback(async (id: string) => {
    setIsDetailLoading(true);
    try {
      const response: any = await BaseRequest.get(
        `/notification-service/notifications/${id}`,
      );
      const data = response?.data || response;
      if (Array.isArray(data) && data[0]) {
        setSelected(mapNotification(data[0]));
        return;
      }
      setSelected(mapNotification(data));
    } catch (error) {
      setSelected(null);
      catchError(error);
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const hasNotifications = notifications.length > 0;

  if (selected) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: C.background }]}
      >
        <View style={styles.header}>
          <Back onPress={() => setSelected(null)} />
          <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
            Notification
          </ThemedText>
          <View style={{ width: 44 }} />
        </View>

        {isDetailLoading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="small" color="#013D25" />
          </View>
        ) : (
          <View style={styles.detailContent}>
            <ThemedText
              type="subtitle"
              style={{ color: C.text, lineHeight: 28 }}
            >
              {selected.title}
            </ThemedText>
            <ThemedText
              style={{ color: C.muted, lineHeight: 22, marginTop: 12 }}
            >
              {selected.body}
            </ThemedText>
            <ThemedText style={{ color: C.muted, fontSize: 12, marginTop: 16 }}>
              {selected.date}
            </ThemedText>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back />
        <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
          Notification
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="small" color="#013D25" />
        </View>
      ) : hasNotifications ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchNotifications(true)}
            />
          }
        >
          {notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => openDetails(item.id)}
              style={[
                styles.card,
                item.isRead
                  ? {
                      backgroundColor: C.background,
                      borderWidth: 1,
                      borderColor: "#D3EBE1",
                    }
                  : { backgroundColor: "#F7F3E8" },
              ]}
            >
              <ThemedText style={styles.cardDate}>{item.date}</ThemedText>
              <ThemedText
                type="defaultSemiBold"
                style={{ color: C.text, fontSize: 14, marginTop: 4 }}
                numberOfLines={2}
              >
                {item.title}
              </ThemedText>
              <ThemedText
                style={{
                  color: C.muted,
                  fontSize: 12,
                  lineHeight: 18,
                  marginTop: 4,
                }}
                numberOfLines={2}
              >
                {item.body}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyWrapper}>
          <EmptyState>
            <BellIcon variant="TwoTone" size={24} color="#013D25" />
            <View style={{ gap: 4, alignItems: "center" }}>
              <ThemedText
                type="defaultSemiBold"
                style={{ fontSize: 14, color: C.text }}
              >
                No new notification
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 12,
                  color: C.muted,
                  textAlign: "center",
                  paddingHorizontal: 32,
                }}
              >
                When you get a notification it appears here for easy tracking
              </ThemedText>
            </View>
          </EmptyState>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
    paddingTop: 8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
  cardDate: {
    fontSize: 11,
    color: "#85808A",
    fontWeight: "400",
  },
  detailContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    flex: 1,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
