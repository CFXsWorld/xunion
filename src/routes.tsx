import { Navigate } from 'react-router-dom';
import PageLayout from '@/components/Layout/PageLayout';
import Swap from 'src/pages/x-dex/swap';
import Pools from '@/pages/x-dex/pools';
import Liquidity from '@/pages/x-dex/liquidity';
import CreatePool from '@/pages/x-dex/create-pool';
import Explore from '@/pages/x-dex/explore';
import PoolDetail from '@/pages/x-dex/explore/PoolDetail';
import TokenDetail from '@/pages/x-dex/explore/TokenDetail.tsx';
import TokenList from '@/pages/x-dex/explore/TokenList';
import PoolList from '@/pages/x-dex/explore/PoolList';

import MintSLC from 'src/pages/x-super-libra-coin/mint';
import BurnSLC from 'src/pages/x-super-libra-coin/burn';
import SLCBorrow from '@/pages/x-super-libra-coin/borrow';
import XLibraUSD from '@/pages/x-libra-usd';
import Dashboard from '@/pages/x-lending/dashboard';
import Market from '@/pages/x-lending/market';
import MarketDetail from '@/pages/x-lending/market/MarketDetail';
import Listing from '@/pages/x-dex/create-pool/Listing';
import LiquidityRemove from '@/pages/x-dex/liquidity/RemovePanel';

const routes = [
  {
    path: '/',
    element: <PageLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="x-dex" replace />,
      },
      {
        path: 'x-dex',
        children: [
          {
            path: '',
            element: <Navigate to="swap" replace />,
          },
          {
            path: 'swap',
            element: <Swap />,
          },
          {
            path: 'swap',
            element: <Swap />,
          },
          {
            path: 'liquidity',
            element: <Liquidity />,
          },

          {
            path: 'liquidity/remove/:address',
            element: <LiquidityRemove />,
          },
          {
            path: 'explore',
            element: <Explore />,
            children: [
              {
                path: '',
                element: <Navigate to="token" replace />,
              },
              {
                path: 'pool',
                element: <PoolList />,
              },
              {
                path: 'token',
                element: <TokenList />,
              },
            ],
          },
          {
            path: 'pools',
            element: <Pools />,
          },
          {
            path: 'explore/token/:address',
            element: <TokenDetail />,
          },
          {
            path: 'explore/pool/:address',
            element: <PoolDetail />,
          },
          {
            path: 'create-pool',
            element: <CreatePool />,
          },
          {
            path: 'listing',
            element: <Listing />,
          },
        ],
      },
      {
        path: 'x-libra-usd',
        element: <XLibraUSD />,
      },
      {
        path: 'x-super-libra-coin',
        children: [
          {
            path: '',
            element: <Navigate to="mint" replace />,
          },
          {
            path: 'mint',
            element: <MintSLC />,
          },
          {
            path: 'burn',
            element: <BurnSLC />,
          },
          {
            path: 'borrow',
            element: <SLCBorrow />,
          },
        ],
      },
      {
        path: 'x-lending',
        children: [
          {
            path: '',
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'market',
            element: <Market />,
          },
          {
            path: 'market/:address',
            element: <MarketDetail />,
          },
        ],
      },
    ],
  },
];

export default routes;
