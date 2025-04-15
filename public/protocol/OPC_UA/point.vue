<template>
  <a-form-item
      :label="$lang('OPC_UA.point.20250207-1')"
      :name="['configuration', 'type']"
      :rules="[
        {
          required: true,
          message: $lang('OPC_UA.point.20250207-2'),
        },
      ]"
  >
    <a-select
        v-model:value="formData.configuration.type"
        show-search
        :placeholder="$lang('OPC_UA.point.20250207-2')"
        :options="opcuaDataTypeList"
    />
  </a-form-item>
  <a-form-item :label="$lang('OPC_UA.point.20250207-3')" name="accessModes" :rules="[
    {
      required: true,
      message: $lang('OPC_UA.point.20250207-4'),
    }
  ]">
    <j-check-button
        v-model:value="formData.accessModes"
        :multiple="true"
        :options="[
          { label: $lang('OPC_UA.point.20250207-5'), value: 'read' },
          { label: $lang('OPC_UA.point.20250207-6'), value: 'write' },
          { label: $lang('OPC_UA.point.20250207-7'), value: 'subscribe'},
        ]"
    />
  </a-form-item>
</template>
<script setup>
import {inject, ref, watch} from 'vue'
import {request} from '@jetlinks-web/core'
import {useLocales} from '@hooks'

const formData = inject('plugin-form')
const showDeathArea = inject('plugin-form-death-area-show', ref(false))

const opcuaDataTypeList = ref([])
const {$lang} = useLocales('OPC_UA')

const getOpcuaDataType = async () => {
  const res = await request.post('/data-collect/OPC_UA/command/OpcUaType', {})
  if (res.success) {
    opcuaDataTypeList.value = res.result.map(item => ({label: item, value: item}))
  }
};
getOpcuaDataType()

watch(() => formData.configuration.type, (val) => {
  showDeathArea.value = val && ['Byte', 'Short', 'Word', 'Integer', 'DWord', 'Long', 'LLong', 'Float', 'Double'].includes(val)
}, {
  immediate: true,
})
</script>
<style></style>
