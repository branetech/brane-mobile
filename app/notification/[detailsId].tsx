import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { formatDate } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface INotificationDetail {
  id: string;
  title: string;
  body: string;
  date: string;
  time: string;
}

const mapDetail = (item: any): INotificationDetail => ({
  id: String(item?.id || ""),
  title: String(item?.title || "Notification"),
  body: String(item?.description || item?.body || ""),
  date: formatDate(item?.createdAt, "MMMM dd, yyyy"),
  time: formatDate(item?.createdAt, "hh:mm a"),
});

export default function NotificationDetailScreen() {
  const { detailsId } = useLocalSearchParams<{ detailsId: string }>();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [detail, setDetail] = useState<INotificationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDetail = useCallback(
    async (refresh = false) => {
      if (!detailsId) return;
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      try {
        const response: any = await BaseRequest.get(
          `/notification-service/notifications/${detailsId}`,
        );
        const data = response?.data || response;
        if (Array.isArray(data) && data[0]) {
          setDetail(mapDetail(data[0]));
        } else {
          setDetail(mapDetail(data));
        }
      } catch (error) {
        catchError(error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [detailsId],
  );

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned spaced>
        <Back />
        <ThemedText type='defaultSemiBold' style={styles.headerTitle}>
          Notification
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size='small' color={C.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchDetail(true)}
              tintColor={C.primary}
            />
          }
        >
          {detail ? (
            <>
              <ThemedText
                type='subtitle'
                style={[styles.title, { color: C.text }]}
              >
                {detail.title}
              </ThemedText>
              <ThemedText style={[styles.datetime, { color: C.muted }]}>
                {detail.date} · {detail.time}
              </ThemedText>
              <ThemedText style={[styles.body, { color: C.text }]}>
                {detail.body}
              </ThemedText>
            </>
          ) : (
            <ThemedText
              style={{ color: C.muted, textAlign: "center", marginTop: 40 }}
            >
              Notification not found.
            </ThemedText>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  title: {
    lineHeight: 28,
  },
  datetime: {
    fontSize: 12,
    marginTop: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 16,
  },
});
