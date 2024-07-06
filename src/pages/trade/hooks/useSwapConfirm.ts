import { Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { Token } from '@/types/swap.ts';
import dayjs from 'dayjs';
import { XUNION_SWAP_CONTRACT } from '@/contracts';
import useNativeToken from '@/hooks/useNativeToken.ts';
import useXWriteContract from '@/hooks/useXWriteContract.ts';

const useSwapConfirm = ({
  inputToken,
  payAmount,
  deadline,
  slippage,
  receiveAmount,
  outputToken,
  onFillSwap,
}: {
  inputToken?: Token;
  outputToken?: Token;
  payAmount: string;
  receiveAmount: string;
  slippage: string;
  deadline: string;
  onFillSwap?: () => void;
}) => {
  const { isNativeToken, getRealSwapAddress, getRealAddress } =
    useNativeToken();

  const { data: fromDecimals } = useReadContract({
    address: getRealAddress(inputToken!) as Address,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const { data: toDecimals } = useReadContract({
    address: getRealAddress(outputToken!) as Address,
    abi: erc20Abi,
    functionName: 'decimals',
  });
  const { writeContractAsync, isSubmittedLoading } = useXWriteContract({
    onSubmitted: () => {
      onFillSwap?.();
    },
  });

  const confirm = () => {
    if (fromDecimals && toDecimals) {
      const { address, abi } = XUNION_SWAP_CONTRACT.interface;

      let value = 0;

      const amountIn = Number(payAmount) * 10 ** fromDecimals;
      const amountOut = Number(receiveAmount) * 10 ** toDecimals;

      const limits =
        Number(slippage === '-1' ? '0.5' : slippage) *
        Number(receiveAmount) *
        0.01 *
        10 ** toDecimals;

      const date = dayjs().add(Number(deadline), 'minute').unix() + 100;

      if (isNativeToken(inputToken!)) {
        value = amountIn;
      }

      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'xexchange2',
        args: [
          [getRealSwapAddress(inputToken!), getRealSwapAddress(outputToken!)],
          amountIn,
          amountOut,
          limits,
          date,
        ],
        value: `${value}` as unknown as bigint,
      });
    }
  };

  return {
    confirm,
    isSubmittedLoading,
  };
};

export default useSwapConfirm;
