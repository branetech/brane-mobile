export const VERSION = "1.0.5";


import { Lock, Message2, MessageQuestion, PasswordCheck, Profile2User, Setting3, TagUser, User, UserOctagon, Verify } from "iconsax-react-native";
import { jwtDecode } from "jwt-decode";
import { ReactNode } from "react";

import type { JSX } from "react";

export interface IUSER {
  id: string;
  braneId: string;
  username: string | null;
  email: null;
  phone: string;
  firstName: string | null;
  lastName: string | null;
  houseAddress: string | null;
  image: string | null;
  transactionPin: string | null;
  password: string | null;
  kyc: boolean | false;
  occupation: string;
  hasTransactionPin: boolean;
  nextOfKin: NextOfKin | null;
  beneficiaries?: any[] | null;
  preference: IPreference | null;
  identityVerification: IdentityVerification | null;
  emailVerifiedAt: any;
  phoneVerifiedAt: string;
  isVerified: boolean;
  isDeactivated: boolean;
  createdAt: string;
  updatedAt: string;

  hasIdentity?: boolean;
  hasNextOfKin?: boolean;
  hasEmail?: boolean;
  hasBvn?: boolean;
  hasBank?: boolean;
  hasPhoto?: boolean;
  hasLocation?: boolean;
  hasPhone?: boolean;
  hasUsername?: boolean;
  hasName?: boolean;
  name?: string;
  identity?: boolean;
  location?: string;
  locationStatus?: string;
  photoStatus?: string;
  kycDone?: boolean;
  university?: boolean;
  identityKyc?: boolean;
}

export interface NextOfKin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPreference {
  metadata: Metadata;
}

export interface Metadata {
  showBalance: boolean;
  theme: string;
  transactionSound: boolean;
}

export interface ITransactionDetail {
  id?: string;
  transactionId?: string;
  userId?: string;
  paystackReference?: string;
  transactionType?: string;
  transactionDescription?: string;
  actionType?: string;
  medium?: string;
  status?: string;
  sentTo?: string;
  serviceCharge?: number;
  traceId?: any;
  amount?: number;
  serviceId?: any;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  time?: string;
  points?: number;
  paymentGatewayFees?: number;
  timestamp?: number | any;
  service?: string;
  rate?: number;
  rebate?: number;
  rebateAmount?: number | null;
  tickerSymbol?: string;
  toTickerSymbol?: string;
  numOfStocks?: number;
}

export interface IdentityVerification {
  id: string;
  bvnVerification: Verification | null;
  locationVerification: LocationVerification | null;
  ninVerification: Verification | null;
  passportVerification: Verification | null;
  votersIdVerification: Verification | null;
  driversLicenseVerification: Verification | null;
  passportPhotographVerification: Verification | null;
  bankAccountVerification: Verification | null;
}

export interface LocationVerification {
  status: string;
  verificationType: string;
}

export interface Verification {
  status: string;
}

export interface RegistrationProps {
  phone?: string | any;
  password?: string | any;
  confirmPassword?: string | null | any;
  otp?: string;
}

export const stocks = [
  {
    title: "MTN",
    text: "MTN Group Limited",
    price: "+ ₦4,000",
    id: "mtn",
    per: "0.00%",
  },
  {
    title: "MTN",
    text: "MTN Group Limited",
    price: "+ ₦4,000",
    id: "mtn",
    per: "0.00%",
  },
];

export interface Accn {
  icon: JSX.Element;
  text: string;
  routes?: string;
}

export interface Acc {
  title: string;
  content: Accn[];
}

export const accnt = (): Acc[] => [
  {
    title: "My account",
    content: [
      { icon: <User size={20} color="#013D25" />, text: "Account Details", routes: "account-details" },
      { icon: <Profile2User size={20} color="#013D25" />, text: "Manage beneficiaries", routes: "beneficiary" },
      { icon: <TagUser size={20} color="#013D25" />, text: "Next of Kin details", routes: "update-kin-details" },
      { icon: <Verify size={20} color="#013D25" />, text: "Account verification", routes: "account-verification" },
      { icon: <Verify size={20} color="#013D25" />, text: "Bracs Investment Trigger", routes: "bracs-investment-trigger" },
    ],
  },
  {
    title: "Security & Privacy",
    content: [
      { icon: <Lock size={20} color="#013D25" />, text: "Change password", routes: "change-password" },
      { icon: <PasswordCheck size={20} color="#013D25" />, text: "Reset transaction PIN", routes: "reset-transaction-pin" },
      { icon: <UserOctagon size={20} color="#013D25" />, text: "Change username", routes: "change-username" },
    ],
  },
  {
    title: "More",
    content: [
      { icon: <Setting3 size={20} color="#013D25" />, text: "Preferences", routes: "preferences" },
      { icon: <MessageQuestion size={20} color="#013D25" />, text: "Help desk", routes: "help-desk" },
      { icon: <Message2 size={20} color="#013D25" />, text: "Live chat", routes: "chat" },
      { icon: <Verify size={20} color="#013D25" />, text: "Terms & conditions", routes: "terms-conditions" },
      { icon: <Verify size={20} color="#013D25" />, text: "Privacy policy", routes: "privacy-policy" },
    ],
  },
];

