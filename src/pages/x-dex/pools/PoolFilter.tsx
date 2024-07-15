import { cn } from '@/utils/classnames.ts';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const tabs = [
  {
    label: 'All Pools',
    value: '0',
  },
  {
    label: 'My Pools',
    value: '1',
  },
];

const PoolFilter = ({
  poolType,
  onPoolChange,
  onSearch,
}: {
  poolType: string;
  onPoolChange: (value: string) => void;
  onSearch: (value: string) => void;
}) => {
  return (
    <div className="flex-center-between mb-[20px] mt-[32px]">
      <div className="flex-center gap-[40px]">
        {(tabs || []).map((tab) => (
          <div
            key={tab.value}
            onClick={() => {
              onPoolChange(tab.value);
            }}
            className={cn(
              'flex-center h-[40px] gap-[12px] rounded-[20px] px-[16px] ',
              poolType === tab.value
                ? 'pointer-events-none bg-theme-non-opaque text-theme'
                : 'cursor-pointer hover:bg-theme-non-opaque hover:text-theme '
            )}
          >
            <span>{tab.label}</span>
          </div>
        ))}
      </div>
      <div className="w-[300px]">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search name"
          className="rounded-[20px]"
          onBlur={(e) => {
            onSearch(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default PoolFilter;
