import { DeviceInstance, InstanceModel } from "@/views/device/Instance/typings"
import { defineStore } from "pinia";
import type { MetadataItem, MetadataType } from '@/views/device/Product/typings'

type MetadataModelType = {
  item: MetadataItem | unknown;
  edit: boolean;
  type: MetadataType;
  action: 'edit' | 'add';
  import: boolean;
  importMetadata: boolean;
};

export const useMetadataStore = defineStore({
  id: 'metadata',
  state: () => ({ 
    model: {
      item: undefined,
      edit: false,
      type: 'events',
      action: 'add',
      import: false,
      importMetadata: false,
    } as MetadataModelType,
    tabActiveKey: 'properties',
  }),
  actions: {
    set(key: string, value: any) {
      this.model[key] = value
    }
  }
})