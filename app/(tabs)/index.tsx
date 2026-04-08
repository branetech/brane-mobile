import { HomeHeader } from "@/components/home";
import { HomeCard, Learning, Quick } from "@/components/home/home-card";
import { Transactions } from "@/components/home/home-transaction";
import { NewUserOnboardingModal } from "@/components/new-user-onboarding-modal";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setShowNewUserModal } from "@/redux/slice/auth-slice";
import { useCallback, useState, useRef } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function HomeScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();
  const transactionsRef = useRef<any>(null);
  const showNewUserModal = useSelector(
    (state: any) => state.auth.showNewUserModal,
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Refresh transactions data
      if (transactionsRef.current?.refresh) {
        await transactionsRef.current.refresh();
      }
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleCloseModal = () => {
    dispatch(setShowNewUserModal(false));
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
        <Transactions ref={transactionsRef} />
        <Learning />
      </ScrollView>
      <NewUserOnboardingModal
        visible={showNewUserModal}
        onClose={handleCloseModal}
      />
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
