import { defineStore } from "pinia"
import { detail } from '@/api/device/instance'
import { onlyMessage } from "@/utils/comm"

export const useMediaStore = defineStore({
  id: 'media',
  state: () => ({
    detail: {},
    tabActiveKey: 'Rule'
  }),
  actions: {
    setCurrent(current:any) {
      this.detail = current
    },
    async refresh(id: string,key:string) {
      const resp: any = key ==='auto' ? await detail(id) : await detail(id)
      if(resp.status === 200){
        this.detail = resp.result
      }
    },
    setTabActiveKey(key: string) {
      this.tabActiveKey = key
    },
  }
})