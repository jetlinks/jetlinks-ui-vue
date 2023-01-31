import { DeviceInstance, InstanceModel } from "@/views/device/Instance/typings"
import { defineStore } from "pinia"
import { detail } from '@/api/device/instance'

export const useInstanceStore = defineStore({
  id: 'device',
  state: () => ({
    current: {} as Partial<DeviceInstance>,
    detail: {} as Partial<DeviceInstance>,
    tabActiveKey: 'Info'
  }),
  actions: {
    setCurrent(current: Partial<DeviceInstance>) {
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