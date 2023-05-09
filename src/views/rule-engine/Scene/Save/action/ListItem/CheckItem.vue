<template>
  <slot />
</template>

<script setup lang='ts' name='ActionCheckItem'>
import { ActionsType } from '@/views/rule-engine/Scene/typings'
import { useSceneStore } from '@/store/scene';
import { storeToRefs } from 'pinia';
import { queryProductList } from '@/api/device/product'
import { query as deviceQuery } from '@/api/device/instance'
import noticeConfig from '@/api/notice/config'
import noticeTemplate from '@/api/notice/template'
import { Form } from 'jetlinks-ui-components'
import { EventEmitter, EventSubscribeKeys } from '@/views/rule-engine/Scene/Save/util'
const sceneStore = useSceneStore();
const { data: _data } = storeToRefs(sceneStore);

const formItemContext = Form.useInjectFormItemContext()

const props = defineProps({
  branchesName: {
    type: Number,
    default: 0,
  },
  thenName: {
    type: Number,
    default: 0,
  },
  name: {
    type: Number,
    default: 0,
  },
});

const sub = ref()

const rules = [{
  validator(_: any, v?: ActionsType) {
    if (v?.executor === 'device') {
      if(
        !v.device?.productId ||  // 产品已删除
        !v.device?.selectorValues || // 设备已删除
        (v.device.source === 'upper' && !v.device?.upperKey)
      ) {
        return Promise.reject(new Error('该数据已发生变更，请重新配置'))
      }
    }
    return Promise.resolve()
  }
}]

const formTouchOff = () => {
  formItemContext.onFieldChange()
}

/**
 * 校验当前执行动作的设备或者产品是否删除
 */
const checkDeviceDelete = async () => {
  const item = _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device
  const proResp = await queryProductList({ terms: [{ terms: [{ column: 'id', termType: 'eq', value: item!.productId }]}]})
  if (proResp.success && (proResp.result as any)?.total === 0 && item && item.productId) { // 产品已删除
    _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.productId = undefined
    formTouchOff()
    return
  }
  if (item?.selector === 'fixed') {
    const deviceList = item!.selectorValues?.map(item => item.value) || []
    const deviceResp = await deviceQuery({ terms: [{ terms: [{ column: 'id', termType: 'in', value: deviceList.toString() }]}]})
    if (deviceResp.success && (deviceResp.result as any)?.total < (item!.selectorValues?.length || 0)) { // 某一个设备被删除
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.selectorValues = undefined
      formTouchOff()
      return
    }
  }
  console.log(item!.source, props.name)
  if (item!.source === 'upper') { // 如果是按变量，校验上一个设备输出的产品id
    if (props.name === 0) {
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.upperKey = undefined
      formTouchOff()
      return
    } else {
      const prevItem = _data.value.branches![props.branchesName].then[props.thenName].actions[props.name - 1].device
      if (prevItem?.productId !== item?.productId) {
        _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.upperKey = undefined
        formTouchOff()
        return
      }
    }
  }
}

/**
 * 校验当前执行动作的通知配置、消息模板是否删除
 */
const checkNoticeDelete = async () => {
  const item = _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].notify
  const configResp = await noticeConfig.list({ terms: [{ terms: [{ column: 'id', termType: 'eq', value: item!.notifierId }]}]})
  if (configResp.success && (configResp.result as any)?.total === 0) {
    _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].notify!.notifierId = ''
    formTouchOff()
    return
  }
  const templateResp = await noticeTemplate.list({ terms: [{ terms: [{ column: 'id', termType: 'eq', value: item!.templateId }]}]})
  if (templateResp.success && (templateResp.result as any)?.total === 0) {
    _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].notify!.templateId = ''
    formTouchOff()
    return
  }
}

const check = () => {
  const _executor = _data.value.branches![props.branchesName].then[props.thenName].actions[props.name]?.executor
  if (_executor === 'device' && _data.value.branches![props.branchesName].then[props.thenName].actions[props.name]?.device) { // 设备输出，并且有值
    checkDeviceDelete()
  } else if (_executor === 'notify' && _data.value.branches![props.branchesName].then[props.thenName].actions[props.name]?.notify) {
    checkNoticeDelete()
  }
}

const subscribe = () => {
  // 订阅上一个action
  const _key = EventSubscribeKeys({
    branch: props.branchesName,
    branchGroup: props.thenName,
    action: props.name
  })

  sub.value = EventEmitter.subscribe(_key, check)
}

subscribe()

check()

</script>

<style scoped>

</style>