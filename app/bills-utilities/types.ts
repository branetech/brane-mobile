export type UtilityService =
  | "airtime"
  | "data"
  | "betting"
  | "cable"
  | "electricity"
  | "transportation";

export type SelectOption = {
  id: string;
  label: string;
  description?: string;
};

export type Beneficiary = {
  id: string;
  name: string;
  phone: string;
  networkProvider?: string;
};

export type DataPlan = {
  id: string;
  label: string;
  amount: number;
  variationCode: string;
};

export type CablePlan = {
  id: string;
  label: string;
  amount: number;
  variationCode: string;
  subscriptionType: string;
};

export const AMOUNT_PRESETS = [
  "500",
  "1000",
  "2000",
  "4000",
  "5000",
  "10000",
  "20000",
  "50000",
];

export const NETWORK_ORDER = [
  "mtn",
  "airtel",
  "9mobile",
  "etisalat",
  "glo",
  "smile",
];

export const ELECTRICITY_PRODUCTS = ["prepaid", "postpaid"];
export const ELECTRICITY_AMOUNTS = ["5000", "10000", "20000", "50000"];
export const BOOST_PRESETS = ["0", "50", "100", "200"];

export const TRANSPORT_KEYWORDS = [
  "transport",
  "bus",
  "rail",
  "metro",
  "brt",
  "train",
];

export const NETWORK_IMAGES: Record<string, any> = {
  mtn: require("@/assets/images/network/mtn.png"),
  mtnn: require("@/assets/images/network/mtn.png"),
  airtel: require("@/assets/images/network/airtel.png"),
  glo: require("@/assets/images/network/glo.png"),
  "9mobile": require("@/assets/images/network/9mobile.png"),
  etisalat: require("@/assets/images/network/9mobile.png"),
  "smile-direct": require("@/assets/images/network/smile-direct.png"),
  smile: require("@/assets/images/network/smile-direct.png"),
  spectranet: require("@/assets/images/network/spectranet.png"),
};

export const CABLE_IMAGES: Record<string, any> = {
  dstv: require("@/assets/images/network/dstv.png"),
  gotv: require("@/assets/images/network/gotv.png"),
  startimes: require("@/assets/images/network/startimes.png"),
  showmax: require("@/assets/images/network/showmax.png"),
};

export const ELECTRICITY_IMAGES: Record<string, any> = {
  aedc: require("@/assets/images/network/aedc.png"),
  bedc: require("@/assets/images/network/bedc.png"),
  eedc: require("@/assets/images/network/eedc.png"),
  ekedc: require("@/assets/images/network/ekedc.png"),
  ibedc: require("@/assets/images/network/ibedc.png"),
  ikedc: require("@/assets/images/network/ikedc.png"),
  jed: require("@/assets/images/network/jed.png"),
  kaedco: require("@/assets/images/network/kaedco.png"),
  kedc: require("@/assets/images/network/kedc.png"),
  kedco: require("@/assets/images/network/kedco.png"),
  phed: require("@/assets/images/network/phed.png"),
  yedc: require("@/assets/images/network/yedc.png"),
};
