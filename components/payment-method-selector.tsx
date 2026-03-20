import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatMoney } from "@/utils/helpers";
import React, { memo, useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

export type PaymentOption = {
  /** Unique identifier for this option */
  id: string;
  /** Display label e.g. "Total balance - ₦ 1,000.00" */
  label: string;
  /** Single character or short string shown in the icon circle */
  icon: string;
};

type Props = {
  options: PaymentOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onSeeAll?: () => void;
  walletBalance?: number;
  amount?: number;
  onFundWallet?: () => void;
  isLoadingBalance?: boolean;
};

function WalletIcon() {
  return (
    <Svg width={20} height={20} viewBox='0 0 20 20' fill='none'>
      <Path
        d='M5.74512 4.4082C5.81954 4.39559 5.90028 4.42375 5.9541 4.4834C6.00131 4.54524 6.00819 4.62732 5.98438 4.68164L5.98145 4.68848L4.52441 8.16797C4.49849 8.22357 4.45588 8.26525 4.40527 8.28906C2.99678 8.90601 2.08692 10.2896 2.08301 11.8232C2.07984 11.9482 1.98057 12.041 1.86621 12.041C1.75466 12.041 1.6582 11.9446 1.6582 11.833V9.3916C1.6582 6.96469 3.37598 4.87003 5.74512 4.4082ZM4.46191 5.32031C3.29064 5.97921 2.4394 7.13135 2.17383 8.47754L1.90332 9.84863L2.88086 8.84961C3.21681 8.50603 3.60307 8.21929 4.03906 8.00879L4.18164 7.93945L4.24316 7.79297L5.05078 5.84277L5.5127 4.72852L4.46191 5.32031Z'
        fill='#013D25'
        stroke='#013D25'
        strokeWidth={0.833333}
      />
      <Path
        d='M15.3877 4.92578C15.451 4.8653 15.5471 4.85405 15.6191 4.89258L15.623 4.89453C17.3016 5.77232 18.3408 7.49597 18.3408 9.3916V11.833C18.3408 11.9446 18.2444 12.041 18.1328 12.041C18.0213 12.0409 17.9248 11.9445 17.9248 11.833C17.9247 10.1404 16.7957 8.6299 15.1895 8.13477L15.1855 8.13379C15.1259 8.11575 15.0813 8.07516 15.0596 8.0293C15.0316 7.97007 15.0336 7.91103 15.0508 7.87012L15.0527 7.86328C15.4552 6.86133 15.5977 6.04488 15.4004 5.35938H15.3984C15.3882 5.31703 15.3799 5.28329 15.3711 5.25684C15.3687 5.24971 15.3659 5.24313 15.3643 5.23828L15.3623 5.23242L15.3535 5.19629L15.3379 5.16309L15.3223 5.10254C15.3154 5.04004 15.3372 4.97408 15.3877 4.92578ZM15.8857 6.37598C15.8475 6.6967 15.7706 7.05425 15.6445 7.44824L15.5322 7.79883L15.8672 7.95312C16.3418 8.1716 16.7663 8.48157 17.124 8.85449L18.1025 9.875L17.834 8.4873C17.6601 7.59041 17.2295 6.77387 16.5967 6.13184L15.9883 5.51562L15.8857 6.37598Z'
        fill='#013D25'
        stroke='#013D25'
        strokeWidth={0.833333}
      />
      <Path
        d='M7.7666 1.66602C8.51472 1.33639 9.47618 1.38889 10.8262 1.90625L10.8311 1.9082C10.8733 1.92377 10.9162 1.96065 10.9414 2.02051C10.964 2.07441 10.9643 2.13154 10.9424 2.18555L8.50098 7.85156V7.85254C8.46911 7.92689 8.39829 7.97559 8.30859 7.97559H5.93359C5.40291 7.9756 4.89778 8.07814 4.41309 8.2832L4.40625 8.28613C4.38804 8.29422 4.36283 8.29977 4.33398 8.2998C4.28602 8.2998 4.22796 8.27755 4.19043 8.24219C4.141 8.18858 4.12243 8.1256 4.12793 8.06934L4.14258 8.01074L5.69238 4.31055C5.70945 4.2717 5.72647 4.23317 5.7334 4.2168C5.73741 4.20732 5.73975 4.20142 5.74121 4.19824L5.75488 4.1748L5.76562 4.14941C6.36707 2.76366 7.01396 1.9977 7.7666 1.66602ZM8.8418 1.875C8.21709 1.87506 7.6959 2.08599 7.24805 2.52246C6.81856 2.94106 6.46927 3.55456 6.13379 4.33594L6.12695 4.35156L6.125 4.35547C6.12185 4.36179 6.11724 4.37205 6.1123 4.38281C6.10861 4.39088 6.10434 4.40118 6.09961 4.41309L5.00781 7.00488L4.73828 7.64453L5.42969 7.58203C5.60108 7.56645 5.76354 7.5586 5.93359 7.55859H8.16602L8.27441 7.30664L10.2832 2.63965L10.4648 2.21777L10.0273 2.07812C9.60342 1.94283 9.20973 1.875 8.8418 1.875Z'
        fill='#C2A83E'
        stroke='#C2A83E'
        strokeWidth={0.833333}
      />
      <Path
        d='M10.8115 1.90137L10.8184 1.9043C10.8987 1.9311 10.9655 1.96101 11.0801 2.00879V2.00977L13.0469 2.83398L13.0488 2.83496C14.1694 3.29782 14.8662 3.76582 15.3047 4.29199L15.3086 4.2959C15.388 4.38853 15.458 4.49298 15.5381 4.62109L15.542 4.62695C15.6161 4.74159 15.6832 4.87688 15.7295 5.01562L15.7354 5.03125L15.7422 5.04785C15.7615 5.09284 15.7924 5.17363 15.8096 5.25391L15.8125 5.26953L15.8164 5.28418C16.0109 5.94408 15.9306 6.80183 15.4521 8.00391C15.4096 8.09081 15.3238 8.1416 15.2412 8.1416C15.2179 8.14157 15.1904 8.13781 15.1729 8.13281H15.1738C14.8208 8.03064 14.4486 7.97562 14.0586 7.97559H8.30859C8.24356 7.97559 8.17495 7.93949 8.13379 7.88086C8.09524 7.81321 8.09205 7.73594 8.11523 7.68262L8.11621 7.68164L10.5322 2.07324L10.5342 2.06836C10.5559 2.01653 10.6066 1.95988 10.6738 1.9248C10.7401 1.89027 10.7883 1.89331 10.8115 1.90137ZM10.7002 2.74316L8.87598 6.97656L8.625 7.55859H14.0664C14.3066 7.55859 14.5424 7.58129 14.7832 7.62012L15.1367 7.67676L15.2461 7.33594C15.49 6.57791 15.5665 5.92371 15.3984 5.35645C15.3884 5.31547 15.3797 5.28266 15.3711 5.25684C15.3687 5.24971 15.3669 5.24311 15.3652 5.23828C15.3634 5.23299 15.3622 5.23009 15.3613 5.22754C15.3596 5.22236 15.3606 5.22556 15.3623 5.23242L15.3564 5.20898L15.3486 5.1875L15.2725 4.99902C15.2466 4.94201 15.2188 4.88958 15.1865 4.83789L15.1846 4.83496L15.1016 4.70215C15.0695 4.65381 15.0301 4.60235 14.9863 4.55176H14.9873C14.9856 4.54967 14.9832 4.54798 14.9814 4.5459C14.98 4.54422 14.979 4.54171 14.9775 4.54004H14.9766C14.5511 4.03217 13.8452 3.60342 12.8838 3.20703H12.8848L11.2432 2.52344L10.8633 2.36621L10.7002 2.74316Z'
        fill='#C2A83E'
        stroke='#C2A83E'
        strokeWidth={0.833333}
      />
      <Path
        d='M5.94141 7.55859H14.0752C14.5114 7.55861 14.9273 7.61964 15.3086 7.73926L15.3125 7.74023C17.0949 8.27874 18.3495 9.96678 18.3496 11.833V13.458C18.3496 13.6289 18.3423 13.7938 18.334 13.96C18.2466 15.5128 17.7546 16.6405 16.9326 17.3838C16.1078 18.1295 14.8917 18.542 13.25 18.542H6.75C6.53701 18.542 6.33672 18.5267 6.13086 18.5029L6.12109 18.502L6.11035 18.501L5.85449 18.4795C4.59317 18.3537 3.63458 17.926 2.96094 17.248C2.24201 16.5244 1.80216 15.4706 1.70703 14.0635L1.70605 14.0498L1.7041 14.0352C1.68165 13.8705 1.66699 13.664 1.66699 13.458V11.833C1.6671 10.1269 2.68198 8.58565 4.25391 7.90039C4.79421 7.6721 5.35563 7.55863 5.94141 7.55859ZM5.93359 7.97461C5.40295 7.97461 4.89775 8.07819 4.41309 8.2832L4.40918 8.28418C2.99116 8.8999 2.0753 10.2913 2.0752 11.833V13.458C2.0752 13.5573 2.08012 13.6559 2.08691 13.75L2.11035 14.0166C2.19518 15.2571 2.54756 16.2488 3.24414 16.9502C3.93956 17.6502 4.92042 18.0019 6.1416 18.0879V18.0889C6.35223 18.1141 6.53998 18.1328 6.74121 18.1328H13.2412C14.6695 18.1328 15.8128 17.82 16.6172 17.0996C17.4261 16.3752 17.8203 15.3045 17.8906 13.9482C17.8989 13.7993 17.9082 13.6378 17.9082 13.458V11.833C17.9081 10.1403 16.7793 8.62979 15.1729 8.13477L15.166 8.13281L14.8975 8.06543C14.6254 8.00656 14.3426 7.97461 14.0498 7.97461H5.93359Z'
        fill='#013D25'
        stroke='#013D25'
        strokeWidth={0.833333}
      />
    </Svg>
  );
}

export const PaymentMethodSelector = memo(function PaymentMethodSelector({
  options,
  selectedId,
  onSelect,
  onSeeAll,
  walletBalance,
  amount = 0,
  onFundWallet,
  isLoadingBalance = false,
}: Props) {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const normalizedOptions = useMemo(
    () =>
      options.length > 0
        ? options
        : [
            {
              id: "brane_wallet",
              label: "Brane Wallet - ₦ --",
              icon: "B",
            },
          ],
    [options],
  );

  const hasWalletOption = useMemo(
    () => normalizedOptions.some((opt) => opt.id === "brane_wallet"),
    [normalizedOptions],
  );

  const formattedBalance = useMemo(() => {
    if (typeof walletBalance !== "number") return "--";
    return formatMoney(walletBalance);
  }, [walletBalance]);

  const isInsufficientBalance = useMemo(
    () =>
      !isLoadingBalance &&
      typeof walletBalance === "number" &&
      amount > walletBalance,
    [isLoadingBalance, walletBalance, amount],
  );

  const showFundButton = useMemo(
    () =>
      hasWalletOption &&
      !isLoadingBalance &&
      typeof walletBalance === "number" &&
      amount > walletBalance,
    [hasWalletOption, isLoadingBalance, walletBalance, amount],
  );

  const displayLabel = isLoadingBalance
    ? `Brane Wallet - ₦ --`
    : `Brane Wallet - ₦ ${formattedBalance}`;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <ThemedText style={styles.heading}>Select Payment Method</ThemedText>
        {onSeeAll ? (
          <TouchableOpacity style={styles.seeAllBtn} onPress={onSeeAll}>
            <ThemedText style={styles.seeAll}>See all</ThemedText>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.card}>
        {normalizedOptions.map((option, index) => {
          const isWalletOption = option.id === "brane_wallet";
          const isDisabled = isWalletOption && isInsufficientBalance;
          const isSelected = !isDisabled && selectedId === option.id;
          const optionLabel = isWalletOption ? displayLabel : option.label;

          return (
            <TouchableOpacity
              key={option.id}
              activeOpacity={isDisabled ? 1 : 0.7}
              onPress={() => !isDisabled && onSelect(option.id)}
              disabled={isDisabled}
              style={[
                styles.optionRow,
                isDisabled ? styles.optionRowDisabled : styles.optionRowActive,
                index > 0 && styles.optionRowSpaced,
              ]}
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.iconWrap,
                    isDisabled
                      ? styles.iconWrapDisabled
                      : styles.iconWrapActive,
                  ]}
                >
                  {isWalletOption ? (
                    <WalletIcon />
                  ) : (
                    <ThemedText style={styles.iconText}>
                      {option.icon}
                    </ThemedText>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <ThemedText
                      style={[
                        styles.optionLabel,
                        !isDisabled && styles.optionLabelActive,
                        isDisabled && { color: C.muted },
                      ]}
                    >
                      {optionLabel}
                    </ThemedText>
                    {isWalletOption && isLoadingBalance && (
                      <ActivityIndicator size='small' color={C.primary} />
                    )}
                  </View>
                  {isWalletOption &&
                    isInsufficientBalance &&
                    !isLoadingBalance && (
                      <ThemedText
                        style={[styles.insufficientText, { color: C.muted }]}
                      >
                        Insufficient balance
                      </ThemedText>
                    )}
                </View>
              </View>

              <View
                style={[
                  styles.radio,
                  isSelected ? styles.radioSelected : styles.radioUnselected,
                ]}
              >
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {showFundButton && onFundWallet && (
        <TouchableOpacity
          onPress={onFundWallet}
          style={[styles.fundButton, { backgroundColor: C.primary }]}
          activeOpacity={0.8}
        >
          <ThemedText style={[styles.fundButtonText, { color: C.googleBg }]}>
            Fund Wallet
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F8FCFA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0B0014",
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAll: {
    fontSize: 11,
    color: "#013D25",
    fontWeight: "500",
  },

  card: {
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#F8FCFA",
  },
  optionRowActive: {
    backgroundColor: "#FAF6E6",
    borderColor: "#F6F0D5",
    borderWidth: 1,
    borderRadius: 12,
  },
  optionRowDisabled: {
    backgroundColor: "#F8FCFA",
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 12,
    opacity: 0.6,
  },
  optionRowSpaced: {
    marginTop: 8,
  },
  optionDivider: {},
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "inherit",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: "inherit",
  },
  iconWrapDisabled: {
    backgroundColor: "inherit",
    opacity: 0.6,
  },
  optionLabel: {
    fontSize: 12,
    color: "#0B0014",
    flex: 1,
  },
  optionLabelActive: {
    fontWeight: "500",
  },
  iconText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#013D25",
  },
  insufficientText: {
    fontSize: 10,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#013D25",
  },
  radioUnselected: {
    borderColor: "#C5C5CA",
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: "#013D25",
  },
  fundButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  fundButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
