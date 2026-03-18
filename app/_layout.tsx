// app/_layout.tsx
import SupportChat from '@/components/support-chat-modal';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import store, { persistor } from '@/redux/store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner-native';

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { isReady, fontError } = useAppInitialization();
  
  // Protect routes based on authentication
  useRouteProtection(isReady);

  
  // Show nothing while initializing
  if (!isReady) {
    return null;
  }

  // Optional: Handle font loading errors
  if (fontError) {
    console.error('Font loading error:', fontError);
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar hidden={true} />
        <Toaster />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootLayoutContent />
      </PersistGate>
    </Provider>
  );
}