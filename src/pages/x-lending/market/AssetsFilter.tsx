import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const AssetsFilter = () => {
  return (
    <div className="flex-center-between mb-[20px] mt-[32px]">
      <div className="flex-center gap-[40px]">Assets</div>
      <div className="w-[300px]">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search name"
          className="rounded-[20px]"
        />
      </div>
    </div>
  );
};

export default AssetsFilter;
