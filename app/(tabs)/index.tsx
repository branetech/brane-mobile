import { HomeHeader } from "@/components/home";
import {
    HomeCard,
    Learning,
    Quick,
} from "@/components/home/home-card";
import { HomeTransactionHistory } from "@/components/home/home-transaction-history";
import { NewUserOnboardingModal } from "@/components/new-user-onboarding-modal";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setShowNewUserModal, setShowSupportChat } from "@/redux/slice/auth-slice";
import { useCallback, useState } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function HomeScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();
  const showNewUserModal = useSelector((state: any) => state.auth.showNewUserModal);
  const showSupportChat = useSelector((state: any) => state.auth.showSupportChat);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Trigger refresh in child components
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  }, []);

  const handleCloseModal = () => {
    dispatch(setShowNewUserModal(false));
  };

  const handleCloseSupportChat = () => {
    dispatch(setShowSupportChat(false));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <HomeHeader />
        <HomeCard />
        <Quick />
        <HomeTransactionHistory />
        <Learning />
      </ScrollView>
      <NewUserOnboardingModal
        visible={showNewUserModal}
        onClose={handleCloseModal}
      />
      {/* <SupportChatModal
        visible={showSupportChat}
        onClose={handleCloseSupportChat}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    position: "relative",
    paddingHorizontal: 16,
  },
});
