import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // ... (copy all styles from index.tsx)
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 15, fontWeight: "700", textAlign: "center" },
  headerSubtitle: { fontSize: 11, marginTop: 1, textAlign: "center" },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  // Dividend banner
  dividendBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dividendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  dividendText: { fontSize: 13, color: "#fff", flex: 1 },
  // Main tabs
  mainTabRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  mainTabItem: {
    paddingVertical: 13,
    paddingHorizontal: 32,
    position: "relative",
  },
  mainTabText: { fontSize: 14 },
  mainTabTextActive: { fontWeight: "600" },
  mainTabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  scroll: { paddingTop: 20, paddingBottom: 120 },
  // Price row
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    paddingHorizontal: 16,
  },
  logo: { width: 46, height: 46, borderRadius: 23 },
  priceText: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  changeAmt: { fontSize: 13, fontWeight: "500" },
  changePct: { fontSize: 13, fontWeight: "500" },
  dot: { fontSize: 12 },
  // Chart
  chartWrap: { marginBottom: 0 },
  chartSkeleton: { height: 170 },
  // Time filters
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
  },
  timeTxt: { fontSize: 13 },
  timeTxtActive: { fontWeight: "700" },
  // Stats section (no background)
  statsSection: {
    padding: 16,
    marginVertical: 30,
    gap: 16,
    backgroundColor: "#F8FCFA",
    marginHorizontal: 16,
    borderRadius: 12,
  },
  statsTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsBottomRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  statLabel: { fontSize: 11 },
  statBigVal: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  statChange: { fontSize: 12, fontWeight: "500" },
  statMuted: { fontSize: 11, marginTop: 3 },
  statMiniVal: { fontSize: 13, fontWeight: "700" },
  horizDivider: { height: StyleSheet.hairlineWidth },
  vertDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    marginHorizontal: 8,
  },
  // Section title
  sectionTitle: { fontSize: 12, marginBottom: 10, paddingHorizontal: 16 },
  // Growth Trend card
  growthCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#CDFEEA",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  growthCardTitle: {
    fontSize: 12,
    color: "#85808A",
    marginBottom: 12,
    marginLeft: 16,
  },
  growthItem: { flex: 1, alignItems: "center", gap: 4 },
  growthVal: { fontSize: 16, fontWeight: "700", color: "#0B0014" },
  growthLabel: { fontSize: 13, color: "#85808A" },
  growthDivider: { width: StyleSheet.hairlineWidth, alignSelf: "stretch" },
  // Sally card
  sallyCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F8FCFA",
    padding: 16,
    marginBottom: 20,
  },
  sallyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sallyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#013D25",
  },
  sallyHeaderTxt: { fontSize: 13, fontWeight: "600", color: "#013D25" },
  sallyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B0014",
    marginBottom: 8,
  },
  sallyBody: { fontSize: 13, lineHeight: 20, color: "#555", marginBottom: 16 },
  sallyBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#D2F1E4",
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sallyBtnTxt: { fontSize: 14, fontWeight: "600", color: "#013D25" },
  // Bottom action bar
  actionBar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionBtn: {
    flex: 1,
    height: 52,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: { fontSize: 16, fontWeight: "600", color: "#D2F1E4" },
  // History sub-tabs
  subTabRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  subTab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
  },
  subTabTxt: { fontSize: 13, fontWeight: "500" },
  // Return section (no card)
  returnSection: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#F8FCFA",
    marginHorizontal: 16,
    borderRadius: 12,
  },
  returnLabel: { fontSize: 12, marginBottom: 8 },
  returnAmt: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 4,
    paddingTop: 10,
  },
  returnPct: { fontSize: 13, fontWeight: "500" },
  // Transaction items
  txItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0EFF2",
  },
  txIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  txLabel: { fontSize: 14, fontWeight: "600", marginBottom: 3 },
  txDate: { fontSize: 11 },
  txAmt: { fontSize: 14, fontWeight: "700", marginBottom: 3 },
});

export default styles;
