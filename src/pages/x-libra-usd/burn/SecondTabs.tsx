import { Link } from 'react-router-dom';
import { cn } from '@/utils/classnames.ts';
import { useTranslate } from '@/i18n';

const SecondTabs = ({ active }: { active: 'Mint' | 'Burn' }) => {
  const { t } = useTranslate();
  const tabs = [
    {
      name: t('common.mint'),
      path: '/x-super-libra-coin/mint',
    },
    {
      name: t('common.burn'),
      path: '/x-super-libra-coin/burn',
    },
  ];

  return (
    <div className="flex-center gap-[10px]">
      {(tabs || []).map((tab) => (
        <Link
          to={tab.path}
          key={tab.name}
          className={cn(
            'flex-center h-[36px] rounded-[20px]  px-[16px] ',
            active === tab.name
              ? 'pointer-events-none bg-fill-primary  '
              : 'cursor-pointer text-tc-secondary hover:bg-fill-primary '
          )}
        >
          <span>{tab.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default SecondTabs;
