import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";

/**
 * Get list of saved beneficiaries
 */
export const getBeneficiaries = async () => {
  try {
    const response = await BaseRequest.get(TRANSACTION_SERVICE.BENEFICIARIES);
    return response?.data || [];
  } catch (error) {
    catchError(error);
    return [];
  }
};

/**
 * Verify recipient account details
 * @param accountNumber - 10-digit account number
 * @param bankCode - Bank code
 */
export const verifyAccountDetails = async (
  accountNumber: string,
  bankCode: string,
) => {
  try {
    const response = await BaseRequest.get(TRANSACTION_SERVICE.VERIFY_ACCOUNT, {
      params: { accountNumber, bankCode },
    });
    return response?.data || null;
  } catch (error) {
    catchError(error);
    return null;
  }
};

/**
 * Get available banks list
 */
export const getBanks = async () => {
  try {
    const response = await BaseRequest.get(TRANSACTION_SERVICE.BANKS);
    return response?.data || [];
  } catch (error) {
    catchError(error);
    return [];
  }
};

export interface SendMoneyPayload {
  recipientName: string;
  accountNumber: string;
  bankCode: string;
  amount: number;
  remark?: string;
  paymentMethod: string;
  addToBeneficiaries?: boolean;
}

/**
 * Send money transfer
 */
export const sendMoney = async (payload: SendMoneyPayload) => {
  try {
    const response = await BaseRequest.post(
      "/transactions-service/banking-info/transfer",
      payload,
    );
    return response?.data || response;
  } catch (error) {
    catchError(error);
    throw error;
  }
};

/**
 * Get wallet balance
 */
export const getWalletBalance = async () => {
  try {
    const response = await BaseRequest.get(TRANSACTION_SERVICE.BALANCE);
    return response?.data || { balance: 0 };
  } catch (error) {
    catchError(error);
    return { balance: 0 };
  }
};

/**
 * Add a new beneficiary
 */
export interface AddBeneficiaryPayload {
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
}

export const addBeneficiary = async (payload: AddBeneficiaryPayload) => {
  try {
    const response = await BaseRequest.post(
      TRANSACTION_SERVICE.BENEFICIARIES,
      payload,
    );
    return response?.data || response;
  } catch (error) {
    catchError(error);
    throw error;
  }
};
