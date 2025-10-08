import { create } from 'zustand';

interface Store {
  selectedRepo: string | null;
  setSelectedRepo: (repo: string | null) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useStore = create<Store>((set) => ({
  selectedRepo: null,
  setSelectedRepo: (repo) => set({ selectedRepo: repo }),
  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
