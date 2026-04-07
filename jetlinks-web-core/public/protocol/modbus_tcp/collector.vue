<template>
  <a-form-item :label="$lang('MODBUS_TCP.collector.20250207-1')" :name="['configuration', 'unitId']"
               :rules="[
    {required: true, message: $lang('MODBUS_TCP.collector.20250207-2'), trigger: 'blur'},
    {
      pattern: new RegExp(/^\d+$/),
      message: $lang('MODBUS_TCP.collector.20250207-3')
    },
  ]">
    <a-input-number
        style="width: 100%"
        v-model:value="formData.configuration.unitId"
        :placeholder="$lang('MODBUS_TCP.collector.20250207-2')"
        :min="0"
        :max="255" :maxlength="64"
    />
  </a-form-item>
</template>
<script setup>
import {inject, computed} from 'vue'
import {useLocales} from '@hooks'

const {$lang} = useLocales('modbus_tcp')
const formData = inject('plugin-form')

if (!('configuration' in formData)) {
  formData.configuration = {
    unitId: undefined
  }
}
</script>
<style></style>
