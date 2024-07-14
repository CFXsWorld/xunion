import useMulticall, { ContractCall } from '@/hooks/useMulticall.ts';
import { SwapRoute } from '@/types/swap.ts';
import { XUNION_SWAP_CONTRACT } from '@/contracts';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { findIndex, maxBy } from 'lodash';
import { formatUnits } from 'ethers';

const useBestRoute = () => {
  const { multiCall } = useMulticall();
  const { address: interfaceAddress, abi } = XUNION_SWAP_CONTRACT.interface;
  const { getRealAddress } = useNativeToken();

  const decodeData = (hexString: string) => {
    const chunkSize = 64;
    const cleanHexString = hexString.slice(2);
    const chunks = cleanHexString.match(
      new RegExp(`.{1,${chunkSize}}`, 'g')
    ) as string[];
    return chunks.map((chunk, chunkIndex) => {
      const resultHex = `0x${chunk}`;
      if (chunkIndex === 0) {
        return formatUnits(resultHex).toString();
      } else {
        return formatUnits(resultHex, 0).toString();
      }
    });
  };

  const getBestInputAmount = async (routes: SwapRoute[], amount: string) => {
    const calls: ContractCall[] = routes.map((router) => {
      const routes = router.route;
      const path = routes.map((item, index) => {
        if (index === 0 || index === routes.length - 1) {
          return getRealAddress(item);
        }
        return item.address;
      });
      return {
        name: 'xExchangeEstimateOutput',
        abi: abi,
        address: interfaceAddress,
        values: [path, amount],
      };
    });
    return multiCall(calls).then(async (allAmounts) => {
      const parsedAmountsInfo = (allAmounts.returnData as string[]).map(
        decodeData
      );
      const maxAmount = maxBy(parsedAmountsInfo, (amount) =>
        Number(amount[0])
      ) as string[];
      const maxIndex = findIndex(
        parsedAmountsInfo,
        (amount) => amount[0] === maxAmount?.[0]
      );
      const route = routes[maxIndex];
      return {
        route,
        amount: [
          maxAmount[0],
          [maxAmount[1], maxAmount[2], maxAmount[3]],
          maxAmount[4],
        ],
      };
    });
  };
  const getBestOutputAmount = async (routes: SwapRoute[], amount: string) => {
    const calls: ContractCall[] = routes.map((router) => {
      const routes = router.route;
      const path = routes.map((item, index) => {
        if (index === 0 || index === routes.length - 1) {
          return getRealAddress(item);
        }
        return item.address;
      });
      return {
        name: 'xExchangeEstimateInput',
        abi: abi,
        address: interfaceAddress,
        values: [path, amount],
      };
    });
    return multiCall(calls).then(async (allAmounts) => {
      const parsedAmountsInfo = (allAmounts.returnData as string[]).map(
        decodeData
      );
      const maxAmount = maxBy(parsedAmountsInfo, (amount) =>
        Number(amount[0])
      ) as string[];
      const maxIndex = findIndex(
        parsedAmountsInfo,
        (amount) => amount[0] === maxAmount?.[0]
      );
      const route = routes[maxIndex];
      return {
        route,
        amount: [
          maxAmount[0],
          [maxAmount[1], maxAmount[2], maxAmount[3]],
          maxAmount[4],
        ],
      };
    });
  };

  return {
    getBestOutputAmount,
    getBestInputAmount,
  };
};

export default useBestRoute;
