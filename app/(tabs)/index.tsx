import { HomeHeader } from '@/components/home';
import { ThemedText } from '@/components/themed-text';
import { View } from '@idimma/rn-widget';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
   <SafeAreaView style={styles.container}>
    <HomeHeader/>
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    position: 'relative',
    paddingHorizontal: 24,
  },
});
