import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Hook to get theme-aware color scheme.
 * Replaces the common pattern: `useColorScheme(); const C = Colors[scheme === "dark" ? "dark" : "light"]`
 *
 * Usage:
 * const C = useThemeColors();
 *
 * This eliminates repeated boilerplate and centralizes theme logic.
 */
export const useThemeColors = () => {
  const scheme = useColorScheme();
  return Colors[scheme === "dark" ? "dark" : "light"];
};
