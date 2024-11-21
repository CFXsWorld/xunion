import { useAccount } from 'wagmi';
import { usePersistStore } from '@/store/persist.ts';
import { BUTTON_ACCESS } from '@/types/auth.ts';
import { useMemo } from 'react';

export const CHAIN_ID = 1_030; //eSpace testnet  71/ main 1_030

const useWalletAuth = (
  access: BUTTON_ACCESS[] = [BUTTON_ACCESS.CONNECTED, BUTTON_ACCESS.CHAIN]
) => {
  const { isConnected } = useAccount();
  const { address, chainId } = useAccount();
  const wallet = usePersistStore((state) => state.wallet);

  const walletConnected = useMemo(
    () =>
      wallet &&
      !(!isConnected && !address && access.includes(BUTTON_ACCESS.CONNECTED)),
    [chainId, address]
  );

  const isErrorNetwork = useMemo(
    () => chainId !== CHAIN_ID && access.includes(BUTTON_ACCESS.CHAIN),
    [chainId, address]
  );

  const disabled = !walletConnected || isErrorNetwork;

  return {
    walletConnected,
    isErrorNetwork,
    disabled,
    CHAIN_ID,
  };
};

export default useWalletAuth;
