import { createStore, StoreApi, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { createContext, useContext } from 'react';

interface Pending {
  hash: string;
  data?: {
    type: 'SWAP' | 'LIMIT';
  };
}
interface Submitted {
  hash: string;
  title?: string;
  forceReload?: boolean;
}
export interface TxPendingState {
  pendingTransactions: Pending[];
  addPending: (tx: Pending) => void;
  removePending: (tx: Pending) => void;
  submittedTx?: Submitted | null;
  updateSubmitted: (submitted: Submitted | null) => void;
}

export const TXPendingContext = createContext<StoreApi<TxPendingState> | null>(
  null
);

export const createPendingStore = () =>
  createStore<TxPendingState>()(
    persist(
      immer((set) => ({
        pendingTransactions: [],
        submittedTx: null,
        addPending: (pending) =>
          set((state) => {
            state.pendingTransactions = [...state.pendingTransactions, pending];
          }),
        removePending: (pending) =>
          set((state) => {
            state.pendingTransactions = state.pendingTransactions.filter(
              (item) => item.hash === pending.hash
            );
          }),
        updateSubmitted: (submitted) =>
          set((state) => {
            state.submittedTx = submitted;
          }),
      })),
      {
        name: 'x-pending-transactions',
      }
    )
  );

export const useTxStore = <T>(selector: (state: TxPendingState) => T): T => {
  const store = useContext(TXPendingContext);
  if (!store) {
    throw new Error('Missing StoreProvider');
  }

  return useStore(store, selector);
};

export default useTxStore;
