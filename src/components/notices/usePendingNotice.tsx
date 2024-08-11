import { notification } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { useTranslate } from '@/i18n';

export const confluxScan = 'https://evmtestnet.confluxscan.io/tx/';

const usePendingNotice = () => {
  const { t } = useTranslate();

  const writeTxErrorNotification = (
    hash: string | null | undefined,
    message = 'Unknown message.'
  ) => {
    notification.open({
      message: (
        <div className="flex items-start justify-between gap-[20px]">
          <div className="flex-start">
            <CloseCircleFilled className="text-[24px] text-red-600" />
          </div>
          <div className="flex flex-1 flex-col gap-[10px]">
            <span className="font-bold">
              {t('common.pending.write.title.error')}
            </span>

            {hash ? (
              <a
                href={`${confluxScan}${hash}`}
                className="text-tc-secondary hover:opacity-75"
                target="_blank"
              >
                {t('common.pending.view.scan')}
              </a>
            ) : (
              <span className="flex flex-1 flex-wrap text-tc-secondary">
                {message}
              </span>
            )}
          </div>
        </div>
      ),
      duration: 10,
    });
  };

  const writeTxNotification = (hash: string) => {
    notification.open({
      message: (
        <div className="flex items-start justify-between gap-[20px]">
          <div className="flex-start">
            <CheckCircleFilled className="text-[24px] text-theme" />
          </div>
          <div className="flex flex-1 flex-col gap-[10px]">
            <span className="font-bold">{t('common.pending.write.title')}</span>
            <a
              href={`${confluxScan}${hash}`}
              className="text-theme hover:opacity-75"
              target="_blank"
            >
              {t('common.pending.view.scan')}
            </a>
          </div>
        </div>
      ),
      duration: 10,
    });
  };

  return {
    writeTxErrorNotification,
    writeTxNotification,
  };
};

export default usePendingNotice;