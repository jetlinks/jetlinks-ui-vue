import type { ProductItem } from "../views/device/Product/typings";
import { defineStore } from "pinia";
import { queryDetailList, getDeviceNumber } from '../api/product'
import {encodeQuery} from "@jetlinks-web-core/utils";

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
      // 改成这个接口的原因是为了查询features
      const resp = await queryDetailList({
        "pageSize":1,
        "terms":[
          {
            "column": "id",
            "value": id
          }
        ]
      })
      if (resp.status === 200) {
        const obj = resp.result?.data?.[0] || {}
        this.current = {
          ...this.current,...obj
        }
        this.detail = obj
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
