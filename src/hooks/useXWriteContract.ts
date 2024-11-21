import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useEffect, useState } from 'react';
import useTxStore from '@/store/pending.ts';
import { WriteContractErrorType } from 'viem';
import usePendingNotice from '@/components/notices/usePendingNotice.tsx';

const useXWriteContract = ({
  showSubmittedModal = true,
  globalNotice = true,
  onSubmitted,
  onWriteSuccess,
  onError,
  forceReload = true,
  onSoftWriteSuccess,
}: {
  showSubmittedModal?: boolean;
  globalNotice?: boolean;
  pendingPool?: boolean;
  onSubmitted?: (hash: string) => void;
  onWriteSuccess?: (e: any) => void;
  onSoftWriteSuccess?: (e: any) => void;
  onError?: (e: WriteContractErrorType) => void;
  forceReload?: boolean;
}) => {
  const { writeTxErrorNotification, writeTxNotification } = usePendingNotice();
  const updateSubmitted = useTxStore((state) => state.updateSubmitted);
  const [loading, setLoading] = useState(false);
  const [_, refresh] = useState(0);
  const {
    data: hash,
    isPending: isSubmittedLoading,
    writeContractAsync,
    isSuccess: isSubmitted,
    error: submittedError,
    isError,
  } = useWriteContract({});

  const {
    isSuccess,
    data: writeEvent,
    error: writeError,
    isError: isWriteError,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  useEffect(() => {
    if (isError) {
      setLoading(false);
      onError?.(submittedError as WriteContractErrorType);
      const reasonMatch = submittedError?.message.match(/reason: (.*)/);
      writeTxErrorNotification(hash, reasonMatch?.[1]);
      updateSubmitted(null);
    }
  }, [submittedError, isError]);

  useEffect(() => {
    if (isWriteError) {
      setLoading(false);
      onError?.(writeError as WriteContractErrorType);
      const reasonMatch = writeError?.message.match(/reason: (.*)/);
      writeTxErrorNotification(hash, reasonMatch?.[1]);
    }
  }, [writeError, isWriteError]);

  useEffect(() => {
    if (isSuccess && hash && globalNotice) {
      setLoading(false);
      // pendingPool
      // TODO collect 2 pools
      writeTxNotification(hash);
      if (!forceReload) {
        onWriteSuccess?.(writeEvent);
      }
      onSoftWriteSuccess?.(writeEvent);
    }
  }, [isSuccess, hash, globalNotice]);

  useEffect(() => {
    if (isSubmitted && showSubmittedModal) {
      setLoading(true);
      updateSubmitted({ hash, forceReload, title: 'Approve' });
      onSubmitted?.(hash);
      refresh(Math.random());
    }
  }, [isSubmitted, showSubmittedModal]);

  return {
    hash,
    submittedError,
    writeError,
    writeEvent,
    isSubmitted,
    isSuccess,
    loading,
    isSubmittedLoading,
    writeContractAsync,
  };
};

export default useXWriteContract;
