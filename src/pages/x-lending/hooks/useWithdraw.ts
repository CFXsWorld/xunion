import useXWriteContract from '@/hooks/useXWriteContract.ts';
import { XUNION_LENDING_CONTRACT } from '@/contracts';
import { Address, erc20Abi } from 'viem';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { useEffect, useMemo, useState } from 'react';
import { isNumeric } from '@/utils/isNumeric.ts';
import useErc20Balance, { formatNumber } from '@/hooks/useErc20Balance.ts';
import useTokenPrice from '@/hooks/useTokenPrice.ts';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits, parseUnits } from 'ethers';
import { LendingAsset } from '@/types/Lending.ts';
import useHealthFactor from '@/pages/x-lending/hooks/useHealthFactor.ts';

const useWithdraw = ({
  asset,
  refresh,
}: {
  asset: LendingAsset;
  refresh: () => void;
}) => {
  const inputToken = asset.token;
  const [payAmount, setPayAmount] = useState<string>('');
  const [estimatedHealthFactor, setEstimatedHealthFactor] = useState<string>();
  const { getBalance } = useErc20Balance();
  const [inputOwnerAmount, setInputOwnerAmount] = useState(0);
  const { isNativeToken, getRealAddress } = useNativeToken();
  const { totalPrice: inputTokenTotalPrice } = useTokenPrice({
    amount: payAmount,
    address: inputToken?.address,
  });
  const { address } = useAccount();

  const { getWithdrawHealth } = useHealthFactor(asset);

  const { writeContractAsync, isSubmittedLoading, loading } = useXWriteContract(
    {
      onWriteSuccess: refresh,
    }
  );

  const { data: health } = useReadContract({
    address: XUNION_LENDING_CONTRACT.interface.address as Address,
    abi: XUNION_LENDING_CONTRACT.interface.abi,
    functionName: 'viewUsersHealthFactor',
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  const { data: decimals } = useReadContract({
    address: getRealAddress(inputToken!) as Address,
    abi: erc20Abi,
    functionName: 'decimals',
    query: {
      enabled: !!inputToken,
    },
  });

  useEffect(() => {
    if (inputToken?.address) {
      getBalance(inputToken.address).then(setInputOwnerAmount);
    }
  }, [inputToken]);

  useEffect(() => {
    if (address && payAmount) {
      getWithdrawHealth(payAmount).then(setEstimatedHealthFactor);
    }
  }, [address, payAmount]);

  const withdrawNormal = async () => {
    if (decimals) {
      const amountIn = parseUnits(payAmount, decimals);

      const { address, abi } = XUNION_LENDING_CONTRACT.interface;
      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'withdrawDeposit',
        args: [inputToken?.address, amountIn],
      });
    }
  };

  const withdrawCFX = async () => {
    if (decimals) {
      const { address, abi } = XUNION_LENDING_CONTRACT.interface;
      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'withdrawDeposit2',
        value: parseUnits(payAmount, decimals),
        args: [],
      });
    }
  };

  const withdraw = () => {
    if (isNativeToken(inputToken!)) {
      withdrawCFX();
    } else {
      withdrawNormal();
    }
  };

  const isInsufficient = useMemo(() => {
    return (
      isNumeric(payAmount) && Number(payAmount) > Number(asset.depositAmount)
    );
  }, [payAmount, asset?.depositAmount]);

  const userHealthFactor = useMemo(() => {
    if (health) {
      return Number(formatUnits(health.toString(), 18));
    }
    return 0;
  }, [health]);

  const remainingProvided = useMemo(
    () =>
      payAmount && asset?.depositAmount
        ? formatNumber(Number(asset?.depositAmount) - Number(payAmount), 8)
        : asset?.depositAmount || 0,
    [payAmount, asset?.depositAmount]
  );

  return {
    withdraw,
    inputToken,
    payAmount,
    setPayAmount,
    isInsufficient,
    inputOwnerAmount,
    isSubmittedLoading,
    loading,
    inputTokenTotalPrice,
    userHealthFactor,
    estimatedHealthFactor,
    remainingProvided,
  };
};

export default useWithdraw;
