'use client'
import BackBtn from "@/components/BackBtn";
import CustomButton from "@/components/Button";
import React, { useEffect, useState } from "react";
import styles from "@/components/Button/style.module.css";
import { Gtb, PlusIcon } from "@/components/Svgs";
import { BraneCustomRadio } from "@/components";
import { RadioGroup } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useRequest } from "@/services/useRequest";

const BankAcc = ({
  onSubmit,
  onAccountSelect,
  inputAmount,
  isLoading,
  error,
  onClick,
}: {
  onSubmit: any;
  error: string | null;
  isLoading: boolean;
  inputAmount: number;
  onAccountSelect: (account: any, code: string) => void;
  onClick?: any;
}) => {
  const router = useRouter();
  const [selectedAccount, setSelectedAccount] = useState<any>();
  const [errorMessage, setErrorMessage] = useState<string | null>(error);
  const [errorMessageVisible, setErrorMessageVisible] = useState<boolean>(
    !!error
  );

  const { data: bankDetails } = useRequest("/transactions-service/banking-info/accounts", {
    initialValue: [],
  });

  const handleRadioChange = (account: any) => {
    setSelectedAccount(account);
    onAccountSelect(account.accountNumber, account.bankCode);
  };

  useEffect(() => {
    if (error !== null) {
      setErrorMessage(error);
      setErrorMessageVisible(true);
      setTimeout(() => {
        setErrorMessageVisible(false);
      }, 3000);
    }
  }, [error]);
  return (
    <div className="flex flex-col p-[5%] gap-6">
      <BackBtn onClick={onClick} />
      <div>
        {errorMessageVisible || errorMessage !== null ? (
          <div className="bg-[#A90109] p-4 text-start rounded-xl h-[50px] w-full">
            <h6 className="text-white text-[12px]">{errorMessage}</h6>
          </div>
        ) : null}
        <h1 className="text-[20px]">Choose bank account</h1>
        <p>Select or add a bank account to complete your transactions.</p>
      </div>
      <div className="pb-7 border-b-1 border-[#F7F7F8]">
        <CustomButton
          className={`${styles.btn} bg-[#D2F1E4] h-[50px] w-full rounded-xl mt-4 text-[#013D25]`}
          title="Add a New Bank"
          type="submit"
          onClick={() => router.push("/wallet/add-bank")}
          leftContent={<PlusIcon />}
        />
      </div>
      <RadioGroup size="lg" value={selectedAccount} onChange={handleRadioChange}>
        {bankDetails.map((account: any, index: number) => (
          <BraneCustomRadio
            key={index}
            value={account}
            description={`${account.bankName} • ${account.accountNumber}`}
            img={<Gtb />}
            className={`border-2 border-gray-300 rounded-lg ${
              selectedAccount === account ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleRadioChange(account)}
          >
            {account?.accountName}
          </BraneCustomRadio>
        ))}
      </RadioGroup>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-10 px-4 max-w-[480px] mx-auto">
        <CustomButton
          title={`Withdraw (₦${inputAmount})`}
          className={`${styles.btn} ${selectedAccount ? "bg-[#013D25]" : "bg-[#AABEB6]"} text-[#D2F1E4] w-full rounded-xl h-[50px]`}
          onClick={onSubmit}
          isLoading={isLoading}
        />
		</div>
      </div>
  );
};

export default BankAcc;
