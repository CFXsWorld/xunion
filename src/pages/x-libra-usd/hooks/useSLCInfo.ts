import useSLCContract from '@/hooks/useSLCContract';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';
import { formatUnits } from 'ethers';
import { formatNumber } from '@/hooks/useErc20Balance.ts';

const useSLCInfo = () => {
  const contract = useSLCContract();
  const { address } = useAccount();

  const {
    mutate: getTVLAndUSDAmount,
    isPending: isGettingTVLAndUSDAmount,
    data: tvlAndUSDAmount,
  } = useMutation({
    mutationFn: () => contract.getTVLAndUSDAmount(),
  });

  const {
    mutate: getTotalMintedAmount,
    isPending: isGettingTotalMintedAmount,
    data: totalMintedAmount,
  } = useMutation({
    mutationFn: () => contract.getTotalMintedAmount(),
  });
  const {
    mutate: getTotalMintedAmountV1,
    isPending: isGettingTotalMintedAmountV1,
    data: totalMintedAmountV1,
  } = useMutation({
    mutationFn: () => contract.getV1MintedCoin(),
  });

  const {
    mutate: getSlcValue,
    isPending: isGettingSlcValue,
    data: slcValue,
  } = useMutation({
    mutationFn: () => contract.getSlcValue(),
  });

  const {
    mutate: getUserMintedAmount,
    isPending: isGettingUserMintedAmount,
    data: userMintedAmount,
  } = useMutation({
    mutationFn: (address: Address) => contract.getUserMintedAmount(address),
  });

  useEffect(() => {
    getTVLAndUSDAmount();
    getTotalMintedAmount();
    getTotalMintedAmountV1();
    getSlcValue();
  }, []);

  useEffect(() => {
    if (address) {
      getUserMintedAmount(address);
    }
  }, [address]);

  const isLoading =
    isGettingTVLAndUSDAmount ||
    isGettingTotalMintedAmount ||
    isGettingSlcValue ||
    isGettingUserMintedAmount ||
    isGettingTotalMintedAmountV1;

  const tvl = useMemo(() => {
    return Number(
      formatNumber(Number(formatUnits(tvlAndUSDAmount?.[1] || 0n, 18)), 2)
    );
  }, [tvlAndUSDAmount]);

  const usdtAmount = useMemo(() => {
    return Number(
      formatNumber(Number(formatUnits(tvlAndUSDAmount?.[0]?.[0] || 0n, 18)), 2)
    );
  }, [tvlAndUSDAmount]);

  const usdcAmount = useMemo(() => {
    return Number(
      formatNumber(Number(formatUnits(tvlAndUSDAmount?.[0]?.[1] || 0n, 18)), 2)
    );
  }, [tvlAndUSDAmount]);

  const amountxUSD = useMemo(() => {
    return Number(
      formatNumber(Number(formatUnits(tvlAndUSDAmount?.[2] || 0n, 18)), 2)
    );
  }, [tvlAndUSDAmount]);

  const totalAmount = useMemo(() => {
    return Number(
      formatNumber(Number(formatUnits(totalMintedAmount || 0n, 18)), 2)
    );
  }, [totalMintedAmount]);

  const totalAmountV1 = useMemo(() => {
    return Number(
      formatNumber(Number(formatUnits(totalMintedAmountV1 || 0n, 18)), 2)
    );
  }, [totalMintedAmountV1]);

  const userAmount = useMemo(() => {
    return Number(
      formatNumber(Number(formatUnits(userMintedAmount || 0n, 18)), 2)
    );
  }, [userMintedAmount]);

  const slcPriceValue = useMemo(() => {
    return Number(formatNumber(Number(formatUnits(slcValue || 0n, 18)), 4));
  }, [slcValue]);

  return {
    isLoading,
    totalAmount,
    totalAmountV1,
    tvl,
    usdtAmount,
    usdcAmount,
    userAmount,
    slcPriceValue,
    amountxUSD,
  };
};

export default useSLCInfo;
