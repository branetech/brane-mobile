/**
 * Brane Finance — Typography Scale
 *
 * Predefined text style objects. Spread them into StyleSheet entries
 * or ThemedText style props.
 *
 * Loaded fonts: SpaceMono (monospace/brand accent)
 * Body/UI: System default (SF Pro / Roboto)
 *
 * @example
 * import { typography, fontFamilies } from '@/constants';
 * <Text style={typography.headingMd}>Hello</Text>
 */

export const typography = {
  displayLg: { fontSize: 32, lineHeight: 38, fontWeight: '700' as const },
  displayMd: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  displaySm: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const },
  headingLg: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const },
  headingMd: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  headingSm: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
  bodyLg:    { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodyMd:    { fontSize: 14, lineHeight: 22, fontWeight: '400' as const },
  bodySm:    { fontSize: 13, lineHeight: 20, fontWeight: '400' as const },
  caption:   { fontSize: 12, lineHeight: 18, fontWeight: '500' as const },
  label:     { fontSize: 12, lineHeight: 16, fontWeight: '600' as const },
  overline:  { fontSize: 11, lineHeight: 15, fontWeight: '700' as const, letterSpacing: 1.0, textTransform: 'uppercase' as const },
} as const;

export const fontFamilies = {
  /** Loaded via expo-font — use for brand/monospaced accents */
  mono:    'SpaceMono',
  /** System UI default — SF Pro on iOS, Roboto on Android */
  body:    undefined,
  display: undefined,
} as const;

export type TypographyKey  = keyof typeof typography;
export type FontFamilyKey  = keyof typeof fontFamilies;
