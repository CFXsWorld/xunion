import LendingCard from '@/components/LendingCard.tsx';
import { ColumnType } from 'antd/es/table';
import { Button } from 'antd';
import { LendingAsset } from '@/types/Lending.ts';
import { useState } from 'react';
import LendingModal from '@/pages/x-lending/dashboad/LendingModal.tsx';
import ResponsiveTable from '@/components/ResponsiveTable.tsx';
import TokenWithIcon from '@/components/TokenWithIcon.tsx';
import AmountWithPrice from '@/components/AmountWithPrice.tsx';
import { useTranslate } from '@/i18n';

const Borrows = ({
  assets,
  loading,
  health,
  refetch,
}: {
  assets: LendingAsset[];
  loading: boolean;
  health: number;
  refetch: () => void;
}) => {
  const { t } = useTranslate();
  const [lendingItem, setLendingItem] = useState<LendingAsset>();
  const columns: ColumnType<LendingAsset>[] = [
    {
      title: t('x-lending.asset'),
      dataIndex: 'asset',
      render: (_: string, record: LendingAsset) => {
        return <TokenWithIcon token={record.token} />;
      },
    },
    {
      title: t('x-lending.available'),
      dataIndex: 'balance',
      render: (_: string, record: LendingAsset) => {
        return (
          <AmountWithPrice
            amount={record?.availableAmount}
            price={record?.availableTotalPrice}
          />
        );
      },
    },
    {
      title: t('x-lending.rate'),
      dataIndex: 'apy',
      render: (_: string, record: LendingAsset) => {
        return (
          <div className="flex flex-col gap-[5px]">
            <span>{`≈ ${record.lendingInterest}%`}</span>
          </div>
        );
      },
    },
    {
      align: 'right',
      dataIndex: 'action',
      render: (_: string, record: LendingAsset) => {
        return (
          <div className="flex  items-center justify-end gap-[5px]">
            <Button
              type="primary"
              className="rounded-[8px] text-[12px] max-md:h-[32px] max-md:flex-1 max-md:rounded-[16px]"
              size="small"
              disabled={!record.availableAmount}
              onClick={() => {
                setLendingItem(record);
              }}
            >
              {t('x-lending.borrow')}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <LendingCard title={t('x-lending.assets.borrow')} loading={loading}>
      {lendingItem && (
        <LendingModal
          asset={lendingItem}
          refresh={() => {
            refetch();
            setLendingItem(undefined);
          }}
          userHealthFactor={health}
          onClose={() => {
            setLendingItem(undefined);
          }}
        />
      )}
      <ResponsiveTable
        columns={columns}
        dataSource={assets}
        size="middle"
        rowKey="id"
      />
    </LendingCard>
  );
};

export default Borrows;
