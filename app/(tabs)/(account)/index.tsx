import { BraneButton } from "@/components/brane-button";
import { MAIN } from "@/constants/colors";
import { Text } from "@idimma/rn-widget";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
export default function AccountScreen() {
  return (
    <View style={styles.titleContainer}>
      <Text black>Hello</Text>
      <BraneButton  
      text="Check Email"
        onPress={() => router.push("/signup")}
        style={{
          backgroundColor: MAIN,
          height: 46,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 11}}/>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginTop: 20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
