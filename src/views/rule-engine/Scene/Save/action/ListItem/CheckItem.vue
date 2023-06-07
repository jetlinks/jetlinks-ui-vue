<template>
  <slot />
</template>

<script setup lang='ts' name='ActionCheckItem'>
import { ActionsType, FormModelType, PlatformRelation } from '@/views/rule-engine/Scene/typings'
import { useSceneStore } from '@/store/scene';
import { storeToRefs } from 'pinia';
import { queryProductList } from '@/api/device/product'
import { query as deviceQuery } from '@/api/device/instance'
import noticeConfig from '@/api/notice/config'
import noticeTemplate from '@/api/notice/template'
import { Form } from 'jetlinks-ui-components'
import { EventEmitter, EventSubscribeKeys, getParams } from '@/views/rule-engine/Scene/Save/util'
import { getOption } from '@/views/rule-engine/Scene/Save/components/DropdownButton/util'
import { getBuildInData, getNotifyVariablesUser } from './util'
import { defineExpose } from 'vue'

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

  const productDetail = proResp?.result?.data?.[0]
  let metadata = JSON.parse(productDetail?.metadata || '{}')
  if (item?.selector === 'fixed') {
    let hasDevice = false
    if (item!.selectorValues) {
      const deviceList = item!.selectorValues?.map(item => item.value) || []
      const deviceResp = await deviceQuery({ terms: [{ terms: [{ column: 'id', termType: 'in', value: deviceList.toString() }]}]})
      hasDevice = deviceResp.success && (deviceResp.result as any)?.total === (item!.selectorValues?.length || 0)

      if (item!.selectorValues!.length === 1 && hasDevice) {
        const deviceDetail = deviceResp?.result?.data?.[0]
        metadata = JSON.parse(deviceDetail?.metadata || '{}') // 只选中一个设备，以设备物模型为准
      }
    }
    if (!hasDevice) { // 某一个设备被删除
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.selectorValues = undefined
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.changeData = true
      formTouchOff()
      return
    }

  } else if (item!.selector === 'context') { // 如果是按变量，校验上一个设备输出的产品id
    if (props.name === 0) {
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.upperKey = undefined
      formTouchOff()
      return
    } else {
      const prevItem = _data.value.branches![props.branchesName].then[props.thenName].actions[props.name - 1].device
      if (prevItem?.productId !== item?.productId) {
        _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.upperKey = undefined
        _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.changeData = true
        formTouchOff()
        return
      } else {
        const _upperKey = item!.upperKey
        const _params = {
          branch: props.thenName,
          branchGroup: props.branchesName,
          action: props.name - 1,
        };
        const upperData = await getParams(_params, unref(_data.value));
        const option = getOption(upperData, _upperKey, 'id')
        if (!option) {
          _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.upperKey = undefined
          _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.changeData = true
          formTouchOff()
          return
        }
      }
    }
  } else if (item!.selector === 'relation') {
    const _relationValue = (item!.selectorValues?.[0]?.value as any)?.relation
    const relationData = await noticeConfig.getRelationUsers({
      paging: false,
      sorts: [{ name: 'createTime', order: 'desc' }],
      terms: [
        { termType: 'eq', column: 'objectTypeName', value: '设备' },
        { termType: 'eq', column: 'relation', value: _relationValue }
      ],
    }).catch(() => ({ success: false, result: []}))
    if (!relationData.result?.length ) {
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.selectorValues = undefined
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.changeData = true
      formTouchOff()
      return
    }
  } else if (item!.selector === 'tag') {
    let hasAllTags = false
    if (item!.selectorValues && metadata?.tags?.length) {
      const values = (item!.selectorValues?.[0]?.value as any).map((item: any) => item.column)
      const tagKeys = new Set(values)
      hasAllTags = [...tagKeys.values()].every((_key) => metadata?.tags.some((item: any) => item.id === _key))
      // hasAllTags = metadata?.tags?.every((item: any) => tagKeys.has(item.id))
    }
    if (!hasAllTags) {
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.selectorValues = undefined
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.changeData = true
      formTouchOff()
      return
    }
  }

  if (item!.message!.messageType === 'READ_PROPERTY') {
    let hasProperties = false
    if (item!.message!.properties && metadata.properties.length) {
      const propertiesKey = item!.message!.properties?.[0]
      hasProperties = metadata.properties?.some((item: any) => item.id === propertiesKey)
    }
    if (!hasProperties) {
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.message!.properties = []
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.changeData = true
      formTouchOff()
      return
    }

  }

  if (item!.message!.messageType === 'WRITE_PROPERTY') {
    let hasProperties = false
    const propertiesKey = Object.keys(item!.message!.properties!)?.[0]
    if (item!.message!.properties && metadata.properties.length) {
      hasProperties = metadata.properties?.some((item: any) => item.id === propertiesKey)
    }
    if (!hasProperties) {
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.message!.properties = undefined
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.changeData = true
      formTouchOff()
      return
    }
    // 判断值-内置参数
    const _value = item!.message!.properties?.[propertiesKey]
    if(_value.source === 'upper') {
      const _params = {
        branch: props.thenName,
        branchGroup: props.branchesName,
        action: props.name - 1,
      };
      const option = (await getBuildInData(_params, _data.value))(_value?.value!, 'id')
      if(!option) {
        _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.message!.properties![propertiesKey] = undefined
        _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.changeData = true
        formTouchOff()
        return
      }
    }
  }

  if (item!.message!.messageType === 'INVOKE_FUNCTION') {
    const functionId = item!.message!.functionId
    let hasFunctions = false
    if (functionId && metadata.functions.length) {
      hasFunctions = metadata.functions?.some((item: any) => item.id === functionId)
    }
    if (!hasFunctions) {
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.message!.functionId = undefined
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].device!.changeData = true
      formTouchOff()
      return
    }

  }
}

