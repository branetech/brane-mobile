import { HomeHeader } from "@/components/home";
import {
    HomeCard,
    Learning,
    Quick,
    Transactions,
} from "@/components/home/home-card";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
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
