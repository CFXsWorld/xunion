import useWalletStore from '@/store/wallet.ts';
import { useAccount } from 'wagmi';
import { usePersistStore } from '@/store/persist.ts';
import { FluentIcon, MetamaskIcon } from '@/components/icons';
import { maskAddress4 } from '@/utils';

const ConnectButton = () => {
  const onOpen = useWalletStore((state) => state.onOpen);
  const onDetailOpen = useWalletStore((state) => state.onDetailOpen);
  const wallet = usePersistStore((state) => state.wallet);
  const { address, isConnected } = useAccount();
  console.log(address, isConnected);

  if (address && isConnected && wallet) {
    return (
      <div
        className="flex h-[40px] cursor-pointer items-center justify-center gap-[12px] rounded-[16px] bg-fill-e-primary px-[16px] text-tc-primary"
        onClick={() => {
          onDetailOpen(true);
        }}
      >
        <span className="text-[20px]">
          {wallet === 'metamask' ? <MetamaskIcon /> : <FluentIcon />}
        </span>
        <span>{maskAddress4(address)}</span>
      </div>
    );
  }

  return (
    <div
      className="flex h-[40px] cursor-pointer items-center justify-center rounded-[16px] bg-theme-non-opaque px-[16px] text-theme"
      onClick={() => {
        onOpen(true);
      }}
    >
      Connect Wallet
    </div>
  );
};

export default ConnectButton;
