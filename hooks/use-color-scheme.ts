import { RootState } from "@/redux/store";
import { useColorScheme as useNativeColorScheme } from "react-native";
import { useSelector } from "react-redux";

export function useColorScheme(): "light" | "dark" {
  const systemScheme = useNativeColorScheme();
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
  if (systemScheme === "dark") return "dark";
  if (systemScheme === "light") return "light";
  // Treat null, undefined, or "unspecified" as "light"
  return "light";
}
