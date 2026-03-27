import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setShowSupportChat } from "@/redux/slice/auth-slice";
import { useAppState } from "@/redux/store";
import { TouchableOpacity, View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Messages2, Notification } from "iconsax-react-native";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Avatar } from "../avatar";
import { ThemedText } from "../themed-text";
import { useRequest } from "@/services/useRequest";

export const HomeHeader = () => {
  const { user } = useAppState();
  const router = useRouter();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme === "dark" ? "dark" : "light"];

  // Fetch notifications
  const { data: notifications } = useRequest(
    "/notification-service/notifications/user",
    {
      initialValue: [],
      params: { currentPage: 0, perPage: 300 }
    }
  );


  // Check for unread notifications
  const hasUnreadNotifications = useMemo(() => {
    if (Array.isArray(notifications)) {
      return notifications?.some((notification: any) => notification?.readAt === null);
    }
    return false;
  }, [notifications]);


  const now = new Date();
  const currentHour = now.getHours();
  const timeOfDay: string =
    currentHour >= 16 ? "evening" : currentHour >= 12 ? "afternoon" : "morning";

  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const displayName = fullName || user?.name || user?.username || "User";
  const username = user?.username
    ? `@${user.username}`
    : user?.email
      ? `@${String(user.email).split("@")[0]}`
      : "@user";

  // const { showChat, hideChat } = useOnHideZohoChat();
  // const openChat = () => {
  //   showChat();
  //   setTimeout(() => {
  //     hideChat();
  //   }, 5000);
  // };    

  return (
    <View row justify='space-between' w='100%' aligned mb={16}>
      {/* Left: Avatar + Greeting */}
      <View row gap={4} aligned>
        <TouchableOpacity onPress={() => router.push("/(tabs)/(account)")}>
          <Avatar
            name={displayName}
            src={user?.image}
            size='md'
            // shape='rounded'
          />
        </TouchableOpacity>
        <View>
          <ThemedText>Good {timeOfDay} ☀️,</ThemedText>
          <ThemedText type='defaultSemiBold'>
            {username || displayName}
          </ThemedText>
        </View>
      </View>

      {/* Right: Chat + Notifications */}
      <View row gap={24}>
        {/* <TouchableOpacity onPress={() => router.push("/support")}>
          <Messages2 color={C.text} size={20} />
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => router.push("/notification")}>
          <View style={{ position: "relative" }}>
            <Notification color={C.text} size={20} />
            {hasUnreadNotifications && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#DC2626",
                  borderWidth: 1.5,
                  borderColor: C.background,
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
