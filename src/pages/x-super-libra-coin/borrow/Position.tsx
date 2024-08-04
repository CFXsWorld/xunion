import { Button, Skeleton } from 'antd';
import { useState } from 'react';
import { formatCurrency } from '@/utils';
import usePosition from '@/pages/x-super-libra-coin/hooks/usePosition.ts';
import BorrowSLCModal from '@/pages/x-super-libra-coin/borrow/BorrowSLCModal.tsx';
import RepaySLCModal from '@/pages/x-super-libra-coin/borrow/RepaySLCModal.tsx';
import RiskModal from '@/components/Borrow/RiskModal.tsx';
import BorrowMode from '@/components/Borrow/BorrowMode.tsx';
import HealthFactor from '@/components/Borrow/HealthFactor.tsx';
import { XUNION_SLC_CONTRACT } from '@/contracts';
import { BorrowModeType } from '@/types/slc.ts';
import { cn } from '@/utils/classnames.ts';

const options = [
  {
    label: 'High liquidity mode',
    description: 'Use high liquidity collateral for borrowing',
    value: BorrowModeType.HighLiquidity,
  },
  {
    label: 'Risk isolation mode',
    description: 'Only use one high-risk asset to borrow SLC',
    value: BorrowModeType.RiskIsolation,
  },
];
const Position = ({
  health,
  loading,
  refresh,
}: {
  health: bigint[];
  loading: boolean;
  refresh: () => void;
}) => {
  const {
    userAssetsValue,
    userAvailableAmount,
    userBorrowedAmount,
    borrowedTotalPrice,
    availableTotalPrice,
    healthFactor,
  } = usePosition({ health });
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [repayOpen, setRepayOpen] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);
  return (
    <div className="w-full rounded-[16px] bg-fill-niubi">
      {loading ? (
        <div className="p-[24px]">
          <Skeleton active />
        </div>
      ) : (
        <div className="flex flex-col">
          <RiskModal
            open={riskOpen}
            onClose={() => setRiskOpen(false)}
            userHealthFactor={healthFactor}
            contact={{
              abi: XUNION_SLC_CONTRACT.interface.abi,
              address: XUNION_SLC_CONTRACT.interface.address,
            }}
          />
          <BorrowSLCModal
            open={borrowOpen}
            onClose={() => setBorrowOpen(false)}
            availableAmount={userAvailableAmount}
            refresh={refresh}
            userHealthFactor={healthFactor}
          />
          <RepaySLCModal
            open={repayOpen}
            onClose={() => setRepayOpen(false)}
            availableAmount={userBorrowedAmount}
            refresh={refresh}
            userHealthFactor={healthFactor}
          />
          <div
            className={cn(
              'flex h-[64px] items-center justify-between border-2 border-solid  border-transparent border-b-line-primary px-[24px]',
              'max-md:h-auto max-md:flex-col max-md:items-start max-md:justify-start max-md:gap-[16px] max-md:px-[16px] max-md:py-[16px]'
            )}
          >
            <div className="flex-center gap-[30px]">
              <span className="font-[500]">Position Management</span>
            </div>
            <div className="flex-center gap-[10px]">
              <Button
                type="primary"
                shape="round"
                disabled={!userAvailableAmount}
                onClick={() => {
                  setBorrowOpen(true);
                }}
              >
                Borrow
              </Button>
              <Button
                type="primary"
                shape="round"
                ghost
                disabled={!userBorrowedAmount}
                onClick={() => setRepayOpen(true)}
              >
                Repay
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap justify-between p-[24px] max-md:px-[16px] ">
            <div className="flex flex-col max-md:gap-[10px] max-md:py-[16px]">
              <span className="flex h-[52px] justify-center text-tc-secondary max-md:h-[auto] max-md:items-start">
                Collateral value
              </span>
              <div className="text-[16px]">
                {formatCurrency(userAssetsValue, false)}
              </div>
            </div>

            <div className="flex flex-col max-md:gap-[10px] max-md:py-[16px] ">
              <span className="flex h-[52px] items-center text-tc-secondary max-md:h-[auto] max-md:items-start">
                Borrowed value
              </span>
              <div className="flex flex-col text-[16px]">
                <span> {formatCurrency(userBorrowedAmount, false)} SLC</span>
                <span className="text-[12px] text-tc-secondary">
                  {formatCurrency(borrowedTotalPrice)}
                </span>
              </div>
            </div>
            <div className="flex flex-col max-md:gap-[10px] max-md:py-[16px]">
              <span className="flex h-[52px] items-center text-tc-secondary max-md:h-[auto] max-md:items-start">
                Available to borrow
              </span>
              <div className="flex flex-col text-[16px]">
                <span> {formatCurrency(userAvailableAmount, false)} SLC</span>
                <span className="text-[12px] text-tc-secondary">
                  {formatCurrency(availableTotalPrice)}
                </span>
              </div>
            </div>
            <div className="flex flex-col max-md:gap-[10px] max-md:py-[16px]">
              <span className="flex h-[52px] items-center text-tc-secondary max-md:h-[auto] max-md:items-start">
                Health Factor
              </span>
              <div className="flex items-center gap-[10px] text-[16px]">
                <HealthFactor value={`${healthFactor}`} />
                <Button
                  type="text"
                  ghost
                  className="text-theme"
                  size="small"
                  onClick={() => setRiskOpen(true)}
                >
                  Rist detail
                </Button>
              </div>
            </div>
            <div className="flex flex-col max-md:gap-[10px] max-md:py-[16px]">
              <span className="flex h-[52px] items-center justify-end text-tc-secondary max-md:h-[auto] max-md:justify-start">
                Borrow mode
              </span>
              <div className="flex items-center gap-[10px] text-[16px]">
                <BorrowMode
                  onSuccess={refresh}
                  contact={{ ...XUNION_SLC_CONTRACT.interface }}
                  options={options}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Position;
