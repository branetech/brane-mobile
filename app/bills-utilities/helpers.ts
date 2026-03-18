import { z } from "zod";
import type { CablePlan, DataPlan, SelectOption } from "./types";

export const phoneSchema = z
  .string()
  .min(10, "Enter a valid phone number")
  .max(15, "Enter a valid phone number")
  .regex(/^[0-9+]+$/, "Phone must contain digits only");

export const customerIdSchema = z.string().min(6, "This field is required");

export const normalizeKey = (value: string) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const getNetworkImageKey = (value: string) => {
  const key = normalizeKey(value);
  if (key.includes("mtn")) return "mtn";
  if (key.includes("airtel")) return "airtel";
  if (key.includes("glo")) return "glo";
  if (key.includes("9mobile") || key.includes("etisalat")) return "9mobile";
  if (key.includes("spectranet")) return "spectranet";
  if (key.includes("smile")) return "smile-direct";
  return "mtn";
};

export const cleanNetworkLabel = (label: string): string => {
  return label
    .replace(/[-\s]*(data|direct|network)[-\s]*/gi, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const getCableImageKey = (value: string) => {
  const key = normalizeKey(value);
  if (key.includes("dstv")) return "dstv";
  if (key.includes("gotv")) return "gotv";
  if (
    key.includes("startimes") ||
    key.includes("star times") ||
    key.includes("startime")
  )
    return "startimes";
  if (key.includes("showmax")) return "showmax";
  return "";
};

export const getElectricityImageKey = (value: string) => {
  const key = normalizeKey(value);
  if (key.includes("ikeja") || key.includes("ikedc")) return "ikedc";
  if (key.includes("eko") || key.includes("ekedc")) return "ekedc";
  if (key.includes("ibadan") || key.includes("ibedc")) return "ibedc";
  if (key.includes("enugu") || key.includes("eedc")) return "eedc";
  if (key.includes("abuja") || key.includes("aedc")) return "aedc";
  if (key.includes("benin") || key.includes("bedc")) return "bedc";
  if (key.includes("jos") || key.includes("jed")) return "jed";
  if (key.includes("kaduna") || key.includes("kaedco")) return "kaedco";
  if (key.includes("kano") || key.includes("kedco")) return "kedco";
  if (key.includes("port harcourt") || key.includes("phed")) return "phed";
  if (key.includes("yola") || key.includes("yedc")) return "yedc";
  if (key.includes("kedc")) return "kedc";
  return "";
};

export const toArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data?.providers)) return value.data.providers;
  if (Array.isArray(value?.providers)) return value.providers;
  if (Array.isArray(value?.data?.variations)) return value.data.variations;
  if (Array.isArray(value?.variations)) return value.variations;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.records)) return value.data.records;
  if (Array.isArray(value?.records)) return value.records;
  return [];
};

export const normalizeOption = (item: any, index: number): SelectOption => {
  if (typeof item === "string" || typeof item === "number") {
    const value = String(item);
    return { id: value.toLowerCase(), label: value };
  }

  const rawId =
    item?.serviceID ||
    item?.serviceId ||
    item?.service_id ||
    item?.id ||
    item?.code ||
    item?.slug ||
    item?.name ||
    `option-${index}`;
  const rawLabel =
    item?.name ||
    item?.label ||
    item?.serviceName ||
    item?.title ||
    String(rawId).toUpperCase();

  return {
    id: String(rawId).toLowerCase(),
    label: String(rawLabel),
    description: String(item?.provider || item?.service || ""),
  };
};

export const normalizeElectricityProviders = (payload: any): SelectOption[] => {
  const providerMap = payload?.providers || payload?.data?.providers || {};
  const seenIds = new Map<string, number>();

  return Object.keys(providerMap).map((key, index) => {
    const left = String(key || "");
    const right = String(providerMap[key] || "");
    const baseId =
      getElectricityImageKey(`${left} ${right}`) ||
      normalizeKey(left).replace(/\s+/g, "-") ||
      `provider-${index}`;
    const seenCount = seenIds.get(baseId) || 0;
    seenIds.set(baseId, seenCount + 1);
    const uniqueId = seenCount === 0 ? baseId : `${baseId}-${seenCount + 1}`;
    const humanLabel = /\s|-/g.test(left) ? left : right || left;
    const meta = humanLabel === left ? right : left;

    return {
      id: uniqueId,
      label: humanLabel,
      description: meta || `provider-${index}`,
    };
  });
};

export const normalizeDataPlan = (item: any, index: number): DataPlan => {
  const variationCode = String(
    item?.variation_code ||
      item?.variationCode ||
      item?.code ||
      item?.id ||
      `plan-${index}`,
  );

  return {
    id: variationCode,
    label: String(item?.name || item?.plan || item?.variation || variationCode),
    amount: Number(item?.variation_amount || item?.amount || item?.price || 0),
    variationCode,
  };
};

export const normalizeCablePlan = (item: any, index: number): CablePlan => {
  const variationCode = String(
    item?.variation_code ||
      item?.variationCode ||
      item?.code ||
      item?.id ||
      `cable-${index}`,
  );

  return {
    id: variationCode,
    label: String(item?.name || item?.plan || item?.variation || variationCode),
    amount: Number(item?.variation_amount || item?.amount || item?.price || 0),
    variationCode,
    subscriptionType: String(
      item?.subscription_type || item?.subscriptionType || "change",
    ),
  };
};

export const formatMoney = (value: number) =>
  Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
