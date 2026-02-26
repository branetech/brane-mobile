import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { View } from "@idimma/rn-widget";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function FundScreen() {
  return (
    <SafeAreaView style={styles.container}>
        <View w={'100%'} spaced row aligned>
            <Back/>
            <ThemedText type='subtitle'>Add Funds</ThemedText>
            <View></View>
        </View>
        <ThemedText style={{fontSize: 12}}>Fund your wallet by selecting your preferred method from the available options.</ThemedText>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        position: 'relative',
        paddingHorizontal: 16,
      },
});
