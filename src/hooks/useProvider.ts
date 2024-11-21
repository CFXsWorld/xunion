import { JsonRpcProvider } from 'ethers';
import { CHAINS } from '@/contracts/chains.tsx';

const useProvider = () => {
  const rpc = CHAINS.eSpace.rpc[0];
  return new JsonRpcProvider(rpc);
};

export default useProvider;
