// store/zustandStore.js
import { create } from "zustand";

const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ selectedProducts: products }),
}));

export default useProductStore;
