/**
 * Brane Finance — Semantic Color Tokens
 *
 * All values are derived from `palette.ts`. This is what components should
 * consume — never raw hex values or palette tokens directly.
 *
 * Usage in components:
 *   const C = Colors[scheme === 'dark' ? 'dark' : 'light'];
 */
import { palette } from "./palette";

export const Colors = {
  light: {
    text: palette.ink,
    background: palette.white,
    inputBackground: palette.surface100,
    tint: palette.tintAlpha,
    icon: palette.brandDeep,
    tabIconDefault: palette.gray950,
    tabIconSelected: palette.tintAlpha,
    borderColor: palette.surface100,
    inputBg: palette.surface200,
    primary: palette.brandDeep,
    muted: palette.gray350,
    border: palette.borderLight,
    error: palette.error,
    screen: palette.white,
    googleBg: palette.brandMint,
    fingerBorder: palette.brandMintSoft,
    greenBtn: palette.greenBtn,
    textMuted: palette.textMuted,
    selectedBorder: palette.selectedBorder,
    selectedBg: palette.selectedBg,
    textLight: palette.gray100,
  },
  dark: {
    text: palette.white,
    background: palette.darkBg,
    inputBackground: palette.darkSurface,
    tint: palette.brandBright,
    icon: palette.brandBright,
    tabIconDefault: palette.gray150,
    tabIconSelected: palette.brandBright,
    borderColor: palette.darkSurface,
    inputBg: palette.darkSurface,
    primary: palette.brandBright,
    muted: palette.gray200,
    border: palette.borderDark,
    error: palette.error,
    screen: palette.darkBg,
    googleBg: palette.brandBright,
    fingerBorder: palette.borderDarkFing,
    greenBtn: palette.greenBtn,
    textMuted: palette.textMuted,
    selectedBorder: palette.selectedBorder,
    selectedBg: palette.selectedBg,
    textLight: palette.gray150,
  },
};

// ── Legacy standalone exports (backward compat) ──────────────────────────────
export const TEXT = palette.gray350;
export const WHITE_TEXT = palette.white;
export const GRAY_TEXT = "#5D5D5D";
export const WEIRD_TEXT = "#3D3D3D";
export const BLACKER = "#000000EB";

export const BG1 = palette.brandMint;
export const BG2 = palette.purple;

export const SUCCESSFUL = palette.brandMid;
export const FAILED = palette.loss;
export const LOSS = palette.error;
export const GAIN = palette.brandGain;

export const MAIN = palette.brandMid;
export const BUTTON = "#FFFFFF66";
