import { Drawer } from 'antd';
import useWalletStore from '@/store/wallet.ts';
import { MetamaskIcon, FluentIcon, AvatarIcon } from '@/components/icons';
import { useAccount, useDisconnect } from 'wagmi';
import { usePersistStore } from '@/store/persist.ts';
import { maskAddress4 } from '@/utils';
import { CopyOutlined, LogoutOutlined } from '@ant-design/icons';
import { useCopy } from '@/hooks/useCopy.ts';

const WalletDetailModal = () => {
  const open = useWalletStore((state) => state.detailOpen);
  const onOpen = useWalletStore((state) => state.onDetailOpen);
  const { disconnectAsync } = useDisconnect();
  const updateWallet = usePersistStore((state) => state.updateWallet);
  const wallet = usePersistStore((state) => state.wallet);
  const { address } = useAccount();
  const { copy } = useCopy();
  return (
    address && (
      <Drawer
        placement="right"
        closable={false}
        onClose={() => {
          onOpen(false);
        }}
        open={open}
        contentWrapperStyle={{
          margin: 20,
          borderRadius: 20,
        }}
        rootClassName="outline-0 border-0"
        className="rounded-[20px] "
        maskStyle={{
          opacity: 0,
        }}
      >
        <div>
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-[10px]">
              <div className="relative h-[40px] w-[40px]">
                <AvatarIcon className="text-[40px]" />
                <span className="absolute bottom-[-4px] right-[-2px] flex h-[20px]  w-[20px] items-center justify-center rounded-[10px] bg-fill-secondary text-[16px]">
                  {wallet === 'metamask' ? <MetamaskIcon /> : <FluentIcon />}
                </span>
              </div>
              <span className="flex items-center gap-[10px]">
                {maskAddress4(address)}
                <CopyOutlined
                  className="cursor-pointer hover:text-theme"
                  onClick={() => {
                    copy(address);
                  }}
                />
              </span>
            </div>
            <LogoutOutlined
              className="cursor-pointer text-[20px] hover:text-theme"
              onClick={() => {
                disconnectAsync().then(() => {
                  onOpen(false);
                  updateWallet(null);
                });
              }}
            />
          </div>

          <div className="mt-[20px] flex flex-col gap-[16px]"></div>
        </div>
      </Drawer>
    )
  );
};

export default WalletDetailModal;
