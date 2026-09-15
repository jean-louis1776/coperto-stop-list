import { create } from 'zustand';

interface StopListUiState {
  selectedItemId: string | null;
  openPanel: (itemId: string) => void;
  closePanel: () => void;
}

export const useStopListUiStore = create<StopListUiState>()((set) => ({
  selectedItemId: null,
  openPanel: (itemId) => set({ selectedItemId: itemId }),
  closePanel: () => set({ selectedItemId: null }),
}));
