import { Contract, formatUnits } from 'ethers';
import { erc20Abi } from 'viem';
import { useAccount } from 'wagmi';
import useProvider from '@/hooks/useProvider.ts';
import { ZERO_ADDRESS } from '@/contracts';

export function formatNumber(number: number, decimals: number) {
  const factor = Math.pow(10, decimals);
  return Math.floor(number * factor) / factor;
}

const useErc20Balance = () => {
  const { address: account } = useAccount();
  const provider = useProvider();

  const getBalance = async (address: string, fixed = 4) => {
    if (!account) return 0;
    try {
      if (address === ZERO_ADDRESS) {
        const result = await provider.getBalance(account);
        return formatNumber(Number(formatUnits(result, 18)), fixed);
      } else {
        const Erc20Contract = new Contract(address, erc20Abi, provider);
        const decimals = await Erc20Contract.decimals();
        const result = await Erc20Contract.balanceOf(account);
        return formatNumber(Number(formatUnits(result, decimals)), fixed);
      }
    } catch (e) {
      return 0;
    }
  };

  const getTotalSupply = async (address: string) => {
    try {
      const Erc20Contract = new Contract(address, erc20Abi, provider);
      return await Erc20Contract.totalSupply();
    } catch (e) {
      return 0;
    }
  };

  return {
    getBalance,
    getTotalSupply,
  };
};

export default useErc20Balance;
