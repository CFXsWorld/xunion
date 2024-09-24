import AmountCard from '@/components/AmountCard.tsx';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PoolList from '@/pages/x-dex/pools/PoolList.tsx';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@/i18n';
import PoolFilter from './PoolFilter';
import { useState } from 'react';
import MyPoolList from './MyPoolList';

function Pools() {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [poolType, setPoolType] = useState('0');
  const onPoolChange = (type: string) => {
    setPoolType(type);
  };
  return (
    <div className="mt-[30px] flex  min-h-[420px]  flex-col items-center p-[20px] max-md:mt-0 max-md:p-[16px] max-md:pb-[80px]">
      <div className="max-md:mx-0 max-md:w-[calc(100%)] md:min-w-[1200px]">
        <div className="flex-center-between pb-[32px]">
          <span className="text-[24px] font-bold">
            {t('x-dex.pools.title')}
          </span>
          <Button
            icon={<PlusOutlined />}
            className="rounded-[20px]"
            type="primary"
            onClick={() => {
              navigate('/x-dex/create-pool');
            }}
          >
            {t('x-dex.pools.create')}
          </Button>
        </div>
        <div className=" flex w-full flex-wrap items-center gap-[30px] max-md:flex-col">
          <AmountCard
            title={t('common.tvl')}
            amount={27812312}
            loading={false}
            className="w-auto flex-1"
          />
          <AmountCard
            title={t('x-dex.pools.volume.24H')}
            amount={78123123.144}
            loading={false}
            className="w-auto flex-1"
          />
        </div>
        <div>
          <PoolFilter poolType={poolType} onPoolChange={onPoolChange} />
          {poolType === '0' ? <PoolList /> : <MyPoolList />}
        </div>
      </div>
    </div>
  );
}

export default Pools;
