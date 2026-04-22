/**
 * Brane Finance — Color Palette
 *
 * Raw brand color primitives. These are the single source of truth for every
 * hex value used in the app. Do NOT use these directly in components — consume
 * semantic tokens from `colors.ts` (via `Colors[scheme]`) instead.
 */

export const palette = {
  // ── Brand greens ────────────────────────────────────────────────────────────
  brandDeep:      '#013D25', // primary / icon (light mode)
  brandBright:    '#13C965', // primary / icon (dark mode)
  brandMid:       '#0C8F5C', // success, MAIN, SUCCESSFUL
  brandGain:      '#09734C', // gain / profit indicator
  brandMint:      '#D2F1E4', // light green surface (google bg, switch track on)
  brandMintSoft:  '#D3EBE1', // finger-scan border
  brandMintPale:  '#F8FCFA', // network tile background

  // ── Background surfaces ──────────────────────────────────────────────────────
  white:          '#FFFFFF',
  surface50:      '#F8F8FA', // display-only / read-only input bg
  surface100:     '#F7F7F8', // default input background + light border
  surface200:     '#F5F5F5', // alternate input background

  darkBg:         '#151718', // dark-mode screen background
  darkSurface:    '#2A2B2D', // dark-mode input / card surface

  // ── Borders ─────────────────────────────────────────────────────────────────
  borderLight:    '#E5E5E5', // general light-mode border
  borderInput:    '#E9E9EC', // text input outline
  borderChip:     '#E8E8EA', // amount-chip / card outline
  borderTab:      '#EBEBEE', // segment-tab bottom divider
  borderSwitch:   '#E6E6E8', // Switch track (off)
  borderPlan:     '#E7E7EB', // plan/selector border
  borderDark:     '#404040', // dark-mode general border
  borderDarkFing: '#2A5F54', // dark-mode finger-scan border

  // ── Text / Neutrals ──────────────────────────────────────────────────────────
  ink:            '#0B0014', // near-black body text (light mode)
  gray950:        '#131927', // tab icon default / tint base
  gray900:        '#1D1D22', // strong form labels
  gray700:        '#4A4A50', // currency prefix
  gray600:        '#5A5660', // secondary label (e.g. network text)
  gray500:        '#6E6E75', // tertiary icon (arrow, chevron)
  gray400:        '#7F7F86', // inactive tab text
  gray350:        '#85808A', // muted text / bodyText
  gray300:        '#8A8A90', // field label
  gray200:        '#8E8E93', // muted (dark mode) / empty-state
  gray150:        '#9BA1A6', // tab-icon default (dark mode)
  gray100:        '#A9A9AE', // placeholder text
  gray50:         '#D0D0D5', // subtle divider

  // ── Semantic states ──────────────────────────────────────────────────────────
  error:          '#D50000', // error text / icon
  errorBorder:    '#D73C3C', // error input border ring
  loss:           '#FF2626', // loss / failed transaction

  // ── Accents ──────────────────────────────────────────────────────────────────
  gold:           '#C3A93F', // decorative stroke accent
  purple:         '#EBEAFD', // card accent / BG2

  // ── Alpha / overlays ────────────────────────────────────────────────────────
  tintAlpha:      '#13192733', // navigation tint with opacity
  modalOverlay:   '#013D254D', // modal backdrop

  // ── Medal / Achievement ──────────────────────────────────────────────────────
  leaderboardGold:   '#FFD700',
  leaderboardSilver: '#C0C0C0',
  leaderboardBronze: '#CD7F32',

  // ── Chart / Service Colors ────────────────────────────────────────────────────
  chartOrange: '#F5A623', // spending data / bar chart
  chartBlue:   '#4A90E2', // spending electricity / bar chart
  chartRed:    '#E24A4A', // spending cable / bar chart
  chartPurple: '#9B59B6', // spending betting / bar chart

  // ── Spending Category Backgrounds (light mode) ───────────────────────────────
  spendDataBg:     '#FFF3DB',
  spendElectricBg: '#E1F0FF',
  spendCableBg:    '#FFE8E8',
  spendBettingBg:  '#EDE1FF',

  // ── Transaction Status ────────────────────────────────────────────────────────
  statusPendingBg:   '#FFF7E8',
  statusPendingText: '#B5760A',
  statusFailedBg:    '#FCE4E4',
  statusBuyBg:       '#EAF8F1',
  statusSellBg:      '#FDECEC',

  // ── Payment Brands ────────────────────────────────────────────────────────────
  mastercardRed: '#EA2D2D',
  visaAmber:     '#F3BD30',
  cardTeal:      '#AFC9BE', // soft teal for account number text on dark card

  // ── Misc Surfaces ─────────────────────────────────────────────────────────────
  fundHighlight: '#FAF6E6', // fund source selection background

  // Added missing palette properties
  greenBtn: '#13C965',
  textMuted: '#85808A',
  selectedBorder: '#09734C',
  selectedBg: '#D2F1E4',
} as const;

export type PaletteColor = keyof typeof palette;
