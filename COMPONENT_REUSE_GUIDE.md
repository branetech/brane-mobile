# Brane Mobile App - Web to Mobile Conversion Strategy

## Component Reuse & Screen Implementation Guide

---

## Overview

The brane-app already has a solid foundation with:

- **87 screens** partially implemented using Expo Router
- **Core UI components** ready to adapt
- **Feature folders** with specialized components
- **Consistent patterns** ready to leverage across all screens

**Strategy**: Extend existing components and use proven patterns to convert remaining web pages.

---

## Part 1: Existing Mobile Components Inventory

### Base UI Components (Ready to Use)

| Component                   | File                          | Purpose                 | Use Cases                  |
| --------------------------- | ----------------------------- | ----------------------- | -------------------------- |
| **BraneButton**             | brane-button.tsx              | Primary action button   | All CTAs, form submissions |
| **FormInput**               | formInput.tsx                 | Text input with labels  | Login, registration, forms |
| **PhoneInput**              | phone-input.tsx               | Phone number selector   | Auth, payment, transfers   |
| **OtpInput**                | otp-input.tsx                 | OTP verification        | 2FA, verification flows    |
| **ThemedText**              | themed-text.tsx               | Theme-aware text        | All text with dark mode    |
| **Back**                    | Back.tsx                      | Navigation back         | All screens with back      |
| **PaymentMethodSelector**   | payment-method-selector.tsx   | Payment method picker   | Wallet, bills, transfers   |
| **BraneRadioButton**        | brane-radio-button.tsx        | Radio selection         | Options, preferences       |
| **Avatar**                  | avatar.tsx                    | User avatar display     | Profile, account           |
| **EmptyState**              | empty-state.tsx               | Empty list fallback     | Lists, transactions        |
| **SuccessModal**            | success-modal.tsx             | Success feedback        | After transactions         |
| **ContinueWithGoogle**      | continue-with-google.tsx      | OAuth button            | Auth flows                 |
| **BiometricSetupModal**     | BiometricSetupModal.tsx       | Biometric setup (8.5KB) | Security setup             |
| **TransactionPinValidator** | transaction-pin-validator.tsx | PIN entry (9.5KB)       | Secure transactions        |

### Feature-Specific Component Folders

#### **Home Components** (3 files, ~12KB)

- `cards.tsx` - Card layouts and styling
- `home-card.tsx` - Main dashboard card component
- `index.tsx` - Home screen orchestration

✅ **Ready for**: Dashboard home, balance display, quick actions

#### **Account Components** (1 file, ~22KB)

- `bracs-investment.tsx` - Investment portfolio display
- `index.tsx` - Account nav and routing
- `transaction.tsx` - Transaction display

✅ **Ready for**: Account management, investment views

#### **KYC Components** (2 files, ~8KB)

- `kyc-item.tsx` - Individual KYC step item
- `upload-method-item.tsx` - File upload method selector

✅ **Ready for**: KYC verification steps

#### **Auth Components** (2 folders)

