import { useEffect, useMemo, useState } from 'react';
import useMulticall, { ContractCall } from '@/hooks/useMulticall.ts';
import { useAccount, useReadContract } from 'wagmi';
import { Address, erc20Abi } from 'viem';
import { useMutation } from '@tanstack/react-query';
import { getTokenList } from '@/services/slc.ts';
import { formatUnits } from 'ethers';
import { BorrowMode, SLCAsset } from '@/types/slc.ts';
import { formatNumber } from '@/hooks/useErc20Balance.ts';
import { XUNION_SLC_CONTRACT } from '@/contracts';

const useCollateral = () => {
  const { multiCall } = useMulticall();
  const { address } = useAccount();
  const [assets, setAssets] = useState<SLCAsset[]>();

  const [allUnitPrice, setAllUnitPrices] = useState<[string, number][]>();

  const { data: assetsOverview, isLoading: isAssetsLoading } = useReadContract({
    address: XUNION_SLC_CONTRACT.interface.address as Address,
    abi: XUNION_SLC_CONTRACT.interface.abi,
    functionName: 'userAssetOverview',
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const { data: userMode } = useReadContract({
    address: XUNION_SLC_CONTRACT.interface.address as Address,
    abi: XUNION_SLC_CONTRACT.interface.abi,
    functionName: 'userMode',
    args: [address],
    query: {
      enabled: !!address,
    },
  });
  const { mutate, isPending: loading } = useMutation({
    mutationFn: getTokenList,
    onSuccess: (data) => {
      setAssets(data?.items || []);
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  useEffect(() => {
    if (assetsOverview) {
      const tokens = (assetsOverview as string[][])[0];
      const calls: ContractCall[] = tokens.map((address) => ({
        name: 'getPrice',
        abi: XUNION_SLC_CONTRACT.oracle.abi,
        address: XUNION_SLC_CONTRACT.oracle.address as Address,
        values: [address],
      }));
      multiCall(calls).then((allUnitPrice) => {
        setAllUnitPrices(
          tokens.map((adds, index) => [
            adds,
            Number(formatUnits(allUnitPrice.returnData[index])),
          ])
        );
      });
    }
  }, [assetsOverview]);

  useEffect(() => {
    if (assets?.length && address && allUnitPrice) {
      const calls: ContractCall[] = assets.map((item) => ({
        name: 'balanceOf',
        abi: erc20Abi,
        address: item.address,
        values: [address],
      }));

      multiCall(calls).then((allBalance) => {
        setAssets((prevState) =>
          (prevState || [])?.map((item, index) => {
            const unitPrice =
              allUnitPrice?.find(
                (n) => n[0].toLowerCase() === item.address.toLowerCase()
              )?.[1] || 0;
            return {
              ...item,
              balance: formatNumber(
                Number(formatUnits(allBalance.returnData[index])),
                6
              ),
              balancePrice: formatNumber(
                Number(formatUnits(allBalance.returnData[index])) * unitPrice,
                6
              ),
            };
          })
        );
      });
    }
  }, [assets?.length, address, allUnitPrice]);

  const assetsWithPrices = useMemo(() => {
    const mode = (userMode as number[])?.[0];
    return (assets || []).map((item) => {
      const AllTokens = (assetsOverview as string[][])?.[0] || [];
      const AllProvided = (assetsOverview as bigint[][])?.[1] || [];
      const index = AllTokens.findIndex(
        (adds) => adds.toLowerCase() === item.address.toLowerCase()
      );

      const provided = AllProvided[index]
        ? Number(formatUnits(AllProvided[index]))
        : 0;

      const unitPrice =
        allUnitPrice?.find(
          (n) => n[0].toLowerCase() === item.address.toLowerCase()
        )?.[1] || 0;

      const canBeProvided =
        mode === BorrowMode?.HighLiquidity && item.max_deposit_amount === '0';
      return {
        ...item,
        provided: formatNumber(provided, 6),
        providedPrice: formatNumber(provided * unitPrice, 6),
        canBeProvided,
        canBeWithdraw: formatNumber(provided, 6) > 0,
      };
    });
  }, [assets, allUnitPrice, assetsOverview, userMode]);

  return {
    assets: assetsWithPrices,
    loading,
    isAssetsLoading,
  };
};

export default useCollateral;