import { Popover, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import useCollateral from '@/pages/x-super-libra-coin/hooks/useCollateral.ts';
import { cn } from '@/utils/classnames.ts';
import { SpinIcon, TokenIcon } from '@/components/icons';
import { SLCAsset } from '@/types/slc.ts';
import { useState } from 'react';

const TokenGroupSelector = ({
  value,
  onChange,
}: {
  value?: SLCAsset;
  onChange: (token: SLCAsset) => void;
}) => {
  const { assets, isAssetsLoading } = useCollateral();
  const [open, onOpen] = useState(false);
  return (
    <Popover
      placement="bottom"
      open={open}
      onOpenChange={onOpen}
      content={
        <Spin spinning={isAssetsLoading} indicator={<SpinIcon />}>
          <div className="h-[250px] w-[450px] overflow-y-auto">
            <div className="my-[10px] flex flex-col gap-[10px] ">
              {(assets || []).map((item) => (
                <div
                  className={cn(
                    'flex-center cursor-pointer gap-[10px] rounded-[12px] px-[10px] ',
                    {
                      'cursor-not-allowed  bg-fill-niubi opacity-45':
                        item.max_deposit_amount === '0',
                    },
                    {
                      'hover:bg-theme-non-opaque hover:opacity-75':
                        item.max_deposit_amount !== '0',
                    }
                  )}
                  key={item.symbol}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onChange(item);
                    onOpen(false);
                  }}
                >
                  <div className="h-full w-[30px]">
                    <TokenIcon src={item.icon} width={30} height={30} />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-[14px]"> {item.name}</span>
                    <span className="text-[12px] text-tc-secondary">
                      {item.symbol}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-[20px]"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <span>{item.balance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Spin>
      }
      arrow={false}
      trigger={['click']}
    >
      <div
        className="flex h-[62px] cursor-pointer justify-between rounded-[12px] bg-fill-niubi2 px-[16px]"
        onClick={() => {
          onOpen(true);
        }}
      >
        <div className="flex items-center text-[14px] text-tc-secondary">
          Select isolation asset
        </div>
        <div className="flex-center gap-[5px]">
          {value?.symbol ? (
            <div className="flex-center gap-[5px]">
              <span className="flex-center text-[22px]">
                <TokenIcon src={value.icon} />
              </span>
              <span className="text-[14px]">{value?.symbol}</span>
            </div>
          ) : (
            <span className="text-[16px]">Select a token</span>
          )}
          <DownOutlined className="text-[14px]" />
        </div>
      </div>
    </Popover>
  );
};

export default TokenGroupSelector;
