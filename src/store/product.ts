import { ProductItem } from "@/views/device/Product/typings";
import { defineStore } from "pinia";

export const useProductStore = defineStore({
  id: 'product',
  state: () => ({
    current: {} as ProductItem | undefined
  }),
  actions: {
    setCurrent(current: ProductItem) {
      this.current = current
    }
  }
})