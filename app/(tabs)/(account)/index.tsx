import {Account} from "@/components/account";
import { Avatar } from "@/components/avatar";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { View } from "@idimma/rn-widget";
import { router } from "expo-router";
import {ArrowRight2 } from "iconsax-react-native";
import { ScrollView, StyleSheet} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type='subtitle'>Account</ThemedText>
      <View style={{gap: 10, flex: 1, flexDirection: 'column'}}>
        <View w='100%' px={12} gap={10} py={16} h={175} bg='#FFFDFA' radius={12} style={{borderColor: '#FFFAF0', borderWidth: 1}}>
          <View row spaced center>
            <View>
              <ThemedText type='subtitle'>John Doe</ThemedText>
              <ThemedText>@oluy112</ThemedText>
            </View>
            <Avatar name="John Doe" size="lg" shape="rounded" />
          </View>
          <View w='100%' gap={8} p={12} h={90} bg='#FFFFFF' radius={12} style={{borderColor: '#FFFFFF', borderWidth: 1}} row spaced>
            <View style={{overflow: 'hidden'}}>
            <ThemedText type="defaultSemiBold" style={{fontSize: 13}}>Complete Your KYC</ThemedText>
            <ThemedText style={{fontSize: 12}}>Complete verification for more seamless experience</ThemedText>
              <View mt={2} row aligned>
              <ThemedText style={{fontSize: 13, color: '#A28C34'}}>Complete Verification</ThemedText>
              <ArrowRight2 size={18} color={'#013D25'}/>
              </View>
            </View>
            <ThemedText type="defaultSemiBold" style={{fontSize: 13, color: '#013D25'}}>50%</ThemedText>
          </View>
        </View>
        <Account/>
      </View>
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
