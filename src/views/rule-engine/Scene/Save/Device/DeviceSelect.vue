<template>
  <div class='device-select'>
    <TopCard :options='typeList' v-model:value='selectorModel' @select='select' />
    <DeviceList v-if='selectorModel === "fixed"' :productId='productId' :row-keys='devices' @update='updateDevice' />
    <OrgList v-else-if='selectorModel === "org" && isNoCommunity' :productId='productId' :row-keys='orgIds' @update='updateOrg' />
  </div>
</template>

<script setup lang='ts'>
import TopCard from '@/views/rule-engine/Scene/Save/components/TopCard.vue'
import DeviceList from './DeviceList.vue'
import OrgList from './OrgList.vue'
import { getImage } from '@/utils/comm'
import type { PropType } from 'vue'
import { SelectorValuesItem } from '@/views/rule-engine/Scene/typings'
import { isNoCommunity } from '@/utils/utils'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

type Emit = {
  (e: 'update:selector', data: string): void
  (e: 'update:selectorValues', data: SelectorValuesItem[]): void
  (e: 'update:deviceKeys', data: SelectorValuesItem[]): void
  (e: 'update:orgId', data: SelectorValuesItem[]): void
}

const emit = defineEmits<Emit>()

const props = defineProps({
  productId: {
    type: String,
    default: ''
  },
  selector: {
    type: String,
    default: ''
  },
  selectorValues: {
    type: Array as PropType<SelectorValuesItem[]>,
    default: () => []
  },
  deviceKeys: {
    type: Array as PropType<SelectorValuesItem[]>,
    default: () => []
  },
  orgId: {
    type: Array as PropType<SelectorValuesItem[]>,
    default: () => []
  }
})

const selectorModel = ref(props.selector)
const devices = ref(props.deviceKeys)
const orgIds = ref(props.orgId)

const typeList = ref([
  { label: $t('Device.DeviceSelect.5425846-0'), value: 'fixed', tip: $t('Device.DeviceSelect.5425846-1'), img: getImage('/scene/device-custom.png')},
  { label: $t('Device.DeviceSelect.5425846-2'), value: 'all', tip: $t('Device.DeviceSelect.5425846-3'), img: getImage('/scene/trigger-device-all.png')},
])

if (isNoCommunity) {
  typeList.value.push({ label: $t('Device.DeviceSelect.5425846-4'), value: 'org', tip: $t('Device.DeviceSelect.5425846-5'), img: getImage('/scene/trigger-device-org.png')},)
}

const select = (s: string) => {
  selectorModel.value = s
  devices.value = []
  orgIds.value = []
  emit('update:selector', s)
  emit('update:selectorValues', [])
  emit('update:deviceKeys', [])
  emit('update:orgId', [])
}

const updateDevice = (d: any[]) => {
  devices.value = d
  emit('update:deviceKeys', d)
  emit('update:selectorValues', d)
}

const updateOrg = (d: any[]) => {
  orgIds.value = d
  emit('update:orgId', d)
  emit('update:selectorValues', d)
}

</script>

<style scoped lang='less'>
.device-select{
  margin-top: 24px;
}
</style>