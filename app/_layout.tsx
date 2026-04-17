// app/_layout.tsx
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppInitialization } from "@/hooks/useAppInitialization";
import { useRouteProtection } from "@/hooks/useRouteProtection";
import store, { persistor } from "@/redux/store";
import { WidgetProvider } from "@idimma/rn-widget";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Sentry from '@sentry/react-native';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner-native";

Sentry.init({
  dsn: 'https://579694169e23c6dd89026602e33a4ee4@o4507425691271168.ingest.de.sentry.io/4511178373857360',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: false,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

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
      <WidgetProvider
        theme={colorScheme === "dark" ? "dark" : "light"}
        disableSafeArea
        lightTheme={Colors.light}
        darkTheme={Colors.dark}
      >
        <ThemeProvider value={navigationTheme}>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar animated style="inverted"/>
          <Toaster />
        </ThemeProvider>
      </WidgetProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootLayoutContent />
      </PersistGate>
    </Provider>
  );
});
