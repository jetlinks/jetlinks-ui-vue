<template>
  <slot></slot>
</template>

<script setup lang='ts' name='CheckItem'>
import { storeToRefs } from 'pinia';
import { useSceneStore } from '@/store/scene'
import { Form } from 'jetlinks-ui-components'
import { queryProductList } from '@/api/device/product'
import { query as deviceQuery } from '@/api/device/instance'
import { getTreeData_api } from '@/api/system/department'

const sceneStore = useSceneStore()
const { data } = storeToRefs(sceneStore)
const formItemContext = Form.useInjectFormItemContext()

const formTouchOff = () => {
  formItemContext.onFieldChange()
}

const check = async (): Promise<boolean> => {
  const deviceTrigger = data.value.trigger!.device!
  const productId = deviceTrigger.productId

  // 判断产品是否删除
  const proResp = await queryProductList({ terms: [{ terms: [{ column: 'id', termType: 'eq', value: productId }]}]})
  if (proResp.success && (proResp.result as any)?.total === 0) {
    data.value.trigger!.device!.productId = ''
    return false
  }

  const productDetail = proResp?.result?.data?.[0]
  const selectorValues = deviceTrigger.selectorValues?.map(item => item.value)
  let metadata = JSON.parse(productDetail?.metadata || '{}') // 获取当前产品物模型

  // 判断设备是否删除
  if (deviceTrigger.selector === 'fixed') { // 设备
    const deviceResp = await deviceQuery({ terms: [{ column: 'id', termType: 'in', value: selectorValues?.toString() }]})
    if (deviceResp.success && (deviceResp.result as any)?.total !== (selectorValues!.length)) {
      data.value.trigger!.device!.selectorValues = undefined
      return false
    }

    if (selectorValues!.length === 1) {
      const deviceDetail = deviceResp?.result?.data?.[0]
      metadata = JSON.parse(deviceDetail?.metadata || '{}') // 只选中一个设备，以设备物模型为准
    }
  } else if (deviceTrigger.selector === 'org') { // 组织
    const orgResp = await getTreeData_api({
      paging: false,
      terms: [{ column: 'id', termType: 'eq', value: selectorValues![0] }]
    })

    if (orgResp.success && (orgResp.result as any[]).length !== selectorValues!.length) {
      data.value.trigger!.device!.selectorValues = undefined
      return false
    }
  }

  // 判断物模型
  if (['readProperty', 'writeProperty'].includes(deviceTrigger.operation?.operator!)) {
    let hasProperties = false
    if (metadata.properties.length) {
      if (deviceTrigger.operation?.readProperties && deviceTrigger.operation?.readProperties.length) {
        // hasProperties = metadata.properties.every((item: any) => deviceTrigger.operation!.readProperties!.includes(item.id))
        hasProperties = deviceTrigger.operation!.readProperties.every(_id => metadata.properties.some((item: any) => item.id === _id))
      } else if (deviceTrigger.operation?.writeProperties && Object.keys(deviceTrigger.operation?.writeProperties).length) {
        const key = Object.keys(deviceTrigger.operation?.writeProperties)[0]
        hasProperties = metadata.properties.some((item: any) => key ===item.id)
      }
    }

    if (!hasProperties) {
      if (deviceTrigger.operation?.operator === 'readProperty') {
        deviceTrigger.operation!.readProperties = []
      } else {
        deviceTrigger.operation!.writeProperties = {}
      }
      return false
    }
  }

  if (deviceTrigger.operation?.operator === 'invokeFunction') {
    let hasProperties = false
    if (metadata.functions.length) {
      const functionId = deviceTrigger.operation?.functionId
      hasProperties = metadata.functions.some((item: any) => functionId ===item.id)
    }

    if (!hasProperties) {
      deviceTrigger.operation.functionId = undefined
      deviceTrigger.operation.functionParameters = []
      return false
    }
  }

  if (deviceTrigger.operation?.operator === 'reportEvent') {
    let hasProperties = false
    if (metadata.events.length) {
      const eventId = deviceTrigger.operation.eventId
      hasProperties = metadata.events.some((item: any) => eventId ===item.id)
    }

    if (!hasProperties) {
      deviceTrigger.operation.eventId = undefined
      return false
    }
  }

  return true
}

const checkInit = async () => {
  if (data.value.trigger?.device) {
    const checkStatus = await check()
    if (!checkStatus) {
      formTouchOff()
    }
  }
}

checkInit()

</script>

<style scoped>

</style>