interface Panel {
  header: string;
  key: number;
  className: string;
  text: ReactNode;
}

export const panel: Panel[] = [
  // 1. Getting Started
  {
    header: "What is Brane?",
    key: 1,
    className: "site-collapse-custom-collapse",
    text: "Brane is a fintech platform that helps you turn everyday spending into wealth. Every time you buy airtime, pay electricity bills, fund gaming accounts, or book transport, you earn Bracs Points. These are converted into investments, such as stocks, gold, ETFs, Indices, and fixed-income assets.",
  },
  {
    header: "Who can use Brane?",
    key: 2,
    className: "site-collapse-custom-collapse",
    text: "Anyone 18+ with a valid BVN and a Nigerian mobile number.",
  },
  {
    header: "Is Brane licensed?",
    key: 3,
    className: "site-collapse-custom-collapse",
    text: "Brane operates under Nigerian fintech regulations and partners with licensed brokers (e.g., Sankore Investment) to deliver investment products. Wallets are NDIC-protected.",
  },
  {
    header: "How do I create an account?",
    key: 4,
    className: "site-collapse-custom-collapse",
    text: (
      <ol className="list-decimal pl-5">
        <li>Visit getbrane.co to get started</li>
        <li>Sign up with your phone number or Google Email</li>
        <li>Verify with BVN (for KYC compliance)</li>
        <li>Create your 6-digit PIN</li>
        <li>Fund your wallet and start transacting</li>
      </ol>
    ),
  },
  // 2. Wallet & Payments
  {
    header: "How do I fund my Brane wallet?",
    key: 5,
    className: "site-collapse-custom-collapse",
    text: (
      <ul className="list-disc pl-5">
        <li>Debit card (instant)</li>
        <li>Bank transfer (unique account number)</li>
        <li>USSD (supported banks only)</li>
      </ul>
    ),
  },
  {
    header: "What’s the minimum/maximum funding?",
    key: 6,
    className: "site-collapse-custom-collapse",
    text: "Minimum: ₦100 | Maximum: ₦50,000 per transaction (daily limits apply).",
  },
  {
    header: "Can I withdraw from my wallet?",
    key: 7,
    className: "site-collapse-custom-collapse",
    text: "Yes. Withdrawals go directly to your linked bank account. Processing time: instant to 24 hours depending on your bank.",
  },
  {
    header: "What services can I pay for?",
    key: 8,
    className: "site-collapse-custom-collapse",
    text: (
      <ul className="gap-y-3">
        <li>
          {" "}
          <b>Airtime & Data: </b> Mtn, Airtel, 9Mobile, Glo, ISP providers
        </li>
        <li>
          {" "}
          <b>Cable TV: </b> DStv, GOtv, Startimes, Netflix vouchers
        </li>
        <li>
          {" "}
          <b>Electricity: </b> All DisCos (prepaid & postpaid)
        </li>
        <li>
          <b> Gaming & Sports:</b> Bet9ja, SportyBet, BetKing, etc.
        </li>
        <li>
          {" "}
          <b>Transport: </b>Cowry (Coming soon), Shuttlers (Coming soon)
        </li>
        <li>
          {" "}
          <b>Vouchers:</b> Gift cards, Shopping credits (Coming soon)
        </li>
      </ul>
    ),
  },
  // 3. Bracs Points (Rewards)
  {
    header: "What are Bracs Points?",
    key: 9,
    className: "site-collapse-custom-collapse",
    text: "Bracs are points you earn for every transaction you make in Brane.",
  },
  {
    header: "Do Bracs expire?",
    key: 10,
    className: "site-collapse-custom-collapse",
    text: "No, Bracs never expire.",
  },
  {
    header: "What can I use Bracs for?",
    key: 11,
    className: "site-collapse-custom-collapse",
    text: "You can use Bracs to claim assets like stocks, Gold, ETFs, and Fixed Income.",
  },
  {
    header: "How do I check my Bracs balance?",
    key: 12,
    className: "site-collapse-custom-collapse",
    text: "From the Brane dashboard, navigate to Portfolio, then look under Cumulative brac points.",
  },
  // 4. Investments
  {
    header: "What investment options are available?",
    key: 13,
    className: "site-collapse-custom-collapse",
    text: "Brane currently offers through our partners: Stocks (Nigerian equities), Gold (Gold Bars), Index Funds/ETFs (Vetiva, Lotus, SIAML ETFs), and Fixed Income (FGN savings bonds, treasury bills, and selected corporate bonds).",
  },
  {
    header: "What’s the minimum investment?",
    key: 14,
    className: "site-collapse-custom-collapse",
    text: "The minimum investment is 100 Bracs (which is approximately ₦100).",
  },
  {
    header: "How do I monitor my investments?",
    key: 15,
    className: "site-collapse-custom-collapse",
    text: "The Portfolio dashboard shows your assets owned, units held, market value, and gains/losses over time.",
  },
  {
    header: "Who manages the investments?",
    key: 16,
    className: "site-collapse-custom-collapse",
    text: "Our licensed investment partners (e.g., Sankore/WealthNG) execute and custody assets. Brane provides the digital access layer.",
  },
  {
    header: "What fees apply?",
    key: 17,
    className: "site-collapse-custom-collapse",
    text: "Standard NGX brokerage, CSCS, VAT, and stamp duty fees apply. A full breakdown will be shown before you confirm any transaction.",
  },
  // 5. Bills & Services
  {
    header: "Can I earn Bracs on bill payments?",
    key: 18,
    className: "site-collapse-custom-collapse",
    text: "Yes. All utility and lifestyle payments earn Bracs.",
  },
  {
    header: "How do I pay for Cable TV?",
    key: 19,
    className: "site-collapse-custom-collapse",
    text: "Go to Home → Pay Bills → Select Biller Category “Cable TV” → Select Biller → Select Product → Enter Smartcard ID → Choose package → Pay. You'll get instant confirmation.",
  },
  {
    header: "How do I pay electricity bills?",
    key: 20,
    className: "site-collapse-custom-collapse",
    text: "Go to Home → Pay Bills → Select Biller Category “Electricity” → Select provider → Enter meter number → Pay. If prepaid, the token is sent via SMS/email or your transaction receipt.",
  },
  {
    header: "Can I pay for transport?",
    key: 21,
    className: "site-collapse-custom-collapse",
    text: "Yes. You will soon be able to use Brane to top up Cowry transport cards or buy Shuttlers vouchers, which are redeemable for seats. (Coming Soon)",
  },
  // 6. Lifestyle & Partnerships
  {
    header: "What lifestyle services does Brane integrate with?",
    key: 22,
    className: "site-collapse-custom-collapse",
    text: "Brane integrates with: Shuttlers (ride vouchers + in-app booking - coming soon), Wakanow (book flights and hotels - coming soon), Pricepally (buy groceries - coming soon), and Betting/Gaming (top up accounts for Bet9ja, SportyBet, etc.).",
  },
  {
    header: "Can I gift Brane vouchers?",
    key: 23,
    className: "site-collapse-custom-collapse",
    text: "Yes. You will soon be able to buy digital vouchers (₦2,000 – ₦10,000 denominations) for friends/family, redeemable for services. (Coming Soon)",
  },
  // 7. Security & Compliance
  {
    header: "How secure is Brane?",
    key: 24,
    className: "site-collapse-custom-collapse",
    text: "Brane uses bank-grade encryption (AES256), 2FA, biometric login, fraud monitoring, and NDIC protection for security.",
  },
  {
    header: "What if someone logs in from a new device?",
    key: 25,
    className: "site-collapse-custom-collapse",
    text: "You’ll receive an instant alert (email, in-app, SMS) with device and IP details.",
  },
  {
    header: "How do I reset my PIN?",
    key: 26,
    className: "site-collapse-custom-collapse",
    text: "Go to Settings → Security → Reset PIN. You will confirm the change with an OTP.",
  },
  {
    header: "What if my transaction fails?",
    key: 27,
    className: "site-collapse-custom-collapse",
    text: "Refunds are automatic. Processing time ranges from instant up to 24 hours, depending on the provider.",
  },
  // 8. Support
  {
    header: "How do I contact Brane Support?",
    key: 28,
    className: "site-collapse-custom-collapse",
    text: "You can contact support via: In-app chat (24/7), Email: info@getbrane.co, or the FAQ/Help Center in the app.",
  },
  {
    header: "Do you offer live support?",
    key: 29,
    className: "site-collapse-custom-collapse",
    text: "Yes. Live support is available during business hours: Monday–Friday (8am–8pm).",
  },
  {
    header: "Where can I follow Brane for updates?",
    key: 30,
    className: "site-collapse-custom-collapse",
    text: "You can follow Brane on social media (Twitter, Instagram, LinkedIn), plus check for in-app News/Announcements.",
  },
];

