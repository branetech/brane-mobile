# TransactionSummaryModal Component Documentation

## Overview

A reusable, theme-aware transaction summary modal component that displays transaction breakdowns, payment methods, and bracs rewards. Used across send-money, airtime, data, and other transaction flows.

## Location

`/components/transaction-summary-modal.tsx`

## Features

✅ **Theme-Aware**: Full dark/light mode support
✅ **Flexible Rows**: Customizable transaction summary rows
✅ **Dynamic Icon**: Support for images or emoji icons
✅ **Payment Methods**: Optional payment method selector
✅ **Bracs Rewards**: Display earned bracs with tooltip
✅ **Loading State**: Button loading indicator during submission
✅ **Tooltip**: Educational information about bracs

## Props

```typescript
interface TransactionSummaryModalProps {
  // Modal visibility
  visible: boolean;
  onClose: () => void;

  // Amount & Display
  amount: number;
  icon?: ImageSourcePropType; // Network/provider logo
  iconEmoji?: string; // Fallback emoji (default: 🪙)

  // Transaction Details
  rows: TransactionRow[]; // Summary breakdown rows
  // Example: [
  //   { label: "Recipient", value: "John Doe" },
  //   { label: "Bank", value: "GTBank" },
  //   { label: "Amount", value: "₦5,000.00" },
  //   { label: "Service Fee", value: "₦0.00" },
  //   { label: "Total Debit", value: "₦5,000.00", bold: true }
  // ]

  // Bracs Rewards
  bracsReward?: number; // Earned bracs (e.g., 3000)
  bracsBoost?: string | number; // Boost amount (e.g., 200)

  // Payment Method Selection
  paymentOptions?: PaymentOption[]; // List of payment methods
  selectedPaymentId?: string; // Currently selected payment ID
  onPaymentSelect?: (id: string) => void; // Payment selection handler
  onSeeAll?: () => void; // See all payment methods handler

  // Button & Actions
  ctaLabel?: string; // Button text (default: "Confirm")
  isSubmitting?: boolean; // Loading state for button
  onConfirm: () => void; // Button press handler
}
```

## TransactionRow Interface

```typescript
interface TransactionRow {
  label: string; // e.g., "Recipient", "Service Fee"
  value: string; // e.g., "John Doe", "₦0.00"
  bold?: boolean; // Emphasis for total/important rows
}
```

## Usage Examples

### Send Money Flow

```typescript
import { TransactionSummaryModal, type TransactionRow } from '@/components/transaction-summary-modal';

const summaryRows: TransactionRow[] = [
  { label: "Recipient", value: recipientName },
  { label: "Bank", value: bankName },
  { label: "Account Number", value: accountNumber },
  { label: "Amount", value: `₦ ${Number(amount).toLocaleString("en-NG")}` },
  { label: "Service Fee", value: "₦ 0.00" },
  {
    label: "Total Debit",
    value: `₦ ${Number(amount).toLocaleString("en-NG")}`,
    bold: true,
  },
];

<TransactionSummaryModal
  visible={showSummarySheet}
  onClose={() => setShowSummarySheet(false)}
  amount={Number(amount)}
  rows={summaryRows}
  bracsReward={calculatedBracs}
  bracsBoost={0}
  iconEmoji="💳"
  paymentOptions={paymentOptions}
  selectedPaymentId={selectedPaymentId}
  onPaymentSelect={setSelectedPaymentId}
  ctaLabel="Pay Now"
  isSubmitting={isSubmitting}
  onConfirm={() => {
    setShowSummarySheet(false);
    setShowPinValidator(true);
  }}
/>
```

### Airtime/Data Flow

```typescript
import { TransactionSummaryModal, type TransactionRow } from '@/components/transaction-summary-modal';
import { NETWORK_IMAGES } from './types';

const summaryRows: TransactionRow[] = [
  { label: "Provider", value: networkLabel },
  { label: "Sending to", value: phone },
  { label: "Transaction Amount", value: `₦ ${formatMoney(amountToPay)}` },
  { label: "Cash Boost", value: `₦ ${formatMoney(Number(boostAmount || 0))}` },
  { label: "Service Fee", value: "₦ 0.00" },
  {
    label: "Total Debit",
    value: `₦ ${formatMoney(amountToPay + Number(boostAmount || 0))}`,
    bold: true,
  },
];

<TransactionSummaryModal
  visible={showSummarySheet}
  onClose={() => setShowSummarySheet(false)}
  amount={amountToPay}
  rows={summaryRows}
  icon={NETWORK_IMAGES[networkImageKey]}
  bracsReward={calculatedBracs}
  bracsBoost={boostAmount}
  paymentOptions={paymentOptions}
  selectedPaymentId={paymentId}
  onPaymentSelect={setPaymentId}
  onSeeAll={() => {}}
  ctaLabel="Pay Now"
  isSubmitting={isSubmitting}
  onConfirm={() => {
    setShowSummarySheet(false);
    setShowPinValidator(true);
  }}
/>
```

