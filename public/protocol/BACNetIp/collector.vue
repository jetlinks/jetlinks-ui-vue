<template>
  <a-form-item
      :label="$lang('BACNetIp.collector.20250207-1')"
      :name="['configuration', 'instanceNumber']"
      :rules="[
        {
          required: true,
          message: $lang('BACNetIp.collector.20250207-2')
        },
      ]"
  >
    <a-input
        type="number"
        style="width: 100%"
        v-model:value="formData.configuration.instanceNumber"
        :placeholder="$lang('BACNetIp.collector.20250207-2')"
        :maxlength="64"
        :disabled="!!route.query.id"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('BACNetIp.collector.20250207-3')"
      :name="['configuration', 'address']"
  >
    <a-input
        style="width: 100%"
        v-model:value="formData.configuration.address"
        :maxlength="64"
        type="tel"
        :placeholder="$lang('BACNetIp.collector.20250207-4')"
    />
  </a-form-item>
</template>
<script setup>
import {inject} from 'vue'
import {useRoute} from 'vue-router'
import {useLocales} from '@hooks'

const formData = inject('plugin-form')
const route = useRoute()

const {$lang} = useLocales('BACNetIp')

if (!('configuration' in formData)) {
  formData.configuration = {
    instanceNumber: undefined,
    address: undefined
  }
}
</script>
<style></style>