interface DecodedToken {
  exp: number;
}

type DecodedJWT = any;

export const isTokenExpired = (token: string): boolean => {
  const decodedToken: DecodedJWT = jwtDecode(token);
  if (decodedToken && typeof decodedToken.exp === "number") {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTimeInSeconds;
  }
  return true;
};

export const svgWithText = ({ text }: any) => {
  return (
    <div className="flex justify-between  gap-7 mt-5 mx-[20px]">
      <div className="border h-[111px] border-[#F7F7F8] w-full p-5 rounded-xl">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="32" height="32" rx="16" fill="#F0FAF6" />
          <path
            d="M18.2223 23.5907H13.7778C12.1572 23.5907 11.2289 23.3384 10.6851 22.7946C10.1413 22.2507 9.88893 21.3224 9.88893 19.7018V12.2944C9.88893 10.6738 10.1413 9.7455 10.6851 9.20168C11.2289 8.65786 12.1572 8.40553 13.7778 8.40553H18.2223C19.8428 8.40553 20.7712 8.65786 21.315 9.20168C21.8588 9.7455 22.1111 10.6738 22.1111 12.2944V19.7018C22.1111 21.3224 21.8588 22.2507 21.315 22.7946C20.7712 23.3384 19.8428 23.5907 18.2223 23.5907ZM13.7778 8.7759C13.1083 8.7759 12.5489 8.80718 12.0907 8.90391C11.6283 9.0015 11.2425 9.17113 10.9471 9.46705C10.6519 9.76293 10.4831 10.149 10.3862 10.6108C10.2901 11.0685 10.2593 11.6269 10.2593 12.2944V19.7018C10.2593 20.3693 10.2901 20.9277 10.3862 21.3854C10.4831 21.8472 10.6519 22.2333 10.9471 22.5292C11.2425 22.8251 11.6283 22.9947 12.0907 23.0923C12.5489 23.1891 13.1083 23.2203 13.7778 23.2203H18.2223C18.8918 23.2203 19.4512 23.1891 19.9094 23.0923C20.3717 22.9947 20.7576 22.8251 21.0529 22.5292C21.3482 22.2333 21.517 21.8472 21.6139 21.3854C21.71 20.9277 21.7408 20.3693 21.7408 19.7018V12.2944C21.7408 11.6269 21.71 11.0685 21.6139 10.6108C21.517 10.149 21.3482 9.76293 21.0529 9.46705C20.7576 9.17113 20.3717 9.0015 19.9094 8.90391C19.4512 8.80718 18.8918 8.7759 18.2223 8.7759H13.7778Z"
            fill="#013D25"
            stroke="#013D25"
            strokeWidth="0.740741"
          />
          <path
            d="M17.4819 11.3696H14.5189C14.4198 11.3696 14.3337 11.2836 14.3337 11.1845C14.3337 11.0853 14.4198 10.9993 14.5189 10.9993H17.4819C17.5811 10.9993 17.6671 11.0853 17.6671 11.1845C17.6671 11.2836 17.5811 11.3696 17.4819 11.3696Z"
            fill="#013D25"
            stroke="#013D25"
            strokeWidth="0.740741"
          />
          <path
            d="M16.0006 21.4511C15.2644 21.4511 14.6672 20.854 14.6672 20.1178C14.6672 19.3816 15.2644 18.7844 16.0006 18.7844C16.7368 18.7844 17.3339 19.3816 17.3339 20.1178C17.3339 20.854 16.7368 21.4511 16.0006 21.4511ZM16.0006 19.1474C15.4701 19.1474 15.0376 19.5799 15.0376 20.1104C15.0376 20.6408 15.4701 21.0733 16.0006 21.0733C16.5311 21.0733 16.9635 20.6408 16.9635 20.1104C16.9635 19.5799 16.5311 19.1474 16.0006 19.1474Z"
            fill="#013D25"
            stroke="#013D25"
            strokeWidth="0.740741"
          />
        </svg>

        <p className="text-[#85808A] text-[14px]">Your data amount </p>
        <p className="text-[#0B0014] text-[16px] ">₦3,000.00 </p>
      </div>
      <div className="border h-[111px] border-[#F7F7F8] w-full p-5 rounded-xl">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="32" height="32" rx="16" fill="#FFF6E5" />
          <path
            d="M15.7845 10.4371L15.7843 10.437L15.78 10.4478C15.7579 10.5042 15.7021 10.5478 15.6221 10.5478H11.5333C11.486 10.5478 11.4382 10.5272 11.4046 10.4919C11.0899 10.1441 11.1024 9.61331 11.4312 9.28451L12.4831 8.23266C12.8238 7.89197 13.3909 7.89197 13.7316 8.23266L15.7464 10.2475C15.7953 10.2964 15.8105 10.3763 15.7845 10.4371ZM11.5612 9.81617V10.1957H11.9407H14.2888H15.2095L14.5562 9.54691L13.4831 8.48117C13.4829 8.48098 13.4827 8.48079 13.4825 8.4806C13.275 8.27371 12.9389 8.2739 12.7316 8.48117L12.9923 8.74184L12.7316 8.48117L11.6797 9.53302L11.5686 9.64417V9.74058C11.5634 9.7666 11.5612 9.79198 11.5612 9.81617ZM12.2151 10.0747L12.2162 10.0736C12.2158 10.074 12.2154 10.0743 12.2151 10.0747ZM11.6738 9.54266L11.6726 9.54396C11.673 9.5435 11.6734 9.54306 11.6738 9.54266ZM11.676 9.54043L11.6755 9.54099L11.676 9.54043Z"
            fill="#FFB92D"
            stroke="#FFB92D"
            strokeWidth="0.758976"
          />
          <path
            d="M15.9903 10.4478L15.9905 10.4477L15.9859 10.4371C15.962 10.3813 15.9706 10.3053 16.0278 10.2436L18.0388 8.23266C18.3795 7.89197 18.9466 7.89197 19.2873 8.23266L20.3391 9.28451C20.5409 9.48629 20.6251 9.76141 20.5885 10.0235L20.1128 9.54783L20.1128 9.54779L20.1128 9.54775L20.1127 9.5477L20.1127 9.54766L20.1126 9.54762L20.1126 9.54757L20.1125 9.54753L20.1125 9.54749L20.1125 9.54745L20.1124 9.54741L20.1124 9.54736L20.1123 9.54732L20.1123 9.54728L20.1123 9.54724L20.1122 9.5472L20.1122 9.54716L20.1121 9.54712L20.1121 9.54708L20.112 9.54704L20.112 9.547L20.112 9.54696L20.1119 9.54692L20.1119 9.54688L20.1118 9.54684L20.1118 9.5468L20.1118 9.54676L20.1117 9.54672L20.1117 9.54668L20.1117 9.54664L20.1116 9.5466L20.1116 9.54656L20.1115 9.54653L20.1115 9.54649L20.1115 9.54645L20.1114 9.54641L20.1114 9.54637L20.1113 9.54634L20.1113 9.5463L20.1113 9.54626L20.1112 9.54622L20.1112 9.54619L20.1112 9.54615L20.1111 9.54611L20.1111 9.54608L20.1111 9.54604L20.111 9.546L20.111 9.54597L20.1109 9.54593L20.1109 9.5459L20.1109 9.54586L20.1108 9.54582L20.1108 9.54579L20.1108 9.54575L20.1107 9.54572L20.1107 9.54568L20.1107 9.54565L20.1106 9.54561L20.1106 9.54558L20.1106 9.54554L20.1105 9.54551L20.1105 9.54547L20.1105 9.54544L20.1104 9.54541L20.1104 9.54537L20.1103 9.54534L20.1103 9.5453L20.1103 9.54527L20.1102 9.54524L20.1102 9.5452L20.1102 9.54517L20.1101 9.54514L20.1101 9.5451L20.1101 9.54507L20.11 9.54504L20.11 9.54501L20.11 9.54497L20.11 9.54494L20.1099 9.54491L20.1099 9.54488L20.1099 9.54485L20.1098 9.54481L20.1098 9.54478L20.1098 9.54475L20.1097 9.54472L20.1097 9.54469L20.1097 9.54466L20.1096 9.54462L20.1096 9.54459L20.1096 9.54456L20.1095 9.54453L20.1095 9.5445L20.1095 9.54447L20.1095 9.54444L20.1094 9.54441L20.1094 9.54438L20.1094 9.54435L20.1093 9.54432L20.1093 9.54429L20.1093 9.54426L20.1092 9.54423L20.1092 9.5442L20.1092 9.54417L20.1092 9.54414L20.1091 9.54411L20.1091 9.54408L20.1091 9.54405L20.109 9.54402L20.109 9.54399L20.109 9.54396L20.1089 9.54394L20.1089 9.54391L20.1089 9.54388L20.1089 9.54385L20.1088 9.54382L20.1088 9.54379L20.1088 9.54377L20.1087 9.54374L20.1087 9.54371L20.1087 9.54368L20.1087 9.54365L20.1086 9.54363L20.1086 9.5436L20.1086 9.54357L20.1086 9.54354L20.1085 9.54352L20.1085 9.54349L20.1085 9.54346L20.1084 9.54343L20.1084 9.54341L20.1084 9.54338L20.1084 9.54335L20.1083 9.54333L20.1083 9.5433L20.1083 9.54327L20.1083 9.54325L20.1082 9.54322L20.1082 9.54319L20.1082 9.54317L20.1082 9.54314L20.1081 9.54311L20.1081 9.54309L20.1081 9.54306L20.108 9.54304L20.108 9.54301L20.108 9.54298L20.108 9.54296L20.1079 9.54293L20.1079 9.54291L20.1079 9.54288L20.1079 9.54286L20.1078 9.54283L20.1078 9.54281L20.1078 9.54278L20.1078 9.54276L20.1077 9.54273L20.1077 9.5427L20.1077 9.54268L20.1077 9.54265L20.1076 9.54263L20.1076 9.54261L20.1076 9.54258L20.1076 9.54256L20.1075 9.54253L20.1075 9.54251L20.1075 9.54248L20.1075 9.54246L20.1074 9.54243L20.1074 9.54241L20.1074 9.54238L20.1074 9.54236L20.1073 9.54234L20.1073 9.54231L20.1073 9.54229L20.1073 9.54226L20.1073 9.54224L20.1072 9.54222L20.1072 9.54219L20.1072 9.54217L20.1072 9.54215L20.1071 9.54212L20.1071 9.5421L20.1071 9.54207L20.1071 9.54205L20.107 9.54203L20.107 9.542L20.107 9.54198L20.107 9.54196L20.1069 9.54193L20.1069 9.54191L20.1069 9.54189L20.1069 9.54187L20.1069 9.54184L20.1068 9.54182L20.1068 9.5418L20.1068 9.54177L20.1068 9.54175L20.1067 9.54173L20.1067 9.5417L20.1067 9.54168L20.1067 9.54166L20.1066 9.54164L20.1066 9.54161L20.1066 9.54159L20.1066 9.54157L20.1066 9.54155L20.1065 9.54152L20.1065 9.5415L20.1065 9.54148L20.1065 9.54146L20.1064 9.54143L20.1064 9.54141L20.1064 9.54139L20.1064 9.54137L20.1064 9.54134L20.1063 9.54132L20.1063 9.5413L20.1063 9.54128L20.1063 9.54125L20.1062 9.54123L20.1062 9.54121L20.1062 9.54119L20.1062 9.54117L20.1062 9.54114L20.1061 9.54112L20.1061 9.5411L20.1061 9.54108L20.1061 9.54106L20.106 9.54103L20.106 9.54101L20.106 9.54099L20.106 9.54097L20.106 9.54095L20.1059 9.54092L20.1059 9.5409L20.1059 9.54088L20.1059 9.54086L20.1058 9.54084L20.1058 9.54082L20.1058 9.54079L20.1058 9.54077L20.1058 9.54075L20.1057 9.54073L20.1057 9.54071L20.1057 9.54068L20.1057 9.54066L20.1057 9.54064L20.1056 9.54062L20.1056 9.5406L20.1056 9.54058L20.1056 9.54055L20.1055 9.54053L20.1055 9.54051L20.1055 9.54049L20.1055 9.54047L20.1055 9.54045L20.1054 9.54042L20.1054 9.5404L20.1054 9.54038L20.1054 9.54036L20.1053 9.54034L20.1053 9.54032L20.1053 9.54029L20.1053 9.54027L20.1053 9.54025L20.1052 9.54023L20.1052 9.54021L20.1052 9.54019L20.1052 9.54016L20.1052 9.54014L20.1051 9.54012L20.1051 9.5401L20.1051 9.54008L20.1051 9.54005L20.105 9.54003L20.105 9.54001L20.105 9.53999L20.105 9.53997L20.105 9.53995L20.1049 9.53992L20.1049 9.5399L20.1049 9.53988L20.1049 9.53986L20.1048 9.53984L20.1048 9.53981L20.1048 9.53979L20.1048 9.53977L20.1048 9.53975L20.1047 9.53973L20.1047 9.5397L20.1047 9.53968L20.1047 9.53966L20.1046 9.53964L20.1046 9.53962L20.1046 9.53959L20.1046 9.53957L20.1046 9.53955L20.1045 9.53953L20.1045 9.5395L20.1045 9.53948L20.1045 9.53946L20.1044 9.53944L20.1044 9.53942L20.1044 9.53939L20.1044 9.53937L20.1044 9.53935L20.1043 9.53933L20.1043 9.5393L20.1043 9.53928L20.1043 9.53926L20.1042 9.53923L20.1042 9.53921L20.1042 9.53919L20.1042 9.53917L20.1042 9.53914L20.1041 9.53912L20.1041 9.5391L20.1041 9.53908L20.1041 9.53905L20.104 9.53903L20.104 9.53901L20.104 9.53898L20.104 9.53896L20.1039 9.53894L20.1039 9.53891L20.1039 9.53889L20.1039 9.53887L20.1039 9.53884L20.1038 9.53882L20.1038 9.5388L20.1038 9.53877L20.1038 9.53875L20.1037 9.53873L20.1037 9.5387L20.1037 9.53868L20.1037 9.53866L20.1036 9.53863L20.1036 9.53861L20.1036 9.53858L20.1036 9.53856L20.1035 9.53854L20.1035 9.53851L20.1035 9.53849L20.1035 9.53846L20.1034 9.53844L20.1034 9.53842L20.1034 9.53839L20.1034 9.53837L20.1034 9.53834L20.1033 9.53832L20.1033 9.53829L20.1033 9.53827L20.1033 9.53824L20.1032 9.53822L20.1032 9.53819L20.1032 9.53817L20.1032 9.53814L20.1031 9.53812L20.1031 9.53809L20.1031 9.53807L20.1031 9.53804L20.103 9.53802L20.103 9.53799L20.103 9.53797L20.103 9.53794L20.1029 9.53792L20.1029 9.53789L20.1029 9.53786L20.1028 9.53784L20.1028 9.53781L20.1028 9.53779L20.1028 9.53776L20.1027 9.53773L20.1027 9.53771L20.1027 9.53768L20.1027 9.53766L20.1026 9.53763L20.1026 9.5376L20.1026 9.53758L20.1026 9.53755L20.1025 9.53752L20.1025 9.5375L20.1025 9.53747L20.1025 9.53744L20.1024 9.53742L20.1024 9.53739L20.1024 9.53736L20.1023 9.53733L20.1023 9.53731L20.1023 9.53728L20.1023 9.53725L20.1022 9.53722L20.1022 9.5372L20.1022 9.53717L20.1021 9.53714L20.1021 9.53711L20.1021 9.53708L20.1021 9.53705L20.102 9.53703L20.102 9.537L20.102 9.53697L20.102 9.53694L20.1019 9.53691L20.1019 9.53688L20.1019 9.53685L20.1018 9.53683L20.1018 9.5368L20.1018 9.53677L20.1017 9.53674L20.1017 9.53671L20.1017 9.53668L20.1017 9.53665L20.1016 9.53662L20.1016 9.53659L20.1016 9.53656L20.1015 9.53653L20.1015 9.5365L20.1015 9.53647L20.1014 9.53644L20.1014 9.53641L20.1014 9.53638L20.1014 9.53635L20.1013 9.53632L20.1013 9.53629L20.1013 9.53626L20.1012 9.53622L20.1012 9.53619L20.1012 9.53616L20.1011 9.53613L20.1011 9.5361L20.1011 9.53607L20.101 9.53603L20.101 9.536L20.101 9.53597L20.1009 9.53594L20.1009 9.53591L20.1009 9.53587L20.1009 9.53584L20.1008 9.53581L20.1008 9.53578L20.1008 9.53574L20.1007 9.53571L20.1007 9.53568L20.1007 9.53564L20.1006 9.53561L20.1006 9.53558L20.1006 9.53554L20.1005 9.53551L20.1005 9.53548L20.1005 9.53544L20.1004 9.53541L20.1004 9.53537L20.1003 9.53534L20.1003 9.53531L20.1003 9.53527L20.1002 9.53524L20.1002 9.5352L20.1002 9.53517L20.1001 9.53513L20.1001 9.5351L20.1001 9.53506L20.1 9.53502L20.1 9.53499L20.1 9.53495L20.0999 9.53492L20.0999 9.53488L20.0999 9.53484L20.0998 9.53481L20.0998 9.53477L20.0997 9.53474L20.0997 9.5347L20.0997 9.53466L20.0996 9.53462L20.0996 9.53459L20.0996 9.53455L20.0995 9.53451L20.0995 9.53447L20.0994 9.53444L20.0994 9.5344L20.0994 9.53436L20.0993 9.53432L20.0993 9.53428L20.0993 9.53425L20.0992 9.53421L20.0992 9.53417L20.0991 9.53413L20.0991 9.53409L20.0991 9.53405L20.099 9.53401L20.099 9.53397L20.0989 9.53393L20.0989 9.53389L20.0989 9.53385L20.0988 9.53381L20.0988 9.53377L20.0987 9.53373L20.0987 9.53369L20.0987 9.53365L20.0986 9.53361L20.0986 9.53357L20.0985 9.53353L20.0985 9.53348L20.0985 9.53344L20.0984 9.5334L20.0984 9.53336L20.0983 9.53332L20.0983 9.53327L20.0982 9.53323L20.0982 9.53319L20.0982 9.53315L20.0981 9.5331L20.0981 9.53306L20.098 9.53302L20.098 9.53302L19.0462 8.48117C18.8387 8.27371 18.5021 8.27371 18.2947 8.48117L17.228 9.54784L16.5802 10.1957H17.4964H19.8445H20.5462C20.508 10.302 20.4483 10.4026 20.3666 10.491C20.333 10.5268 20.2848 10.5478 20.2371 10.5478H16.1482C16.0727 10.5478 16.0114 10.5015 15.9903 10.4478Z"
            fill="#FFB92D"
            stroke="#FFB92D"
            strokeWidth="0.758976"
          />
          <path
            d="M10.4964 14.2512H10.1169V14.6306V20.001C10.1169 20.9568 10.2324 21.707 10.7151 22.1897C11.1978 22.6724 11.948 22.7879 12.9038 22.7879H18.8297C19.7855 22.7879 20.5357 22.6724 21.0184 22.1897C21.5011 21.707 21.6166 20.9568 21.6166 20.001V14.6306V14.2512H21.2371H10.4964ZM18.8297 23.14H12.9038C11.6719 23.14 10.9187 22.8978 10.4629 22.4419C10.007 21.986 9.76474 21.2328 9.76474 20.001V14.0751C9.76474 13.981 9.84669 13.899 9.94081 13.899H21.7927C21.8868 13.899 21.9687 13.981 21.9687 14.0751V20.001C21.9687 21.2328 21.7265 21.986 21.2706 22.4419C20.8147 22.8978 20.0615 23.14 18.8297 23.14Z"
            fill="#FFB92D"
            stroke="#FFB92D"
            strokeWidth="0.758976"
          />
          <path
            d="M21.4445 14.2517H10.3334C9.75665 14.2517 9.35486 14.0882 9.09713 13.8305C8.8394 13.5727 8.67587 13.171 8.67587 12.5942V11.8534C8.67587 11.2767 8.8394 10.8749 9.09713 10.6172C9.35486 10.3594 9.75665 10.1959 10.3334 10.1959H21.4445C21.9953 10.1959 22.4003 10.3644 22.6669 10.631C22.9336 10.8977 23.1021 11.3027 23.1021 11.8534V12.5942C23.1021 13.1449 22.9336 13.5499 22.6669 13.8166C22.4003 14.0832 21.9953 14.2517 21.4445 14.2517ZM10.3334 10.548C9.9652 10.548 9.60514 10.6136 9.34934 10.8694C9.09354 11.1252 9.02801 11.4852 9.02801 11.8534V12.5942C9.02801 12.9624 9.09354 13.3225 9.34934 13.5783C9.60514 13.8341 9.9652 13.8996 10.3334 13.8996H21.4445C21.8125 13.8996 22.1663 13.8239 22.4203 13.5699C22.6743 13.3159 22.7499 12.9622 22.7499 12.5942V11.8534C22.7499 11.4855 22.6743 11.1317 22.4203 10.8777C22.1663 10.6237 21.8125 10.548 21.4445 10.548H10.3334Z"
            fill="#FFB92D"
            stroke="#FFB92D"
            strokeWidth="0.758976"
          />
        </svg>

        <p className="text-[#85808A] text-[14px]">Your stock reward </p>
        <p className="text-[#0B0014] text-[16px] ">{text}</p>
      </div>
    </div>
  );
};

