import { NotificationOutlined } from '@ant-design/icons';
import { useTranslate } from '@/i18n';

const Tip = () => {
  const { t } = useTranslate();
  return (
    <div className="mt-[30px] w-[500px]  rounded-[14px]  border border-theme p-[10px] text-[14px] max-md:w-full">
      <span className="pr-[10px] text-theme">
        <NotificationOutlined />
      </span>
      <span>{t('x-super-libra-coin.description')}</span>
    </div>
  );
};

export default Tip;
