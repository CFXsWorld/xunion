import { useAccount, useReadContract } from 'wagmi';
import { XUNION_LENDING_CONTRACT, XUNION_SLC_CONTRACT } from '@/contracts';
import { Address, isAddress } from 'viem';
import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getLendingAssets, getAssetInterest } from '@/services/lending.ts';
import useMulticall, { ContractCall } from '@/hooks/useMulticall.ts';
import { formatUnits } from 'ethers';
import { formatNumber } from '@/hooks/useErc20Balance.ts';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { LendingAsset } from '@/types/Lending.ts';
import { Token } from '@/types/swap.ts';
import { useParams } from 'react-router-dom';

const useMarketDetail = () => {
  const params = useParams<{ address: string }>();
  const tokenAddress = params.address;
  const { getRealAddress } = useNativeToken();
  const { address } = useAccount();
  const { multiCall } = useMulticall();
  const [lendingAssets, setLendingAssets] = useState<LendingAsset[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    mutate: getAssets,
    data,
    isPending,
  } = useMutation({
    mutationFn: getLendingAssets,
  });

  const {
    mutate: getAssetsInterest,
    data: interests,
    isPending: chartLoading,
  } = useMutation({
    mutationFn: getAssetInterest,
  });

  useEffect(() => {
    if (isAddress(tokenAddress as Address)) {
      getAssets({ pageSize: 20, pageNum: 1 });
      getAssetsInterest({
        token: getRealAddress({ address: tokenAddress } as Token),
      });
    }
  }, []);

  const { data: userAssets, isLoading } = useReadContract({
    address: XUNION_LENDING_CONTRACT.interface.address as Address,
    abi: XUNION_LENDING_CONTRACT.interface.abi,
    functionName: 'generalParametersOfAllAssets',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  const { data: licensedAssets } = useReadContract({
    address: XUNION_LENDING_CONTRACT.interface.address as Address,
    abi: XUNION_LENDING_CONTRACT.interface.abi,
    functionName: 'licensedAssets',
    args: [tokenAddress!],
    query: {
      enabled: !!address && !!tokenAddress,
    },
  });
  const { data: nomalFloorOfHealthFactor } = useReadContract({
    address: XUNION_LENDING_CONTRACT.interface.address as Address,
    abi: XUNION_LENDING_CONTRACT.interface.abi,
    functionName: 'nomalFloorOfHealthFactor',
    query: {
      enabled: !!address && !!tokenAddress,
    },
  });

  const licensed = useMemo(() => {
    if (licensedAssets) {
      const data = licensedAssets as any;
      return {
        bestDepositInterestRate: String(data.bestDepositInterestRate / 100n),
        bestLendingRatio: String(data.bestLendingRatio / 100n),
        homogeneousModeLTV: String(data.homogeneousModeLTV / 100n),
        lendingModeNum: 2,
        liquidationPenalty: String(data.liquidationPenalty / 100n),
        maxLendingAmountInRIM: 0n,
        maximumLTV: String(data.maximumLTV / 100n),
      };
    }
  }, [licensedAssets]);

  const normalFloorOfHealthFactor = useMemo(() => {
    if (!nomalFloorOfHealthFactor) return 0;
    return Number(formatUnits(nomalFloorOfHealthFactor as bigint));
  }, [nomalFloorOfHealthFactor]);
  useEffect(() => {
    if (userAssets && data?.items?.length && address) {
      setLoading(true);
      const tokens = (userAssets as string[][])[0];
      const depositAmounts = (userAssets as bigint[][])[1];
      const lendingAmounts = (userAssets as bigint[][])[2];

      const depositInterests = (userAssets as bigint[][])[3];

      const lendingInterests = (userAssets as bigint[][])[4];

      const oracleAmounts = (userAssets as bigint[][])[5];

      const calls: ContractCall[] = tokens.map((tokenAddress) => ({
        name: 'getPrice',
        abi: XUNION_SLC_CONTRACT.oracle.abi,
        address: XUNION_SLC_CONTRACT.oracle.address as Address,
        values: [getRealAddress({ address: tokenAddress } as Token)],
      }));

      multiCall(calls)
        .then(async (allUnitPrice) => {
          const newData = [];
          for (let index = 0; index < tokens.length; index++) {
            const tokenAddress = tokens[index];
            const asset = (data.items || []).find(
              (n) =>
                n.token.address?.toLowerCase() === tokenAddress?.toLowerCase()
            );
            if (asset) {
              const unitPrice = Number(
                formatUnits(allUnitPrice.returnData[index])
              );
              const depositAmount = Number(formatUnits(depositAmounts[index]));
              const lendingAmount = Number(formatUnits(lendingAmounts[index]));
              const depositTotalPrice = formatNumber(
                depositAmount * unitPrice,
                6
              );
              const lendingTotalPrice = formatNumber(
                lendingAmount * unitPrice,
                6
              );
              const lendingInterest =
                Number(lendingInterests[index].toString()) / 100;
              const depositInterest =
                Number(depositInterests[index].toString()) / 100;
              const oraclePrice = Number(formatUnits(oracleAmounts[index]));
              newData.push({
                ...asset,
                depositAmount,
                depositInterest,
                lendingAmount,
                lendingInterest,
                depositTotalPrice,
                lendingTotalPrice,
                oraclePrice,
                unitPrice,
              });
            }
          }
          setLendingAssets(newData);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userAssets, address, data]);

  const tokenAsset = (lendingAssets || []).find(
    (item) => item.token.address.toLowerCase() === tokenAddress?.toLowerCase()
  );

  return {
    loading: loading || isLoading || isPending,
    setLendingAssets,
    tokenAsset,
    interests,
    chartLoading,
    licensed,
    normalFloorOfHealthFactor,
  };
};

export default useMarketDetail;
