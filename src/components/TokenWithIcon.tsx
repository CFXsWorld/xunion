import { TokenIcon } from '@/components/icons';
import { Token } from '@/types/swap.ts';
import { cn } from '@/utils/classnames';

const TokenWithIcon = ({
  token,
  className,
}: {
  token: Token;
  className?: string;
}) => {
  return (
    <div className={cn('flex items-center gap-[5px]', className)}>
      <TokenIcon src={token?.icon} name={token?.symbol || 'X'} />
      <span>{token?.symbol}</span>
    </div>
  );
};

export default TokenWithIcon;
