import { Token } from '@/types/swap.ts';
import { useEffect, useState } from 'react';
import useMulticall, { ContractCall } from '@/hooks/useMulticall.ts';
import { XUNION_SLC_CONTRACT } from '@/contracts';
import { Address, erc20Abi, isAddress } from 'viem';
import { formatUnits } from 'ethers';
import { formatNumber } from '@/hooks/useErc20Balance.ts';
import { useAccount } from 'wagmi';
import { useMutation } from '@tanstack/react-query';
import { getTokenList } from '@/services/token.ts';
import useNativeToken from '@/hooks/useNativeToken.ts';
import useErc20Info from '@/hooks/useERC20TokenInfo';

const useTokensWithPrice = () => {
  const { getRealAddress, isNativeToken, getNativeTokenBalance } =
    useNativeToken();
  const { address } = useAccount();
  const { multiCall } = useMulticall();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);

  const { fetchTokenInfo } = useErc20Info();

  const {
    isPending: isTokenLoading,
    mutateAsync: getTokens,
    data: tokenData,
  } = useMutation({
    mutationFn: getTokenList,
  });

  useEffect(() => {
    if (address) {
      getTokens({
        pageNum: 1,
        pageSize: 50,
      }).then((res) => {
        setTokens(res.items || []);
      });
    }
  }, [address]);

  useEffect(() => {
    if (tokenData && tokenData.items?.length && address) {
      setLoading(true);
      const calls: ContractCall[] = tokenData.items?.map((token) => ({
        name: 'getPrice',
        abi: XUNION_SLC_CONTRACT.oracle.abi,
        address: XUNION_SLC_CONTRACT.oracle.address as Address,
        values: [getRealAddress(token)],
      }));
      const calls2: ContractCall[] = tokenData.items?.map((token) => ({
        name: 'balanceOf',
        abi: erc20Abi,
        address: getRealAddress(token),
        values: [address],
      }));
      multiCall(calls)
        .then(async (allUnitPrice) => {
          return multiCall(calls2).then(async (allBalance) => {
            const newData = [];
            for (let index = 0; index < tokenData.items.length; index++) {
              const item = tokenData.items[index];
              const unitPrice = Number(
                formatUnits(allUnitPrice.returnData[index])
              );
              const amount = Number(formatUnits(allBalance.returnData[index]));
              if (isNativeToken(item)) {
                const balance = await getNativeTokenBalance();
                newData.push({
                  ...item,
                  amount: formatNumber(balance, 6),
                  price: formatNumber(balance * unitPrice, 6),
                });
              } else {
                newData.push({
                  ...item,
                  amount: formatNumber(amount, 6),
                  price: formatNumber(amount * unitPrice, 6),
                });
              }
            }
            setTokens(newData);
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [tokenData, address]);

  const getTokensList = (params: any) => {
    getTokens(params).then(async (res) => {
      if (!res.items.length) {
        const { nameOrAddress } = params;
        if (isAddress(nameOrAddress)) {
          const info = await fetchTokenInfo(nameOrAddress);
          setTokens(info ? [info] : []);
        } else {
          setTokens(res.items || []);
        }
        //
      } else {
        setTokens(res.items || []);
      }
    });
  };

  return {
    tokens,
    loading,
    isTokenLoading,
    getTokens: getTokensList,
  };
};

export default useTokensWithPrice;
