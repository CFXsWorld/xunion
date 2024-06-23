import { useEffect, useMemo, useState } from 'react';
import { Token } from '@/types/swap.ts';
import useErc20Balance, { formatNumber } from '@/hooks/useErc20Balance.ts';
import usePair from '@/pages/trade/hooks/usePair.ts';
import { XUNION_SWAP_CONTRACT } from '@/contracts';
import useLP from '@/pages/trade/hooks/useLP.ts';
import { isNumeric } from '@/utils/isNumeric.ts';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { writeTxNotification } from '@/components/notices/writeTxNotification.tsx';
import useTxStore from '@/store/transaction.ts';
import { Address, erc20Abi, isAddress } from 'viem';
import { Form } from 'antd';
import useCISContract from '@/hooks/useCISContract.ts';
import { parseUnits } from 'ethers';

const useSendToken = () => {
  const { getBalance } = useErc20Balance();
  const [inputToken, setInputToken] = useState<Token | undefined>();
  const [payAmount, setPayAmount] = useState<string>('');
  const [inputOwnerAmount, setInputOwnerAmount] = useState(0);
  const [inputTokenTotalPrice, setInputTokenTotalPrice] = useState(0);

  const account = useAccount();
  const [form] = Form.useForm();
  const { getAddrByCISId } = useCISContract();
  const cis = Form.useWatch('address', form);
  const [cisAddress, setCisAddress] = useState<string>();

  const { data: decimals } = useReadContract({
    address: inputToken?.address as Address,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  useEffect(() => {
    setCisAddress('');
    if (cis && !isAddress(cis)) {
      getAddrByCISId(cis).then((res) => {
        if (res) {
          setCisAddress(res);
        }
      });
    }
  }, [cis]);

  const { pairAddress: fromWithSLCPairAddress } = usePair({
    fromToken: inputToken,
    toToken: { address: XUNION_SWAP_CONTRACT.slc.address },
  });
  const { getLpPrice } = useLP();
  const updateSubmitted = useTxStore((state) => state.updateSubmitted);
  const {
    data: hash,
    isPending: isSubmittedLoading,
    writeContractAsync,
    isSuccess: isSubmitted,
  } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  useEffect(() => {
    if (isSuccess && hash) {
      writeTxNotification(hash);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSubmitted) {
      updateSubmitted({ hash });
    }
  }, [isSubmitted]);

  useEffect(() => {
    if (fromWithSLCPairAddress && payAmount) {
      getLpPrice(fromWithSLCPairAddress).then((unitPrice) => {
        setInputTokenTotalPrice(formatNumber(Number(payAmount) * unitPrice, 2));
      });
    }
  }, [fromWithSLCPairAddress, payAmount]);

  useEffect(() => {
    if (inputToken?.address) {
      getBalance(inputToken.address).then(setInputOwnerAmount);
    }
  }, [inputToken]);

  const isInsufficient = useMemo(() => {
    return !!(
      inputToken?.address &&
      isNumeric(payAmount) &&
      Number(payAmount) > Number(inputOwnerAmount)
    );
  }, [payAmount, inputOwnerAmount, inputToken?.address]);

  const confirm = () => {
    if ((isAddress(cis) || !!cisAddress) && decimals && account.address) {
      const toAddress = cis || cisAddress;

      writeContractAsync({
        address: inputToken?.address as Address,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [toAddress, parseUnits(payAmount, decimals)],
      });
    }
  };

  return {
    confirm,
    inputToken,
    setInputToken,
    payAmount,
    setPayAmount,
    inputOwnerAmount,
    inputTokenTotalPrice,
    isInsufficient,
    cisAddress,
    form,
    getAddrByCISId,
    cis,
    isSubmittedLoading,
  };
};

export default useSendToken;
