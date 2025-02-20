<template>
  <a-form-item
      :label="$lang('CJ188.channel.20250207-1')"
      :name="['configuration', 'serialPortId']"
      :rules="[{ required: true, message: $lang('CJ188.channel.20250207-2') }]"
  >
    <a-select
        v-model:value="formData.configuration.serialPortId"
        :placeholder="$lang('CJ188.channel.20250207-2')"
        :options="list || []"
        @change="handlePortChange"
    />
  </a-form-item>
  <a-form-item
      :name="['configuration', 'leadLength']"
      :rules="[{ required: true, message: $lang('CJ188.channel.20250207-4') }]"
      :label="$lang('CJ188.channel.20250207-3')"
  >
    <j-card-select
        :showImage="false"
        v-model:value="formData.configuration.leadLength"
        :options="options"
    />
  </a-form-item>
</template>

<script setup>
import {inject, ref} from 'vue'
import {request} from '@jetlinks-web/core'

import {useLocales} from '@hooks'

const {$lang} = useLocales('CJ188')

const formData = inject('plugin-form')

if (!('configuration' in formData)) {
  formData.configuration = {
    serialPortId: undefined,
    leadLength: undefined,
    serialPortProperties: null,
  };
}

const list = ref([])

const options = [
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
]

const handlePortChange = (_, option) => {
  formData.configuration.serialPortProperties = option.source;
}

const getList = () => {
  request.post('/data-collect/CJ188/command/GetRtuPorts', {}).then(resp => {
    if (resp.success){
      list.value = (resp.result || []).map(i => {
        return {
          source: {
            id: i.port,
            ...i,
          },
          label: i.name,
          value: i.port,
        }
      })
    }
  })
}

getList()
</script>

<style scoped></style>
