import useSLCContract from '@/hooks/useSLCContract.ts';
import { useCallback } from 'react';
import { Token } from '@/types/swap.ts';
import { formatEther, parseEther } from 'ethers';
import { formatNumber } from '@/hooks/useErc20Balance.ts';

import { isNumeric } from '@/utils/isNumeric.ts';
import useNativeToken from '@/hooks/useNativeToken.ts';

const useCalcMintAmount = ({
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
    return await contract.slcTokenBuyEstimateIn(address, amount);
  };

  const getOutputAmount = async (address: string, amount: string) => {
    return await contract.slcTokenBuyEstimateOut(address, amount);
  };
  const autoGetPayAmount = useCallback(
    ({
      inputToken,
      receiveAmount,
    }: {
      outputToken?: Token;
      inputToken?: Token;
      receiveAmount: string;
    }) => {
      setIsInsufficientLiquidity(false);
      if (inputToken?.address && isNumeric(receiveAmount)) {
        getInputAmount(
          getRealAddress(inputToken!),
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
      inputToken,
      payAmount,
    }: {
      outputToken?: Token;
      inputToken?: Token;
      payAmount: string;
    }) => {
      setIsInsufficientLiquidity(false);
      if (inputToken?.address && isNumeric(payAmount)) {
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

export default useCalcMintAmount;
