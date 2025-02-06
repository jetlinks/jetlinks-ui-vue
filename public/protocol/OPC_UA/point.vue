<template>
  <a-form-item label="数据类型" :name="['configuration', 'type']" :rules="rules.type">
    <a-select v-model:value="formData.configuration.type" show-search placeholder="请选择数据类型" :options="opcuaDataTypeList">
    </a-select>
  </a-form-item>
  <a-form-item label="访问类型" name="accessModes" :rules="rules.accessModes">
    <j-check-button v-model:value="formData.accessModes" :multiple="true" :options="[
      { label: '读', value: 'read' },
      { label: '写', value: 'write' },
      { label: '订阅', value: 'subscribe'},
    ]" />
  </a-form-item>
</template>
<script setup>
import { inject, ref } from 'vue'
import { request } from '@jetlinks-web/core'

const formData = inject('plugin-form')
const opcuaDataTypeList = ref([])

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
      message: '请选择访问类型',
    }
  ]
}

const getOpcuaDataType = async () => {
  const res = await request.post('/data-collect/OPC_UA/command/OpcUaType', {})
  if (res.success) {
    opcuaDataTypeList.value = res.result.map(item => ({ label: item, value: item}))
  }
};
getOpcuaDataType()
</script>
<style></style>
