import { DeviceInstance, InstanceModel } from "@/views/device/instance/typings";
import { defineStore } from "pinia";

export const useInstanceStore = defineStore({
  id: 'device',
  state: () => ({} as InstanceModel),
  actions: {
    setCurrent(current: Partial<DeviceInstance>) {
      this.current = current
    }
  }
})