// export const Finicials = [
//   {
//     title: "0.1 units of Stocks earned on ₦200 MTN airtime recharge",
//     icon: <StockIcn />,
//     date: "Jan 25, 2023 at 11:00 PM",
//   },
//   {
//     title: "20 units of stocks purchased",
//     icon: <StockIcn2 />,
//     date: "Jan 25, 2023 at 11:00 PM",
//   },
//   {
//     title: "0.1 units of Stocks earned on ₦200 MTN airtime recharge",
//     icon: <StockIcn />,
//     date: "Jan 25, 2023 at 11:00 PM",
//   },
//   {
//     title: "20 units of stocks purchased",
//     icon: <StockIcn2 />,
//     date: "Jan 25, 2023 at 11:00 PM",
//   },
//   {
//     title: "0.1 units of Stocks earned on ₦200 MTN airtime recharge",
//     icon: <StockIcn />,
//     date: "Jan 25, 2023 at 11:00 PM",
//   },
//   {
//     title: "20 units of stocks purchased",
//     icon: <StockIcn2 />,
//     date: "Jan 25, 2023 at 11:00 PM",
//   },
//   {
//     title: "0.1 units of Stocks earned on ₦200 MTN airtime recharge",
//     icon: <StockIcn />,
//     date: "Jan 25, 2023 at 11:00 PM",
//   },
//   {
//     title: "20 units of stocks purchased",
//     icon: <StockIcn2 />,
//     date: "Jan 25, 2023 at 11:00 PM",
//   },
//   {
//     title: "0.1 units of Stocks earned on ₦200 MTN airtime recharge",
//     icon: <StockIcn />,
//     date: "Jan 25, 2023 at 11:00 PM",
//   },
//   {
//     title: "20 units of stocks purchased",
//     icon: <StockIcn2 />,
//     date: "Jan 25, 2023 at 11:00 PM",
//   },
// ];

