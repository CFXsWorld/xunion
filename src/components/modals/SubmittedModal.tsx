import { Button, Modal, Spin } from 'antd';
import useTxStore from '@/store/pending.ts';
import { ArrowRightTopIcon, ArrowUpIcon } from '@/components/icons';
import { useTranslate } from '@/i18n';
import { confluxScan } from '@/components/notices/usePendingNotice.tsx';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { cn } from '@/utils/classnames';
import { useWaitForTransactionReceipt } from 'wagmi';
import { useEffect } from 'react';

const SubmittedModal = () => {
  const { t } = useTranslate();
  const submittedTx = useTxStore((state) => state.submittedTx);
  const updateSubmitted = useTxStore((state) => state.updateSubmitted);

  const {
    isSuccess,
    error: writeError,
    isError: isWriteError,
  } = useWaitForTransactionReceipt({
    hash: submittedTx?.hash as `0x`,
    query: {
      enabled: !!submittedTx?.hash,
    },
  });

  useEffect(() => {
    updateSubmitted(null);
  }, []);

  const renderContent = () => {
    if (isSuccess) {
      return (
        <div className="flex flex-col items-center">
          <div
            className={cn(
              'flex-center h-[72px] w-[72px] rounded-full bg-status-success text-[40px] text-white'
            )}
          >
            <CheckOutlined />
          </div>
          <span className="text-[20px] font-bold">
            {t('common.pending.submitted.success')}
          </span>
          <div className="mt-[20px]">
            <Button
              type="primary"
              className="h-[40px] w-[120px]"
              onClick={() => {
                updateSubmitted(null);
                if (submittedTx?.forceReload) {
                  window.location.reload();
                }
              }}
            >
              {t('common.pending.submitted.done')}
            </Button>
          </div>
        </div>
      );
    }

    if (isWriteError && writeError) {
      return (
        <div className="flex flex-col items-center">
          <div
            className={cn(
              'flex-center h-[72px] w-[72px] rounded-full bg-status-error text-[40px] text-white'
            )}
          >
            <CloseOutlined />
          </div>
          <span className="text-[20px] font-bold">
            {t('common.pending.submitted.error')}
          </span>
          <div className="mt-[20px]">
            <Button
              type="primary"
              className="h-[40px] w-[120px]"
              onClick={() => {
                updateSubmitted(null);
              }}
            >
              {t('common.pending.submitted.done')}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex-center h-[72px] w-[72px] rounded-full bg-theme text-[40px] text-white'
          )}
        >
          <ArrowUpIcon />
        </div>
        <span className="text-[20px] font-bold">
          {t('common.pending.submitted.title')}
        </span>
        <div className="mt-[30px]">
          <Spin spinning />
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={!!submittedTx?.hash}
      title={submittedTx?.title}
      centered
      width={400}
      footer={null}
      maskClosable={false}
      closable={false}
    >
      <div className="flex flex-col items-center gap-[20px]">
        {renderContent()}
        <a
          href={`${confluxScan}tx/${submittedTx?.hash}`}
          className="flex-center gap-[10px] py-[20px] text-theme hover:opacity-75"
          target="_blank"
        >
          <span> {t('common.pending.view.scan')}</span>
          <ArrowRightTopIcon className="text-[12px]" />
        </a>
      </div>
    </Modal>
  );
};

export default SubmittedModal;
