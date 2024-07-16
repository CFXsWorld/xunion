import { Token } from '@/types/swap.ts';
import { NATIVE_ERC20_TOKEN, ZERO_ADDRESS } from '@/contracts';
import { useAccount } from 'wagmi';
import useProvider from '@/hooks/useProvider.ts';
import { formatUnits } from 'ethers';
import { formatNumber } from '@/hooks/useErc20Balance.ts';

const useNativeToken = () => {
  const { chainId = 71, address } = useAccount();

  const provider = useProvider();
  const getNativeTokenERC20Address = (token: Token) => {
    return (
      NATIVE_ERC20_TOKEN[token?.chainId || chainId]?.address || ZERO_ADDRESS
    );
  };

  const isNativeToken = (token: Token) => {
    return (
      token?.address.toLowerCase() ===
      NATIVE_ERC20_TOKEN[token?.chainId || chainId]?.address?.toLowerCase?.()
    );
  };

  const getRealAddress = (token: Token) => {
    if (isNativeToken(token)) {
      return getNativeTokenERC20Address(token);
    }
    return token?.address;
  };

  const getNativeTokenBalance = async () => {
    if (address) {
      const amount = await provider.getBalance(address).catch(() => 0n);
      return Number(formatNumber(Number(formatUnits(amount, 18)), 6));
    }
    return 0;
  };

  return {
    getNativeTokenERC20Address,
    isNativeToken,
    getRealAddress,
    getNativeTokenBalance,
  };
};

export default useNativeToken;
