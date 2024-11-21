import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface CommonState {
  theme?: 'dark' | 'light' | string;
  updateTheme: (theme: string) => void;
  updateSwapLimit: (v: number[]) => void;
  swapLimit?: number[];
}

export const useCommonStore = create<CommonState>()(
  immer((set) => ({
    theme: 'light',
    swapLimit: [],
    updateSwapLimit: (v) => {
      set((state) => {
        state.swapLimit = v;
      });
    },
    updateTheme: (theme) =>
      set((state) => {
        state.theme = theme;
      }),
  }))
);
