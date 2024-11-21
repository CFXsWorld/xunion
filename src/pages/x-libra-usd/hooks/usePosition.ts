import { useMemo } from 'react';
import { formatUnits } from 'ethers';
import useTokenPrice from '@/hooks/useTokenPrice.ts';

const usePosition = ({ health }: { health: bigint[] }) => {
  const userAssetsValue = useMemo(() => {
    if (health) {
      const amount = health[1];
      return Number(formatUnits(amount, 18));
    }
    return 0;
  }, [health]);

  const userBorrowedAmount = useMemo(() => {
    if (health) {
      const amount = health[2];
      return Number(formatUnits(amount, 18));
    }
    return 0;
  }, [health]);

  const userAvailableAmount = useMemo(() => {
    if (health) {
      const amount = health[3];
      return Number(formatUnits(amount, 18));
    }
    return 0;
  }, [health]);

  const healthFactor = useMemo(() => {
    if (health) {
      const amount = health[0];
      return Number(formatUnits(amount)) > 1000
        ? 1000
        : Number(formatUnits(amount));
    }
    return 0;
  }, [health]);

  const { totalPrice: borrowedTotalPrice } = useTokenPrice({
    amount: health ? formatUnits(health?.[2], 18) : '0',
  });

  const { totalPrice: availableTotalPrice } = useTokenPrice({
    amount: health ? formatUnits(health?.[3], 18) : '0',
  });

  return {
    userAvailableAmount,
    userBorrowedAmount,
    userAssetsValue,
    borrowedTotalPrice,
    availableTotalPrice,
    healthFactor,
  };
};

export default usePosition;
