import { DeviceInstance } from "../views/device/Instance/typings"
import { defineStore } from "pinia"
import { detail } from '../api/instance'

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
    setState(state: {
      value: string;
      text: string;
    }) {
      this.current.state = state
      this.detail.state = state
    },
    async refresh(id: string) {
      const resp: any = await detail(id)
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
