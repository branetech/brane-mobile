import { useEffect, useState } from "react";
import BraneSDK from "./brane-sdk";

export type BracModel = "model1" | "model2" | "model3";
export type ServiceProvider = "interswitch" | "vtpass";
export type ServiceType =
  | "electricity"
  | "data"
  | "airtime"
  | "cable"
  | "betting";
export type AirtimeDataService =
  | "mtn"
  | "airtel"
  | "glo"
  | "9mobile"
  | "startimes"
  | "showmax";

export type ElectricityService =
  | "abedc"
  | "aedc"
  | "bedc"
  | "ekedc"
  | "eedc"
  | "ibedc"
  | "ikedc"
  | "jed"
  | "kaedco"
  | "kedco"
  | "phed"
  | "yedc";

export type BettingService =
  | "sportybet"
  | "nairabet"
  | "betway"
  | "1xbet"
  | "merrybet"
  | "betking"
  | "bangbet"
  | "bet9ja"
  | "lotto";

export type gatewayType = "PAYSTACK" | "FCMB";

export interface IBracAllocator {
  amount: number;
  model?: BracModel;
  serviceProvider?: ServiceProvider;
  serviceType: ServiceType;
  serviceId: ElectricityService | AirtimeDataService | BettingService | string;
  gateway?: gatewayType;
}

export interface IBrac {
  gatewayFee: number;
  userPoints: number;
  braneProfit: number;
}

const serviceIdToEnum: Record<string, string> = {
  ikedc: "ikeja-electric",
  smile: "smile-direct",
  ekedc: "eko-electric",
  kedco: "kano-electric",
  phed: "portharcourt-electric",
  jed: "jos-electric",
  ibedc: "ibadan-electric",
  kaedco: "kaduna-electric",
  abedc: "abuja-electric",
  aedc: "abuja-electric", // alias
  eedc: "enugu-electric",
  bedc: "benin-electric",
  aba: "aba-electric",
  yedc: "yola-electric",
};

const enumToServiceId: Record<string, string> = Object.fromEntries(
  Object.entries(serviceIdToEnum).map(([k, v]) => [v, k]),
) as Record<string, string>;

export const stringifyServiceID = (serviceID: string): string => {
  const serviceId = String(enumToServiceId[serviceID] || serviceID);
  return serviceId.replaceAll("-data", "").replaceAll("-direct", "") as string;
};

export const useEarnedBracs = (payload: IBracAllocator) => {
  const [bracs, setState] = useState(0);
  useEffect(() => {
    const onLoad = async () => {
      payload.serviceId = stringifyServiceID(payload.serviceId?.toLowerCase());
      const { bracValue } = BraneSDK.getBracs(payload);
      setState(bracValue);
    };
    onLoad();
  }, [payload]);
  return bracs;
};

export interface iShares {
  bracValue: number;
  rate: number | string;
  commissionVal: number;
  braneProfit: number;
  allocatable: number;
  paymentGatewayFees: number;
}
export const getEarnedBracs = (payload: IBracAllocator): iShares =>
  BraneSDK.getBracs(payload);
