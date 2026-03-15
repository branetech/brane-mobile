# Brane Mobile App - Master Implementation Plan

## Component Status ✅

All 8 new components created:

1. ✅ DataPlansList - `/components/data-plan-list.tsx`
2. ✅ UtilityBillSelector - `/components/utility-bill-selector.tsx`
3. ✅ TransactionCard - `/components/transaction-card.tsx`
4. ✅ StockCard - `/components/stock-card.tsx`
5. ✅ NotificationItem - `/components/notification-item.tsx`
6. ✅ AirtimeDataPreview - `/components/airtime-data-preview.tsx`
7. ✅ ReceiptDisplay - `/components/receipt-display.tsx`
8. ✅ ChartComponent - `/components/chart.tsx`

---

## Screen Implementation Schedule

### Phase 1: Authentication (4 screens)

**Priority**: 🔴 CRITICAL

- [ ] `app/(auth)/login/index.tsx` - Enhanced
- [ ] `app/(auth)/signup/index.tsx` - Enhanced
- [ ] `app/(auth)/forgot-password.tsx` - Enhanced
- [ ] `app/splash/onboard.tsx` - Enhanced

### Phase 2: Dashboard & Navigation (5 screens)

**Priority**: 🔴 CRITICAL

- [ ] `app/(tabs)/index.tsx` - Home dashboard
- [ ] `app/(tabs)/portfolio.tsx` - Portfolio tab
- [ ] `app/(tabs)/transactions.tsx` - Transactions tab
- [ ] `app/(tabs)/utilities.tsx` - Utilities tab
- [ ] `app/(tabs)/(account)/index.tsx` - Account tab

### Phase 3: Financial Management (19 screens)

**Priority**: 🟠 HIGH

- [ ] `app/wallet/index.tsx` - Wallet home
- [ ] `app/wallet/withdraw/index.tsx` - Withdraw funds
- [ ] `app/wallet/withdraw/dividend.tsx` - Dividend withdrawal
- [ ] `app/add-funds/index.tsx` - Add funds main
- [ ] `app/add-funds/add-card.tsx` - Add card
- [ ] `app/add-funds/card.tsx` - Card listing
- [ ] `app/add-funds/bank.tsx` - Bank transfer
- [ ] `app/saved-cards/index.tsx` - Saved cards
- [ ] `app/bank-account/index.tsx` - Bank account
- [ ] `app/buy-data/index.tsx` - Buy data
- [ ] `app/buy-airtime/index.tsx` - Buy airtime
- [ ] `app/pay-bills/index.tsx` - Pay bills main
- [ ] `app/pay-bills/[mode].tsx` - Pay bills by mode
- [ ] `app/bills-utilities/select.tsx` - Utility selection
- [ ] `app/send-money/index.tsx` - Send money
- [ ] `app/send-money/set-amount.tsx` - Set amount
- [ ] `app/all-services/index.tsx` - Services menu
- [ ] `app/transaction/[details].tsx` - Transaction detail
- [ ] `app/transaction/stocks/[details].tsx` - Stock transaction

### Phase 4: KYC Verification (10 screens)

**Priority**: 🟠 HIGH

- [ ] `app/kyc/index.tsx` - KYC main menu
- [ ] `app/kyc/verification.tsx` - Verification status
- [ ] `app/kyc/kin-details.tsx` - Kin information
- [ ] `app/kyc/information/index.tsx` - Personal info main
- [ ] `app/kyc/information/bvn-verification.tsx` - BVN verification
- [ ] `app/kyc/information/bank-details.tsx` - Bank details
- [ ] `app/kyc/identity-verification/index.tsx` - ID verification main
- [ ] `app/kyc/identity-verification/id-verification.tsx` - ID document upload
- [ ] `app/kyc/identity-verification/address-verification.tsx` - Address verification
- [ ] `app/kyc/identity-verification/photograph-verification.tsx` - Photo capture

### Phase 5: Account Management (19 screens)

**Priority**: 🟡 MEDIUM

