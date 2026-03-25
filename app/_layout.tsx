// app/_layout.tsx
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppInitialization } from "@/hooks/useAppInitialization";
import { useRouteProtection } from "@/hooks/useRouteProtection";
import store, { persistor } from "@/redux/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner-native";

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { isReady, fontError } = useAppInitialization();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const baseTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  const navigationTheme = useMemo(
    () => ({
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: palette.primary,
        background: palette.background,
        card: palette.background,
        text: palette.text,
        border: palette.border,
        notification: palette.error,
      },
    }),
    [baseTheme, palette],
  );

  // Protect routes based on authentication
  useRouteProtection(isReady);

  // Show nothing while initializing
  if (!isReady) {
    return null;
  }

  // Optional: Handle font loading errors
  if (fontError) {
    console.error("Font loading error:", fontError);
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={navigationTheme}>
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
