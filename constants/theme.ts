/**
 * Brane Finance — Theme Constants
 *
 * `Colors` is the canonical semantic token map — all keys derive from
 * `palette.ts` via `colors.ts`. Import `Colors` from either
 * `@/constants/colors` or `@/constants/theme`; both resolve to the same object.
 */

import { Platform } from "react-native";
import { palette } from './palette';

// Re-export from the single source of truth so both import paths work.
export { Colors } from './colors';

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
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
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/** Light/dark scheme identifier */
export type Scheme = "light" | "dark";

/** Modal backdrop — branded green at 30% opacity */
export const MODAL_OVERLAY_COLOR = palette.modalOverlay;

/** Support chat message */
export type ChatMessage = {
  id: string;
  text: string;
  sender: "support" | "user";
};

/** FAQ entry */
export type FAQ = { q: string; a: string };

