<template>
  <a-row :gutter="24">
    <a-col :span="12">
      <FormItemEditable
          :label="$lang('MODBUS_TCP.collector.20250207-1')"
          :name="['configuration', 'unitId']"
          :rules="[
            {required: true, message: $lang('MODBUS_TCP.collector.20250207-2'), trigger: 'blur'},
            {
              pattern: new RegExp(/^\d+$/),
              message: $lang('MODBUS_TCP.collector.20250207-3')
            },
          ]"
          v-model:value="formData.configuration.unitId"
          :componentProps="{
            placeholder: $lang('MODBUS_TCP.collector.20250207-2'),
            min: 0,
            max: 255
          }"
          type="number"
          @change="() => onChange(['configuration', 'unitId'], formData.configuration.unitId)"
      />
    </a-col>
  </a-row>
</template>
<script setup>
import {inject, computed} from 'vue'
import {useLocales} from '@hooks'

const {$lang} = useLocales('modbus_tcp')
const formData = inject('plugin-collector-detail-form')
const events = inject("plugin-collector-detail-events");

if (!('configuration' in formData)) {
  formData.configuration = {
    unitId: undefined,
    endian: 'BIG',
    endianIn: 'BIG',
    port: undefined,
    host: undefined,
  }
}

const onChange = (name, value) => {
  const arr = [
    {
      name,
      value
    }
  ]
  events.onValueChange(arr)
}
</script>
<style></style>
