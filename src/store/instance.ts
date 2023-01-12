import { InstanceModel } from "@/views/device/instance/typings";
import { defineStore } from "pinia";

export const useInstanceStore = defineStore({
  id: 'device',
  state: () => ({} as InstanceModel),
});