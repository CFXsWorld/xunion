import { formatCurrency } from '@/utils';
import HealthFactor from '@/components/Borrow/HealthFactor.tsx';
import { useState } from 'react';
import RiskModal from '@/components/Borrow/RiskModal.tsx';
import { Button } from 'antd';
import { XUNION_LENDING_CONTRACT } from '@/contracts';
import { formatUnits } from 'ethers';
import BorrowMode from '@/components/Borrow/BorrowMode.tsx';
import { BorrowModeType } from '@/types/slc.ts';
import { useTranslate } from '@/i18n';

const MarketInfo = ({
  netWorth,
  netApy,
  health,
  refetch,
}: {
  netWorth: bigint;
  netApy: bigint;
  health: number;
  refetch: () => void;
}) => {
  const { t } = useTranslate();

  const options = [
    {
      label: t('x-lending.borrow.mode.high.title'),
      description: t('x-lending.borrow.mode.high.description'),
      value: BorrowModeType.HighLiquidity,
    },
    {
      label: t('x-lending.borrow.mode.risk.title'),
      description: t('x-lending.borrow.mode.risk.description'),
      value: BorrowModeType.RiskIsolation,
    },
    {
      label: t('x-lending.borrow.mode.homogenous.title'),
      description: t('x-lending.borrow.mode.homogenous.description'),
      value: BorrowModeType.Homogenous,
    },
  ];
  const [riskOpen, setRiskOpen] = useState(false);
  return (
    <div className="flex w-full items-center justify-start max-md:flex-row max-md:flex-wrap">
      <RiskModal
        open={riskOpen}
        onClose={() => setRiskOpen(false)}
        userHealthFactor={health}
        contact={{
          ...XUNION_LENDING_CONTRACT.interface,
        }}
      />
      <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px] py-[12px] pr-[16px] max-md:min-w-[160px] max-md:flex-1">
        <span className="text-[16px] text-tc-secondary">
          {t('x-lending.net.worth')}
        </span>
        <span className="text-[20px] font-bold">
          {formatCurrency(Number(formatUnits(netWorth.toString())), true)}
        </span>
      </div>

      <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px] max-md:min-w-[160px] max-md:flex-1">
        <span className="text-[16px] text-tc-secondary">
          {t('x-lending.net.apy')}
        </span>
        <span className="text-[20px] font-bold">{`${Number(netApy.toString()) / 100}%`}</span>
      </div>
      <div className="flex flex-1 justify-between">
        <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px] max-md:min-w-[160px] max-md:flex-1">
          <span className="text-[16px] text-tc-secondary">
            {t('x-lending.health.factor')}
          </span>
          <div className="flex items-end gap-[10px] text-[16px] ">
            <HealthFactor value={`${health}`} />
            <Button
              type="text"
              ghost
              className="text-theme"
              size="small"
              onClick={() => setRiskOpen(true)}
            >
              {t('x-lending.health.risk.detail')}
            </Button>
          </div>
        </div>
        <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px] max-md:min-w-[160px] max-md:flex-1">
          <span className="flex  items-center justify-end text-tc-secondary max-md:justify-start">
            {t('x-lending.borrow.mode')}
          </span>
          <div className="flex items-center justify-end gap-[10px] text-[16px] max-md:justify-start">
            <BorrowMode
              onSuccess={refetch}
              contact={{ ...XUNION_LENDING_CONTRACT.interface }}
              options={options}
              description={t('x-lending.borrow.mode.description')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default MarketInfo;
