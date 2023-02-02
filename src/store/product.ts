import { ProductItem } from "@/views/device/Product/typings";
import { defineStore } from "pinia";
import { detail} from '@/api/device/product'

export const useProductStore = defineStore({
  id: 'product',
  state: () => ({
    current: {} as ProductItem | undefined,
    detail: {} as ProductItem | undefined,
    tabActiveKey: 'Info'
  }),
  actions: {
    setCurrent(current: ProductItem) {
      this.current = current
      this.detail = current
    },
    async refresh(id: string) {
      const resp = await detail(id)
      if(resp.status === 200){
        this.current = resp.result
        this.detail = resp.result
      }
    },
    setTabActiveKey(key: string) {
      this.tabActiveKey = key
    },
  }
})