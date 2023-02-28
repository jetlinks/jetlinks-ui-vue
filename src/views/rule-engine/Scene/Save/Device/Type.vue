<template>
  <div class='type'>
    <a-form ref='typeForm' :model='formModel' layout='vertical' :colon='false'>
      <a-form-item
        required
        label='触发类型'
      >
        <TopCard
          :label-bottom='true'
          :options='topOptions'
          v-model:value='formModel.operator'
        />
      </a-form-item>
      <Timer v-if='showTimer' v-model:value='formModel.timer' />
      <ReadProperties v-if='showReadProperty' v-model:value='formModel.readProperties' v-model:action='optionCache.action' :properties='readProperties' />
      <a-form-item
        v-if='showWriteProperty'
        name='writeProperties'
        :rules="[{ required: true, message: '请输入修改值' }]"
      >
        <WriteProperty v-model:value='formModel.writeProperties' v-model:action='optionCache.action' :properties='writeProperties' />
      </a-form-item>
      <a-form-item
        v-if='showReportEvent'
        name='eventId'
        :rules="[{ required: true, message: '请选择事件' }]"
      >
        <a-select
          v-model:value='formModel.eventId'
          :filter-option='filterSelectNode'
          :options='eventOptions'
          placeholder='请选择事件'
          style='width: 100%'
          @select='eventSelect'
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang='ts'>
import { filterSelectNode } from '@/utils/comm'
import { TopCard, Timer } from '@/views/rule-engine/Scene/Save/components'
import { getImage } from '@/utils/comm'
import { metadataType } from '@/views/rule-engine/Scene/typings'
import type { PropType } from 'vue'
import { TypeEnum } from '@/views/rule-engine/Scene/Save/Device/util'
import ReadProperties from './ReadProperties.vue'
import WriteProperty from './WriteProperty.vue'

const props = defineProps({
  metadata: {
    type: Object as PropType<metadataType>,
    default: () => ({})
  }
})

const formModel = reactive({
  operator: 'online',
  timer: {},
  readProperties: [],
  writeProperties: {},
  eventId: undefined,
  functionId: undefined,
  functionParameters: []
})

const optionCache = reactive({
  action: ''
})

const readProperties = ref<any[]>([])
const writeProperties = ref<any[]>([])
const eventOptions = ref<any[]>([])

const topOptions = computed(() => {
  const baseOptions = [
    {
      label: '设备上线',
      value: 'online',
      img: getImage('/scene/online.png'),
    },
    {
      label: '设备离线',
      value: 'offline',
      img: getImage('/scene/offline.png'),
    },
  ]

  if (props.metadata.events?.length) {
    baseOptions.push(TypeEnum.reportEvent)
    eventOptions.value = props.metadata.events.map(item => ({ ...item, label: item.name, value: item.id }))
  }

  if (props.metadata.properties?.length) {
    const _properties = props.metadata.properties
    readProperties.value = _properties.filter((item: any) => item.expands.type?.includes('read')).map(item => ({...item, label: item.name, value: item.id }))
    writeProperties.value = _properties.filter((item: any) => item.expands.type?.includes('write')).map(item => ({...item, label: item.name, value: item.id }))
    const reportProperties = _properties.filter((item: any) => item.expands.type?.includes('report')).map(item => ({...item, label: item.name, value: item.id }))

    if (readProperties.value.length) {
      baseOptions.push(TypeEnum.readProperty)
    }

    if (writeProperties.value.length) {
      baseOptions.push(TypeEnum.writeProperty)
    }

    if (reportProperties.length) {
      baseOptions.push(TypeEnum.reportProperty)
    }

  }

  if (props.metadata.functions?.length) {
    baseOptions.push(TypeEnum.invokeFunction)
  }

  return baseOptions
})

const showReadProperty = computed(() => {
  return formModel.operator === TypeEnum.readProperty.value
})

const showWriteProperty = computed(() => {
  return formModel.operator === TypeEnum.writeProperty.value
})

const showReportEvent = computed(() => {
  return formModel.operator === TypeEnum.reportEvent.value
})

const showInvokeFunction = computed(() => {
  return formModel.operator === TypeEnum.invokeFunction.value
})

const showTimer = computed(() => {
  return [
    TypeEnum.readProperty.value,
    TypeEnum.writeProperty.value,
    TypeEnum.invokeFunction.value
  ].includes(formModel.operator)
})

const eventSelect = (_: string, eventItem: any) => {
  optionCache.action = `${eventItem.name}上报`
}

</script>

<style scoped lang='less'>
.type {
  max-height: calc(100vh - 350px);
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 24px;
}
</style>