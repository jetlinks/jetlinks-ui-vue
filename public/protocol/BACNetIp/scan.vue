<script setup>
import { inject, onMounted, defineProps, provide, ref } from 'vue'
import {useLocales} from '@hooks'
import {request} from '@jetlinks-web/core'

const scanSetting = inject("plugin-scan-point", {})
const collectionData = inject('collector-data', {})
const {$lang} = useLocales('BACNetIp')
const props = defineProps({
  objectId: String
})
const options = ref([])
scanSetting.value.options = []
scanSetting.value.valueTypes = []
scanSetting.value.optionsSelectKesy = new Set()
scanSetting.value.handleData = (data) => {
  return data.map(item => ({
    name: item.name,
    provider: 'BACNetIp',
    collectorId: collectionData.value?.id,
    collectorName: collectionData.value?.name,
    configuration: {
      interval: item.configuration?.interval?.value,
      valueType: item.valueType,
      propertyId: item.propertyId,
      objectId: item.objectId,
    },
    pointKey: `${item.objectId.type}:${item.objectId.instanceNumber}:${item.propertyId}`,
    features: !item.features?.value ? [] : ['changedOnly'],
    accessModes: item.accessModes?.value || [],
  }))
}

provide('bacnet-property-options', options)

request.post('/data-collect/BACNetIp/command/QueryValueTypes').then(resp => {
  if (resp.success) {
    scanSetting.value.valueTypes = resp.result.map(item => ({ label: item, value: item}))
  }
})

setTimeout(() => {
  scanSetting.value.columns = [
    {
      title: '对象类型',
      dataIndex: 'objectType',
      key: 'objectType',
      width: 140,
      fixed: 'left',
    },
    {
      title: '对象实例号',
      dataIndex: 'objectInstance',
      key: 'objectInstance',
      width: 120,
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      form: {
        required: true,
        rules: [
          {
            required: true,
            message: $lang('BACNetIp.scan.20250414-1'),
          },
        ]
      },
      template: {
        components: 'a-input',
        props: {
          placeholder: $lang('BACNetIp.scan.20250414-1')
        }
      }
    },
    {
      title: '属性ID',
      dataIndex: 'propertyId',
      width: 140,
      template: {
        components: () => 'ScanPointSelect',
        props: {
          placeholder: $lang('BACNetIp.scan.20250414-1')
        }
      }
    },
    {
      title: '值类型',
      dataIndex: 'dataType',
      width: 140,
      template: {
        components: 'a-select',
        props: {
          placeholder: $lang('BACNetIp.scan.20250414-1'),
          options: scanSetting.value.valueTypes,
          style: { width: '100%'}
        }
      }
    }
  ]
}, 500)

const getPropertyIds = async () => {
  const pointsResp = await request.post('/data-collect/point/_query', {})
  if (pointsResp.success) {
    const usedPropertyIds = new Set(pointsResp.result.data.map(item => item.configuration.propertyId))
    const resp = await request.post('/data-collect/BACNetIp/command/QueryPropertyIds')
    if (resp.success) {
      scanSetting.value.options = resp.result.filter(item => !usedPropertyIds.has(item))
    }
  }
}

getPropertyIds()
</script>

<template>

</template>

<style scoped lang="less">

</style>
