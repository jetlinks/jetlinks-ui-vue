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
    collectorId: props.data?.id,
    collectorName: props.data?.name,
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
  scanSetting.columns = [
    {
      title: $lang('OPC_UA.scan.20250414-1'),
      dataIndex: 'name',
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
