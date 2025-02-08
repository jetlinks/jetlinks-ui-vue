<template>
  <a-form-item :label="$lang('CJ188.collector.20250207-1')" :name="['configuration', 'meterId']" :rules="{
        required: true,
        message: $lang('CJ188.collector.20250207-2'),
        trigger: 'blur',
      }">
    <a-auto-complete
        :placeholder="$lang('CJ188.collector.20250207-2')"
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
      :label="$lang('CJ188.collector.20250207-3')"
      :name="['configuration', 'meter']"
      v-model:value="formData.configuration.meter"
      :rules="[
          { required: true, message: $lang('CJ188.collector.20250207-4'), trigger: 'change' },
        ]"
  >
    <a-select :placeholder="$lang('CJ188.collector.20250207-4')" v-model:value="formData.configuration.meter">
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
import {useLocales} from '@hooks'

const {$lang} = useLocales('CJ188')
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
