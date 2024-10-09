import { Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { useMemo } from 'react';
import { XUNION_SWAP_CONTRACT } from '@/contracts';
import { LiquidityReturnType } from '@/pages/x-dex/hooks/useAddLP.ts';
import { getAddress, parseUnits } from 'ethers';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { Token } from '@/types/swap.ts';
import useXWriteContract from '@/hooks/useXWriteContract.ts';
import { formatNumber } from '@/hooks/useErc20Balance';

const useAddLPConfirm = ({
  lpPairInfo,
  tokenAAmount,
  tokenBAmount,
  tokenA,
  tokenB,
  setStep,
}: Pick<
  LiquidityReturnType,
  | 'lpPairInfo'
  | 'tokenAAmount'
  | 'tokenBAmount'
  | 'tokenA'
  | 'tokenB'
  | 'setStep'
>) => {
  const { writeContractAsync, isSubmittedLoading } = useXWriteContract({
    onSubmitted: () => {
      setStep('FILL');
    },
  });

  const { getRealAddress, isNativeToken } = useNativeToken();

  const { data: tokenADecimals } = useReadContract({
    address: getRealAddress(tokenA!) as Address,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const { data: tokenBDecimals } = useReadContract({
    address: getRealAddress(tokenB!) as Address,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const sortedAmounts = useMemo(() => {
    if (!tokenADecimals || !tokenBDecimals) return [];
    const amountIn = parseUnits(tokenAAmount, tokenADecimals);
    const amountOut = parseUnits(tokenBAmount, tokenBDecimals);
    return (lpPairInfo?.lpPair || []).map(
      (address) =>
        [
          { ...tokenA, amount: amountIn },
          { ...tokenB, amount: amountOut },
        ].find(
          (token) =>
            getAddress(
              getRealAddress(token as unknown as Token) as Address
            ).toLowerCase() === getAddress(address).toLowerCase()
        )?.amount
    );
  }, [lpPairInfo, tokenAAmount, tokenBAmount, tokenADecimals, tokenBDecimals]);

  const txValue = useMemo(() => {
    if (isNativeToken(tokenA!) && tokenADecimals) {
      return (
        formatNumber(Number(tokenAAmount || 0) + 0.0001, 5) *
        10 ** tokenADecimals
      );
    }
    if (isNativeToken(tokenB!) && tokenBDecimals) {
      return (
        formatNumber(Number(tokenBAmount || 0) + 0.0001, 5) *
        10 ** tokenBDecimals
      );
    }
    return 0;
  }, [tokenAAmount, tokenBAmount, tokenADecimals, tokenBDecimals]);

  const confirm = () => {
    if (tokenADecimals && tokenBDecimals) {
      const { address, abi } = XUNION_SWAP_CONTRACT.interface;
      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'xLpSubscribe2',
        args: [
          lpPairInfo?.pairAddress as Address,
          sortedAmounts as unknown as string[],
        ],
        value: `${txValue}` as unknown as bigint,
      });
    }
  };

  return {
    confirm,
    isSubmittedLoading,
  };
};

export default useAddLPConfirm;
