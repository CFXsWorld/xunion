import { formatCurrency } from '@/utils';
import { formatNumber } from '@/hooks/useErc20Balance.ts';

const MarketInfo = ({
  totalLendingSize,
  totalDepositSize,
  totalMarketSize,
}: {
  totalLendingSize: number;
  totalDepositSize: number;
  totalMarketSize: number;
}) => {
  return (
    <div className="flex items-center justify-start">
      <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px] py-[12px] pr-[16px]">
        <span className="text-[16px] text-tc-secondary">Total market size</span>
        <span className="text-[20px] font-bold">
          {formatCurrency(formatNumber(totalMarketSize, 6), true)}
        </span>
      </div>

      <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px]  ">
        <span className="text-[16px] text-tc-secondary">Total available</span>
        <span className="text-[20px] font-bold">
          {formatCurrency(formatNumber(totalLendingSize, 6), true)}
        </span>
      </div>
      <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px]  ">
        <span className="text-[16px] text-tc-secondary">Total borrows</span>
        <span className="text-[20px] font-bold">
          {formatCurrency(formatNumber(totalDepositSize, 6), true)}
        </span>
      </div>
    </div>
  );
};
export default MarketInfo;
