<script setup>
import { inject } from 'vue'
import {useLocales} from '@hooks'

const scanSetting = inject("plugin-scan-point")
const collectionData = inject('collector-data', {})

const {$lang} = useLocales('OPC_UA')

scanSetting.value.handleData = (data) => {
  return data.map(item => ({
    name: item.name,
    provider: 'OPC_UA',
    collectorId: collectionData.value.id,
    collectorName: collectionData.value.name,
    pointKey: item.id,
    configuration: {
      interval: item.configuration?.interval?.value,
      type: item.type,
    },
    features: !item.features?.value ? [] : ['changedOnly'],
    accessModes: item.accessModes?.value || [],
  }))
}

setTimeout(() => {
  scanSetting.value.columns = [
    {
      title: $lang('OPC_UA.scan.20250414-1'),
      dataIndex: 'name',
      template: {
        components: 'a-input',
        props: {
          allowClear: true
        }
      },
      ellipsis: true,
    },
    {
      title: 'nodeId',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      ellipsis: true,
    },
  ]
}, 500)

</script>

<template>

</template>

<style scoped lang="less">

</style>
