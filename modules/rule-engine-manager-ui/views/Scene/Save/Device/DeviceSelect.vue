<template>
  <div class='device-select'>
    <TopCard :options='typeList' v-model:value='selectorModel' @select='select' />
    <DeviceList v-if='selectorModel === "fixed"' :productId='productId' :row-keys='devices' @update='updateDevice' />
    <OrgList v-else-if='selectorModel === "org" && isNoCommunity' :productId='productId' :row-keys='orgIds' @update='updateOrg' />
  </div>
</template>

<script setup lang='ts'>
import TopCard from '../components/TopCard.vue'
import DeviceList from './DeviceList.vue'
import OrgList from './OrgList.vue'
import type { PropType } from 'vue'
import { SelectorValuesItem } from '../../typings'
import { isNoCommunity } from '@jetlinks-web-core/utils/utils'
import { sceneImages } from '../../../../assets/index'
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
  { label: $t('Device.DeviceSelect.372525-0'), value: 'fixed', tip: $t('Device.DeviceSelect.372525-1'), img: sceneImages.deviceCustom},
  { label: $t('Device.DeviceSelect.372525-2'), value: 'all', tip: $t('Device.DeviceSelect.372525-3'), img: sceneImages.triggerDeviceAll},
])

if (isNoCommunity) {
  typeList.value.push({ label: $t('Device.DeviceSelect.372525-4'), value: 'org', tip: $t('Device.DeviceSelect.372525-5'), img: sceneImages.triggerDeviceOrg},)
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
  height: 100%;
}
</style>
