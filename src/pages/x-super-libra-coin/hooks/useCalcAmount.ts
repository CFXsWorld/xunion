import useSLCContract from '@/hooks/useSLCContract.ts';
import { useCallback } from 'react';
import { Token } from '@/types/swap.ts';
import { formatEther, parseEther } from 'ethers';
import { formatNumber } from '@/hooks/useErc20Balance.ts';

import { isNumeric } from '@/utils/isNumeric.ts';
import useNativeToken from '@/hooks/useNativeToken.ts';

const useCalcAmount = ({
  setIsInsufficientLiquidity,
  setPayAmount,
  setInputTokenTotalPrice,
  setReceiveAmount,
  setOutputTokenTotalPrice,
}: {
  setIsInsufficientLiquidity: (value: boolean) => void;
  setPayAmount: (value: string) => void;
  setReceiveAmount: (value: string) => void;
  setInputTokenTotalPrice: (value: number) => void;
  setOutputTokenTotalPrice: (value: number) => void;
}) => {
  const contract = useSLCContract();

  const { getRealAddress } = useNativeToken();

  const getInputAmount = async (address: string, amount: string) => {
    return await contract.slcTokenSellEstimate(address, amount);
  };

  const getOutputAmount = async (address: string, amount: string) => {
    return await contract.slcTokenBuyEstimate(address, amount);
  };
  const autoGetPayAmount = useCallback(
    ({
      outputToken,
      inputToken,
      receiveAmount,
    }: {
      outputToken?: Token;
      inputToken?: Token;
      receiveAmount: string;
    }) => {
      setIsInsufficientLiquidity(false);
      if (
        inputToken?.address &&
        outputToken?.address &&
        isNumeric(receiveAmount)
      ) {
        getInputAmount(
          getRealAddress(outputToken!),
          parseEther(receiveAmount).toString()
        )
          .then((amount) => {
            const amountStr = formatEther(amount.toString());
            setPayAmount(formatNumber(Number(amountStr), 8).toString());
          })
          .catch(() => {
            setIsInsufficientLiquidity(true);
            setPayAmount('');
            setInputTokenTotalPrice(0);
          });
      }
    },
    []
  );

  const autoGetReceiveAmount = useCallback(
    ({
      outputToken,
      inputToken,
      payAmount,
    }: {
      outputToken?: Token;
      inputToken?: Token;
      payAmount: string;
    }) => {
      setIsInsufficientLiquidity(false);
      if (inputToken?.address && outputToken?.address && isNumeric(payAmount)) {
        getOutputAmount(
          getRealAddress(inputToken!),
          parseEther(payAmount).toString()
        )
          .then((amount) => {
            const amountStr = formatEther(amount.toString());
            setReceiveAmount(formatNumber(Number(amountStr), 8).toString());
          })
          .catch(() => {
            setIsInsufficientLiquidity(true);
            setReceiveAmount('');
            setOutputTokenTotalPrice(0);
          });
      }
    },
    []
  );

  return {
    autoGetPayAmount,
    autoGetReceiveAmount,
  };
};

export default useCalcAmount;
