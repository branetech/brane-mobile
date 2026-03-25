import { LockedFundsData } from "@/utils/constants";
import React from "react";

const PRIMARY_COLOR = "#0088FF";
const GRAY_TEXT_COLOR = "#85808A";

interface LockedFundsCardProps {
  data: LockedFundsData;
}

const LockedFundsCard: React.FC<LockedFundsCardProps> = ({ data }) => {
  const {
    totalLiquidityDays,
    remainingLiquidityDays,
    tenureDays,
    interestRate,
  } = data;

  const progressPercentage = ((totalLiquidityDays - remainingLiquidityDays) / totalLiquidityDays) * 100;
  const safeProgressPercentage = Math.max(0, Math.min(100, progressPercentage));

  return (
    <div className="mt-5 bg-[#F5FAFF]">
      <div className="p-3 border border-[#0088FF] rounded-md">
        <p className="text-sm font-normal mb-2">
          You have{" "}
          <span className={`font-normal text-[#0B0014]`}>
            {remainingLiquidityDays} days
          </span>{" "}
          to liquidity period
        </p>

        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full`}
            style={{ 
                width: `${safeProgressPercentage}%`,
                backgroundColor: PRIMARY_COLOR,
              }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center space-x-1">
            <span className={GRAY_TEXT_COLOR}>Tenure:</span>
            <span className="font-medium text-sm text-[#0B0014]">{tenureDays} days</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={GRAY_TEXT_COLOR}>Interest:</span>
            <span className="font-medium text-sm text-[#0B0014]">{interestRate}% p.a</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockedFundsCard;
