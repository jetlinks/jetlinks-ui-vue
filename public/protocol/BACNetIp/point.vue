<template>
  <a-form-item label="对象ID">
    <div style="background-color: #F2F3F7; padding: 6px 0;">
      <a-form-item label="对象类型" :name="['configuration', 'objectId', 'type']" style="padding: 0 20px;">
        <a-input disabled v-model:value="formData.configuration.objectId.type" />
      </a-form-item>
      <a-form-item label="对象实例号" :name="['configuration', 'objectId', 'instanceNumber']" style="padding: 0 20px;">
        <a-input disabled v-model:value="formData.configuration.objectId.instanceNumber" />
      </a-form-item>
    </div>
  </a-form-item>
  <a-form-item label="属性ID" :name="['configuration', 'propertyId']">
    <a-input v-model:value="formData.configuration.propertyId" disabled />
  </a-form-item>
  <a-form-item label="值类型" :name="['configuration', 'valueType']">
    <a-select v-model:value="formData.configuration.valueType">
      <a-select-option v-for="item in bacnetValueType" :key="item" :value="item">{{ item }}</a-select-option>
    </a-select>
  </a-form-item>
  <a-form-item label="访问类型" name="accessModes" :rules="rules.accessModes">
    <j-check-button v-model:value="formData.accessModes" :multiple="true" :options="[
      { label: '读', value: 'read' },
      { label: '写', value: 'write' },
      { label: '订阅', value: 'subscribe' },
    ]" />
  </a-form-item>
</template>
<script setup>
import { inject, ref } from 'vue'
import { request } from '@jetlinks-web/core'

const formData = inject('plugin-form')

const bacnetValueType = ref([])

const rules = {
  type: [
    {
      required: true,
      message: '请选择数据类型',
    },
  ],
  accessModes: [
    {
      required: true,
      validator: (_, value) => {
        if (!value?.length) {
          return Promise.reject('请选择访问类型')
        }
        return Promise.resolve()
      }
    }
  ]
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

</script>
<style></style>
