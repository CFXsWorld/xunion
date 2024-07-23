import ChainSelector from '@/pages/x-lending/dashboad/ChainSelector.tsx';
import MarketInfo from './MarketInfo.tsx';
import useDashboard from '@/pages/x-lending/hooks/useDashboard.ts';
import AssetsList from './AssetsList.tsx';

function LendingMarket() {
  const { lendingAssets, loading, netWorth, netApy, health } = useDashboard();
  return (
    <div className="mt-[30px] flex  flex-col items-center p-[20px] ">
      <div className="w-full max-w-[1200px]  overflow-hidden max-md:mx-[20px]">
        <div className="flex-center-between pb-[20px]">
          <ChainSelector />
        </div>
        <div className="flex-center-between pb-[20px]">
          <MarketInfo netWorth={netWorth} netApy={netApy} health={health} />
        </div>
        <div className="flex w-full gap-[24px]">
          <AssetsList assets={lendingAssets} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default LendingMarket;
