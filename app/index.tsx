import { useAppState } from "@/redux/store";
import expoSecureStorage from "@/utils/secureStore";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const { isLoading, isAuthenticated } = useAppState("auth");

  useEffect(() => {
    const checkInitialRoute = async () => {
      if (isLoading) return;

      try {
        // Authenticated users always go straight to tabs — no splash, no onboard
        if (isAuthenticated) {
          router.replace("/(tabs)");
          return;
        }

        const hasSeenFirstSplash =
          await expoSecureStorage.getItem("hasSeenFirstSplash");
        const hasCompletedOnboarding = await expoSecureStorage.getItem(
          "hasCompletedOnboarding",
        );
        const hasRegistered = await expoSecureStorage.getItem("hasRegistered");

        if (hasRegistered) {
          // Returning user who logged out — skip straight to login
          router.replace("/login");
        } else if (!hasSeenFirstSplash) {
          // Brand new install — show splash first
          router.replace("/splash");
        } else if (!hasCompletedOnboarding) {
          // Seen splash but hasn't finished onboarding
          router.replace("/splash/onboard");
        } else {
          // Completed onboarding but never registered
          router.replace("/login");
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkInitialRoute();
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size='small' />
      </View>
    );
  }

  return null;
}
