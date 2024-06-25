import { useCallback, useEffect, useState } from 'react';
import useLP from '@/pages/trade/hooks/useLP.ts';
import useErc20Balance from '@/hooks/useErc20Balance.ts';
import { Token } from '@/types/swap.ts';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { writeTxNotification } from '@/components/notices/writeTxNotification.tsx';
import { XUNION_SWAP_CONTRACT } from '@/contracts';
import { Address } from 'viem';

const useAddLP = () => {
  const { getBalance } = useErc20Balance();
  const [tokenA, setTokenA] = useState<Token | undefined>();
  const [tokenB, setTokenB] = useState<Token | undefined>();
  const [tokenAOwnerAmount, setTokenAOwnerAmount] = useState(0);
  const [tokenBOwnerAmount, setTokenBOwnerAmount] = useState(0);
  const [tokenASLCPairAddress, setTokenAPairAddress] = useState<
    string | undefined
  >();
  const [tokenBSLCPairAddress, setTokenBPairAddress] = useState<
    string | undefined
  >();
  const [lpPairAddress, setLpPairAddress] = useState<string>();
  const [loading, setLoading] = useState(false);

  const { getSLCPairAddress, getPairAddress } = useLP();

  useEffect(() => {
    if (tokenA?.address) {
      getBalance(tokenA.address).then(setTokenAOwnerAmount);
      getSLCPairAddress(tokenA.address).then(setTokenAPairAddress);
    }
  }, [tokenA]);
  useEffect(() => {
    if (tokenB?.address) {
      getBalance(tokenB.address).then(setTokenBOwnerAmount);
      getSLCPairAddress(tokenB.address).then(setTokenBPairAddress);
    }
  }, [tokenB]);

  useEffect(() => {
    if (tokenB?.address && tokenA?.address) {
      getPairAddress(tokenA?.address, tokenB?.address).then(setLpPairAddress);
    }
  }, [tokenB, tokenA]);

  const { data: hash, writeContractAsync } = useWriteContract();

  const { isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  useEffect(() => {
    if (isSuccess && hash) {
      setLoading(false);
      writeTxNotification(hash);
      if (tokenB?.address && tokenA?.address) {
        getPairAddress(tokenA?.address, tokenB?.address).then(setLpPairAddress);
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setLoading(false);
    }
  }, [isError]);

  const onTokenAChange = useCallback(
    async (token: Token) => {
      setTokenA(token);
    },
    [tokenB?.address]
  );

  const onTokenBChange = useCallback(
    async (token: Token) => {
      setTokenB(token);
    },
    [tokenA?.address]
  );

  const onCreate = () => {
    setLoading(true);
    if (tokenB && tokenA) {
      const { address, abi } = XUNION_SWAP_CONTRACT.interface;

      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'createPair',
        args: [tokenA?.address, tokenB.address],
      });
    }
  };

  return {
    tokenA,
    tokenB,
    tokenAOwnerAmount,
    tokenBOwnerAmount,
    lpPairAddress,
    tokenASLCPairAddress,
    tokenBSLCPairAddress,
    onTokenBChange,
    onTokenAChange,
    onCreate,
    loading,
  };
};

export default useAddLP;
