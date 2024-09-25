import { ColumnType } from 'antd/es/table';
import { SwapIcon, TokenIcon } from '@/components/icons';
import { formatCurrency } from '@/utils';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { Popover, Skeleton } from 'antd';
import TimePicker from '@/components/TimePicker.tsx';
import { PoolType } from '@/types/pool.ts';
import { formatUnits } from 'ethers';
import { useNavigate } from 'react-router-dom';
import ResponsiveTable from '@/components/ResponsiveTable.tsx';
import ResponsiveButton from '@/components/ResponsiveButton.tsx';
import { useTranslate } from '@/i18n';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getAllPools } from '@/services/pool';

const PoolList = () => {
  const navigate = useNavigate();

  const { t } = useTranslate();

  const [time, setTime] = useState('24H');
  const { data, mutate, isPending } = useMutation({ mutationFn: getAllPools });
  useEffect(() => {
    mutate({ pageNum: 1, pageSize: 100 });
  }, []);

  const onTimeChange = (time?: string) => {
    setTime(time as string);
    mutate({ pageNum: 1, pageSize: 100 });
  };

  const pools = data?.items || [];
  const total = data?.total || 0;

  const columns: ColumnType<PoolType>[] = [
    {
      title: t('common.name'),
      dataIndex: 'tokenA',
      width: 240,
      render: (_: string, record: PoolType) => {
        return (
          <div className="flex  gap-[10px]">
            <span className="flex">
              <TokenIcon src={record.tokenA.icon} width={20} height={20} />
              <TokenIcon src={record.tokenB.icon} width={20} height={20} />
            </span>
            <span>{`${record.tokenA.symbol} / ${record.tokenB.symbol}`}</span>
          </div>
        );
      },
    },
    {
      title: t('common.tvl'),
      dataIndex: 'tvl',
      width: 240,
      render: (_: string, record: PoolType) => {
        return (
          <div className="flex flex-col gap-[5px]">
            {formatCurrency(Number(formatUnits(record?.tvl || 0n)), true)}
          </div>
        );
      },
    },
    {
      title: t('common.volume24h'),
      dataIndex: 'volume24h',
      width: 240,
      render: (_: string, record: PoolType) => {
        return (
          <div className="flex flex-col gap-[5px]">
            {formatCurrency(Number(formatUnits(record?.volume24h || 0n)), true)}
          </div>
        );
      },
    },
    {
      title: t('common.fees24h'),
      dataIndex: 'fees',
      align: 'center',
      // render: (value: string) => (
      //   <div className="flex flex-col gap-[5px]">
      //     {formatCurrency(Number(formatUnits(value || 0n)), true)}
      //   </div>
      // ),
    },
    // {
    //   title: t('common.APR24h'),
    //   dataIndex: 'apr',
    //   align: 'center',
    //   render: (value: string) => value || '-',
    // },
    {
      dataIndex: 'action',
      render: (_: string, record: PoolType) => {
        const Buttons = (
          <div className="flex  flex-col gap-[5px] max-md:flex-row">
            <ResponsiveButton
              className="md:text-left md:text-primary"
              onClick={() => {
                navigate(
                  `/x-dex/liquidity?tokena=${record.tokenA.address}&tokenb=${record.tokenB.address}`
                );
              }}
              icon={<PlusOutlined />}
            >
              {t('x-dex.liquidity.add')}
            </ResponsiveButton>
            <ResponsiveButton
              className="md:text-left md:text-primary"
              onClick={() => {
                navigate(
                  `/x-dex/swap?tokena=${record.tokenA.address}&tokenb=${record.tokenB.address}`
                );
              }}
              icon={<SwapIcon />}
            >
              {t('x-dex.swap.title')}
            </ResponsiveButton>
          </div>
        );
        return (
          <>
            <div className="md:hidden">{Buttons}</div>
            <div className="max-md:hidden">
              <Popover title={Buttons} trigger={['click']}>
                <EllipsisOutlined className="cursor-pointer text-[20px]" />
              </Popover>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="bg-fill-niubi">
        <div className="flex-center-between p-[15px]">
          <div className="flex-center gap-[5px]">
            <span className="text-[18px] font-bold">
              {t('x-dex.pools.label')}
            </span>
            <span className="text-tc-secondary">{`(${total})`}</span>
          </div>
          <TimePicker
            time={time}
            onTimeChange={onTimeChange}
            options={[
              {
                label: '24H',
                value: '24H',
              },
              {
                label: '7D',
                value: '7D',
              },
              {
                label: '30D',
                value: '30D',
              },
            ]}
          />
        </div>
        {isPending ? (
          <div className="p-[24px]">
            <Skeleton active />
          </div>
        ) : (
          <ResponsiveTable columns={columns} dataSource={pools} rowKey="id" />
        )}
      </div>
    </div>
  );
};

export default PoolList;
