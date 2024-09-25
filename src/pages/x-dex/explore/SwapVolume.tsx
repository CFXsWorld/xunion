import MagicCard from '@/components/MagicCard.tsx';
import TimePicker from '@/components/TimePicker.tsx';
import { times } from '@/pages/x-dex/explore/times.ts';
import VolumeBar from '@/pages/x-dex/explore/charts/VolumeBar.tsx';
import { useTranslate } from '@/i18n';
import { Recently, TokenVolume } from '@/types/explore';
import { useEffect, useMemo, useState } from 'react';
import { formatLargeNumber } from '@/utils';
import { formatUnits } from 'ethers';

const SwapVolume = ({
  data,
  getData,
}: {
  data: TokenVolume[];
  getData: (params: { recently?: Recently }) => void;
}) => {
  const { t } = useTranslate();
  const [recently, setRecently] = useState<Recently | undefined>(Recently.day);
  useEffect(() => {
    getData({ recently });
  }, [recently]);
  const total = useMemo(() => {
    const sum = (data || []).reduce(
      (prev, next) => prev + Number(formatUnits(next.amount)),
      0
    );
    return formatLargeNumber(sum, 4);
  }, [data]);
  return (
    <MagicCard>
      <div className="flex flex-col py-[16px]">
        <div className="flex-center-between">
          <span className="text-[16px] text-tc-secondary">
            {t('common.volume')}
          </span>
          <TimePicker
            options={times}
            onTimeChange={(v) => {
              setRecently(v as Recently);
            }}
            time={recently as string}
          />
        </div>
        <div className="mt-[10px] flex flex-col">
          <span className="text-[28px] font-[500]">${total}</span>
          <div>
            <VolumeBar recently={recently} data={data} />
          </div>
        </div>
      </div>
    </MagicCard>
  );
};

export default SwapVolume;
