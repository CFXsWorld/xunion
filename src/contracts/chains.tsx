import { ChainType } from '@/types/chain.ts';
import { ESpaceIcon, ScrollIcon } from '@/components/icons/chains.tsx';

type ChainName = 'eSpace' | 'scroll' | 'eSpaceTest' | 'scrollTest';

export const CHAINS: Record<ChainName, ChainType> = {
  eSpace: {
    chainId: 1_030,
    name: 'Conflux eSpace',
    icon: <ESpaceIcon />,
    rpc: ['https://evm.confluxrpc.com'],
  },
  scroll: {
    chainId: 534352,
    name: 'Scroll',
    icon: <ScrollIcon />,
    rpc: ['https://rpc.scroll.io'],
  },
  eSpaceTest: {
    chainId: 71,
    name: 'Conflux eSpace',
    icon: <ESpaceIcon />,
    rpc: [
      'https://evmtestnet.confluxrpc.org/3zE8uVdvebDSL9KykwKqaDKUYXJiN7jGchiDfpr9Sgr4YqPWGNyi4X877wm7EeBbmtDwXXA3duVLYysoDP2EmD1hC',
      'https://evmtestnet.confluxrpc.org',
    ],
  },
  scrollTest: {
    chainId: 534351,
    name: 'Scroll',
    icon: <ScrollIcon />,
    rpc: ['https://scroll-sepolia.blockpi.network/v1/rpc/public'],
  },
};
