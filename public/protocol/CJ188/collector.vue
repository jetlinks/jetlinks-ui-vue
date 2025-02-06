<template>
  <a-form-item label="表号" :name="['configuration', 'meterId']" :rules="{
        required: true,
        message: '请输入或选择表号',
        trigger: 'blur',
      }">
    <a-auto-complete
        placeholder="请输入或选择表号"
        v-model:value="formData.configuration.meterId"
        :options="meterNumberOptions"
        :maxlength="14"
    >
      <template #option="item">
        <span> {{ item.value }} </span>
      </template>
      <a-input :maxlength="14"></a-input>
    </a-auto-complete>
  </a-form-item>
  <a-form-item
      label="表类型"
      :name="['configuration', 'meter']"
      v-model:value="formData.configuration.meter"
      :rules="[
          { required: true, message: '请选择表类型', trigger: 'change' },
        ]"
  >
    <a-select placeholder="请选择表类型" v-model:value="formData.configuration.meter">
      <a-select-option
          v-for="item in meterOptions"
          :key="item.ID"
          :value="item.ID"
      >{{ item.name }}</a-select-option
      >
    </a-select>
  </a-form-item>
</template>
<script setup>
import { inject } from 'vue'

const formData = inject('plugin-form')

if (!('configuration' in formData)) {
  formData.configuration = {
    meterId: undefined,
    meter: undefined
  }
}

const meterOptions = [
  { label: 'AB', value: 'BIG' },
  { label: 'BA', value: 'LITTLE' },
]

const meterNumberOptions = ref([])
</script>
<style></style>