// export const KYC_LIST = [
//   {
//     icon: <Information color="#013d25" size={16} variant="Outline" />,
//     title: "Personal Details",
//     route: "/verification",
//     type: "name",
//   },
//   {
//     icon: <User2 color="#013d25" size={16} variant="Outline" />,
//     title: "Next of Kin",
//     route: "/kin-details",
//     type: "kin",
//   },
//   {
//     id: 4,
//     icon: <Bank color="#013d25" size={16} variant="Outline" />,
//     title: "Add Bank Details",
//     route: "/information/bank-details",
//     type: "bank",
//   },
//   {
//     id: 5,
//     icon: <Cards color="#013d25" size={16} variant="Outline" />,
//     title: "Bvn Verification",
//     route: "/information/bvn-verification",
//     type: "bvn",
//   },
//   {
//     icon: <SafeHome color="#013d25" size={16} variant="Outline" />,
//     title: "Address Verification",
//     route: "/identity-verification/address-verification",
//     type: "address",
//   },
//   {
//     icon: <User2 color="#013d25" size={16} variant="Outline" />,
//     title: "Identity Verification",
//     route: "/identity-verification/id-verification",
//     type: "identity",
//   },
//   {
//     id: 3,
//     icon: <Photoshop color="#013d25" size={16} variant="Outline" />,
//     title: "Photograph Verification",
//     route: "/identity-verification/photograph-verification",
//     type: "photo",
//   },
// ];
