import { ProductItem } from "@/views/device/Product/typings";
import { defineStore } from "pinia";
import { detail, getDeviceNumber } from '@/api/device/product'
import encodeQuery from "@/utils/encodeQuery";

export const useProductStore = defineStore({
  id: 'product',
  state: () => ({
    current: {} as ProductItem,
    detail: {} as ProductItem,
    tabActiveKey: 'Info'
  }),
  actions: {
    setCurrent(current: ProductItem) {
      this.current = current
      this.detail = current
    },
    async getDetail(id: string) {
      const resp = await detail(id)
      if (resp.status === 200) {
        this.current = {
          ...this.current,...resp.result
        }
        this.detail = resp.result
      }
    },
    async refresh(id: string) {
      await this.getDetail(id)
      const res = await getDeviceNumber(encodeQuery({ terms: { productId: id } }))
      if (res.status === 200) {
        this.current.count = res.result
      }
    },
    setTabActiveKey(key: string) {
      this.tabActiveKey = key
    },
    reSet() {
      this.current = {} as ProductItem
      this.detail = {} as ProductItem
    }
  }
})