- [ ] `app/account/account-details.tsx` - Account details
- [ ] `app/account/account-verification.tsx` - Account verification
- [ ] `app/account/beneficiary.tsx` - Beneficiary list
- [ ] `app/account/biometric-settings.tsx` - Biometric setup
- [ ] `app/account/change-password.tsx` - Change password
- [ ] `app/account/change-username.tsx` - Change username
- [ ] `app/account/delete-account.tsx` - Delete account
- [ ] `app/account/preference.tsx` - Preferences
- [ ] `app/account/preferences.tsx` - Preferences main
- [ ] `app/account/preferences/themes.tsx` - Theme selector
- [ ] `app/account/privacy-policy.tsx` - Privacy policy
- [ ] `app/account/privacy.tsx` - Privacy settings
- [ ] `app/account/terms-conditions.tsx` - Terms & conditions
- [ ] `app/account/reset-transaction-pin.tsx` - PIN reset
- [ ] `app/account/update-kin-details.tsx` - Update kin
- [ ] `app/account/help-desk.tsx` - Help desk
- [ ] `app/account/help-desk/contact.tsx` - Contact support
- [ ] `app/account/help-desk/faqs.tsx` - FAQs
- [ ] `app/account/live-chat.tsx` - Live chat (NEW)

### Phase 6: Investment & Stock Trading (11+ screens)

**Priority**: 🔵 MEDIUM

- [ ] `app/stock/index.tsx` - Stock listing
- [ ] `app/stock/breakdown/index.tsx` - Stock breakdown
- [ ] `app/stock/breakdown/[details]/index.tsx` - Breakdown detail
- [ ] `app/stock/portfolio/index.tsx` - Portfolio view
- [ ] `app/stock/portfolio/my-stocks.tsx` - My stocks
- [ ] `app/stock/swap.tsx` - Stock swap
- [ ] `app/stock/withdraw.tsx` - Stock withdrawal
- [ ] `app/stock/bracs/[details]/bracs-breakdown.tsx` - BRACS breakdown
- [ ] `app/account/bracs-investment-trigger/index.tsx` - BRACS main
- [ ] `app/account/bracs-investment-trigger/bracs-allocation.tsx` - Allocation
- [ ] `app/account/bracs-investment-trigger/managed-portfolio.tsx` - Managed portfolio
- [ ] `app/account/bracs-investment-trigger/managed-portfolio/about-managed-portfolio.tsx` - About

### Phase 7: Analytics & User Features (9+ screens)

**Priority**: 🟣 LOW

- [ ] `app/leaderboard/index.tsx` - Leaderboard
- [ ] `app/spending-pattern/index.tsx` - Spending analytics
- [ ] `app/notification/index.tsx` - Notifications list
- [ ] `app/notification/[detailsId].tsx` - Notification detail
- [ ] `app/portfolio/checkout.tsx` - Portfolio checkout
- [ ] `app/portfolio/company/[details]/index.tsx` - Company detail
- [ ] `app/support/index.tsx` - Support page
- [ ] `app/splash/index.tsx` - Splash screen (refine)
- [ ] Additional screens as needed

---

## Architecture & Patterns

### Standard Screen Structure

```tsx
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/colors";
import BaseRequest, { catchError } from "@/services";
import Back from "@/components/Back";
import { ThemedText } from "@/components/themed-text";
import { BraneButton } from "@/components/brane-button";

export default function ScreenName() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await BaseRequest.get("/api/endpoint");
      setData(response.data);
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Content */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
```

### Redux Integration Pattern

```tsx
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// In component:
const dispatch = useDispatch();
const user = useSelector((state: RootState) => state.auth.user);
const { authData } = useSelector((state: RootState) => state.auth);
```

### API Call Pattern

```tsx
import BaseRequest from "@/services";

const response = await BaseRequest.post("/endpoint", {
  data: values,
});

// Handles:
// - Token injection
// - Error parsing
// - Token refresh on 401
// - Device headers
```

---

## Current Status Summary

| Phase      | Screens | Status            |
| ---------- | ------- | ----------------- |
| Auth       | 4       | ⏳ Ready to build |
| Dashboard  | 5       | ⏳ Ready to build |
| Financial  | 19      | ⏳ Ready to build |
| KYC        | 10      | ⏳ Ready to build |
| Account    | 19      | ⏳ Ready to build |
| Investment | 12      | ⏳ Ready to build |
| Analytics  | 9+      | ⏳ Ready to build |
| **TOTAL**  | **78+** | **Ready**         |

**Components**: ✅ 8/8 created
**Architecture**: ✅ Documented
**Patterns**: ✅ Defined

---

## Next Steps

Build screens phase by phase in order:

1. Phase 1 (Auth) - 4 screens
2. Phase 2 (Dashboard) - 5 screens
3. Phase 3 (Financial) - 19 screens
4. Phase 4 (KYC) - 10 screens
5. Phase 5 (Account) - 19 screens
6. Phase 6 (Investment) - 12 screens
7. Phase 7 (Analytics) - 9+ screens

**Total estimated code**: 50,000+ lines
**Reusable components**: Will significantly reduce duplication
**Implementation time**: Systematic & organized
