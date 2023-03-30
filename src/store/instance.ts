import { DeviceInstance, InstanceModel } from "@/views/device/Instance/typings"
import { defineStore } from "pinia"
import { detail } from '@/api/device/instance'
import { onlyMessage } from "@/utils/comm"

export const useInstanceStore = defineStore({
  id: 'device',
  state: () => ({
    current: {} as DeviceInstance,
    detail: {} as DeviceInstance,
    tabActiveKey: 'Info'
  }),
  actions: {
    setCurrent(current: DeviceInstance) {
      this.current = current
      this.detail = current
    },
    async refresh(id: string) {
      const resp: any = await detail(id).catch((err) => {
        onlyMessage(err.response.data.message, 'error')
      })
      if(resp.status === 200){
        this.current = resp.result
        this.detail = resp.result
      } else {
        onlyMessage(resp?.message, 'error')
      }
    },
    setTabActiveKey(key: string) {
      this.tabActiveKey = key
    },
  }
})