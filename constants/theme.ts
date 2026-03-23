/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app) etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#013D25";
const tintColorDark = "#13C965";

export const Colors = {
  light: {
    text: "#0B0014",
    background: "#ffffff",
    tint: tintColorLight,
    icon: "#013D25",
    tabIconDefault: "#131927",
    tabIconSelected: tintColorLight,
    bodyText: "#85808A",
    border: "#E5E5E5",
    inputBg: "#F5F5F5",
    primary: "#013D25",
    muted: "#85808A",
    error: "#D50000",
    screen: "#FFFFFF",
    googleBg: "#D2F1E4",
  },
  dark: {
    text: "#FFFFFF",
    background: "#151718",
    tint: tintColorDark,
    icon: "#13C965",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    bodyText: "#FFFFFF",
    border: "#404040",
    inputBg: "#2A2B2D",
    primary: "#13C965",
    muted: "#8E8E93",
    error: "#D50000",
    screen: "#151718",
    googleBg: "#13C965",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/**
 * Global type definitions for theme
 */
export type Scheme = "light" | "dark";

/**
 * Modal overlay color - branded green with 30% opacity
 * Used consistently across all modal backdrops in the app
 */
export const MODAL_OVERLAY_COLOR = "#013D254D";

/**
 * Chat message types
 */
export type ChatMessage = {
  id: string;
  text: string;
  sender: "support" | "user";
};

/**
 * FAQ entry
 */
export type FAQ = { q: string; a: string };
