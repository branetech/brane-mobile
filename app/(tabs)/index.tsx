import { HomeHeader } from "@/components/home";
import {
    HomeCard,
    Learning,
    Quick,
    Transactions,
} from "@/components/home/home-card";
import { useCallback, useState } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Trigger refresh in child components
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
        <Transactions />
        <Learning />
      </ScrollView>
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
