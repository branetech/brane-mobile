import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setShowSupportChat } from "@/redux/slice/auth-slice";
import { useAppState } from "@/redux/store";
import { TouchableOpacity, View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Messages2, Notification } from "iconsax-react-native";
import React from "react";
import { useDispatch } from "react-redux";
import { Avatar } from "../avatar";
import { ThemedText } from "../themed-text";

export const HomeHeader = () => {
  const { user } = useAppState();
  const router = useRouter();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme === "dark" ? "dark" : "light"];
  // const { data: notifications } = useRequest(
  //   "/notification-service/notifications/user",
  //   {
  //     initialValue: [],
  //     params: { currentPage: 0, perPage: 300 },
  //   }
  // );

  // const { showChat, hideChat } = useOnHideZohoChat();
  // const openChat = () => {
  //   showChat();
  //   setTimeout(() => {
  //     hideChat();
  //   }, 5000);
  // };

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

  // const hasUnreadNotifications = useMemo(() => {
  //   if (Array.isArray(notifications))
  //     return notifications?.some(
  //       (notification: any) => notification?.readAt === null
  //     );
  //   return false;
  // }, [notifications]);

  return (
    <View row justify='space-between' w='100%' aligned>
      {/* Left: Avatar + Greeting */}
      <View row gap={4} aligned>
        <TouchableOpacity onPress={() => router.push("/(tabs)/(account)")}>
          {/* <Avatar
            size={48}
            shape="circle"
            src={user?.image}
            style={{ backgroundColor: "#FFF3DB" }}
          >
            {getInitials("Tomi Balo")}
          </Avatar> */}
          <Avatar
            name={displayName}
            src={user?.image}
            size='lg'
            shape='rounded'
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
        <TouchableOpacity onPress={() => dispatch(setShowSupportChat(true))}>
          <Messages2 color={C.text} size={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/notification")}>
          <Notification color={C.text} size={20} />
          {/* {hasUnreadNotifications && (
              <View />
            )} */}
        </TouchableOpacity>
      </View>
    </View>
  );
};
