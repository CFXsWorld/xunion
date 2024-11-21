import AmountCard from '@/components/AmountCard.tsx';
import useBorrow from '@/pages/x-super-libra-coin/hooks/useBorrow.ts';
import { useTranslate } from '@/i18n';
import { formatCurrency } from '@/utils';
import MintSLC from './mint';
import BurnSLC from './burn';

const XLibraUSD = () => {
  const { isOverviewLoading, tvlAmount, totalSupply, unitPrice, sentinel } =
    useBorrow();
  const { t } = useTranslate();
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center pt-[40px] max-md:pt-[40px] "
      key={sentinel}
    >
      <div className="mt-[30px] min-h-[420px]  w-full p-[20px] max-md:mx-0 max-md:p-[16px] max-md:pb-[80px] md:max-w-[1200px]">
        <div className="flex items-center justify-between max-md:flex-col max-md:gap-[10px]">
          <AmountCard
            title={t('common.tvl')}
            amount={formatCurrency(tvlAmount, false, 0)}
            loading={isOverviewLoading}
          />
          <AmountCard
            title={t('x-super-libra-coin.slc.supply')}
            amount={formatCurrency(totalSupply, false, 0)}
            loading={isOverviewLoading}
          />
          <AmountCard
            title="xUSD"
            amount={formatCurrency(unitPrice, false, 0)}
            loading={isOverviewLoading}
          />
        </div>
        <div className="mt-[30px] flex flex-wrap gap-[20px]">
          <MintSLC />
          <BurnSLC />
        </div>
      </div>
    </div>
  );
};

export default XLibraUSD;
