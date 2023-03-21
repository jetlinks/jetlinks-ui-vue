<template>
  <div class='type'>
    <j-form ref='typeForm' :model='formModel' layout='vertical' :colon='false'>
      <j-form-item
        required
        label='触发类型'
      >
        <TopCard
          :label-bottom='true'
          :options='topOptions'
          v-model:value='formModel.operator'
        />
      </j-form-item>
      <template v-if='showTimer'>
        <Timer ref='timerRef' v-model:value='formModel.timer' />
      </template>
      <ReadProperties
        v-if='showReadProperty'
        v-model:value='formModel.readProperties'
        v-model:action='optionCache.action'
        :properties='readProperties'
      />
      <WriteProperty
        ref='writeRef'
        v-if='showWriteProperty'
        v-model:value='formModel.writeProperties'
        v-model:action='optionCache.action'
        :properties='writeProperties'
      />
      <j-form-item
        v-if='showReportEvent'
        name='eventId'
        :rules="[{ required: true, message: '请选择事件' }]"
      >
        <j-select
          v-model:value='formModel.eventId'
          :filter-option='filterSelectNode'
          :options='eventOptions'
          placeholder='请选择事件'
          style='width: 100%'
          @select='eventSelect'
        />
      </j-form-item>
      <template v-if='showInvokeFunction'>
        <InvokeFunction
          ref='invokeRef'
          v-model:functionId='formModel.functionId'
          v-model:functionParameters='formModel.functionParameters'
          :functions='functionOptions'
        />
      </template>
    </j-form>
  </div>
</template>

<script setup lang='ts'>
import { filterSelectNode } from '@/utils/comm'
import { TopCard, Timer } from '@/views/rule-engine/Scene/Save/components'
import { getImage } from '@/utils/comm'
import type { metadataType, TriggerDeviceOptions } from '@/views/rule-engine/Scene/typings'
import type { PropType } from 'vue'
import { TypeEnum } from '@/views/rule-engine/Scene/Save/Device/util'
import ReadProperties from './ReadProperties.vue'
import WriteProperty from './WriteProperty.vue'
import InvokeFunction from './InvokeFunction.vue'
import { defineExpose } from 'vue'
import { cloneDeep, omit } from 'lodash-es'

const props = defineProps({
  metadata: {
    type: Object as PropType<metadataType>,
    default: () => ({})
  },
  operator: {
    type: Object as PropType<TriggerDeviceOptions>,
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

Object.assign(formModel, props.operator)

const optionCache = reactive({
  action: ''
})

const readProperties = ref<any[]>([])
const writeProperties = ref<any[]>([])
const eventOptions = ref<any[]>([])
const functionOptions = ref<any[]>([])

const typeForm = ref()
const timerRef = ref()
const writeRef = ref()
const invokeRef = ref()

const topOptions = computed(() => {
  const baseOptions = [
    {
      label: '设备上线',
      value: 'online',
      img: getImage('/scene/online.png')
    },
    {
      label: '设备离线',
      value: 'offline',
      img: getImage('/scene/offline.png')
    }
  ]

  if (props.metadata.events?.length) {
    baseOptions.push(TypeEnum.reportEvent)
    eventOptions.value = props.metadata.events.map(item => ({ ...item, label: item.name, value: item.id }))
  }

  if (props.metadata.properties?.length) {
    const _properties = props.metadata.properties
    readProperties.value = _properties.filter((item: any) => item.expands.type?.includes('read')).map(item => ({
      ...item,
      label: item.name,
      value: item.id
    }))
    writeProperties.value = _properties.filter((item: any) => item.expands.type?.includes('write')).map(item => ({
      ...item,
      label: item.name,
      value: item.id
    }))
    const reportProperties = _properties.filter((item: any) => item.expands.type?.includes('report')).map(item => ({
      ...item,
      label: item.name,
      value: item.id
    }))

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
    functionOptions.value = props.metadata.functions.map(item => ({ ...item, label: item.name, value: item.id }))
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

defineExpose({
  vail: () => {
    return new Promise(async (resolve, reject) => {

      const cloneModel = cloneDeep(formModel)
      const filterKey: string[] = []
      const typeData = await typeForm.value?.validateFields()

      if (!typeData) return resolve(false)

      if (!showReadProperty.value) {
        filterKey.push('readProperties')
      }

      if (showInvokeFunction.value) {
        const invokeData = await invokeRef.value?.validateFields()
        if (!invokeData) return resolve(false)
      } else {
        filterKey.push('functionId')
        filterKey.push('functionParameters')
      }

      if (showTimer.value) {
        const timerData = await timerRef.value?.validateFields()
        if (!timerData) return resolve(false)
      } else {
        filterKey.push('timer')
      }

      if (!showReportEvent.value) {
        filterKey.push('eventId')
      }
      if (showWriteProperty.value) {
        const writeData = await writeRef.value?.validateFields()
        if (!writeData) return resolve(false)
      } else {
        filterKey.push('writeProperties')
      }

      resolve({ data: omit(cloneModel, filterKey), action: optionCache.action })
    })
  }
})

</script>

<style scoped lang='less'>
.type {
  margin-top: 24px;
}
</style>