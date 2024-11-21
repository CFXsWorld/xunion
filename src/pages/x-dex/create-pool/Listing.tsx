import { Link } from 'react-router-dom';
import {
  CheckCircleOutlined,
  LeftOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import TokenInput from '@/components/TokenInput.tsx';
import useListing from '@/pages/x-dex/hooks/useListing';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import { Button } from 'antd';
import { XUNION_SWAP_CONTRACT } from '@/contracts';
import UploadInfo from '@/pages/x-dex/create-pool/UploadInfo.tsx';
import { useTranslate } from '@/i18n';
import SLCTokenInput from '@/components/SLCTokenInput';
import Info from '@/components/Info';
import { Address } from 'viem';
import useNativeToken from '@/hooks/useNativeToken';
import useApprove from '../hooks/useApprove';
import { useCommonStore } from '@/store/common';

function CreatePool() {
  const {
    tokenA,
    onTokenAChange,
    tokenAOwnerAmount,
    tokenB,
    tokenBAmount,
    setTokenBAmount,
    tokenBOwnerAmount,
    lpPairAddress,
    onCreate,
    loading,
    tokenAAmount,
    onTokenAAmountChange,
    disabled,
    invalidWallet,
  } = useListing();

  const { t } = useTranslate();
  const listingLimit = useCommonStore((state) => state.swapLimit?.[0] || 200);
  const {
    isApproved: isTokenAApproved,
    loading: isTokenAApproving,
    approve: approveTokenA,
  } = useApprove({
    token: tokenA!,
    amount: tokenAAmount,
    spenderAddress: XUNION_SWAP_CONTRACT.interface.address as Address,
  });

  const { isNativeToken } = useNativeToken();

  const {
    isApproved: isTokenBApproved,
    loading: isTokenBApproving,
    approve: approveTokenB,
  } = useApprove({
    token: tokenB!,
    amount: tokenBAmount,
    spenderAddress: XUNION_SWAP_CONTRACT.interface.address as Address,
  });

  const approvedAll =
    (isNativeToken(tokenA!) || isTokenAApproved) &&
    (isNativeToken(tokenB!) || isTokenBApproved);

  return (
    <div className="mb-[60px] flex flex-1 flex-col items-center justify-center pt-[20px] max-md:pt-[20px]">
      <div className="mt-[30px] min-h-[420px] w-[500px] rounded-[20px]  bg-fill-niubi p-[20px] max-md:w-full max-md:px-[10px]">
        <Link
          to="/x-dex/liquidity"
          className="inline-block w-auto cursor-pointer  hover:text-theme"
        >
          <LeftOutlined />
          <span className="pl-[10px]">{t('x-dex.liquidity.listing')}</span>
        </Link>

        <div className="my-[10px]">
          <Info>{t('x-dex.liquidity.no.pair.address.tip')}</Info>
        </div>
        <div className="my-[20px]">
          <TokenInput
            title={t('x-dex.liquidity.input.tokenA')}
            editable
            token={tokenA}
            onTokenChange={onTokenAChange}
            amount={tokenAAmount}
            onAmountChange={onTokenAAmountChange}
            disabledToken={tokenB}
            disabled={invalidWallet}
            onMax={(ownerAmount) => {
              onTokenAAmountChange(ownerAmount.toString());
            }}
            ownerAmount={tokenAOwnerAmount}
            totalPrice={0}
          />
          <div className="relative h-[20px]">
            <div className="flex-center  absolute left-[50%]  top-[-8px] h-[36px] w-[36px] -translate-x-[50%] transform rounded-[2px] border-[3px] border-line-primary2 bg-background-primary">
              <PlusOutlined />
            </div>
          </div>
          <SLCTokenInput
            editable
            title={t('x-dex.liquidity.input.tokenB')}
            token={tokenB}
            placeholder={`${listingLimit}`}
            amount={tokenBAmount}
            onAmountChange={setTokenBAmount}
            ownerAmount={tokenBOwnerAmount}
          />
        </div>
        <WithAuthButton>
          <div>
            {!disabled && (
              <div className="flex-center mb-[10px] gap-[20px]">
                {tokenA && !isNativeToken(tokenA) && (
                  <Button
                    className="flex-1"
                    type="primary"
                    size="large"
                    disabled={isTokenAApproved}
                    icon={isTokenBApproved ? <CheckCircleOutlined /> : null}
                    loading={isTokenAApproving}
                    onClick={approveTokenA}
                  >
                    {isTokenAApproved
                      ? t('common.approved', { name: `${tokenA?.symbol}` })
                      : t('common.approve.to', { name: `${tokenA?.symbol}` })}
                  </Button>
                )}
                {tokenB && !isNativeToken(tokenB) && (
                  <Button
                    className="flex-1"
                    type="primary"
                    size="large"
                    disabled={isTokenBApproved}
                    loading={isTokenBApproving}
                    icon={isTokenBApproved ? <CheckCircleOutlined /> : null}
                    onClick={approveTokenB}
                  >
                    {isTokenBApproved
                      ? t('common.approved', { name: `${tokenB?.symbol}` })
                      : t('common.approve.to', { name: `${tokenB?.symbol}` })}
                  </Button>
                )}
              </div>
            )}
            <Button
              className="w-full"
              type="primary"
              size="large"
              onClick={onCreate}
              loading={loading}
              disabled={disabled || !approvedAll}
            >
              {lpPairAddress
                ? `${tokenA?.symbol} already listed`
                : t('x-dex.liquidity.listing')}
            </Button>
          </div>
        </WithAuthButton>
        <UploadInfo lpAddress={lpPairAddress} tokenAddress={tokenA?.address} />
      </div>
    </div>
  );
}

export default CreatePool;