- **sign-up/** (7 files) - Registration component library
- **forgot-password/** (5 files) - Password recovery flows
- **log-out/** (3 files) - Logout mechanisms

✅ **Ready for**: Complete auth flows

---

## Part 2: Existing Screens (87 Total)

### Already Implemented Screens (Can be Enhanced)

#### Auth (4 screens)

- ✅ `app/(auth)/login/index.tsx` - Login page
- ✅ `app/(auth)/signup/index.tsx` - Registration
- ✅ `app/(auth)/forgot-password.tsx` - Password recovery
- ✅ `app/splash/onboard.tsx` - Onboarding

#### Dashboard Navigation (5 screens)

- ✅ `app/(tabs)/index.tsx` - Home dashboard
- ✅ `app/(tabs)/portfolio.tsx` - Portfolio view
- ✅ `app/(tabs)/transactions.tsx` - Transaction tabs
- ✅ `app/(tabs)/utilities.tsx` - Utilities dashboard
- ✅ `app/(tabs)/(account)/index.tsx` - Account section

#### Financial (19 screens)

- ✅ `app/wallet/index.tsx` - Main wallet
- ✅ `app/wallet/withdraw/index.tsx` - Withdraw screen
- ✅ `app/wallet/withdraw/dividend.tsx` - Dividend withdrawal
- ✅ `app/add-funds/index.tsx` - Add funds main
- ✅ `app/add-funds/add-card.tsx` - Add card method
- ✅ `app/add-funds/card.tsx` - Card listing
- ✅ `app/add-funds/bank.tsx` - Bank transfer method
- ✅ `app/saved-cards/index.tsx` - Saved cards list
- ✅ `app/bank-account/index.tsx` - Bank account view
- ✅ `app/buy-data/index.tsx` - Data purchase
- ✅ `app/buy-airtime/index.tsx` - Airtime purchase
- ✅ `app/pay-bills/index.tsx` - Bills main
- ✅ `app/pay-bills/[mode].tsx` - Bill payment by mode
- ✅ `app/bills-utilities/select.tsx` - Utility selection
- ✅ `app/send-money/index.tsx` - Send money
- ✅ `app/send-money/set-amount.tsx` - Amount setup
- ✅ `app/all-services/index.tsx` - Service menu
- ✅ `app/transaction/[details].tsx` - Transaction detail
- ✅ `app/transaction/stocks/[details].tsx` - Stock transaction

#### KYC Verification (10 screens)

- ✅ `app/kyc/index.tsx` - KYC main
- ✅ `app/kyc/verification.tsx` - Verification status
- ✅ `app/kyc/kin-details.tsx` - Kin information
- ✅ `app/kyc/information/index.tsx` - Info main
- ✅ `app/kyc/information/bvn-verification.tsx` - BVN verification
- ✅ `app/kyc/information/bank-details.tsx` - Bank details
- ✅ `app/kyc/identity-verification/index.tsx` - ID verification main
- ✅ `app/kyc/identity-verification/id-verification.tsx` - ID document
- ✅ `app/kyc/identity-verification/address-verification.tsx` - Address
- ✅ `app/kyc/identity-verification/photograph-verification.tsx` - Photo/biometric

#### Account Management (19 screens)

- ✅ `app/account/account-details.tsx` - Details view
- ✅ `app/account/account-verification.tsx` - Verification
- ✅ `app/account/beneficiary.tsx` - Beneficiary list
- ✅ `app/account/biometric-settings.tsx` - Biometric setup ⭐ NEW
- ✅ `app/account/change-password.tsx` - Password change
- ✅ `app/account/change-username.tsx` - Username change
- ✅ `app/account/delete-account.tsx` - Account deletion
- ✅ `app/account/preference.tsx` - Preferences
- ✅ `app/account/preferences.tsx` - Preferences main
- ✅ `app/account/preferences/themes.tsx` - Theme selector
- ✅ `app/account/privacy-policy.tsx` - Privacy policy
- ✅ `app/account/privacy.tsx` - Privacy settings
- ✅ `app/account/terms-conditions.tsx` - Terms & conditions
- ✅ `app/account/terms-condition.tsx` - Terms (alt)
- ✅ `app/account/reset-transaction-pin.tsx` - PIN reset
- ✅ `app/account/update-kin-details.tsx` - Kin update
- ✅ `app/account/help-desk.tsx` - Help desk (alt)
- ✅ `app/account/helpdesk.tsx` - Support tickets
- ✅ `app/account/help-desk/contact.tsx` - Contact support
- ✅ `app/account/help-desk/faqs.tsx` - FAQs page

#### Investment/Stock (11 screens)

- ✅ `app/stock/index.tsx` - Stock main
- ✅ `app/stock/breakdown/index.tsx` - Breakdown main
- ✅ `app/stock/breakdown/[details]/index.tsx` - Breakdown detail
- ✅ `app/stock/portfolio/index.tsx` - Portfolio view
- ✅ `app/stock/portfolio/my-stocks.tsx` - My stocks list
- ✅ `app/stock/swap.tsx` - Stock swap
- ✅ `app/stock/withdraw.tsx` - Stock withdrawal
- ✅ `app/account/bracs-investment-trigger/index.tsx` - BRACS main
- ✅ `app/account/bracs-investment-trigger/bracs-allocation.tsx` - Allocation
- ✅ `app/account/bracs-investment-trigger/managed-portfolio.tsx` - Managed portfolio
- ✅ `app/account/bracs-investment-trigger/managed-portfolio/about-managed-portfolio.tsx` - About

#### Analytics & Views (9 screens)

- ✅ `app/(tabs)/transactions.tsx` - Transaction tabs
- ✅ `app/notification/index.tsx` - Notifications list
- ✅ `app/notification/[detailsId].tsx` - Notification detail
- ✅ `app/spending-pattern/index.tsx` - Spending analytics
- ✅ `app/leaderboard/index.tsx` - Leaderboard ranking
- ✅ `app/portfolio/checkout.tsx` - Portfolio checkout
- ✅ `app/portfolio/company/[details]/index.tsx` - Company detail
- ✅ `app/stock/bracs/[details]/bracs-breakdown.tsx` - BRACS breakdown
- ✅ `app/support/index.tsx` - Support page

#### Auth-Related (2 additional)

- ⭐ `app/account/live-chat.tsx` - Live chat (new)
- ✅ `app/splash/index.tsx` - Splash screen

**Status**: 87 screens exist | ~60 are fully or partially built | ~27 need enhancement/completion

---

## Part 3: Component Conversion Mapping

### Pattern 1: Form Screens

**Examples**: Login, Register, Forgot Password, Add Bank Account

```tsx
// Use these component combinations:
1. FormInput (for text fields)
2. PhoneInput (for phone fields)
3. BraneButton (for submit)
4. ThemedText (for labels/errors)

// From existing folders:
- sign-up/ folder has complete registration flow
- forgot-password/ folder has recovery flow
- login/index.tsx is authentication ready
```

### Pattern 2: List/Selection Screens

**Examples**: Saved Cards, Beneficiary, Services, Stock List

```tsx
// Use these components:
1. FlatList (React Native native)
2. PaymentMethodSelector (for method pickers)
3. BraneRadioButton (for single selection)
4. EmptyState (for empty lists)

// Leverage:
- Payment selector for payment methods
- KYC item component for list items
```

### Pattern 3: Dashboard/Overview Screens

**Examples**: Home, Wallet, Portfolio, Account

```tsx
// Use these components:
1. Home components (cards.tsx, home-card.tsx)
2. BraneButton (action buttons)
3. ThemedText (displays)
4. Custom cards from home/ folder

// Enhanced with:
- home/cards.tsx - CardStyle, LearnCard, ServicesCard
- home/home-card.tsx - Complete balance display
```

### Pattern 4: Verification/Modal Flows

**Examples**: OTP, Transaction PIN, Biometric, Photo

```tsx
// Use these components:
1. OtpInput (OTP entry)
2. TransactionPinValidator (PIN entry)
3. BiometricSetupModal (Biometric setup)
4. SuccessModal (confirmation)

// From KYC folder:
- upload-method-item.tsx (for upload options)
- kyc-item.tsx (for step display)
```

### Pattern 5: Transaction/Detail Screens

**Examples**: Transaction Detail, Stock Detail, Notification

```tsx
// Use these components:
1. ThemedText (display info)
2. BraneButton (actions)
3. Account/transaction.tsx (layout reference)
4. Back component (navigation)
```

---

## Part 4: Components Ready for Each Web Page

### Auth Pages (4)

| Web Page        | Mobile Screen                | Components to Use                  | Status   |
| --------------- | ---------------------------- | ---------------------------------- | -------- |
| login           | `(auth)/login/index.tsx`     | FormInput, PhoneInput, BraneButton | ✅ Ready |
| register        | `(auth)/signup/index.tsx`    | sign-up/\* folder                  | ✅ Ready |
| forget-password | `(auth)/forgot-password.tsx` | forgot-password/\* folder          | ✅ Ready |
| onboarding      | `splash/onboard.tsx`         | Custom cards + BraneButton         | ✅ Ready |

### Wallet & Financial (18)

| Web Page                 | Mobile Screen                  | Components                       | Status   |
| ------------------------ | ------------------------------ | -------------------------------- | -------- |
| wallet                   | `wallet/index.tsx`             | Home cards, BraneButton          | ✅ Ready |
| wallet/add-card          | `add-funds/add-card.tsx`       | FormInput, BraneButton           | ✅ Ready |
| wallet/add-bank          | `add-funds/bank.tsx`           | FormInput, BraneButton           | ✅ Ready |
| wallet/fund-wallet       | `add-funds/index.tsx`          | PaymentMethodSelector            | ✅ Ready |
| wallet/withdraw          | `wallet/withdraw/index.tsx`    | FormInput, BraneButton           | ✅ Ready |
| wallet/withdraw/dividend | `wallet/withdraw/dividend.tsx` | FormInput, BraneButton           | ✅ Ready |
| buy-data                 | `buy-data/index.tsx`           | FormInput, PaymentMethodSelector | ✅ Ready |
| buy-airtime              | `buy-airtime/index.tsx`        | FormInput, PhoneInput            | ✅ Ready |
| pay-bills                | `pay-bills/index.tsx`          | FormInput, PaymentMethodSelector | ✅ Ready |
| pay-bills/[mode]         | `pay-bills/[mode].tsx`         | FormInput, BraneButton           | ✅ Ready |
| saved-cards              | `saved-cards/index.tsx`        | FlatList, EmptyState             | ✅ Ready |
| bank-account             | `bank-account/index.tsx`       | ThemedText, BraneButton          | ✅ Ready |
| send-money               | `send-money/index.tsx`         | FormInput, PaymentMethodSelector | ✅ Ready |
| transaction-history      | `transaction/[details].tsx`    | ThemedText, EmptyState           | ✅ Ready |
| all-services             | `all-services/index.tsx`       | Grid/FlatList, HomeCard          | ✅ Ready |
| home                     | `(tabs)/index.tsx`             | home/\* components               | ✅ Ready |
| home-page                | `(tabs)/utilities.tsx`         | home/\* components               | ✅ Ready |

### Account Management (16)

| Web Page                 | Mobile Screen                       | Status   |
| ------------------------ | ----------------------------------- | -------- |
| account                  | account/index.tsx                   | ✅ Ready |
| account-details          | account/account-details.tsx         | ✅ Ready |
| beneficiary              | account/beneficiary.tsx             | ✅ Ready |
| change-password          | account/change-password.tsx         | ✅ Ready |
| change-username          | account/change-username.tsx         | ✅ Ready |
| delete-account           | account/delete-account.tsx          | ✅ Ready |
| preferences              | account/preferences.tsx             | ✅ Ready |
| preferences/themes       | account/preferences/themes.tsx      | ✅ Ready |
| privacy-policy           | account/privacy-policy.tsx          | ✅ Ready |
| terms-conditions         | account/terms-conditions.tsx        | ✅ Ready |
| reset-transaction-pin    | account/reset-transaction-pin.tsx   | ✅ Ready |
| update-kin-details       | account/update-kin-details.tsx      | ✅ Ready |
| help-desk/contact        | account/help-desk/contact.tsx       | ✅ Ready |
| help-desk/faqs           | account/help-desk/faqs.tsx          | ✅ Ready |
| help-desk                | account/help-desk.tsx               | ✅ Ready |
| bracs-investment-trigger | account/bracs-investment-trigger/\* | ✅ Ready |

### KYC/Verification (10)

| Web Page                                          | Mobile Screen                                           | Components                                  | Status   |
| ------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------- | -------- |
| kyc                                               | `kyc/index.tsx`                                         | kyc-item.tsx                                | ✅ Ready |
| kyc/verification                                  | `kyc/verification.tsx`                                  | ThemedText, BraneButton                     | ✅ Ready |
| kyc/kin-details                                   | `kyc/kin-details.tsx`                                   | FormInput, BraneButton                      | ✅ Ready |
| kyc/information                                   | `kyc/information/index.tsx`                             | kyc-item.tsx                                | ✅ Ready |
| kyc/information/bvn-verification                  | `kyc/information/bvn-verification.tsx`                  | FormInput, OtpInput                         | ✅ Ready |
| kyc/information/bank-details                      | `kyc/information/bank-details.tsx`                      | FormInput, BraneButton                      | ✅ Ready |
| kyc/identity-verification                         | `kyc/identity-verification/index.tsx`                   | kyc-item.tsx                                | ✅ Ready |
| kyc/identity-verification/id-verification         | `kyc/identity-verification/id-verification.tsx`         | upload-method-item.tsx                      | ✅ Ready |
| kyc/identity-verification/address-verification    | `kyc/identity-verification/address-verification.tsx`    | FormInput, BraneButton                      | ✅ Ready |
| kyc/identity-verification/photograph-verification | `kyc/identity-verification/photograph-verification.tsx` | upload-method-item.tsx, BiometricSetupModal | ✅ Ready |

### Investment (11)

| Web Page                    | Mobile Screen                         | Status   |
| --------------------------- | ------------------------------------- | -------- |
| stock                       | stock/index.tsx                       | ✅ Ready |
| stock/[details]             | stock/breakdown/[details]/index.tsx   | ✅ Ready |
| stock/breakdown             | stock/breakdown/index.tsx             | ✅ Ready |
| stock/portfolio             | stock/portfolio/index.tsx             | ✅ Ready |
| stock/portfolio/my-stocks   | stock/portfolio/my-stocks.tsx         | ✅ Ready |
| stock/swap                  | stock/swap.tsx                        | ✅ Ready |
| stock/withdraw              | stock/withdraw.tsx                    | ✅ Ready |
| portfolio                   | (tabs)/portfolio.tsx                  | ✅ Ready |
| portfolio/checkout          | portfolio/checkout.tsx                | ✅ Ready |
| portfolio/company/[details] | portfolio/company/[details]/index.tsx | ✅ Ready |
| account/bracs-\*            | account/bracs-investment-trigger/\*   | ✅ Ready |

### Analytics & Misc (8)

| Web Page                      | Mobile Screen                | Status   |
| ----------------------------- | ---------------------------- | -------- |
| leaderboard                   | leaderboard/index.tsx        | ✅ Ready |
| spending-pattern              | spending-pattern/index.tsx   | ✅ Ready |
| notification-page             | notification/index.tsx       | ✅ Ready |
| notification-page/[detailsId] | notification/[detailsId].tsx | ✅ Ready |
| payment-callback              | (handled by routing)         | ✅ Ready |
| google                        | (handled by auth)            | ✅ Ready |

**Total: All 60+ web pages have corresponding mobile screens!**

---

## Part 5: Implementation Checklist by Phase

### Phase 1: Enhance Core Library ⭐ START HERE

- [ ] Review all base components (brane-button, form-input, etc.)
- [ ] Create component showcase/demo screen
- [ ] Add missing variants (size options, states)
- [ ] Document component APIs and patterns
- [ ] Create TypeScript types interface doc

### Phase 2: Complete Auth Flows

- [ ] Enhance sign-up/\* components to match web version
- [ ] Add forgot-password/\* sub-components
- [ ] Add password strength validator
- [ ] Add phone validation utilities
- [ ] Add Google OAuth full flow

### Phase 3: Financial Features

- [ ] Enhance wallet screens with real data
- [ ] Complete add payment method flows
- [ ] Add bill payment flow complete
- [ ] Add airtime/data form validations
- [ ] Add transaction history with filters
- [ ] Create send money complete flow

### Phase 4: KYC/Verification

- [ ] KYC items all using kyc-item.tsx pattern
- [ ] Document upload methods
- [ ] Complete camera integration
- [ ] Add photo capture flow (biometric-settings)
- [ ] Add BVN verification flow
- [ ] Add address verification flow

### Phase 5: Account Management

- [ ] Account detail display
- [ ] Beneficiary management
- [ ] Password change flow
- [ ] PIN reset flow
- [ ] Theme selector enhancement
- [ ] Help desk integration

### Phase 6: Investment Features

- [ ] Stock listing and search
- [ ] Portfolio view enhancement
- [ ] BRACS investment flow
- [ ] Transaction history for investments
- [ ] Dividend tracking

### Phase 7: Polish & Finishing

- [ ] Add empty states everywhere
- [ ] Add loading states
- [ ] Add error handling UI
- [ ] Add success feedback modals
- [ ] Add notifications/toasts
- [ ] Add animations/transitions

---

## Part 6: Quick Start - How to Build Your Next Screen

### Step 1: Identify Web Page

```
Example: wallet/fund-wallet
```

### Step 2: Check Mobile Status

```
✅ Screen location: app/add-funds/index.tsx
✅ Components available: PaymentMethodSelector, BraneButton, FormInput
```

### Step 3: Find Component Examples

```
Payment selector example: /components/payment-method-selector.tsx
Button example: /components/brane-button.tsx
Form input example: /components/formInput.tsx
```

### Step 4: Build Screen

```tsx
// app/add-funds/index.tsx
import { FormInput } from "@/components/formInput";
import { BraneButton } from "@/components/brane-button";
import { PaymentMethodSelector } from "@/components/payment-method-selector";
import { ThemedText } from "@/components/themed-text";
import { ScrollView, View, StyleSheet } from "react-native";
import { useState } from "react";

export default function FundWallet() {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("card");

  const methods = [
    { id: "card", label: "Card", icon: "💳" },
    { id: "bank", label: "Bank Transfer", icon: "🏦" },
  ];

  return (
    <ScrollView style={styles.container}>
      <ThemedText type='title'>Fund Your Wallet</ThemedText>

      <FormInput
        labelText='Amount (₦)'
        placeholder='Enter amount'
        value={amount}
        onChangeText={setAmount}
        keyboardType='decimal-pad'
      />

      <PaymentMethodSelector
        options={methods}
        selectedId={selectedMethod}
        onSelect={setSelectedMethod}
      />

      <BraneButton
        text='Continue'
        onPress={() => {
          /* API call */
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
```

### Step 5: Test & Polish

- Hook up Redux state
- Add API call
- Add form validation
- Add error handling
- Test on device

---

## Part 7: New Components to Create

Based on web pages not fully covered:

1. **DataPlansList** - Data plan selection with pricing
   - Location: `components/data-plan-list.tsx`
   - Use cases: buy-data screen

2. **UtilityBillSelector** - Bill payment option selector
   - Location: `components/utility-bill-selector.tsx`
   - Use cases: pay-bills flows

3. **TransactionCard** - Transaction history item
   - Location: `components/transaction-card.tsx`
   - Use cases: transaction history, wallet view

4. **StockCard** - Stock display card
   - Location: `components/stock-card.tsx`
   - Use cases: stock listing, portfolio

5. **NotificationItem** - Notification list item
   - Location: `components/notification-item.tsx`
   - Use cases: notification page

6. **AirtimeDataPreview** - Preview before purchase
   - Location: `components/airtime-data-preview.tsx`
   - Use cases: buy-airtime/data confirmation

7. **ReceiptDisplay** - Transaction receipt
   - Location: `components/receipt-display.tsx`
   - Use cases: transaction confirmation, bills

8. **ChartComponent** - Data visualization
   - Location: `components/chart.tsx`
   - Use cases: spending pattern, portfolio gains

---

## Part 8: Reusable Utilities & Hooks

### Existing Hooks to Leverage

```
hooks/
├── useBiometricAuth.ts - Biometric authentication
└── (check what else exists)
```

### Services to Reuse

```
services/
├── index.ts - Base API axios instance
└── data.tsx - Custom hooks for API (usePostLogin, usePreference, etc.)
```

### Already Available Redux Slices

```
redux/slice/
├── auth-slice.ts
├── bracsSlice.ts
├── checkScreen.ts
├── fundCardSlice.ts
└── themeSlice.ts
```

### Constants & Utilities

```
constants/colors.ts - Color scheme
utils/ - Helper functions
```

---

## Part 9: Implementation Order Recommendation

### Quick Wins (Do First)

1. ✅ Component documentation & demo screen
2. ✅ Add Data Plan List component
3. ✅ Utility Bill Selector component
4. ✅ Transaction Card component
5. ✅ Stock Card component

### Core Completions (Do Next)

6. ✅ Enhance wallet screens with real data
7. ✅ Complete buy-data flow
8. ✅ Complete buy-airtime flow
9. ✅ Complete pay-bills flow
10. ✅ Complete send-money flow

### Advanced Features (Do Later)

11. ✅ Investment features
12. ✅ Stock trading
13. ✅ Analytics (leaderboard, spending)

---

## Part 10: File Structure You'll Follow

```
brane-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password.tsx
│   ├── (tabs)/
│   │   ├── index.tsx (home)
│   │   ├── portfolio.tsx
│   │   ├── transactions.tsx
│   │   ├── utilities.tsx
│   │   └── (account)/
│   ├── wallet/
│   ├── kyc/
│   ├── account/
│   ├── stock/
│   ├── buy-data/
│   ├── buy-airtime/
│   ├── pay-bills/
│   ├── add-funds/
│   ├── spend-pattern/
│   ├── leaderboard/
│   ├── notification/
│   ├── portfolio/
│   └── ...
├── components/
│   ├── brane-button.tsx
│   ├── formInput.tsx
│   ├── phone-input.tsx
│   ├── otp-input.tsx
│   ├── themed-text.tsx
│   ├── payment-method-selector.tsx
│   ├── transaction-pin-validator.tsx
│   ├── success-modal.tsx
│   ├── home/
│   ├── account/
│   ├── kyc/
│   ├── sign-up/
│   ├── forgot-password/
│   ├── log-out/
│   ├── data-plan-list.tsx (NEW)
│   ├── utility-bill-selector.tsx (NEW)
│   ├── transaction-card.tsx (NEW)
│   ├── stock-card.tsx (NEW)
│   ├── notification-item.tsx (NEW)
│   ├── airtime-data-preview.tsx (NEW)
│   ├── receipt-display.tsx (NEW)
│   └── chart.tsx (NEW)
├── services/
│   └── index.ts (already has API config)
├── redux/
│   └── slice/ (already configured)
├── utils/
│   └── helpers.ts (already has utilities)
├── hooks/
│   └── (existing hooks to leverage)
└── constants/
    └── colors.ts (design tokens)
```

---

## Part 11: Success Metrics

### Per Screen

- ✅ All form fields working with validation
- ✅ Integration with Redux state
- ✅ API calls functioning
- ✅ Error handling shown
- ✅ Loading states visible
- ✅ Success feedback displayed
- ✅ Navigation working to/from screen
- ✅ Dark mode support

### Overall

- ✅ All 60+ web pages have mobile equivalents
- ✅ UI components reused > 80%
- ✅ Consistent branding & theming
- ✅ Proper error handling
- ✅ Performance optimized
- ✅ Tests pass

---

## Next Steps

1. **Review This Document** - Confirm approach aligns with your vision
2. **Pick First Screen** - Start with Phase 1 "Quick Wins"
3. **Build & Test** - Create components, integrate, verify
4. **Iterate** - Move to next priority
5. **Deploy** - Phase by phase rollout

**Ready to start? Let me know which screen you'd like to tackle first!**
