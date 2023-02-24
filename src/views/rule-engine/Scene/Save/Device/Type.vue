<template>
  <div class='type'>
    <a-form ref='typeForm' :model='formModel' layout='vertical' :colon='false'>
      <a-form-item
        required
        label='触发类型'
      >
        <TopCard
          :label-bottom='true'
          :options='options'
          v-model:value='formModel.operator'
        />
      </a-form-item>
      <Timer v-if='showTimer' />
    </a-form>
  </div>
</template>

<script setup lang='ts'>

import TopCard from '@/views/rule-engine/Scene/Save/components/TopCard.vue'
import { getImage } from '@/utils/comm'
import { metadataType } from '@/views/rule-engine/Scene/typings'
import type { PropType } from 'vue'
import { TypeEnum } from '@/views/rule-engine/Scene/Save/Device/util'
import Timer from '../components/Timer.vue'

const props = defineProps({
  metadata: {
    type: Object as PropType<metadataType>,
    default: () => ({})
  }
})

const formModel = reactive({
  operator: 'online',
})

const readProperties = ref<any[]>([])
const writeProperties = ref<any[]>([])

const options = computed(() => {
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
  }

  if (props.metadata.properties?.length) {
    const _properties = props.metadata.properties
    readProperties.value = _properties.filter((item: any) => item.expands.type?.includes('read'))
    writeProperties.value = _properties.filter((item: any) => item.expands.type?.includes('write'))
    const reportProperties = _properties.filter((item: any) => item.expands.type?.includes('report'))

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

const showTimer = computed(() => {
  return ['readProperty', 'writeProperty', 'invokeFunction'].includes(formModel.operator)
})

</script>

<style scoped lang='less'>
.type {
  max-height: calc(100vh - 350px);
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 24px;
}
</style>