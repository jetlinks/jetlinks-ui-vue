<template>
  <a-form-item
      :label="$lang('CJ188.point.20250207-1')"
      :name="['configuration', 'dataId']"
      :rules="{
      required: true,
      trigger: 'change',
    }"
  >
    <a-select
        :placeholder="$lang('CJ188.point.20250207-2')"
        v-model:value="formData.configuration.dataId"
        @change="functionChange"
    >
      <a-select-option
          v-for="item in options"
          :key="item.ID"
          :value="item.ID"
      >
        {{ item.name }}
      </a-select-option>
    </a-select>
  </a-form-item>
  <a-form-item
      :name="['configuration', 'type']"
      :label="$lang('CJ188.point.20250207-3')"
      :rules="{
        required: true,
        trigger: 'blur',
      }"
  >
    <a-input
        disabled
        v-model:value="formData.configuration.type"
    />
  </a-form-item>
</template>
<script setup>
import {inject, ref} from 'vue'
import {request} from '@jetlinks-web/core'
import {randomString} from "@jetlinks-web/utils";
import {useLocales} from '@hooks'

const {$lang} = useLocales('CJ188')
const formData = inject('plugin-form')

const options = ref([]);

if (!('configuration' in formData)) {
  formData.configuration = {
    dataId: undefined,
    type: undefined
  }
}

if (!('pointKey' in formData)) {
  formData.pointKey = randomString(9)
}

const functionChange = (val) => {
  const result = options.value.find(item => item.ID === val);
  formData.configuration.type = result?.dateType;
};

const getList = () => {
  request.post('/data-collect/CJ188/command/GetDataCode').then(resp => {
    options.value = resp.result || [];
  })
}
getList();
</script>
<style></style>