### Minimal Example (Without Bracs/Payments)

```typescript
const summaryRows: TransactionRow[] = [
  { label: "Service", value: "Electricity Bill" },
  { label: "Amount", value: "₦5,000.00", bold: true },
];

<TransactionSummaryModal
  visible={visible}
  onClose={onClose}
  amount={5000}
  rows={summaryRows}
  ctaLabel="Confirm Payment"
  onConfirm={handleConfirm}
/>
```

## Styling & Theme

The component automatically adapts to the current theme using the color system:

- `C.background`: Modal card background
- `C.inputBg`: Summary card and icon circle background
- `C.text`: Primary text color
- `C.muted`: Secondary text color (labels)
- `C.primary`: Emphasis color (bold rows, buttons, bracs)
- `C.border`: Dividers and borders
- `C.googleBg`: Button text color

## Layout

```
┌─ Modal Overlay (transparent) ────────────┐
│                                          │
│  ┌─ Summary Card (from bottom) ────────┐ │
│  │                                      │ │
│  │  ═══ Grabber Bar ═══               │ │
│  │                                      │ │
│  │       ₦5,000.00                     │ │
│  │    [Network Icon/Emoji]             │ │
│  │                                      │ │
│  │  ┌─ Summary Section ─────────────┐ │ │
│  │  │ Transaction Summary           │ │ │
│  │  │ Recipient: John Doe           │ │ │
│  │  │ ─────────────────────         │ │ │
│  │  │ Bank: GTBank                  │ │ │
│  │  │ ─────────────────────         │ │ │
│  │  │ Amount: ₦5,000.00             │ │ │
│  │  │ ─────────────────────         │ │ │
│  │  │ Service Fee: ₦0.00            │ │ │
│  │  │ ═════════════════════         │ │ │
│  │  │ Total Debit: ₦5,000.00 [BOLD] │ │ │
│  │  └─────────────────────────────┘ │ │
│  │                                      │ │
│  │  🏆 Bracs Reward: 3,000 + 200     │ │
│  │                                      │ │
│  │  ○ Payment Method ─────────────── │ │
│  │  • Total Balance - ₦1,000        │ │
│  │  ○ Brane Wallet - ₦1,000         │ │
│  │                                      │ │
│  │        [Pay Now Button]            │ │
│  │                                      │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

## Key Differences from Original SummaryModal

✅ **Standalone Component**: No longer tied to bills-utilities module
✅ **Flexible Rows**: Define rows dynamically instead of hardcoded
✅ **Reusable**: Works with any transaction type (send-money, airtime, data, etc.)
✅ **Optional Features**: Bracs, payments, icons are all optional
✅ **Better Props**: Clear, typed interface for all parameters
✅ **Simplified**: Removed airtime-specific logic (serviceType, serviceId)

## Next Steps

1. Update `/app/send-money/set-amount.tsx` to use this component
2. Update `/app/bills-utilities/select.tsx` to use this component
3. Remove the old SummaryModal from `bills-utilities/Modals.tsx`
4. Apply to other transaction flows (cable, electricity, etc.)

## Migration Guide

**Before:**

```typescript
<SummaryModal
  visible={showSummarySheet}
  onClose={() => setShowSummarySheet(false)}
  amountToPay={amountToPay}
  bracsRewardAmount={bracsRewardAmount}
  networkImageKey={networkImageKey}
  networkLabel={networkLabel}
  phone={phone}
  boostAmount={boostAmount}
  paymentOptions={paymentOptions}
  paymentId={paymentId}
  setPaymentId={setPaymentId}
  ctaLabel={ctaLabel}
  isSubmitting={isSubmitting}
  onSeeAll={onSeeAll}
  onConfirm={onConfirm}
/>
```

**After:**

```typescript
<TransactionSummaryModal
  visible={showSummarySheet}
  onClose={() => setShowSummarySheet(false)}
  amount={amountToPay}
  rows={[
    { label: "Provider", value: networkLabel },
    { label: "Sending to", value: phone },
    { label: "Amount", value: `₦ ${formatMoney(amountToPay)}` },
    { label: "Boost", value: `₦ ${formatMoney(boostAmount)}` },
    { label: "Service Fee", value: "₦ 0.00" },
    { label: "Total Debit", value: `₦ ${formatMoney(amountToPay + boostAmount)}`, bold: true },
  ]}
  icon={NETWORK_IMAGES[networkImageKey]}
  bracsReward={calculatedBracs}
  bracsBoost={boostAmount}
  paymentOptions={paymentOptions}
  selectedPaymentId={paymentId}
  onPaymentSelect={setPaymentId}
  onSeeAll={onSeeAll}
  ctaLabel={ctaLabel}
  isSubmitting={isSubmitting}
  onConfirm={onConfirm}
/>
```

This reusable component maintains consistency across the app while being flexible enough for different transaction types!
