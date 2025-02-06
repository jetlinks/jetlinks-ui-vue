<template>
  <a-form-item label="设备实例号" :name="['configuration', 'instanceNumber']" :rules="rules.instanceNumber">
    <a-input type="number" style="width: 100%" v-model:value="formData.configuration.instanceNumber"
             placeholder="请输入设备实例号" :maxlength="64" :disabled="route.query.id ? true : false" />
  </a-form-item>
  <a-form-item label="地址" :name="['configuration', 'address']">
    <a-input style="width: 100%" v-model:value="formData.configuration.address" :maxlength="64" type="tel"
             placeholder="请输入地址" />
  </a-form-item>
</template>
<script setup>
import { inject } from 'vue'
import { useRoute } from 'vue-router'

const formData = inject('plugin-form')
const route = useRoute()

const rules = {
  instanceNumber: [
    {
      required: true,
      message: '请输入设备实例号'
    },
  ]
}

if (!('configuration' in formData)) {
  formData.configuration = {
    instanceNumber: undefined,
    address: undefined
  }
}
</script>
<style></style>
