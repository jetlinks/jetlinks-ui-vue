
export const tabs = {
  Info: defineAsyncComponent(() => import('./BasicInfo/index.vue')),
  Metadata: defineAsyncComponent(() => import('../../components/Metadata/index.vue')),
  Device: defineAsyncComponent(() => import('./DeviceAccess/index.vue')),
  DataAnalysis: defineAsyncComponent(() => import('./DataAnalysis/index.vue')),
  MetadataMap: defineAsyncComponent(() => import('./MetadataMap')),
  AlarmRecord: defineAsyncComponent(() => import('../../Instance/Detail/AlarmRecord/index.vue')),
  Firmware: defineAsyncComponent(() => import('../../Instance/Detail/Firmware/index.vue')),
  Invalid: defineAsyncComponent(() => import('../../Instance/Detail/Invalid/index.vue')),
  Dashboard: defineAsyncComponent(() => import('./Dashboard/index.vue')),
};
