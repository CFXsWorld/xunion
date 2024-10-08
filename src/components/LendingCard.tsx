import { PropsWithChildren, ReactNode, useState } from 'react';
import { Button, Skeleton } from 'antd';
import { cn } from '@/utils/classnames.ts';
import { useTranslate } from '@/i18n';

const LendingCard = ({
  children,
  title,
  description,
  loading,
  collapsible = true,
  className,
}: PropsWithChildren<{
  title: string;
  description?: ReactNode;
  loading?: boolean;
  collapsible?: boolean;
  className?: string;
}>) => {
  const [hide, setHide] = useState(false);
  const { t } = useTranslate();
  return (
    <div
      className={cn(
        'w-full  rounded-[20px] bg-fill-niubi',
        !hide && 'min-h-[420px]',
        className
      )}
    >
      {loading ? (
        <div className="flex flex-col gap-[24px] p-[24px] max-md:p-[16px]">
          <Skeleton active />
          <Skeleton active />
        </div>
      ) : (
        <>
          <div className="border border-transparent border-b-line-primary px-[24px] py-[14px] max-md:px-[16px]">
            <div className="flex-center-between">
              <span className="text-[18px] font-[500]">{title}</span>
              {collapsible && (
                <Button
                  className="w-[60px] rounded-[20px]"
                  size="small"
                  onClick={() => {
                    setHide(!hide);
                  }}
                >
                  {hide ? t('common.show') : t('common.hide')}
                </Button>
              )}
            </div>
            {description && <div className="pt-[10px]">{description}</div>}
          </div>
          {!hide && (
            <div className="flex flex-col px-[18px] py-[5px] max-md:px-0">
              {children}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LendingCard;
