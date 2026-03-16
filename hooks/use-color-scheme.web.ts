import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { useSelector } from "react-redux";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme(): "light" | "dark" {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const systemScheme = useRNColorScheme();
  const currentTheme = useSelector(
    (state: RootState) => state.themes.currentTheme,
  );

  // If user selected a specific theme, use it
  if (currentTheme === "dark") {
    return "dark";
  }
  if (currentTheme === "light") {
    return "light";
  }

  // If system is selected, use the native system preference
  if (hasHydrated) {
    return systemScheme || "light";
  }

  return "light";
}