/**
 * 校验当前执行动作的通知配置、消息模板是否删除
 */
const checkNoticeDelete = async () => {
  const item = _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].notify
  const _triggerType = _data.value.triggerType
  const configResp = await noticeConfig.list({ terms: [{ terms: [{ column: 'id', termType: 'eq', value: item!.notifierId }]}]})
  if (configResp.success && (configResp.result as any)?.total === 0) { // 通知配置
    _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].notify!.notifierId = ''
    formTouchOff()
    return
  }
  const templateResp = await noticeTemplate.list({ terms: [{ terms: [{ column: 'id', termType: 'eq', value: item!.templateId }]}]})
  if (templateResp.success && (templateResp.result as any)?.total === 0) { // 通知模板
    _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].notify!.templateId = ''
    formTouchOff()
    return
  }
  const templateDetailResp = await noticeTemplate.getTemplateDetail(item!.templateId)
  if (templateDetailResp.success) {
    const variableDefinitionsMap = new Map()
    const itemVariableKeys = Object.keys(item!.variables)
    const notifyType = item!.notifyType
    templateDetailResp.result.variableDefinitions.map((dItem: any) => {
      variableDefinitionsMap.set(dItem.id, dItem.expands?.businessType)
    })
    // 判断参数是否发生变化
    let BuildInData: any = null
    const hasAll = itemVariableKeys.every(async (variableKey: any) => {
      if (variableDefinitionsMap.has(variableKey)) {
        const itemData = item!.variables[variableKey]
        if (itemData.source === 'upper') {
          if (!BuildInData) {
            const _params = {
              branch: props.thenName,
              branchGroup: props.branchesName,
              action: props.name - 1,
            };
            BuildInData = await getBuildInData(_params, _data.value)
          }
          const option = BuildInData?.(itemData.upperKey!, 'id')
          return !!option
        } else if (itemData.source === 'fixed') {
          const itemType = variableDefinitionsMap.get(variableKey)
          let hasUser = false

          console.log(itemType, notifyType)
          if (itemType === 'user') { // 微信用户，钉钉用户
            let resp = undefined;
            if (['dingTalk', 'weixin'].includes(notifyType)) {
              resp = notifyType === 'dingTalk' ? await noticeConfig.queryDingTalkUsers(item!.notifierId) : await noticeConfig.queryWechatUsers(item!.notifierId);
            } else {
              hasUser = true
            }

            if (resp && resp.success) {
              hasUser = resp.result.some((uItem: any) => uItem.id === itemData.value)
            }
            return hasUser
          }

          if (itemType === 'tag') { // 标签
            const resp = await noticeTemplate.getTags(item!.notifierId)
            if (resp && resp.success) {
              hasUser = resp.result.some((tag: any) => tag.id === itemData.value)
            }
            return hasUser
          }

          if (itemType === 'org') { // 组织
            let resp = undefined;
            if (['dingTalk', 'weixin'].includes(notifyType)) {
              resp = notifyType === 'dingTalk' ? await noticeConfig.dingTalkDept(item!.notifierId) : await noticeConfig.weChatDept(item!.notifierId)
            } else {
              hasUser = true
            }

            if (resp && resp.success) {
              hasUser = resp.result.some((org: any) => org.id === itemData.value)
            }
            return hasUser
          }

        } else if (itemData.source == 'relation') {
          // 获取平台用户
          const userData = await getNotifyVariablesUser(_triggerType === 'device')
          let hasUser = false
          if (!hasUser && userData.platform.length) { // 平台用户
            hasUser = userData.platform.some(uItem => {
              return uItem.id === (itemData.relation as PlatformRelation)?.objectId
            })
          }
          if (!hasUser && userData.relation.length) { // 关系用户
            hasUser = userData.relation.some(uItem => {
              return uItem.id === (itemData.relation as PlatformRelation)?.objectId
            })
          }
          return hasUser
        }

      } else {
        return false
      }
      return true
    })

    BuildInData = null

    if (!hasAll) {
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].notify!.changeData! = true
      formTouchOff()
      return
    }
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

defineExpose({
  formTouchOff
})

</script>

<style scoped>

</style>