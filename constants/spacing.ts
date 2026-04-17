/**
 * Brane Finance — Spacing & Radius Scale
 *
 * Use these tokens for margins, paddings, gaps, and border radii
 * instead of hardcoded numbers.
 *
 * @example
 * import { spacing, radius } from '@/constants';
 * paddingHorizontal: spacing.xl   // 16
 * borderRadius: radius.lg         // 12
 */

export const spacing = {
  xs:    2,
  sm:    4,
  md:    8,
  lg:    12,
  xl:    16,
  '2xl': 20,
  safe: 20,
  '3xl': 24,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
  '7xl': 64,
} as const;

export const radius = {
  sm:   6,
  md:   10,
  lg:   12,
  xl:   16,
  '2xl': 20,
  full: 9999,
} as const;

export type SpacingKey = keyof typeof spacing;
export type RadiusKey  = keyof typeof radius;
