<template>
  <a-form-item :label="$lang('BACNetIp.point.20250207-1')">
    <div style="background-color: #F2F3F7; padding: 6px 0;">
      <a-form-item :label="$lang('BACNetIp.point.20250207-2')" :name="['configuration', 'objectId', 'type']"
                   style="padding: 0 20px;">
        <a-input disabled v-model:value="formData.configuration.objectId.type"/>
      </a-form-item>
      <a-form-item :label="$lang('BACNetIp.point.20250207-3')" :name="['configuration', 'objectId', 'instanceNumber']"
                   style="padding: 0 20px;">
        <a-input disabled v-model:value="formData.configuration.objectId.instanceNumber"/>
      </a-form-item>
    </div>
  </a-form-item>
  <a-form-item :label="$lang('BACNetIp.point.20250207-4')" :name="['configuration', 'propertyId']">
    <a-input v-model:value="formData.configuration.propertyId" disabled/>
  </a-form-item>
  <a-form-item :label="$lang('BACNetIp.point.20250207-5')" :name="['configuration', 'valueType']">
    <a-select v-model:value="formData.configuration.valueType">
      <a-select-option v-for="item in bacnetValueType" :key="item" :value="item">{{ item }}</a-select-option>
    </a-select>
  </a-form-item>
  <a-form-item :label="$lang('BACNetIp.point.20250207-6')" name="accessModes" :rules="[
    {
      required: true,
      validator:valValue
    }
  ]">
    <j-check-button v-model:value="formData.accessModes" :multiple="true" :options="[
      { label: $lang('BACNetIp.point.20250207-9'), value: 'read' },
      { label: $lang('BACNetIp.point.20250207-10'), value: 'write' },
      { label: $lang('BACNetIp.point.20250207-11'), value: 'subscribe' },
    ]"/>
  </a-form-item>
</template>
<script setup>
import {inject, ref, watch} from 'vue'
import {request} from '@jetlinks-web/core'
import {useLocales} from '@hooks'

const {$lang} = useLocales('BACNetIp')

const formData = inject('plugin-form')
const showDeathArea = inject('plugin-form-death-area-show', ref(false))
const bacnetValueType = ref([])

const valValue = (_, value) => {
  if (!value?.length) {
    return Promise.reject($lang('BACNetIp.point.20250207-8'))
  }
  return Promise.resolve()
}

if (!('configuration' in formData)) {
  formData.configuration = {
    propertyId: undefined,
    valueType: undefined,
    accessModes: undefined,
    objectId: {
      type: undefined,
      instanceNumber: undefined
    }
  }
}

if (!('objectId' in formData.configuration)) {
  formData.objectId = {
    type: undefined,
    instanceNumber: undefined
  }
}

const getOptions = () => {
  request.post('/data-collect/BACNetIp/command/QueryValueTypes', {}).then(resp => {
    bacnetValueType.value = resp.result || []
  })
}

getOptions()

watch(() => formData.configuration?.objectId?.type, (val) => {
  showDeathArea.value = val && ['Unsigned8', 'Unsigned16', 'Unsigned32', 'UnsignedInteger', 'Double'].includes(val)
}, {
  immediate: true,
})
</script>
<style></style>
