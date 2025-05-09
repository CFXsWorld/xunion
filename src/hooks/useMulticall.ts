import { Contract, InterfaceAbi } from 'ethers';
import { XUNION_SLC_CONTRACT } from '@/contracts';
import useProvider from '@/hooks/useProvider.ts';

export interface ContractCall {
  abi: InterfaceAbi;
  address: string;
  name: string;
  values: any[];
}

const useMulticall = () => {
  const { address, abi } = XUNION_SLC_CONTRACT.mutilCall;

  const provider = useProvider();

  const multicallContract = new Contract(address, abi, provider);

  const multiCall = async (calls: ContractCall[]) => {
    if (!calls.length) {
      console.warn('Calls must be definition');
      return;
    }
    const promises = [];
    for (const call of calls) {
      const contract = new Contract(call.address, call.abi, provider);
      promises.push([
        call.address,
        contract.interface.encodeFunctionData(call.name, call.values),
      ]);
    }
    return await multicallContract.aggregate.staticCall(promises);
    // return await multicallContract.tryAggregate.staticCall(true, promises);
  };
  return { multiCall };
};

export default useMulticall;
