"use client";
import CustomButton from "@/components/Button";
import Header from "@/components/Header";
import { Option, renderSliderCard } from "@/components/InvestmentTriggerModals/AISallyModal";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { showSuccess } from "@/utils/helpers";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SliderValues {
  stockAsset: number;
  goldAsset: number;
  fixedIncome: number;
  indexFund: number;
}

const BracsAllocation = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [stockAssets, setStockAssets] = useState<number>(25);
  const [goldAssets, setGoldAssets] = useState<number>(25);
  const [fixedIncome, setFixedIncome] = useState<number>(25);
  const [indexFunds, setIndexFunds] = useState<number>(25);
  const [isAiTradesEnabled, setIsAiTradesEnabled] = useState(false);

  const {
    data: allocatedBracsResponse,
    mutate: mutateBracs_allocation,
    isLoading: isLoadingBracs,
  } = useRequest(TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION, {});

  useEffect(() => {
    if (allocatedBracsResponse && !isLoadingBracs) {
      setStockAssets(allocatedBracsResponse.stockAsset || 0);
      setGoldAssets(allocatedBracsResponse.goldAsset || 0);
      setFixedIncome(allocatedBracsResponse.fixedIncome || 0);
      setIndexFunds(allocatedBracsResponse.indexFund || 0);
    }
  }, [allocatedBracsResponse, isLoadingBracs]);

  const isValid = stockAssets + goldAssets + fixedIncome + indexFunds === 100;

  const handleSave = async () => {
    setLoading(true);
    try {
      await BaseRequest.put(TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION, {
        stockAsset: stockAssets,
        goldAsset: goldAssets,
        fixedIncome,
        indexFund: indexFunds,
        allocationType: "do-it-yourself"
      });
      showSuccess("Bracs Allocation Settings Saved Successfully");
      await mutateBracs_allocation();
    } catch (err) {
      catchError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col px-[5%] pb-5 gap-5">
      <Header handleBackPress={router.back} title="Bracs Allocation" />
      <p className="text-xs text-[#85808A]  font-light">
        Preset your Bracc distribution across available assets. Bracc will be
        <span className="text-black font-normal"> distributed in %</span>{" "}
        according to your setting.
      </p>

      {isLoadingBracs ? (
        <div className="flex justify-center items-center  w-full">
          <Spinner color="primary" />
        </div>
      ) : (
        <div className="space-y-0">
          {renderSliderCard("Stock assets", stockAssets, setStockAssets)}
          {renderSliderCard("Gold assets", goldAssets, setGoldAssets)}
          {renderSliderCard("Fixed income", fixedIncome, setFixedIncome)}
          {renderSliderCard("Index funds", indexFunds, setIndexFunds)}
        </div>
      )}

      {!isLoadingBracs &&
        stockAssets + goldAssets + fixedIncome + indexFunds !== 100 && (
          <p className="text-red-500 text-sm mt-2 text-center">
            <span className="font-semibold text-base">
              Current: {stockAssets + goldAssets + fixedIncome + indexFunds}%
            </span>
          </p>
        )}

      <div>
        <Option
          title="AI Recommended Trades"
          description="Enable or disable AI recommended trades"
          isSwitch={true}
          isSelected={isAiTradesEnabled}
          onChange={() => setIsAiTradesEnabled(!isAiTradesEnabled)}
          value={isAiTradesEnabled}
        />
      </div>


      <div className="w-full flex flex-1 items-end justify-end">
        <CustomButton
          aria-label="Save"
          className={`${isValid
              ? "bg-[#013D25] dark:bg-[#D2F1E4] dark:text-[#013D25]"
              : "bg-[#AABEB6] dark:bg-[#46504C] dark:text-[#8CA198]"
            } rounded-xl text-softGreen-500  w-full`}
          title="Save Settings"
          disabled={
            !isValid ||
            stockAssets + goldAssets + fixedIncome + indexFunds !== 100
          }
          type="submit"
          onClick={handleSave}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default BracsAllocation;
