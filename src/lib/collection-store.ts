// Hook para gerenciar atualizações da coleção
import { create } from 'zustand';

interface CollectionStore {
  shouldRefresh: boolean;
  triggerRefresh: () => void;
  resetRefresh: () => void;
}

export const useCollectionStore = create<CollectionStore>((set) => ({
  shouldRefresh: false,
  triggerRefresh: () => set({ shouldRefresh: true }),
  resetRefresh: () => set({ shouldRefresh: false }),
}));
